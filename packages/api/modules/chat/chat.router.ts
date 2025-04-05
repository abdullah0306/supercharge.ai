import { z } from 'zod'
import { and, eq, sql } from "drizzle-orm";
import { createTRPCRouter, workspaceProcedure } from "#trpc";
import { db } from "@acme/db";
import { chatHistory } from "../../../db/src/chat/chat.sql";
import { v4 as uuidv4 } from 'uuid';
import { generateAIResponse, WELCOME_MESSAGES } from '../../../../apps/web/lib/ai/assistant';

interface ChatMessage {
  assistant: string | null;
  user: string | null;
}

export const chatRouter = createTRPCRouter({
  // Get conversation history
  getConversation: workspaceProcedure
    .input(z.object({
      workspaceId: z.string(),
      conversationId: z.string().uuid(),
      assistantType: z.enum(['ai_assistant', 'sales_assistant', 'hr_assistant', 'marketing_assistant', 'data_analyst', 'bug_reporting', 'rfp_response']).default('ai_assistant'),
    }))
    .query(async ({ input, ctx }) => {
      try {
        if (!ctx.session?.user) {
          throw new Error('User not authenticated');
        }

        // Check if conversation exists
        let chat = await db
          .select()
          .from(chatHistory)
          .where(
            and(
              eq(chatHistory.workspaceId, input.workspaceId),
              eq(chatHistory.userId, ctx.session.user.id),
              eq(chatHistory.conversationId, input.conversationId)
            )
          )
          .limit(1);

        // Initialize chat if it doesn't exist
        if (!chat.length) {
          const messages = [{ assistant: WELCOME_MESSAGES[input.assistantType], user: null }];
          const newChat = {
            userId: ctx.session.user.id,
            workspaceId: input.workspaceId,
            conversationId: input.conversationId,
            ai_assistant: input.assistantType === 'ai_assistant' ? messages : [],
            sales_assistant: input.assistantType === 'sales_assistant' ? messages : [],
            hr_assistant: input.assistantType === 'hr_assistant' ? messages : [],
            marketing_assistant: input.assistantType === 'marketing_assistant' ? messages : [],
            data_analyst: input.assistantType === 'data_analyst' ? messages : [],
            bug_reporting: input.assistantType === 'bug_reporting' ? messages : [],
            rfp_response: input.assistantType === 'rfp_response' ? messages : [],
            timestamp: new Date(),
          };

          await db.insert(chatHistory).values(newChat);

          // Fetch the newly created chat
          chat = await db
            .select()
            .from(chatHistory)
            .where(
              and(
                eq(chatHistory.workspaceId, input.workspaceId),
                eq(chatHistory.userId, ctx.session.user.id),
                eq(chatHistory.conversationId, input.conversationId)
              )
            )
            .limit(1);
        }

        if (!chat.length) {
          throw new Error('Failed to create or fetch chat');
        }

        return chat[0];
      } catch (error) {
        console.error('Error in getConversation:', error);
        throw error;
      }
    }),

  // Send a new message
  sendMessage: workspaceProcedure
    .input(z.object({
      workspaceId: z.string(),
      conversationId: z.string().uuid(),
      message: z.string().min(1, "Message cannot be empty"),
      assistantType: z.enum(['ai_assistant', 'sales_assistant', 'hr_assistant', 'marketing_assistant', 'data_analyst', 'bug_reporting', 'rfp_response']).default('ai_assistant'),
    }))
    .mutation(async ({ input, ctx }) => {
      if (!ctx.session?.user) {
        throw new Error('User not authenticated');
      }

      try {
        // Get current chat
        const currentChat = await db
          .select()
          .from(chatHistory)
          .where(
            and(
              eq(chatHistory.workspaceId, input.workspaceId),
              eq(chatHistory.userId, ctx.session.user.id),
              eq(chatHistory.conversationId, input.conversationId)
            )
          )
          .limit(1);

        if (!currentChat.length) {
          throw new Error('Chat not found');
        }

        // Get current messages array
        const messages = (currentChat[0][input.assistantType] as ChatMessage[]) || [];
        
        // Add user message
        messages.push({ assistant: null, user: input.message });

        try {
          // Generate AI response
          const aiResponse = await generateAIResponse(
            messages.map(msg => ({
              conversation_id: input.conversationId,
              role: msg.user === null ? 'assistant' : 'user',
              content: msg.user ?? msg.assistant ?? '',
              assistantType: input.assistantType
            }))
          );

          // Add AI response
          messages.push({ assistant: aiResponse, user: null });

          // Update chat with new messages
          await db
            .update(chatHistory)
            .set({
              [input.assistantType]: messages,
              timestamp: new Date(),
            })
            .where(
              and(
                eq(chatHistory.workspaceId, input.workspaceId),
                eq(chatHistory.userId, ctx.session.user.id),
                eq(chatHistory.conversationId, input.conversationId)
              )
            );

          return {
            success: true,
            message: aiResponse,
          };
        } catch (aiError) {
          console.error('AI Response Error:', aiError);
          
          // Add error message to chat
          const errorMessage = "I encountered an error. Please try again later.";
          messages.push({ assistant: errorMessage, user: null });
          
          // Update chat with error message
          await db
            .update(chatHistory)
            .set({
              [input.assistantType]: messages,
              timestamp: new Date(),
            })
            .where(
              and(
                eq(chatHistory.workspaceId, input.workspaceId),
                eq(chatHistory.userId, ctx.session.user.id),
                eq(chatHistory.conversationId, input.conversationId)
              )
            );

          return {
            success: false,
            message: errorMessage,
          };
        }
      } catch (error) {
        console.error('Error in sendMessage:', error);
        throw error;
      }
    }),
});