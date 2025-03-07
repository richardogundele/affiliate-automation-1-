import OpenAI from "openai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ error: "OpenAI API key not configured" }, { status: 500 });
  }

  try {
    const { product_name, description, type } = await req.json();
    
    if (type === "text") {
      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });

      const systemPrompt = `You are an expert copywriter specializing in creating high-converting sales copy 
      for e-commerce products. Focus on benefits, unique selling points, and emotional triggers. 
      Use persuasive language and create urgency while maintaining credibility.`;

      const userPrompt = `Create compelling sales copy for the following product:
      Product Name: ${product_name}
      Product Description: ${description}
      
      Include:
      - Attention-grabbing headline
      - Key benefits and features
      - Emotional triggers
      - Call to action
      - Social proof elements`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 500,
      });

      return NextResponse.json({ 
        content: completion.choices[0].message.content 
      });
    }

    throw new Error("Unsupported generation type");
  } catch (error) {
    console.error("Text generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate text", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}