"use client";

import { PortableText } from "next-sanity";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { getBlogPostBySlug } from "@/server/sanity/actions";
import { Post } from "@/lib/types";
import { urlFor } from "@/lib/sanity/image";
import Link from "next/link";
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const {
    mutate: fetchPost,
    data: post,
    isPending,
    error,
  } = useApiMutation<Post, string>(async (slug: string) => {
    return await getBlogPostBySlug(slug);
  }, {
    onError: (error) => {
      console.error("Failed to fetch blog post:", error);
    },
  });

  useEffect(() => {
    params.then(({ slug }) => {
      fetchPost(slug);
    });
  }, [params, fetchPost]);

  if (isPending) {
    return (
      <main className="container mx-auto min-h-screen max-w-3xl p-8 flex flex-col gap-4">
        <Link href="/blog" className="hover:underline">
          ← Back to announcements
        </Link>
        <Skeleton className="aspect-video rounded-xl" />
        <Skeleton className="h-10 w-3/4" />
        <div className="prose">
          <Skeleton className="h-4 w-1/2 mb-4" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="container mx-auto min-h-screen max-w-3xl p-8 flex flex-col gap-4">
        <Link href="/blog" className="hover:underline">
          ← Back to announcements
        </Link>
        <p className="text-destructive">
          Failed to load blog post. Please try again.
        </p>
      </main>
    );
  }

  if (!post) {
    return (
      <main className="container mx-auto min-h-screen max-w-3xl p-8 flex flex-col gap-4">
        <Link href="/blog" className="hover:underline">
          ← Back to announcements
        </Link>
        <p className="text-muted-foreground">Blog post not found.</p>
      </main>
    );
  }

  const postImageUrl = post.image
    ? urlFor(post.image)?.width(550).height(310).url()
    : null;

  return (
    <main className="container mx-auto min-h-screen max-w-3xl p-8 flex flex-col gap-4">
      <Link href="/blog" className="hover:underline">
        ← Back to announcements
      </Link>
      {postImageUrl && (
        <img
          src={postImageUrl}
          alt={post.title}
          className="aspect-video rounded-xl"
          width="550"
          height="310"
        />
      )}
      <h1 className="text-4xl font-bold mb-8">{post.title}</h1>
      <div className="prose">
        <p className="text-muted-foreground">
          Published: {new Date(post.publishedAt).toLocaleDateString()}
        </p>
        {Array.isArray(post.body) && <PortableText value={post.body} />}
      </div>
    </main>
  );
}
