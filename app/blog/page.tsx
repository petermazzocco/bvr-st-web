import { client } from "@/lib/sanity/client";
import Link from "next/link";
import { SanityDocument } from "next-sanity";

const POSTS_QUERY = `*[
  _type == "post"
  && defined(slug.current)
]|order(publishedAt desc)[0...12]{_id, title, slug, publishedAt}`;

const options = { next: { revalidate: 30 } };

export default async function Page() {
  const posts = await client.fetch<SanityDocument[]>(POSTS_QUERY, {}, options);

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
                {new Date(post.publishedAt).toLocaleDateString()} {post.Author}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
