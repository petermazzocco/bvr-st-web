import { PortableText } from "next-sanity";
import { notFound } from "next/navigation";
import { getLegalDocBySlug } from "@/server/sanity/actions";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const doc = await getLegalDocBySlug(resolvedParams.slug);

  if (!doc.data) {
    notFound();
  }

  return (
    <main className="relative z-10 bg-background container mx-auto max-w-4xl p-8 flex flex-col gap-4 min-h-screen rounded-none sm:rounded-lg shadow-sm border mb-10">
      <div className="prose max-w-none">
        <Suspense fallback={<Skeleton className="h-8 w-12" />}>
          {doc.data.updatedAt && (
            <p className="text-muted-foreground text-sm mb-6">
              Updated: {new Date(doc.data.updatedAt).toLocaleDateString()}
            </p>
          )}
        </Suspense>
        <Suspense fallback={<Skeleton className="h-screen w-full" />}>
          {doc.data.body && Array.isArray(doc.data.body) && (
            <PortableText
              value={doc.data.body}
              components={{
                block: {
                  h1: ({ children }) => (
                    <h1 className="text-2xl font-bold mt-8 mb-4">{children}</h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-xl font-semibold mt-6 mb-3">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-lg font-medium mt-4 mb-2">
                      {children}
                    </h3>
                  ),
                  normal: ({ children }) => (
                    <p className="mb-4 text-xs leading-relaxed">{children}</p>
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
                    <ul className="list-disc ml-6 mb-4 space-y-1">
                      {children}
                    </ul>
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
        </Suspense>
        {!doc.data.body && (
          <p className="text-muted-foreground">No content available.</p>
        )}
      </div>
    </main>
  );
}
