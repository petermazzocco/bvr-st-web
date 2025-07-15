"use client";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import {
  useProduct,
  useUpdateURL,
} from "@/components/product/product-provider";
import Image from "next/image";

export function Gallery({
  images,
}: {
  images: { src: string; altText: string }[];
}) {
  const { state, updateImage } = useProduct();
  const updateURL = useUpdateURL();
  const imageIndex = state.image ? parseInt(state.image) : 0;

  const nextImageIndex = imageIndex + 1 < images.length ? imageIndex + 1 : 0;
  const previousImageIndex =
    imageIndex === 0 ? images.length - 1 : imageIndex - 1;

  return (
    <form>
      <div className="relative aspect-square h-full max-h-full w-full overflow-hidden ">
        {images.length > 1 && (
          <>
            <button
              formAction={() => {
                const newState = updateImage(previousImageIndex.toString());
                updateURL(newState);
              }}
              aria-label="Previous product image"
              className="absolute left-2 top-1/2 z-10 -translate-y-1/2 text-foreground"
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </button>
            <button
              formAction={() => {
                const newState = updateImage(nextImageIndex.toString());
                updateURL(newState);
              }}
              aria-label="Next product image"
              className="absolute right-2 top-1/2 z-10 -translate-y-1/2 text-foreground"
            >
              <ChevronRightIcon className="h-5 w-5" />
            </button>
          </>
        )}
        {images[imageIndex] && (
          <Image
            className="h-full w-full   object-cover"
            fill
            sizes="(min-width: 1024px) 66vw, 100vw"
            alt={images[imageIndex]?.altText as string}
            src={images[imageIndex]?.src as string}
            priority={true}
          />
        )}
      </div>
    </form>
  );
}
