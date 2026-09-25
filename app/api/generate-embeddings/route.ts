import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function POST() {
  try {
    const supabase = await createClient();

    // 1. Get document chunks that do not have embeddings yet
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

    // 2. Generate Gemini embeddings
    for (const chunk of chunks) {
      const response = await ai.models.embedContent({
        model: "gemini-embedding-001",
        contents: chunk.chunk_text,
        config: {
          outputDimensionality: 768,
        },
      });

      const embedding = response.embeddings?.[0]?.values;

      if (!embedding || embedding.length !== 768) {
        throw new Error(
          `Failed to generate a valid 768-dimensional embedding for chunk ${chunk.id}.`
        );
      }

      // 3. Save embedding
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
