import { InferInsertModel, InferSelectModel, relations } from 'drizzle-orm';
import { 
  pgTable, 
  serial, 
  varchar, 
  timestamp, 
  uuid,
  jsonb
} from 'drizzle-orm/pg-core';
import { users } from '../users/users.sql'; 
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { userId } from '../utils';

export const chatHistory = pgTable('chat_history', {
  id: serial('id').primaryKey(),
  userId: userId('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  conversationId: uuid('conversation_id').notNull().defaultRandom(),
  ai_assistant: jsonb('ai_assistant').default('[]').notNull(),
  sales_assistant: jsonb('sales_assistant').default('[]').notNull(),
  hr_assistant: jsonb('hr_assistant').default('[]').notNull(),
  marketing_assistant: jsonb('marketing_assistant').default('[]').notNull(),
  data_analyst: jsonb('data_analyst').default('[]').notNull(),
  bug_reporting: jsonb('bug_reporting').default('[]').notNull(),
  rfp_response: jsonb('rfp_response').default('[]').notNull(),
  workspaceId: varchar('workspace_id', { length: 255 }),
  timestamp: timestamp('timestamp', { withTimezone: true }).defaultNow(),
});

// Optional: Define relations if you need them
export const chatHistoryRelations = relations(chatHistory, ({ one }) => ({
  user: one(users, {
    fields: [chatHistory.userId],
    references: [users.id],
  }),
}));

// Type inference
export type ChatHistory = InferSelectModel<typeof chatHistory>;
export type NewChatHistory = InferInsertModel<typeof chatHistory>;

export const ChatHistorySchema = createSelectSchema(chatHistory);
export const ChatHistoryInsertSchema = createInsertSchema(chatHistory);