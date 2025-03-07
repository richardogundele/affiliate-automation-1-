'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpIcon, ArrowDownIcon } from "@radix-ui/react-icons";

interface TrendingProduct {
  name: string;
  searchVolume: string;
  insight: string;
  trend: string;
}

export function TrendingProducts() {
  const [products, setProducts] = useState<TrendingProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTrendingProducts() {
      try {
        const response = await fetch('/api/trending-products');
        const data = await response.json();
        setProducts(data.products);
      } catch (error) {
        console.error('Error fetching trending products:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchTrendingProducts();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-[200px]">Loading...</div>;
  }

  return (
    <div className="space-y-4">
      {products.map((product, index) => (
        <div
          key={index}
          className="flex items-center justify-between p-4 rounded-lg border bg-card text-card-foreground shadow-sm"
        >
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none">{product.name}</p>
            <p className="text-sm text-muted-foreground">{product.insight}</p>
          </div>
          <div className="flex flex-col items-end">
            <div className="flex items-center">
              <span className="text-sm font-medium">{product.searchVolume}</span>
              <span className="ml-2 text-green-500">{product.trend}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 