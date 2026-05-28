import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    const falKey = process.env.FAL_KEY;

    if (!falKey) {
      return NextResponse.json({ error: 'FAL_KEY is not configured' }, { status: 500 });
    }

    // Using Fal.ai for fast texture generation (SDXL or similar)
    const res = await fetch('https://fal.run/fal-ai/fast-sdxl', {
      method: 'POST',
      headers: {
        'Authorization': `Key ${falKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: `seamless texture of ${prompt}, high resolution, 8k, pbr, architectural material`,
        image_size: 'square_hd',
        num_inference_steps: 25,
      }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || 'Failed to generate material');

    return NextResponse.json({ imageUrl: data.images[0].url });

  } catch (err: any) {
    console.error('Material API Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
