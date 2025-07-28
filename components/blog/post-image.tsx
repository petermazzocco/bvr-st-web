"use client";

import Image from "next/image";
import { ApiResult, Post } from "@/lib/types";
import { urlFor } from "@/lib/sanity/image";

export const PostImage = ({ post }: { post: ApiResult<Post> }) => {
  const postImageUrl = post.data?.image
    ? urlFor(post.data.image)?.width(550).height(310).url()
    : null;
  return (
    <Image
      src={postImageUrl || ""}
      alt={post.data?.title || ""}
      className="aspect-video rounded-xl"
      width={550}
      height={310}
    />
  );
};
