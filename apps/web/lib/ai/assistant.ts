import OpenAI from 'openai';
import { v4 as uuidv4 } from 'uuid';
import { db } from '@acme/db';
import { chatHistory } from '../../../../packages/db/src/chat/chat.sql';
import * as dotenv from 'dotenv';
import { AI_ASSISTANT_PROMPT, SALES_ASSISTANT_PROMPT, HR_ASSISTANT_PROMPT, MARKETING_ASSISTANT_PROMPT, DATA_ANALYST_PROMPT, BUG_REPORTING_PROMPT, RFP_RESPONSE_PROMPT, WELCOME_MESSAGES } from './config';

// Load environment variables
console.log('Loading environment variables...');
dotenv.config({ path: '.env' });
console.log('Environment variables loaded');

// Log the available environment variables (without showing the actual key)
console.log('Available environment variables:', Object.keys(process.env));

// Initialize OpenAI with browser support
const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY || process.env.OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

// Ensure API key is configured
if (!openai.apiKey) {
  console.error('OpenAI API key is not configured');
  console.error('Expected environment variable: NEXT_PUBLIC_OPENAI_API_KEY or OPENAI_API_KEY');
}

export type ChatMessage = {
  conversation_id: string;
  role: 'user' | 'assistant';
  content: string;
  assistantType?: 'ai_assistant' | 'sales_assistant' | 'hr_assistant' | 'marketing_assistant' | 'data_analyst' | 'bug_reporting' | 'rfp_response';
};

export const generateAIResponse = async (messages: ChatMessage[]): Promise<string> => {
  try {
    if (!openai.apiKey) {
      return "I'm sorry, but I'm not configured properly at the moment. Please contact support.";
    }

    // Determine which system prompt to use based on the assistant type
    const assistantType = messages[0]?.assistantType || 'ai_assistant';
    let systemPrompt = AI_ASSISTANT_PROMPT;
    
    switch (assistantType) {
      case 'sales_assistant':
        systemPrompt = SALES_ASSISTANT_PROMPT;
        break;
      case 'hr_assistant':
        systemPrompt = HR_ASSISTANT_PROMPT;
        break;
      case 'marketing_assistant':
        systemPrompt = MARKETING_ASSISTANT_PROMPT;
        break;
      case 'data_analyst':
        systemPrompt = DATA_ANALYST_PROMPT;
        break;
      case 'bug_reporting':
        systemPrompt = BUG_REPORTING_PROMPT;
        break;
      case 'rfp_response':
        systemPrompt = RFP_RESPONSE_PROMPT;
        break;
      default:
        systemPrompt = AI_ASSISTANT_PROMPT;
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        systemPrompt,
        ...messages.map(msg => ({
          role: msg.role,
          content: msg.content
        }))
      ],
      max_tokens: 150,
      temperature: 0.7
    });

    const aiResponse = completion.choices[0]?.message?.content;
    
    if (!aiResponse) {
      return "I apologize, but I couldn't generate a response. Please try again.";
    }

    return aiResponse;
  } catch (error) {
    console.error('OpenAI API Error:', error);
    return "I encountered an error while processing your request. Please try again later.";
  }
};

export const saveChatMessage = async (
  message: string,
  userId: string,
  workspaceId: string,
  conversationId?: string
) => {
  return await db.insert(chatHistory).values({
    userId,
    ai_assistant: message,
    workspaceId,
    conversationId: conversationId || uuidv4(),
    timestamp: new Date()
  });
};

// Export welcome messages from config
export { WELCOME_MESSAGES };
