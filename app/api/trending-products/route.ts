import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function GET() {
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a market research expert. Generate 4 currently trending products with their estimated monthly search volume and brief market insight. Format as JSON array."
        },
        {
          role: "user",
          content: "What are some currently trending products on the market?"
        }
      ],
      temperature: 0.7,
      response_format: { type: "json_object" },
      max_tokens: 500
    });

    const trendingProducts = JSON.parse(completion.choices[0].message.content || '{"products": []}');

    return NextResponse.json(trendingProducts);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({
      products: [
        {
          name: "Smart Water Bottle",
          searchVolume: "250K+",
          insight: "Rising health consciousness driving demand",
          trend: "↑ 45%"
        },
        {
          name: "Portable Solar Charger",
          searchVolume: "180K+",
          insight: "Eco-friendly tech gaining traction",
          trend: "↑ 32%"
        },
        {
          name: "Sleep Tracking Ring",
          searchVolume: "120K+",
          insight: "Wellness tech sector boom",
          trend: "↑ 28%"
        },
        {
          name: "Plant-Based Protein Bars",
          searchVolume: "200K+",
          insight: "Health food market expansion",
          trend: "↑ 38%"
        }
      ]
    });
  }
} 