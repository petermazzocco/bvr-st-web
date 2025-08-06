"use client";
import Image from "next/image";
import { ApiResult, Post } from "@/lib/types";
import { AspectRatio } from "../ui/aspect-ratio";

export const PostImage = ({ post }: { post: ApiResult<Post> }) => {
  // @ts-expect-error improper type
  const postImageUrl = post.data?.image?.asset?.url || null;

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
