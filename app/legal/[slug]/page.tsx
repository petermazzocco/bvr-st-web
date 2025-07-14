import { PortableText, type SanityDocument } from "next-sanity";
import { client } from "@/lib/sanity/client";
import { notFound } from "next/navigation";

const DOC_QUERY = `*[_type == "legal" && slug.current == $slug][0]`;
const options = { next: { revalidate: 30 } };

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const doc = await client.fetch<SanityDocument>(
    DOC_QUERY,
    resolvedParams,
    options,
  );

  // Handle case where document is not found
  if (!doc) {
    notFound();
  }

  return (
    <main className="container mx-auto min-h-screen max-w-3xl p-8 flex flex-col gap-4">
      <h1 className="text-4xl font-bold mb-8">{doc.title}</h1>
      <div className="prose max-w-none">
        {doc.updatedAt && (
          <p className="text-muted-foreground text-sm mb-6">
            Updated: {new Date(doc.updatedAt).toLocaleDateString()}
          </p>
        )}
        {doc.body && Array.isArray(doc.body) && (
          <PortableText
            value={doc.body}
            components={{
              block: {
                h1: ({ children }) => (
                  <h1 className="text-3xl font-bold mt-8 mb-4">{children}</h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-2xl font-semibold mt-6 mb-3">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-xl font-medium mt-4 mb-2">{children}</h3>
                ),
                normal: ({ children }) => (
                  <p className="mb-4 leading-relaxed">{children}</p>
                ),
              },
              marks: {
                strong: ({ children }) => (
                  <strong className="font-semibold">{children}</strong>
                ),
                em: ({ children }) => <em className="italic">{children}</em>,
                code: ({ children }) => (
                  <code className="bg-gray-100 px-1 py-0.5 rounded text-sm">
                    {children}
                  </code>
                ),
              },
              list: {
                bullet: ({ children }) => (
                  <ul className="list-disc ml-6 mb-4 space-y-1">{children}</ul>
                ),
                number: ({ children }) => (
                  <ol className="list-decimal ml-6 mb-4 space-y-1">
                    {children}
                  </ol>
                ),
              },
              listItem: {
                bullet: ({ children }) => (
                  <li className="leading-relaxed">{children}</li>
                ),
                number: ({ children }) => (
                  <li className="leading-relaxed">{children}</li>
                ),
              },
            }}
          />
        )}
        {!doc.body && (
          <p className="text-muted-foreground">No content available.</p>
        )}
      </div>
    </main>
  );
}
