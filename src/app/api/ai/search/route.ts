import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(req: Request) {
  try {
    const { query } = await req.json();
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: 'OPENAI_API_KEY is not configured' }, { status: 500 });
    }

    // 1. Generate Embedding from OpenAI
    const embeddingRes = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        input: query,
        model: 'text-embedding-3-small',
      }),
    });

    const embeddingData = await embeddingRes.json();
    if (!embeddingRes.ok) throw new Error(embeddingData.error?.message || 'Failed to generate embedding');

    const embedding = embeddingData.data[0].embedding;

    // 2. Vector Search in Supabase
    const supabase = createClient();
    const { data: assets, error: searchError } = await supabase.rpc('match_assets', {
      query_embedding: embedding,
      match_threshold: 0.3,
      match_count: 10,
    });

    if (searchError) throw new Error(searchError.message);

    return NextResponse.json({ assets });

  } catch (err: any) {
    console.error('Search API Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
