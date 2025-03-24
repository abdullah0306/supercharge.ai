import { relations } from 'drizzle-orm';
import { pgTable, text, timestamp, serial, char, uuid, varchar } from 'drizzle-orm/pg-core'
import { workspaces } from './workspaces/workspaces.sql'
import { mailroom } from './mailroom/mailroom.sql'
import { users } from './users/users.sql'

export const companyDetails = pgTable('company_details', {
  id: serial('id').primaryKey(),
  workspace_id: char('workspace_id', { length: 24 })
    .notNull()
    .references(() => workspaces.id),
  company_name: text('company_name').notNull(),
  company_logo: text('company_logo'),
  state: text('state'),
  industry: text('industry'),
  website: text('website'),
  linkedin: text('linkedin'),
  fiscal_year_end: text('fiscal_year_end'),
  responsible_party_name: text('responsible_party_name'),
  responsible_party_address: text('responsible_party_address'),
  responsible_party_phone: text('responsible_party_phone'),
  owner_name: text('owner_name'),
  ownership_percentage: text('ownership_percentage'),
  owner_address: text('owner_address'),
  owner_phone: text('owner_phone'),
  incorporator_name: text('incorporator_name'),
  incorporator_country: text('incorporator_country'),
  incorporator_mailing_address: text('incorporator_mailing_address'),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
})

export const chatHistory = pgTable('chat_history', {
  id: serial('id').primaryKey(),
  user_id: uuid('user_id').references(() => users.id).notNull(),
  role: varchar('role', { enum: ['user', 'assistant'] }).notNull(),
  message: text('message').notNull(),
  timestamp: timestamp('timestamp', { withTimezone: true }).defaultNow(),
  workspace_id: varchar('workspace_id'),
  conversation_id: uuid('conversation_id').defaultRandom()
});

export const chatHistoryRelations = relations(chatHistory, ({ one }) => ({
  user: one(users, {
    fields: [chatHistory.user_id],
    references: [users.id]
  })
}));

export { mailroom }