import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { sceneState, userMessage } = await req.json();
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: 'OPENAI_API_KEY is not configured' }, { status: 500 });
    }

    const systemPrompt = `
      You are an expert interior designer AI. You help users style their 3D room.
      The current scene state is: ${JSON.stringify(sceneState)}
      
      Suggest specific improvements like changing colors, adding assets, or adjusting lighting.
      Keep it professional, encouraging, and concise.
      Return your suggestions in a friendly chat format.
    `;

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage }
        ],
      }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error?.message || 'Failed to get suggestions');

    return NextResponse.json({ message: data.choices[0].message.content });

  } catch (err: any) {
    console.error('Assistant API Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
