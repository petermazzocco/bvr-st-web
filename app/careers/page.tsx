import type { Metadata } from "next";
import { getCareers } from "@/server/sanity/actions";
import { notFound } from "next/navigation";
import { generateMetadata as createMetadata } from "@/lib/metadata";
import { PortableText } from "next-sanity";

export const metadata: Metadata = createMetadata({
  title: "Careers",
  description:
    "Join the BVR STR CO team. Explore exciting career opportunities in streetwear, fashion, and e-commerce. Help us build the future of independent fashion retail.",
  canonical: "https://bvrstrco.com/careers",
});

export default async function Page() {
  const careers = await getCareers();

  if (!careers.success || !careers.data) {
    return notFound();
  }

  if (careers.data.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold mb-8">Careers</h1>
        <p className="text-lg text-muted-foreground text-center max-w-md">
          No open positions at the moment. Check back soon for new
          opportunities!
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-center">Careers</h1>
      <div className="max-w-4xl mx-auto space-y-6">
        {careers.data.map((career, index) => (
          <div
            key={`career-${career._id || index}`}
            className="p-6 border border-input rounded-lg shadow-sm"
          >
            <h2 className="text-2xl font-bold mb-2">{career.title}</h2>
            {career.pay && (
              <p className="text-lg font-semibold text-primary mb-4">
                {career.pay}
              </p>
            )}
            <div className="text-muted-foreground prose prose-sm max-w-none">
              {Array.isArray(career.description) && (
                <PortableText value={career.description} />
              )}
            </div>
            <div className="mt-4 text-sm text-muted-foreground">
              Posted: {new Date(career.createdAt).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
