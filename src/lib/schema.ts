import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
  real,
  jsonb,
} from "drizzle-orm/pg-core";
import { customType } from "drizzle-orm/pg-core";

// Custom vector type for pgvector
const vector = customType<{ data: number[]; driverData: string }>({
  dataType(config: unknown) {
    const dimensions = (config as { dimensions?: number })?.dimensions || 768;
    return `vector(${dimensions})`;
  },
  toDriver(value: number[]): string {
    return JSON.stringify(value);
  },
  fromDriver(value: string): number[] {
    return JSON.parse(value);
  },
});

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("emailVerified"),
  image: text("image"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expiresAt").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
  ipAddress: text("ipAddress"),
  userAgent: text("userAgent"),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("accountId").notNull(),
  providerId: text("providerId").notNull(),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  idToken: text("idToken"),
  accessTokenExpiresAt: timestamp("accessTokenExpiresAt"),
  refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

// Resume Screening Tables

export const document = pgTable("document", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  fileName: text("fileName").notNull(),
  fileType: text("fileType").notNull(), // 'resume' or 'job_description'
  mimeType: text("mimeType").notNull(), // 'application/pdf', 'text/plain', etc.
  content: text("content").notNull(), // Extracted text content
  rawContent: text("rawContent"), // Original file as base64 (optional)
  metadata: jsonb("metadata"), // Store additional metadata like file size, page count, etc.
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export const documentEmbedding = pgTable("documentEmbedding", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  documentId: text("documentId")
    .notNull()
    .references(() => document.id, { onDelete: "cascade" }),
  chunkText: text("chunkText").notNull(),
  chunkIndex: integer("chunkIndex").notNull(),
  embedding: vector({ dimensions: 768 }).notNull(),
  metadata: jsonb("metadata"), // Store section info, token count, etc.
  createdAt: timestamp("createdAt").notNull().defaultNow(),
});

export const screeningSession = pgTable("screeningSession", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  resumeId: text("resumeId")
    .notNull()
    .references(() => document.id, { onDelete: "cascade" }),
  jobDescriptionId: text("jobDescriptionId")
    .notNull()
    .references(() => document.id, { onDelete: "cascade" }),
  title: text("title"), // Auto-generated from candidate name + job title
  candidateName: text("candidateName"), // Extracted from resume
  jobTitle: text("jobTitle"), // Extracted from job description
  matchScore: real("matchScore"), // 0-100, nullable until analyzed
  strengths: jsonb("strengths"), // Array of strengths, nullable until analyzed
  gaps: jsonb("gaps"), // Array of gaps, nullable until analyzed
  insights: jsonb("insights"), // Array of key insights, nullable until analyzed
  summary: text("summary"), // Overall assessment text, nullable until analyzed
  isPinned: boolean("isPinned").notNull().default(false),
  isArchived: boolean("isArchived").notNull().default(false),
  lastActivityAt: timestamp("lastActivityAt").notNull().defaultNow(),
  messageCount: integer("messageCount").notNull().default(0),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export const chatMessage = pgTable("chatMessage", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  screeningSessionId: text("screeningSessionId")
    .notNull()
    .references(() => screeningSession.id, { onDelete: "cascade" }),
  role: text("role").notNull(), // 'user' or 'assistant'
  content: text("content").notNull(),
  status: text("status").notNull().default("sent"), // 'sent', 'pending', 'failed'
  metadata: jsonb("metadata"), // Token count, error info, etc.
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});
