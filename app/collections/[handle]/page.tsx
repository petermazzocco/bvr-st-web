import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Gallery } from "@/components/product/product-gallery";
import { ProductProvider } from "@/components/product/product-provider";
import { getCollection, getCollectionProducts } from "@/lib/shopify";
import { Suspense } from "react";
import Link from "next/link";

export async function generateMetadata(props: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const collection = await getCollection(params.handle);
  const products = await getCollectionProducts({ collection: params.handle });

  if (!collection) return notFound();

  const { url, width, height, altText: alt } = products[0]?.images[0] || {};

  return {
    title: collection.seo.title,
    description: collection.seo.description || collection.description,
    openGraph: url
      ? {
          images: [
            {
              url,
              width,
              height,
              alt,
            },
          ],
        }
      : null,
  };
}

export default async function Page(props: {
  params: Promise<{ handle: string }>;
}) {
  const params = await props.params;
  const collection = await getCollection(params.handle);
  const products = await getCollectionProducts({ collection: params.handle });

  if (!collection) return notFound();

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Collection",
    name: collection.title,
    description: collection.description,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productJsonLd),
        }}
      />
      <div className="mx-auto my-10 min-h-screen max-w-screen-2xl px-4">
        <div className="flex flex-col gap-24">
          <div className="flex max-w-3xl flex-col gap-4">
            <h1 className="text-4xl font-bold uppercase">{collection.title}</h1>
            <p className="text-base">{collection.description}</p>
          </div>

          <div className="h-full w-full basis-full lg:basis-4/6">
            <Suspense
              fallback={
                <div className="relative aspect-square h-full max-h-[550px] w-full overflow-hidden" />
              }
            >
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-10 lg:grid-cols-4">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="relative aspect-square overflow-hidden rounded-md"
                  >
                    {product.images[0] && (
                      <Link href={`/products/${product.handle}`}>
                        <ProductProvider>
                          <Gallery
                            images={[
                              {
                                src: product.images[0].url,
                                altText: product.images[0].altText,
                              },
                            ]}
                          />
                        </ProductProvider>
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </Suspense>
          </div>
        </div>
      </div>
    </>
  );
}
