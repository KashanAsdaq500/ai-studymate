import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const query = body.query;

    if (!query || typeof query !== "string") {
      return NextResponse.json(
        {
          success: false,
          error: "Query is required",
        },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // 1. Convert user's question into a Gemini embedding
    const embeddingResponse = await ai.models.embedContent({
      model: "gemini-embedding-001",
      contents: query,
      config: {
        outputDimensionality: 768,
      },
    });

    const queryEmbedding = embeddingResponse.embeddings?.[0]?.values;

    if (!queryEmbedding || queryEmbedding.length !== 768) {
      throw new Error(
        "Failed to generate a valid 768-dimensional query embedding."
      );
    }

    // 2. Search for the most relevant document chunks
    const { data, error } = await supabase.rpc(
      "match_document_chunks",
      {
        query_embedding: queryEmbedding,
        match_count: 3,
      }
    );

    if (error) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      query,
      results: data || [],
    });
  } catch (error) {
    console.error("Search error:", error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
