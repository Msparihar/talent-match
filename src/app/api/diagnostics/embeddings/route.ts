import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { documentEmbedding, document } from "@/lib/schema";
import { eq, sql } from "drizzle-orm";
import {
  searchSimilarChunks,
  getDocumentChunks,
} from "@/lib/embeddings/vector-store";

/**
 * Diagnostic endpoint for embeddings and vector search
 * GET /api/diagnostics/embeddings
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const testQuery = searchParams.get("testQuery");
    const documentId = searchParams.get("documentId");

    console.log("[Diagnostics] Starting embeddings diagnostics");

    // 1. Count total embeddings
    const totalEmbeddings = await db
      .select({ count: sql<number>`count(*)` })
      .from(documentEmbedding);

    console.log(
      "[Diagnostics] Total embeddings:",
      totalEmbeddings[0]?.count || 0
    );

    // 2. Count embeddings per document
    const embeddingsPerDocument = await db
      .select({
        documentId: documentEmbedding.documentId,
        fileName: document.fileName,
        fileType: document.fileType,
        count: sql<number>`count(*)`,
      })
      .from(documentEmbedding)
      .leftJoin(document, eq(documentEmbedding.documentId, document.id))
      .groupBy(
        documentEmbedding.documentId,
        document.fileName,
        document.fileType
      );

    console.log(
      "[Diagnostics] Embeddings per document:",
      embeddingsPerDocument.length,
      "documents"
    );

    // 3. Get sample embeddings to verify dimensions
    const sampleEmbedding = await db
      .select({
        id: documentEmbedding.id,
        documentId: documentEmbedding.documentId,
        chunkIndex: documentEmbedding.chunkIndex,
        embedding: documentEmbedding.embedding,
        chunkTextPreview: sql<string>`substring(${documentEmbedding.chunkText}, 1, 100)`,
      })
      .from(documentEmbedding)
      .limit(1);

    let embeddingDimensions = 0;
    if (sampleEmbedding.length > 0 && sampleEmbedding[0].embedding) {
      embeddingDimensions = sampleEmbedding[0].embedding.length;
      console.log("[Diagnostics] Embedding dimensions:", embeddingDimensions);
    }

    // 4. Test search if query provided
    let searchResults = null;
    if (testQuery) {
      console.log("[Diagnostics] Testing search with query:", testQuery);
      const searchOptions = documentId
        ? { limit: 5, threshold: 0.3, documentIds: [documentId] }
        : { limit: 5, threshold: 0.3 };

      searchResults = await searchSimilarChunks(testQuery, searchOptions);
      console.log(
        "[Diagnostics] Search returned:",
        searchResults.length,
        "results"
      );
    }

    // 5. Get specific document chunks if documentId provided
    let documentChunks = null;
    if (documentId) {
      console.log("[Diagnostics] Getting chunks for document:", documentId);
      documentChunks = await getDocumentChunks(documentId);
      console.log(
        "[Diagnostics] Document has",
        documentChunks.length,
        "chunks"
      );
    }

    // 6. Check for documents without embeddings
    const documentsWithoutEmbeddings = await db
      .select({
        id: document.id,
        fileName: document.fileName,
        fileType: document.fileType,
        createdAt: document.createdAt,
      })
      .from(document)
      .leftJoin(
        documentEmbedding,
        eq(document.id, documentEmbedding.documentId)
      )
      .where(sql`${documentEmbedding.id} IS NULL`);

    console.log(
      "[Diagnostics] Documents without embeddings:",
      documentsWithoutEmbeddings.length
    );

    const response = {
      success: true,
      timestamp: new Date().toISOString(),
      summary: {
        totalEmbeddings: totalEmbeddings[0]?.count || 0,
        documentsWithEmbeddings: embeddingsPerDocument.length,
        documentsWithoutEmbeddings: documentsWithoutEmbeddings.length,
        embeddingDimensions,
      },
      embeddingsPerDocument: embeddingsPerDocument.map((doc) => ({
        documentId: doc.documentId,
        fileName: doc.fileName || "Unknown",
        fileType: doc.fileType || "Unknown",
        embeddingCount: Number(doc.count),
      })),
      sampleEmbedding:
        sampleEmbedding.length > 0
          ? {
              id: sampleEmbedding[0].id,
              documentId: sampleEmbedding[0].documentId,
              chunkIndex: sampleEmbedding[0].chunkIndex,
              chunkTextPreview: sampleEmbedding[0].chunkTextPreview,
              embeddingDimensions,
            }
          : null,
      documentsWithoutEmbeddings: documentsWithoutEmbeddings.map((doc) => ({
        id: doc.id,
        fileName: doc.fileName,
        fileType: doc.fileType,
        createdAt: doc.createdAt,
      })),
      testSearch: searchResults
        ? {
            query: testQuery,
            resultCount: searchResults.length,
            results: searchResults.map((r) => ({
              documentId: r.documentId,
              fileName: r.documentFileName,
              similarity: r.similarity,
              chunkIndex: r.chunkIndex,
              textPreview: r.chunkText.substring(0, 100) + "...",
            })),
          }
        : null,
      documentChunks: documentChunks
        ? {
            documentId,
            chunkCount: documentChunks.length,
            chunks: documentChunks.slice(0, 3).map((c) => ({
              id: c.id,
              chunkIndex: c.chunkIndex,
              textPreview: c.chunkText.substring(0, 100) + "...",
            })),
          }
        : null,
      usage: {
        testSearch: "Add ?testQuery=your+query to test vector search",
        testSpecificDocument:
          "Add &documentId=doc-id to search in specific document",
        getDocumentChunks:
          "Add ?documentId=doc-id to view chunks for a document",
      },
    };

    console.log("[Diagnostics] ✅ Diagnostics completed successfully");
    return NextResponse.json(response);
  } catch (error) {
    console.error("[Diagnostics] ❌ Error running diagnostics:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
