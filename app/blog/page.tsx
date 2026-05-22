import { getBlogPosts } from "@/server/sanity/actions";
import Link from "next/link";
import { notFound } from "next/navigation";
import Image from "next/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import type { Metadata } from "next";
import { generateMetadata as createMetadata } from "@/lib/metadata";

export const metadata: Metadata = createMetadata({
  title: "Blog",
  description: "The latest from BVR ST STUDIO",
  canonical: "https://bvrst.studio/blog",
  image: {
    url: "https://bvrst.studio/opengraph/index.png",
    alt: "BVR ST STUDIO Blog",
  },
});

export default async function Page() {
  const posts = await getBlogPosts();

  if (!posts) {
    return notFound();
  }

  return (
    <main className="bg-background text-foreground">
      <div className="mx-auto w-full max-w-6xl border-x border-border">
        {/* Header */}
        <section className="border-b border-border px-6 py-20 md:px-12 md:py-28">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-primary mb-4">
            BVR ST STUDIO
          </p>
          <h1 className="text-3xl font-thin tracking-[-0.02em] text-foreground md:text-5xl">
            Announcements
          </h1>
        </section>

        {/* Grid */}
        <section className="px-6 py-20 md:px-12 md:py-28">
          <Suspense
            fallback={
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                <Skeleton className="h-[300px] w-full" />
                <Skeleton className="h-[300px] w-full" />
                <Skeleton className="h-[300px] w-full" />
              </div>
            }
          >
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {posts?.data?.reverse().map((post) => (
                <article key={post._id}>
                  <Link
                    href={`/blog/${post.slug.current}`}
                    className="group block border border-border rounded-lg bg-card hover:bg-secondary transition-colors"
                    prefetch
                  >
                    <AspectRatio ratio={1 / 1}>
                      <Suspense
                        fallback={
                          <Skeleton className="h-full w-full object-cover rounded-t-lg" />
                        }
                      >
                        <Image
                          // @ts-expect-error improper type
                          src={post.image?.asset?.url || "/placeholder.svg"}
                          alt={post.title}
                          width={200}
                          height={240}
                          className="h-full w-full object-cover rounded-t-lg"
                        />
                      </Suspense>
                    </AspectRatio>

                    <div className="p-3 flex flex-col items-start justify-center">
                      <h2 className="mb-2 text-sm font-medium leading-tight text-foreground group-hover:text-primary transition-colors">
                        {post.title}
                      </h2>

                      <div className="mb-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <span>{post.author}</span>
                        </div>
                        <span className="opacity-40">|</span>
                        <div className="flex items-center gap-1">
                          <span>
                            {new Date(post.publishedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          </Suspense>
        </section>
      </div>
    </main>
  );
}
