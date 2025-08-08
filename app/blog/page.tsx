import { getBlogPosts } from "@/server/sanity/actions";
import Link from "next/link";
import { notFound } from "next/navigation";
import Image from "next/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default async function Page() {
  const posts = await getBlogPosts();

  if (!posts) {
    return notFound();
  }

  return (
    <main className="mx-auto min-h-screen min-w-screen p-8">
      <h1 className="text-md uppercase font-bold mb-8">Announcements</h1>
      <Suspense
        fallback={
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ">
            <Skeleton className="h-60 w-60" />
            <Skeleton className="h-60 w-60" />
            <Skeleton className="h-60 w-60" />
          </div>
        }
      >
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ">
          {posts?.data?.map((post) => (
            <article key={post._id}>
              <Link href={`/blog/${post.slug.current}`} className="block">
                <AspectRatio ratio={1 / 1}>
                  <Suspense
                    fallback={
                      <Skeleton className="h-full w-full object-cover" />
                    }
                  >
                    <Image
                      // @ts-expect-error improper type
                      src={post.image?.asset?.url || "/placeholder.svg"}
                      alt={post.title}
                      width={200}
                      height={240}
                      className="h-full w-full object-cover "
                    />
                  </Suspense>
                </AspectRatio>

                <div className="p-2 flex flex-col items-center justify-center">
                  <h2 className="mb-2 text-sm font-semibold leading-tight group-hover:text-primary">
                    {post.title}
                  </h2>

                  <div className="mb-1 flex items-center gap-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <span>{post.author}</span>
                    </div>
                    |
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
    </main>
  );
}
