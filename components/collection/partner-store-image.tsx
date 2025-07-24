"use client";
import Image from "next/image";
import cloudflareLoader from "@/lib/imageLoader";

export const PartnerStoreImage = ({
  collection,
}: {
  collection: {
    id: string;
    title: string;
    handle: string;
    description: string;
    image: {
      url: string;
      altText: string | null;
    } | null;
    productCount: number;
  };
}) => {
  return (
    <Image
      loader={cloudflareLoader}
      src={collection?.image?.url || ""}
      alt={collection?.image?.altText || collection.title}
      className="h-full w-full object-contain p-4 object-center  bg-muted "
      width={500}
      height={500}
    />
  );
};
