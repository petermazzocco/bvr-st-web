"use client";
import Image from "next/image";
import { ApiResult, Post } from "@/lib/types";
import { AspectRatio } from "../ui/aspect-ratio";

export const PostImage = ({ 
  post, 
  isParallax = false 
}: { 
  post: ApiResult<Post>;
  isParallax?: boolean;
}) => {
  // @ts-expect-error improper type
  const postImageUrl = post.data?.image?.asset?.url || null;

  if (isParallax) {
    return (
      <Image
        src={postImageUrl || ""}
        alt={post.data?.title || ""}
        className="object-cover w-full h-full"
        fill
        priority
      />
    );
  }

  return (
    <div className="w-full">
      <AspectRatio ratio={18 / 5}>
        <Image
          src={postImageUrl || ""}
          alt={post.data?.title || ""}
          className="object-cover w-full h-full"
          fill
          priority
        />
      </AspectRatio>
    </div>
  );
};
