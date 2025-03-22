import OpenAI from 'openai';
import { v4 as uuidv4 } from 'uuid';
import { db } from '@acme/db';
import { chatHistory } from '../../../../packages/db/src/chat/chat.schema';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export interface ChatMessage {
  conversation_id: string;
  role: 'user' | 'assistant';
  content: string;
}

export const generateAIResponse = async (messages: ChatMessage[]): Promise<string> => {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: messages.map(msg => ({
        role: msg.role,
        content: msg.content
      })),
      max_tokens: 150,
      temperature: 0.7
    });

    const aiResponse = completion.choices[0]?.message?.content;
    
    if (!aiResponse) {
      throw new Error('No response generated');
    }

    return aiResponse;
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw new Error('Failed to generate AI response. Please try again.');
  }
};

export const saveChatMessage = async (
  message: string,
  userId: string,
  role: 'user' | 'assistant',
  workspaceId: string,
  conversationId?: string
) => {
  return await db.insert(chatHistory).values({
    userId,
    role,
    message,
    workspaceId,
    conversationId: conversationId || uuidv4()
  });
};

export const WELCOME_MESSAGE = "Hello! I'm your AI assistant. How can I help you today? Feel free to ask me anything about your workspace, tasks, or any questions you might have.";
