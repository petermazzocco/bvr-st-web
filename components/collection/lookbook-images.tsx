"use client";

import { AdditionalImage } from "@/lib/types";
import Image from "next/image";
import cloudflareLoader from "@/lib/imageLoader";

export function LookbookImages({ images }: { images: AdditionalImage[] }) {
  return (
    <>
      {images.map((image, index) => (
        <div key={index} className="relative">
          <Image
            src={image.url}
            alt={`Lookbook image ${index + 1}`}
            className="w-full h-auto  object-cover"
            width={500}
            height={500}
          />
        </div>
      ))}
    </>
  );
}
