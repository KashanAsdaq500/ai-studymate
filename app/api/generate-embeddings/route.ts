import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { pipeline } from "@xenova/transformers";

let extractor: any = null;

async function getExtractor() {
  if (!extractor) {
    extractor = await pipeline(
      "feature-extraction",
      "Xenova/all-MiniLM-L6-v2"
    );
  }

  return extractor;
}

export async function POST() {
  try {
    const supabase = await createClient();

    // 1. Get document chunks
    const { data: chunks, error: chunksError } = await supabase
      .from("document_chunks")
      .select("id, chunk_text")
      .is("embedding", null)
      .order("chunk_index", { ascending: true });

    if (chunksError) {
      return NextResponse.json(
        {
          success: false,
          error: chunksError.message,
        },
        { status: 500 }
      );
    }

    if (!chunks || chunks.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No chunks need embeddings.",
        processed_chunks: 0,
      });
    }

    // 2. Load embedding model
    const model = await getExtractor();

    // 3. Generate embeddings
    for (const chunk of chunks) {
      const output = await model(chunk.chunk_text, {
        pooling: "mean",
        normalize: true,
      });

      const embedding = Array.from(output.data);

      // 4. Save embedding
      const { error: updateError } = await supabase
        .from("document_chunks")
        .update({
          embedding,
        })
        .eq("id", chunk.id);

      if (updateError) {
        return NextResponse.json(
          {
            success: false,
            error: updateError.message,
            chunk_id: chunk.id,
          },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      message: "Embeddings generated successfully!",
      processed_chunks: chunks.length,
    });
  } catch (error) {
    console.error("Embedding generation error:", error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}