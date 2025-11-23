CREATE TABLE "chatMessage" (
	"id" text PRIMARY KEY NOT NULL,
	"screeningSessionId" text NOT NULL,
	"role" text NOT NULL,
	"content" text NOT NULL,
	"status" text DEFAULT 'sent' NOT NULL,
	"metadata" jsonb,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "screeningSession" ALTER COLUMN "matchScore" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "screeningSession" ALTER COLUMN "strengths" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "screeningSession" ALTER COLUMN "gaps" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "screeningSession" ALTER COLUMN "insights" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "screeningSession" ADD COLUMN "title" text;--> statement-breakpoint
ALTER TABLE "screeningSession" ADD COLUMN "candidateName" text;--> statement-breakpoint
ALTER TABLE "screeningSession" ADD COLUMN "jobTitle" text;--> statement-breakpoint
ALTER TABLE "screeningSession" ADD COLUMN "isPinned" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "screeningSession" ADD COLUMN "isArchived" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "screeningSession" ADD COLUMN "lastActivityAt" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "screeningSession" ADD COLUMN "messageCount" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "chatMessage" ADD CONSTRAINT "chatMessage_screeningSessionId_screeningSession_id_fk" FOREIGN KEY ("screeningSessionId") REFERENCES "public"."screeningSession"("id") ON DELETE cascade ON UPDATE no action;