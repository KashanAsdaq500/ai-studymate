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

    // 1. Convert user's question into an embedding
    const model = await getExtractor();

    const output = await model(query, {
      pooling: "mean",
      normalize: true,
    });

    const queryEmbedding = Array.from(output.data);

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