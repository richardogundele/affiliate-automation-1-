import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(request: Request) {
  try {
    const { product_name, description, prompt = "" } = await request.json();

    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OpenAI API key is not configured');
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: `Professional product photography of ${product_name}. ${description}. 
        High-quality commercial product shot, studio lighting, photorealistic, 
        detailed texture, professional marketing material style, white background, 
        centered composition. ${prompt}`.trim(),
      n: 1,
      size: "1024x1024",
      quality: "hd",
      style: "natural"
    });

    const imageUrl = response.data[0]?.url;
    if (!imageUrl) {
      throw new Error("No image URL generated");
    }

    console.log('Generated image URL:', imageUrl);

    return NextResponse.json({
      success: true,
      url: imageUrl,
      isPlaceholder: false
    });
  } catch (error) {
    console.error('Error generating image:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to generate image', 
        details: error instanceof Error ? error.message : "Unknown error",
        url: `/placeholder.png`,
        isPlaceholder: true
      }, 
      { status: 500 }
    );
  }
}

