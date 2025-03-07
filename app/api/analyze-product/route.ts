import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(request: Request) {
  try {
    const { keyword } = await request.json();

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a market analysis expert. Analyze the product and categorize its demand as 'high', 'medium', or 'low'."
        },
        {
          role: "user",
          content: `Analyze the market demand for: ${keyword}`
        }
      ],
      temperature: 0.7,
      max_tokens: 100
    });

    const result = completion.choices[0].message.content?.toLowerCase() || 'medium';
    const demandLevel = result.includes('high') ? 'high' : result.includes('low') ? 'low' : 'medium';

    return NextResponse.json({
      demand_level: demandLevel,
      dates: ["2023-01", "2023-02", "2023-03", "2023-04", "2023-05", "2023-06"],
      values: [65, 59, 80, 81, 56, 55].map(() => Math.floor(Math.random() * 100)),
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed to analyze product' }, { status: 500 });
  }
} 