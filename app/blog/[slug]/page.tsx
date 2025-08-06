import { PortableText } from "next-sanity";
import { getBlogPostBySlug } from "@/server/sanity/actions";
import { notFound } from "next/navigation";
import { PostImage } from "@/components/blog/post-image";

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
      {/* Full-width banner image */}
      {postImageUrl && (
        <div className="w-full">
          <PostImage post={post} />
        </div>
      )}

      {/* Main content with container */}
      <main className="container mx-auto max-w-4xl p-8 flex flex-col gap-4">
        <h1 className="text-2xl font-bold mb-8">{post.data?.title || ""}</h1>
        <div className="prose flex flex-col gap-4">
          <p className="text-muted-foreground text-xs">
            {post.data.author} |{" "}
            {new Date(post?.data?.publishedAt).toLocaleDateString()}
          </p>
          {Array.isArray(post?.data?.body) && (
            <PortableText
              value={post.data.body}
              components={{
                block: {
                  h1: ({ children }) => (
                    <h1 className="text-3xl font-bold mb-4 mt-8">{children}</h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-2xl font-bold mb-3 mt-6">{children}</h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-xl font-bold mb-2 mt-4">{children}</h3>
                  ),
                  h4: ({ children }) => (
                    <h4 className="text-lg font-bold mb-2 mt-4">{children}</h4>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-border/10 pl-4 italic mb-4">
                      {children}
                    </blockquote>
                  ),
                  normal: ({ children }) => (
                    <p className="mb-4 leading-7">{children}</p>
                  ),
                },
                marks: {
                  link: ({ value, children }) => (
                    <a
                      className="text-blue-500 hover:underline"
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
        </div>
      </main>
    </div>
  );
}
