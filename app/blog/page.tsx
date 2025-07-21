import { getBlogPosts } from "@/server/sanity/actions";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function Page() {
  const posts = await getBlogPosts();

  if (!posts) {
    return notFound();
  }

  return (
    <main className="container mx-auto min-h-screen max-w-3xl p-8">
      <h1 className="text-4xl font-bold mb-8">Announcements</h1>
      <ul className="flex flex-col gap-y-4">
        {posts?.data?.map((post) => (
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
