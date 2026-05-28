import { GoogleGenerativeAI } from '@google/generative-ai';
import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const systemPrompt = `Bạn là chuyên gia thiết kế 3D bằng OpenSCAD.
Hãy viết mã OpenSCAD hoàn chỉnh để tạo ra đồ vật: "${prompt}".

YÊU CẦU KỸ THUẬT:
1. Chỉ trả về mã code OpenSCAD thuần túy, không giải thích, không markdown.
2. Luôn bắt đầu bằng việc thiết lập độ phân giải: "$fn = 50;".
3. Sử dụng đơn vị mm. Kích thước tổng thể nên nằm trong khoảng 200mm - 800mm.
4. Ưu tiên sử dụng: cube(), cylinder(), sphere(), union(), difference().
5. Đồ vật phải được lắp ghép logic (ví dụ: cái bàn thì phải có mặt bàn và các chân bàn được translate đúng vị trí).
6. Mã code phải compile được 100% không có lỗi cú pháp.`;

    let scadCode = '';
    let usedModel = '';

    // --- TẦNG 1: GEMINI (ƯU TIÊN) ---
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) throw new Error('GEMINI_API_KEY missing');

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
      const result = await model.generateContent(systemPrompt);
      scadCode = result.response.text();
      usedModel = 'gemini';
    } catch (geminiError: any) {
      console.warn('Gemini failed:', geminiError.message);

      // --- TẦNG 2: GROQ (FALLBACK MIỄN PHÍ TỐT NHẤT) ---
      try {
        const groqApiKey = process.env.GROQ_API_KEY;
        if (!groqApiKey) throw new Error('GROQ_API_KEY missing');

        const groq = new OpenAI({
          apiKey: groqApiKey,
          baseURL: 'https://api.groq.com/openai/v1',
        });

        const response = await groq.chat.completions.create({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: 'Bạn là chuyên gia OpenSCAD. Chỉ trả về mã code thuần túy.' },
            { role: 'user', content: systemPrompt }
          ],
        });

        scadCode = response.choices[0].message.content || '';
        usedModel = 'groq';
      } catch (groqError: any) {
        console.warn('Groq failed:', groqError.message);

        // --- TẦNG 3: GROK (FALLBACK TRẢ PHÍ) ---
        try {
          const grokApiKey = process.env.GROK_API_KEY;
          if (!grokApiKey) throw new Error('GROK_API_KEY missing');

          const grok = new OpenAI({
            apiKey: grokApiKey,
            baseURL: 'https://api.x.ai/v1',
          });

          const response = await grok.chat.completions.create({
            model: 'grok-latest',
            messages: [
              { role: 'system', content: 'Bạn là chuyên gia OpenSCAD. Chỉ trả về mã code thuần túy.' },
              { role: 'user', content: systemPrompt }
            ],
          });

          scadCode = response.choices[0].message.content || '';
          usedModel = 'grok';
        } catch (grokError: any) {
          throw new Error('Tất cả các dịch vụ AI hiện tại đều không khả dụng (hết quota hoặc lỗi kết nối). Vui lòng thử lại sau giây lát.');
        }
      }
    }

    // Tiền xử lý để xóa markdown bọc code nếu LLM lỡ thêm vào
    scadCode = scadCode.replace(/^```(scad|openscad)?/i, '').replace(/```$/i, '').trim();

    return NextResponse.json({ scadCode, usedModel });
  } catch (error: any) {
    console.error('Final Text-to-3D API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
