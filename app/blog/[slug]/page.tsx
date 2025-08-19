import type { Metadata } from "next";
import { PortableText } from "next-sanity";
import { getBlogPostBySlug } from "@/server/sanity/actions";
import { notFound } from "next/navigation";
import { PostImage } from "@/components/blog/post-image";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { AddToNewsletterForm } from "@/components/forms/add-to-newsletter-form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const post = await getBlogPostBySlug(params.slug);

  if (!post.data) {
    return {
      title: "Post Not Found | BVR ST CO",
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://bvrstco.com";
  // @ts-expect-error improper typing
  const imageUrl = post.data?.image?.asset?.url;

  return {
    title: `${post.data.title} | BVR ST CO`,
    description: `Read ${post.data.title} on BVR ST CO blog`,
    openGraph: {
      title: `${post.data.title} | BVR ST CO`,
      description: `Read ${post.data.title} on BVR ST CO blog`,
      url: `${siteUrl}/blog/${params.slug}`,
      siteName: "BVR ST CO",
      images: imageUrl
        ? [
            {
              url: imageUrl,
              width: 1200,
              height: 630,
              alt: post.data.title,
            },
          ]
        : [],
      locale: "en_US",
      type: "article",
      publishedTime: post.data.publishedAt,
      authors: [post.data.author],
    },
    twitter: {
      card: "summary_large_image",
      title: `${post.data.title} | BVR ST CO`,
      description: `Read ${post.data.title} on BVR ST CO blog`,
      images: imageUrl ? [imageUrl] : [],
    },
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = await params.then(({ slug }) => slug);
  const post = await getBlogPostBySlug(slug);

  if (!post.data) {
    return notFound();
  }

  // @ts-expect-error improper type
  const postImageUrl = post.data?.image?.asset?.url || null;

  return (
    <div className="min-h-screen">
      {/* Mobile: Regular banner image */}

      {/* Desktop: Spacer to push content down initially */}
      <div className="hidden md:block h-[calc(10vh-64px)]" />

      {/* Content */}
      <main className="relative z-10 bg-background container mx-auto max-w-4xl p-8 flex flex-col gap-4 min-h-screen rounded-none sm:rounded-lg shadow-sm border mb-10">
        <article className="prose flex flex-col gap-2">
          <Suspense fallback={<Skeleton className="w-14 h-5" />}>
            <h1 className="text-2xl font-bold mb-2">
              {post.data?.title || ""}
            </h1>
            <div className="flex flex-row text-xs mb-2">
              <Avatar className="mr-2 w-12 h-12">
                <AvatarImage
                  //@ts-expect-error - invalid type
                  src={post.data?.author_image.asset.url || "/logo.png"}
                  alt={post.data?.author}
                  className="object-cover"
                />
                <AvatarFallback>
                  {post.data?.author?.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col justify-center items-start">
                <p>{post.data.author}</p>
                <p className="text-muted-foreground">
                  {new Date(post?.data?.publishedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </Suspense>
          <Suspense fallback={<Skeleton className="w-full h-screen" />}>
            {Array.isArray(post?.data?.body) && (
              <PortableText
                value={post.data.body}
                components={{
                  block: {
                    h1: ({ children }) => (
                      <h1 className="text-3xl font-bold mb-4 mt-8">
                        {children}
                      </h1>
                    ),
                    h2: ({ children }) => (
                      <h2 className="text-2xl font-bold mb-3 mt-6">
                        {children}
                      </h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="text-xl font-bold mb-2 mt-4">
                        {children}
                      </h3>
                    ),
                    h4: ({ children }) => (
                      <h4 className="text-lg font-bold mb-2 mt-4">
                        {children}
                      </h4>
                    ),
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-4 text-sm border-border/10 pl-4 italic mb-4">
                        {children}
                      </blockquote>
                    ),
                    normal: ({ children }) => (
                      <p className="mb-4 leading-7 text-sm">{children}</p>
                    ),
                  },
                  marks: {
                    link: ({ value, children }) => (
                      <a
                        className="text-primary hover:underline"
                        href={value.href}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {children}
                      </a>
                    ),
                  },
                }}
              />
            )}
          </Suspense>
        </article>
      </main>

      {/* Newsletter signup card */}
      <div className="w-full flex justify-center mb-10">
        <div className="bg-background max-w-[400px] mx-auto p-6 rounded-lg flex flex-col gap-2 items-center shadow-sm border">
          <Avatar className="w-14 h-14 bg-muted-foreground">
            <AvatarImage
              src="/assets/icons/BEAVER-ST-CO_ICON-03.svg"
              alt="Avatar"
              className="p-3"
            />
            <AvatarFallback>OS</AvatarFallback>
          </Avatar>
          <h2 className="text-md text-left">Stay up to date on the latest:</h2>
          <p className="mb-4  text-xs text-muted-foreground">
            Join our newsletter and be the first to know when we launch our
            products, experiences, and services.
          </p>
          <AddToNewsletterForm />
        </div>
      </div>
    </div>
  );
}
