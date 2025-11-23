import { db } from "@/lib/db";
import { documentEmbedding, document } from "@/lib/schema";
import { eq, sql, desc, inArray } from "drizzle-orm";
import { generateEmbedding, generateEmbeddings } from "./embedding-service";
import { chunkText, TextChunk } from "./chunking-service";

export interface StoredChunk {
  id: string;
  documentId: string;
  chunkText: string;
  chunkIndex: number;
  similarity?: number;
}

export interface SearchResult extends StoredChunk {
  similarity: number;
  documentFileName?: string;
  documentType?: string;
}

/**
 * Store document chunks with embeddings
 */
export async function storeDocumentEmbeddings(
  documentId: string,
  chunks: TextChunk[]
): Promise<void> {
  try {
    // Generate embeddings for all chunks
    const texts = chunks.map((chunk) => chunk.text);
    const embeddings = await generateEmbeddings(texts);

    // Store in database
    const values = chunks.map((chunk, index) => ({
      documentId,
      chunkText: chunk.text,
      chunkIndex: chunk.index,
      embedding: embeddings[index].embedding,
      metadata: chunk.metadata,
    }));

    // Insert in batches to avoid overwhelming the database
    const batchSize = 10;
    for (let i = 0; i < values.length; i += batchSize) {
      const batch = values.slice(i, i + batchSize);
      await db.insert(documentEmbedding).values(batch);
    }

    console.log(
      `Stored ${chunks.length} embeddings for document ${documentId}`
    );
  } catch (error) {
    console.error("Error storing embeddings:", error);
    throw new Error("Failed to store document embeddings");
  }
}

/**
 * Process and store embeddings for a document
 */
export async function processDocument(
  documentId: string,
  content: string
): Promise<void> {
  try {
    // Chunk the document
    const chunks = chunkText(content, {
      chunkSize: 800,
      overlap: 100,
      minChunkSize: 100,
    });

    console.log(`Processing document ${documentId}: ${chunks.length} chunks`);

    // Store embeddings
    await storeDocumentEmbeddings(documentId, chunks);
  } catch (error) {
    console.error("Error processing document:", error);
    throw error;
  }
}

/**
 * Search for similar chunks using vector similarity
 */
export async function searchSimilarChunks(
  query: string,
  options: {
    limit?: number;
    documentIds?: string[];
    threshold?: number;
  } = {}
): Promise<SearchResult[]> {
  const { limit = 5, documentIds, threshold = 0.5 } = options;

  try {
    console.log("[Vector Store] Starting similarity search");
    console.log("[Vector Store] Query:", query);
    console.log("[Vector Store] Options:", { limit, threshold, documentIds });

    // Generate embedding for query
    const queryEmbedding = await generateEmbedding(query);
    console.log(
      "[Vector Store] Generated query embedding with",
      queryEmbedding.length,
      "dimensions"
    );

    // Build SQL for vector similarity search
    // Using cosine distance: 1 - (embedding <=> query_embedding)
    // Important: Use sql.raw to properly format the vector literal
    const embeddingStr = `'[${queryEmbedding.join(",")}]'`;
    console.log("[Vector Store] Embedding string prepared for SQL query");

    const baseQuery = db
      .select({
        id: documentEmbedding.id,
        documentId: documentEmbedding.documentId,
        chunkText: documentEmbedding.chunkText,
        chunkIndex: documentEmbedding.chunkIndex,
        similarity: sql<number>`1 - (${
          documentEmbedding.embedding
        } <=> ${sql.raw(embeddingStr)}::vector)`,
        documentFileName: document.fileName,
        documentType: document.fileType,
      })
      .from(documentEmbedding)
      .leftJoin(document, eq(documentEmbedding.documentId, document.id));

    console.log("[Vector Store] Base query constructed");

    // Filter by document IDs if provided and execute query
    let results;
    if (documentIds && documentIds.length > 0) {
      console.log("[Vector Store] Filtering by document IDs:", documentIds);
      results = await baseQuery
        .where(inArray(documentEmbedding.documentId, documentIds))
        .orderBy(
          desc(
            sql`1 - (${documentEmbedding.embedding} <=> ${sql.raw(
              embeddingStr
            )}::vector)`
          )
        )
        .limit(limit);
    } else {
      console.log("[Vector Store] Searching across all documents");
      results = await baseQuery
        .orderBy(
          desc(
            sql`1 - (${documentEmbedding.embedding} <=> ${sql.raw(
              embeddingStr
            )}::vector)`
          )
        )
        .limit(limit);
    }

    console.log("[Vector Store] Raw database results:", results.length, "rows");

    if (results.length > 0) {
      const scores = results.map((r) => r.similarity).filter((s) => s !== null);
      console.log("[Vector Store] Similarity scores:", {
        min: Math.min(...scores),
        max: Math.max(...scores),
        avg: scores.reduce((a, b) => a + b, 0) / scores.length,
      });
    }

    // Filter by threshold
    const filteredResults = results.filter(
      (r) => (r.similarity || 0) >= threshold
    );
    console.log(
      "[Vector Store] After threshold filter:",
      filteredResults.length,
      "rows"
    );

    if (filteredResults.length === 0) {
      console.warn("[Vector Store] No results above threshold", threshold);
      console.warn(
        "[Vector Store] Consider lowering threshold or checking embedding quality"
      );
    } else {
      console.log("[Vector Store] Sample result:", {
        documentId: filteredResults[0].documentId,
        similarity: filteredResults[0].similarity,
        textPreview: filteredResults[0].chunkText.substring(0, 100) + "...",
      });
    }

    const mappedResults = filteredResults.map((r) => ({
      id: r.id,
      documentId: r.documentId,
      chunkText: r.chunkText,
      chunkIndex: r.chunkIndex,
      similarity: r.similarity || 0,
      documentFileName: r.documentFileName || undefined,
      documentType: r.documentType || undefined,
    }));

    console.log("[Vector Store] ✅ Search completed successfully");
    return mappedResults;
  } catch (error) {
    console.error("[Vector Store] ❌ Error searching similar chunks:", error);
    if (error instanceof Error) {
      console.error("[Vector Store] Error details:", {
        message: error.message,
        stack: error.stack,
      });
    }
    throw new Error("Failed to search similar chunks");
  }
}

/**
 * Delete all embeddings for a document
 */
export async function deleteDocumentEmbeddings(
  documentId: string
): Promise<void> {
  try {
    await db
      .delete(documentEmbedding)
      .where(eq(documentEmbedding.documentId, documentId));
  } catch (error) {
    console.error("Error deleting embeddings:", error);
    throw new Error("Failed to delete document embeddings");
  }
}

/**
 * Get all chunks for a document
 */
export async function getDocumentChunks(
  documentId: string
): Promise<StoredChunk[]> {
  try {
    const chunks = await db
      .select({
        id: documentEmbedding.id,
        documentId: documentEmbedding.documentId,
        chunkText: documentEmbedding.chunkText,
        chunkIndex: documentEmbedding.chunkIndex,
      })
      .from(documentEmbedding)
      .where(eq(documentEmbedding.documentId, documentId))
      .orderBy(documentEmbedding.chunkIndex);

    return chunks;
  } catch (error) {
    console.error("Error getting document chunks:", error);
    throw new Error("Failed to get document chunks");
  }
}
