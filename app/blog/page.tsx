"use client";

import { useApiMutation } from "@/hooks/use-api-mutation";
import { getBlogPosts } from "@/server/sanity/actions";
import { Post } from "@/lib/types";
import Link from "next/link";
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Page() {
  const {
    mutate: fetchPosts,
    data: posts,
    isPending,
    error,
  } = useApiMutation<Post[], void>(async (_variables: void) => await getBlogPosts(), {
    onError: (error) => {
      console.error("Failed to fetch blog posts:", error);
    },
  });

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  if (isPending) {
    return (
      <main className="container mx-auto min-h-screen max-w-3xl p-8">
        <h1 className="text-4xl font-bold mb-8">Announcements</h1>
        <ul className="flex flex-col gap-y-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <li key={i} className="bg-muted p-4 rounded">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </li>
          ))}
        </ul>
      </main>
    );
  }

  if (error) {
    return (
      <main className="container mx-auto min-h-screen max-w-3xl p-8">
        <h1 className="text-4xl font-bold mb-8">Announcements</h1>
        <p className="text-destructive">
          Failed to load blog posts. Please try again.
        </p>
      </main>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <main className="container mx-auto min-h-screen max-w-3xl p-8">
        <h1 className="text-4xl font-bold mb-8">Announcements</h1>
        <p className="text-muted-foreground">No blog posts available.</p>
      </main>
    );
  }

  return (
    <main className="container mx-auto min-h-screen max-w-3xl p-8">
      <h1 className="text-4xl font-bold mb-8">Announcements</h1>
      <ul className="flex flex-col gap-y-4">
        {posts.map((post) => (
          <li
            className="hover:underline bg-muted p-4 rounded hover:bg-muted/80"
            key={post._id}
          >
            <Link href={`/blog/${post.slug.current}`}>
              <h2 className="text-xl font-semibold">{post.title}</h2>
              <p>
                {new Date(post.publishedAt).toLocaleDateString()} {post.author}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
