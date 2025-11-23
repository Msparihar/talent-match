import { retrieveContext, retrieveResumeContext } from "./retriever";
import {
  buildContext,
  buildResumeScreeningContext,
  formatMessageWithContext,
} from "./context-builder";

export interface RAGQueryOptions {
  topK?: number;
  threshold?: number;
  documentIds?: string[];
}

export interface RAGResult {
  context: string;
  formattedPrompt: {
    systemPrompt: string;
    userMessage: string;
  };
  relevantChunks: number;
}

/**
 * Main RAG query function
 */
export async function queryRAG(
  query: string,
  options: RAGQueryOptions = {}
): Promise<RAGResult> {
  try {
    // Retrieve relevant context
    const { chunks } = await retrieveContext(query, options);

    // Build context string
    const context = buildContext(chunks);

    // Format with system prompt
    const formattedPrompt = formatMessageWithContext(query, context);

    return {
      context,
      formattedPrompt,
      relevantChunks: chunks.length,
    };
  } catch (error) {
    console.error("Error in RAG query:", error);
    throw new Error("Failed to process RAG query");
  }
}

/**
 * RAG query specifically for resume screening
 */
export async function queryResumeScreening(
  query: string,
  resumeId: string,
  jobDescriptionId: string,
  options: { topK?: number; threshold?: number } = {}
): Promise<RAGResult> {
  try {
    console.log("[RAG Service] Starting resume screening query");
    console.log("[RAG Service] Query:", query);
    console.log("[RAG Service] Resume ID:", resumeId);
    console.log("[RAG Service] Job Description ID:", jobDescriptionId);
    console.log("[RAG Service] Options:", options);

    // Retrieve context from both documents
    console.log("[RAG Service] Retrieving context from documents...");
    const { resumeChunks, jobDescriptionChunks } = await retrieveResumeContext(
      query,
      resumeId,
      jobDescriptionId,
      options
    );

    console.log("[RAG Service] Retrieved chunks:");
    console.log("  - Resume chunks:", resumeChunks.length);
    console.log("  - Job description chunks:", jobDescriptionChunks.length);

    if (resumeChunks.length > 0) {
      console.log(
        "[RAG Service] Sample resume chunk:",
        resumeChunks[0].chunkText.substring(0, 100) + "..."
      );
    }
    if (jobDescriptionChunks.length > 0) {
      console.log(
        "[RAG Service] Sample JD chunk:",
        jobDescriptionChunks[0].chunkText.substring(0, 100) + "..."
      );
    }

    // Build specialized context
    console.log("[RAG Service] Building context...");
    const context = buildResumeScreeningContext(
      resumeChunks,
      jobDescriptionChunks
    );
    console.log(
      "[RAG Service] Context built, length:",
      context.length,
      "chars"
    );

    // Format with system prompt
    console.log("[RAG Service] Formatting prompt with context...");
    const formattedPrompt = formatMessageWithContext(query, context);
    console.log("[RAG Service] Prompt formatted successfully");

    const result = {
      context,
      formattedPrompt,
      relevantChunks: resumeChunks.length + jobDescriptionChunks.length,
    };

    console.log("[RAG Service] ✅ Query completed successfully");
    return result;
  } catch (error) {
    console.error("[RAG Service] ❌ Error in resume screening query:", error);
    throw new Error("Failed to process resume screening query");
  }
}
