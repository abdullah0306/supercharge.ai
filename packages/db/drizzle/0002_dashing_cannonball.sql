ALTER TABLE "chat_history" RENAME COLUMN "message" TO "ai_assistant";--> statement-breakpoint
ALTER TABLE "chat_history" ADD COLUMN "sales_assistant" jsonb DEFAULT '[]' NOT NULL;--> statement-breakpoint
ALTER TABLE "chat_history" ADD COLUMN "hr_assistant" jsonb DEFAULT '[]' NOT NULL;--> statement-breakpoint
ALTER TABLE "chat_history" DROP COLUMN "role";--> statement-breakpoint
DROP TYPE "public"."role";