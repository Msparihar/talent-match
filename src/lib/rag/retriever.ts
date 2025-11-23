import {
  searchSimilarChunks,
  SearchResult,
} from "@/lib/embeddings/vector-store";

export interface RetrievalOptions {
  topK?: number;
  threshold?: number;
  documentIds?: string[];
}

export interface RetrievalResult {
  chunks: SearchResult[];
  query: string;
}

/**
 * Retrieve relevant chunks for a query
 */
export async function retrieveContext(
  query: string,
  options: RetrievalOptions = {}
): Promise<RetrievalResult> {
  const { topK = 5, threshold = 0.3, documentIds } = options;

  try {
    console.log("[Retriever] Starting context retrieval");
    console.log("[Retriever] Query:", query);
    console.log("[Retriever] Options:", { topK, threshold, documentIds });

    const chunks = await searchSimilarChunks(query, {
      limit: topK,
      threshold,
      documentIds,
    });

    console.log("[Retriever] Retrieved", chunks.length, "chunks");
    if (chunks.length > 0) {
      console.log("[Retriever] Top similarity score:", chunks[0].similarity);
    } else {
      console.warn(
        "[Retriever] ⚠️ No chunks retrieved - check threshold or document availability"
      );
    }

    return {
      chunks,
      query,
    };
  } catch (error) {
    console.error("[Retriever] ❌ Error retrieving context:", error);
    throw new Error("Failed to retrieve context");
  }
}

/**
 * Retrieve context from specific documents (resume + job description)
 */
export async function retrieveResumeContext(
  query: string,
  resumeId: string,
  jobDescriptionId: string,
  options: { topK?: number; threshold?: number } = {}
): Promise<{
  resumeChunks: SearchResult[];
  jobDescriptionChunks: SearchResult[];
  query: string;
}> {
  const { topK = 3, threshold = 0.5 } = options;

  try {
    console.log("[Retriever] Starting resume context retrieval");
    console.log("[Retriever] Query:", query);
    console.log("[Retriever] Resume ID:", resumeId);
    console.log("[Retriever] Job Description ID:", jobDescriptionId);
    console.log("[Retriever] Options:", { topK, threshold });

    // Search in resume
    console.log("[Retriever] Searching resume document...");
    const resumeChunks = await searchSimilarChunks(query, {
      limit: topK,
      threshold,
      documentIds: [resumeId],
    });
    console.log("[Retriever] Resume chunks retrieved:", resumeChunks.length);

    // Search in job description
    console.log("[Retriever] Searching job description document...");
    const jobDescriptionChunks = await searchSimilarChunks(query, {
      limit: topK,
      threshold,
      documentIds: [jobDescriptionId],
    });
    console.log(
      "[Retriever] Job description chunks retrieved:",
      jobDescriptionChunks.length
    );

    if (resumeChunks.length === 0 && jobDescriptionChunks.length === 0) {
      console.warn("[Retriever] ⚠️ No chunks retrieved from either document");
      console.warn("[Retriever] Possible issues:");
      console.warn("  - Documents may not exist in database");
      console.warn("  - Embeddings may not be generated yet");
      console.warn("  - Threshold may be too high");
      console.warn("  - Query embedding may not match document embeddings");
    }

    console.log("[Retriever] ✅ Resume context retrieval completed");
    return {
      resumeChunks,
      jobDescriptionChunks,
      query,
    };
  } catch (error) {
    console.error("[Retriever] ❌ Error retrieving resume context:", error);
    throw new Error("Failed to retrieve resume context");
  }
}
