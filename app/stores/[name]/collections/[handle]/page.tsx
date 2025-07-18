import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductProvider } from "@/components/product/product-provider";
import { ProductImageHover } from "@/components/product/product-image-hover";
import { Suspense } from "react";
import Link from "next/link";
import { getPartnerStoreCollectionByHandle } from "@/server/vendor/actions";

export async function generateMetadata(props: {
  params: Promise<{ name: string; handle: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const collectionResponse = await getPartnerStoreCollectionByHandle(
    params.name,
    params.handle,
  );

  if (!collectionResponse.success || !collectionResponse.data)
    return notFound();

  const collection = collectionResponse.data.collectionByHandle;

  return {
    title: collection.title,
    description: collection.description,
  };
}

export default async function Page(props: {
  params: Promise<{ name: string; handle: string }>;
}) {
  const params = await props.params;
  const collectionResponse = await getPartnerStoreCollectionByHandle(
    params.name,
    params.handle,
  );

  if (!collectionResponse.success || !collectionResponse.data)
    return notFound();

  const collection = collectionResponse.data.collectionByHandle;
  const products = collection.products.edges.map((edge) => edge.node);

  console.log(params.name);
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
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-10 lg:grid-cols-3">
                {products.map((product) => (
                  <div key={product.id} className="group">
                    <div className="relative aspect-square overflow-hidden rounded-md">
                      {product.featuredImage && (
                        <Link
                          href={`/stores/${params.name}/collections/${params.handle}/products/${product.handle}`}
                          id="product-viewed-button"
                          data-umami-event="Product viewed button"
                        >
                          <ProductProvider>
                            <ProductImageHover
                              images={[
                                {
                                  url: product.featuredImage.url,
                                  altText:
                                    product.featuredImage.altText ||
                                    product.title,
                                },
                              ]}
                            />
                          </ProductProvider>
                        </Link>
                      )}
                    </div>
                    <div className="mt-3 space-y-1">
                      <Link
                        href={`/stores/${params.name}/collections/${params.handle}/products/${product.handle}`}
                      >
                        <h3 className="text-sm font-medium text-gray-900 hover:text-gray-700">
                          {product.title}
                        </h3>
                      </Link>
                      <p className="text-sm font-semibold text-gray-900">
                        ${product.priceRange.minVariantPrice.amount}
                      </p>
                    </div>
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
