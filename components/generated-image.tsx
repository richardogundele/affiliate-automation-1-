'use client';

import Image from 'next/image';
import { useState } from 'react';

interface GeneratedImageProps {
  imageUrl: string;
  alt: string;
  isPlaceholder?: boolean;
}

export function GeneratedImage({ imageUrl, alt, isPlaceholder = false }: GeneratedImageProps) {
  const [error, setError] = useState(false);

  if (!imageUrl) {
    return (
      <div className="w-full h-64 bg-muted flex items-center justify-center">
        <p className="text-muted-foreground">No image available</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-64">
      <Image
        src={error ? '/placeholder.png' : imageUrl}
        alt={alt}
        fill
        className="object-contain rounded-md"
        onError={() => {
          console.error('Error loading image:', imageUrl);
          setError(true);
        }}
      />
    </div>
  );
} 