-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;
--> statement-breakpoint
CREATE TABLE "document" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"fileName" text NOT NULL,
	"fileType" text NOT NULL,
	"mimeType" text NOT NULL,
	"content" text NOT NULL,
	"rawContent" text,
	"metadata" jsonb,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "documentEmbedding" (
	"id" text PRIMARY KEY NOT NULL,
	"documentId" text NOT NULL,
	"chunkText" text NOT NULL,
	"chunkIndex" integer NOT NULL,
	"embedding" vector(768) NOT NULL,
	"metadata" jsonb,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "screeningSession" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"resumeId" text NOT NULL,
	"jobDescriptionId" text NOT NULL,
	"matchScore" real NOT NULL,
	"strengths" jsonb NOT NULL,
	"gaps" jsonb NOT NULL,
	"insights" jsonb NOT NULL,
	"summary" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "document" ADD CONSTRAINT "document_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "documentEmbedding" ADD CONSTRAINT "documentEmbedding_documentId_document_id_fk" FOREIGN KEY ("documentId") REFERENCES "public"."document"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "screeningSession" ADD CONSTRAINT "screeningSession_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "screeningSession" ADD CONSTRAINT "screeningSession_resumeId_document_id_fk" FOREIGN KEY ("resumeId") REFERENCES "public"."document"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "screeningSession" ADD CONSTRAINT "screeningSession_jobDescriptionId_document_id_fk" FOREIGN KEY ("jobDescriptionId") REFERENCES "public"."document"("id") ON DELETE cascade ON UPDATE no action;