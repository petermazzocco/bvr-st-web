import type { Metadata } from "next";
import { PortableText } from "@portabletext/react";
import { getBlogPostBySlug } from "@/server/sanity/actions";
import { notFound } from "next/navigation";
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
      title: "Post Not Found | BVR ST STUDIO",
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://bvrst.studio";
  // @ts-expect-error improper typing
  const imageUrl = post.data?.image?.asset?.url;

  return {
    title: `${post.data.title} | BVR ST STUDIO`,
    description: `Read ${post.data.title} on BVR ST STUDIO blog`,
    openGraph: {
      title: `${post.data.title} | BVR ST STUDIO`,
      description: `Read ${post.data.title} on BVR ST STUDIO blog`,
      url: `${siteUrl}/blog/${params.slug}`,
      siteName: "BVR ST STUDIO",
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
      title: `${post.data.title} | BVR ST STUDIO`,
      description: `Read ${post.data.title} on BVR ST STUDIO blog`,
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
    <div className="bg-background text-foreground min-h-screen">
      <div className="mx-auto w-full max-w-6xl border-x border-border">
        {/* Desktop spacer */}
        <div className="hidden md:block h-[calc(10vh-64px)]" />

        {/* Article content */}
        <main className="relative z-10 container mx-auto max-w-4xl px-6 py-12 md:px-12 flex flex-col gap-4 mb-10">
          <article className="flex flex-col gap-2">
            <Suspense fallback={<Skeleton className="w-14 h-5" />}>
              <p className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-primary mb-2">
                BVR ST STUDIO — Blog
              </p>
              <h1 className="text-3xl font-thin tracking-[-0.02em] text-foreground md:text-5xl mb-4">
                {post.data?.title || ""}
              </h1>
              <div className="flex flex-row items-center text-xs mb-6 pb-6 border-b border-border">
                <Avatar className="mr-3 w-10 h-10">
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
                <div className="flex flex-col justify-center items-start gap-0.5">
                  <p className="text-foreground font-medium">{post.data.author}</p>
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
                        <h1 className="text-3xl font-thin tracking-[-0.02em] text-foreground mb-4 mt-8">
                          {children}
                        </h1>
                      ),
                      h2: ({ children }) => (
                        <h2 className="text-2xl font-thin tracking-[-0.02em] text-foreground mb-3 mt-6">
                          {children}
                        </h2>
                      ),
                      h3: ({ children }) => (
                        <h3 className="text-xl font-medium text-foreground mb-2 mt-4">
                          {children}
                        </h3>
                      ),
                      h4: ({ children }) => (
                        <h4 className="text-lg font-medium text-foreground mb-2 mt-4">
                          {children}
                        </h4>
                      ),
                      blockquote: ({ children }) => (
                        <blockquote className="border-l-4 border-primary pl-4 italic mb-4 text-muted-foreground text-sm">
                          {children}
                        </blockquote>
                      ),
                      normal: ({ children }) => (
                        <p className="mb-4 leading-7 text-sm font-light text-muted-foreground">
                          {children}
                        </p>
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

        {/* Newsletter signup */}
        <div className="w-full border-t border-border px-6 py-16 md:px-12 flex justify-center mb-10">
          <div className="bg-card border border-border max-w-[400px] w-full mx-auto p-8 rounded-lg flex flex-col gap-2 items-center">
            <Avatar className="w-14 h-14 bg-secondary">
              <AvatarImage
                src="/assets/icons/BEAVER-ST-CO_ICON-03.svg"
                alt="Avatar"
                className="p-3"
              />
              <AvatarFallback>OS</AvatarFallback>
            </Avatar>
            <h2 className="text-sm font-medium text-foreground text-center mt-2">
              Stay up to date on the latest
            </h2>
            <p className="mb-4 text-xs font-light leading-relaxed text-muted-foreground text-center">
              Join our newsletter and be the first to know when we launch our
              products, experiences, and services.
            </p>
            <AddToNewsletterForm />
          </div>
        </div>
      </div>
    </div>
  );
}
