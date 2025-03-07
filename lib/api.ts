import { mockDashboardData, mockLeads, mockCampaigns, mockNotifications } from "./mockData"
import type { Product } from "./types"
import OpenAI from "openai";

// Add these new types
interface Campaign {
  id?: string;
  name: string;
  product_id: string;
  status?: 'active' | 'paused' | 'completed';
  created_at?: string;
  [key: string]: any;
}

interface AdCopy {
  headline: string;
  body: string;
  cta: string;
}

interface ImageResponse {
  url: string;
  isPlaceholder: boolean;
}

const getOpenAIInstance = () => {
  const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY || process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    throw new Error("OpenAI API key is not configured. Please add OPENAI_API_KEY to your environment variables.");
  }

  return new OpenAI({
    apiKey: apiKey,
    dangerouslyAllowBrowser: true
  });
};

export async function getDashboardInsights() {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockDashboardData)
    }, 500)
  })
}

export async function fetchLeads() {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockLeads)
    }, 500)
  })
}

export async function fetchProducts(): Promise<Product[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockProduct = {
        id: "1",
        name: "Blue Light Blocking Glasses",
        description: "Protect your eyes from digital strain",
        status: "Active",
        analysis: {
          demand_level: "High",
          dates: ["2023-01", "2023-02", "2023-03", "2023-04", "2023-05", "2023-06"],
          values: [65, 59, 80, 81, 56, 55],
        },
        salesCopy: [
          "Protect your eyes from harmful blue light with our cutting-edge Blue Light Blocking Glasses!",
          "Experience reduced eye strain and better sleep with our innovative Blue Light Blocking technology.",
        ],
        images: [
          {
            url: "https://images.unsplash.com/photo-1577400983943-1c979d857bcc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
            isPlaceholder: false,
          },
        ],
      }

      // Retrieve stored products from localStorage
      const storedProducts = JSON.parse(localStorage.getItem("products") || "[]")

      // Combine mock product with stored products, ensuring no duplicates
      const allProducts = [mockProduct, ...storedProducts].reduce((acc, product) => {
        if (!acc.some((p: Product) => p.id === product.id)) {
          acc.push(product)
        }
        return acc
      }, [] as Product[])

      resolve(allProducts)
    }, 500)
  })
}

export async function generateAdCopy(product: { name: string; description: string }) {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        headline: `Check out ${product.name}!`,
        body: product.description,
        cta: "Buy now!",
      })
    }, 500)
  })
}

export async function generateProductDescription(product: { name: string; features: string }) {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`This is a great ${product.name} with amazing features: ${product.features}`)
    }, 500)
  })
}

export async function fetchCampaigns() {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockCampaigns)
    }, 500)
  })
}

export async function fetchNotifications() {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockNotifications)
    }, 500)
  })
}

export async function createCampaign(campaign: Campaign) {
  // Validate campaign data
  if (!campaign.name || !campaign.product_id) {
    throw new Error("Campaign must include name and product_id");
  }

  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      const newCampaign = { 
        ...campaign, 
        id: Math.random().toString(36).substring(7),
        created_at: new Date().toISOString(),
        status: 'active'
      }
      resolve(newCampaign)
    }, 500)
  })
}

export async function updateCampaign(campaign: any) {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(campaign)
    }, 500)
  })
}

export async function analyzeProduct({ keyword }: { keyword: string }) {
  try {
    const response = await fetch('/api/analyze-product', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ keyword }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    return await response.json();
  } catch (error) {
    console.error("Error analyzing product:", error);
    return {
      demand_level: "medium",
      dates: ["2023-01", "2023-02", "2023-03", "2023-04", "2023-05", "2023-06"],
      values: [65, 59, 80, 81, 56, 55],
      error: error instanceof Error ? error.message : "Unknown error occurred"
    }
  }
}

export async function generateText({
  product_name,
  description,
  prompt,
}: {
  product_name: string;
  description: string;
  prompt: string;
}) {
  try {
    const response = await fetch('/api/generate-text', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ product_name, description, prompt }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    return await response.json();
  } catch (error) {
    console.error("Error generating text:", error);
    return { 
      text: `Failed to generate sales copy for ${product_name}. Please try again later.`,
      error: error instanceof Error ? error.message : "Unknown error occurred"
    };
  }
}

export async function generateImage({
  product_name,
  description,
  prompt = "",
}: {
  product_name: string;
  description: string;
  prompt?: string;
}) {
  try {
    const response = await fetch('/api/generate-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ product_name, description, prompt }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    console.log('Image generation response:', data); // Add logging

    if (data.error) {
      throw new Error(data.error);
    }

    if (!data.url) {
      throw new Error('No image URL received');
    }

    return {
      url: data.url,
      isPlaceholder: data.isPlaceholder || false,
    };
  } catch (error) {
    console.error("Error generating image:", error);
    return {
      url: `/placeholder.png`,
      isPlaceholder: true,
      error: error instanceof Error ? error.message : "Unknown error occurred"
    };
  }
}

export async function deleteCampaign(campaignId: string) {
  try {
    const response = await fetch(`/api/campaigns/${campaignId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete campaign');
    }

    return true;
  } catch (error) {
    console.error("Error deleting campaign:", error);
    throw error;
  }
}

export async function getExistingProducts() {
  try {
    const response = await fetch('/api/products');
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching products:", error);
    // Return an empty array as fallback
    return [];
  }
}

