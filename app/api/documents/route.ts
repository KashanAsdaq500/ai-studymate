import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();

    // 1. Fetch all study documents
    const { data: documents, error: docsError } = await supabase
      .from("study_documents")
      .select("id, title, file_name, file_url, created_at")
      .order("created_at", { ascending: false });

    if (docsError) {
      console.error("Error fetching documents:", docsError);
      return NextResponse.json(
        { success: false, error: docsError.message },
        { status: 500 }
      );
    }

    if (!documents || documents.length === 0) {
      return NextResponse.json({
        success: true,
        documents: [],
      });
    }

    // 2. Fetch chunk counts for each document
    const { data: chunks, error: chunksError } = await supabase
      .from("document_chunks")
      .select("document_id");

    const chunkCountMap = new Map<string, number>();
    if (!chunksError && chunks) {
      for (const chunk of chunks) {
        if (chunk.document_id) {
          chunkCountMap.set(
            chunk.document_id,
            (chunkCountMap.get(chunk.document_id) || 0) + 1
          );
        }
      }
    }

    // 3. Format documents with chunk count and ready status
    const formatted = documents.map((doc) => {
      const chunkCount = chunkCountMap.get(doc.id) || 0;
      return {
        id: doc.id,
        name: doc.title || doc.file_name?.replace(/\.[^/.]+$/, "") || "Untitled Document",
        fileName: doc.file_name || "document.docx",
        fileUrl: doc.file_url || null,
        status: chunkCount > 0 ? "Ready for AI" : "Processing",
        indexedChunks: chunkCount,
        uploadDate: doc.created_at
          ? new Date(doc.created_at).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
              year: "numeric",
            })
          : "Recently",
        format: doc.file_name?.toLowerCase().endsWith(".pdf") ? "PDF" : "DOCX",
      };
    });

    return NextResponse.json({
      success: true,
      documents: formatted,
    });
  } catch (error: unknown) {
    console.error("GET /api/documents error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to load documents",
      },
      { status: 500 }
    );
  }
}
