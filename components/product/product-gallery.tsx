"use client";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import {
  useProduct,
  useUpdateURL,
} from "@/components/product/product-provider";
import Image from "next/image";
import cloudflareLoader from "@/lib/imageLoader";

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
      <div className="relative aspect-square h-screen w-full overflow-hidden ">
        {images.length > 1 && (
          <>
            <button
              formAction={() => {
                const newState = updateImage(previousImageIndex.toString());
                updateURL(newState);
              }}
              aria-label="Previous product image"
              className="absolute left-2 top-1/2 z-10   px-2 py-1 rounded text-sm -translate-y-1/2 text-foreground"
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </button>
            <button
              formAction={() => {
                const newState = updateImage(nextImageIndex.toString());
                updateURL(newState);
              }}
              aria-label="Next product image"
              className="absolute right-2 top-1/2 z-10 text-foreground px-2 py-1  text-sm rounded -translate-y-1/2 "
            >
              <ChevronRightIcon className="h-5 w-5" />
            </button>
          </>
        )}
        {images[imageIndex] && (
          <Image
            loader={cloudflareLoader}
            className="h-full w-full   object-cover"
            sizes="(min-width: 1024px) 66vw, 100vw"
            alt={images[imageIndex]?.altText as string}
            src={images[imageIndex]?.src as string}
            width={1024}
            height={1024}
          />
        )}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-4 z-10  text-foreground px-2 py-1 rounded text-sm">
            {imageIndex + 1} / {images.length}
          </div>
        )}
      </div>
    </form>
  );
}
