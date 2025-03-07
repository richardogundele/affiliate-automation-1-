import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(request: Request) {
  try {
    const { product_name, description, prompt } = await request.json();

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `Act as a world-class copywriter and marketing strategist. Create a polished, professionally formatted sales copy following this exact structure and formatting:

[HEADLINE]
• Write in ALL CAPS
• Make it attention-grabbing
• Keep it under 70 characters
• Add two blank lines after

[SUBHEADLINE]
• Write in Title Case
• Make it benefit-focused
• Keep it under 100 characters
• Add two blank lines after

[MAIN COPY]
• Write in clear paragraphs
• Use short, punchy sentences
• Add one blank line between paragraphs
• Include 2-3 bullet points for key benefits
• Format bullet points with "•" symbol
• Add two blank lines after

[SOCIAL PROOF]
• Include one strong testimonial or statistic
• Format in italics
• Add two blank lines after

[OFFER]
• Present the main offer clearly
• Include any bonuses or special deals
• Format pricing with bold numbers
• Add two blank lines after

[CALL TO ACTION]
• Write in Title Case
• Make it action-oriented
• Create urgency
• End with ">>>" to draw attention

Format the final output exactly like this example:

🔥 TRANSFORM YOUR LIFE WITH [PRODUCT] TODAY 🔥

Experience the Future of [Benefit] Right Now

Tired of [pain point]? Our revolutionary [product] is here to change that forever. 

Here's what makes [product] special:
• Benefit 1: Specific result
• Benefit 2: Specific result
• Benefit 3: Specific result

"This [product] changed everything for me. [Specific result] in just [timeframe]" 
- Real Customer Name

Special Launch Offer:
Regular Price: $XX
Today Only: $YY
Save 50% + Get 3 Free Bonuses

>> CLAIM YOUR [PRODUCT] NOW - LIMITED TIME OFFER >>>`
        },
        {
          role: "user",
          content: `Create compelling sales copy for:
          Product: ${product_name}
          Description: ${description}
          Additional Requirements: ${prompt}`
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    });

    // Add line breaks for better formatting in the frontend
    const formattedText = completion.choices[0].message.content?.replace(/\n/g, '\n\n') || '';

    return NextResponse.json({ text: formattedText });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed to generate text' }, { status: 500 });
  }
} 