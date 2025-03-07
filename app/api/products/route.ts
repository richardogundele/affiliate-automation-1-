import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // For now, we'll return mock data
    // In a real application, this would fetch from your database
    const products = [
      {
        id: "1",
        name: "Blue Light Blocking Glasses",
        description: "Protect your eyes from digital strain",
        status: "Active",
      },
      {
        id: "2",
        name: "Smart Water Bottle",
        description: "Track your hydration with smart technology",
        status: "Active",
      },
      {
        id: "3",
        name: "Ergonomic Keyboard",
        description: "Comfortable typing experience for long hours",
        status: "Active",
      },
      {
        id: "4",
        name: "Wireless Earbuds",
        description: "Premium sound quality with noise cancellation",
        status: "Active",
      }
    ];

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
} 