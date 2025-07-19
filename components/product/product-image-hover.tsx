"use client";

import { useState } from "react";

interface ProductImageHoverProps {
  images: Array<{
    url: string;
    altText: string;
  }>;
}

export function ProductImageHover({ images }: ProductImageHoverProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleMouseEnter = () => {
    if (images.length > 1) {
      setCurrentImageIndex(1);
    }
  };

  const handleMouseLeave = () => {
    setCurrentImageIndex(0);
  };

  if (!images[0]) return null;

  return (
    <img
      src={images[currentImageIndex]?.url || images[0].url}
      alt={images[currentImageIndex]?.altText || images[0].altText}
      width={400}
      height={200}
      className="h-full w-full object-cover transition-transform duration-300"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    />
  );
}
