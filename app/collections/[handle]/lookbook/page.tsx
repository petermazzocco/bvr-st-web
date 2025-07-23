import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCollection, getCollectionProducts } from "@/lib/shopify";
import { generateCollectionMetadata } from "@/lib/metadata";
import { getCollectionLookbookByHandle } from "@/server/sanity/actions";
import { PortableText } from "@portabletext/react";
import { Separator } from "@/components/ui/separator";

export async function generateMetadata(props: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const collection = await getCollection(params.handle);
  const products = await getCollectionProducts({ collection: params.handle });

  if (!collection) return notFound();

  const { url, width, height, altText: alt } = products[0]?.images[0] || {};
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://bvrstrco.com";

  return generateCollectionMetadata({
    title: collection.seo.title || collection.title,
    description:
      collection.seo.description ||
      collection.description ||
      `The ${collection.title} Lookbook`,
    image: url
      ? {
          url,
          width,
          height,
          alt: alt || `${collection.title} Collection`,
        }
      : undefined,
    productCount: products.length,
    canonical: `${siteUrl}/collections/${params.handle}/lookbook`,
  });
}

export default async function Page(props: {
  params: Promise<{ handle: string }>;
}) {
  const params = await props.params;
  const collection = await getCollection(params.handle);
  const lookbook = await getCollectionLookbookByHandle(params.handle);

  if (!collection || !lookbook) return notFound();

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-[1fr_1px_1fr] lg:gap-12 lg:items-start">
          {/* Left Column - Text Content */}
          <div className="space-y-6">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">
              {lookbook.data?.collectionTitle}
            </h1>
            <Separator />
            {Array.isArray(lookbook.data?.body) && (
              <div className="prose prose-lg max-w-none">
                <PortableText
                  value={lookbook.data?.body}
                  components={{
                    types: {
                      block: ({ value }) => {
                        const style = value.style || "normal";

                        if (style === "h1") {
                          return (
                            <h1 className="text-3xl font-bold text-gray-900 mb-4">
                              {value.children
                                ?.map((child: any) => child.text)
                                .join("")}
                            </h1>
                          );
                        }
                        if (style === "h2") {
                          return (
                            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                              {value.children
                                ?.map((child: any) => child.text)
                                .join("")}
                            </h2>
                          );
                        }
                        if (style === "h3") {
                          return (
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                              {value.children
                                ?.map((child: any) => child.text)
                                .join("")}
                            </h3>
                          );
                        }
                        if (style === "h4") {
                          return (
                            <h4 className="text-lg font-medium text-gray-900 mb-2">
                              {value.children
                                ?.map((child: any) => child.text)
                                .join("")}
                            </h4>
                          );
                        }
                        if (style === "blockquote") {
                          return (
                            <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-700 my-4">
                              {value.children
                                ?.map((child: any) => child.text)
                                .join("")}
                            </blockquote>
                          );
                        }

                        return (
                          <p className="text-gray-700 leading-relaxed mb-4">
                            {value.children
                              ?.map((child: any) => child.text)
                              .join("")}
                          </p>
                        );
                      },
                    },
                  }}
                />
              </div>
            )}

            {/* Credits Section */}
            {lookbook.data?.credits && lookbook.data.credits.length > 0 && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Credits
                </h3>
                <dl className="space-y-2">
                  {lookbook.data.credits.map((credit, index) => (
                    <div key={index} className="flex">
                      <dt className="font-medium text-gray-900 mr-2">
                        {credit.key}:
                      </dt>
                      <dd className="text-gray-700">{credit.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </div>

          {/* Vertical Separator */}
          <div className="hidden lg:block border-l border-border self-stretch"></div>

          {/* Right Column - Scrollable Images */}
          {lookbook.data?.images && lookbook.data.images.length > 0 && (
            <div className="mt-8 lg:mt-0 lg:sticky lg:top-8">
              <div className="lg:h-screen lg:overflow-y-auto lg:pr-4">
                <div className=" lg:pb-8">
                  {lookbook.data.images.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image.url}
                        alt={`Lookbook image ${index + 1}`}
                        className="w-full h-auto  object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
