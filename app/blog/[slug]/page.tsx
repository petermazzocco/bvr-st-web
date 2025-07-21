import { PortableText } from "next-sanity";
import { getBlogPostBySlug } from "@/server/sanity/actions";
import { notFound } from "next/navigation";
import { urlFor } from "@/lib/sanity/image";
import Link from "next/link";
import Image from "next/image";

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

  const postImageUrl = post.data?.image
    ? urlFor(post.data.image)?.width(550).height(310).url()
    : null;

  return (
    <main className="container mx-auto min-h-screen max-w-3xl p-8 flex flex-col gap-4">
      <Link href="/blog" className="hover:underline">
        ← Back to announcements
      </Link>
      {postImageUrl && (
        <Image
          src={postImageUrl}
          alt={post.data?.title || ""}
          className="aspect-video rounded-xl"
          width={550}
          height={310}
        />
      )}
      <h1 className="text-4xl font-bold mb-8">{post.data?.title || ""}</h1>
      <div className="prose">
        <p className="text-muted-foreground">
          Published: {new Date(post?.data?.publishedAt).toLocaleDateString()}
        </p>
        {Array.isArray(post?.data?.body) && (
          <PortableText value={post.data.body} />
        )}
      </div>
    </main>
  );
}
