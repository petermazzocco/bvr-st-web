import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductProvider } from "@/components/product/product-provider";
import { ProductImageHover } from "@/components/product/product-image-hover";
import { Suspense } from "react";
import Link from "next/link";
import { getPartnerStoreCollectionByHandle } from "@/server/vendor/actions";
import { generateCollectionMetadata } from "@/lib/metadata";
import { Price } from "@/components/product/product-price";

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
  const productCount = collection.products.edges.length;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://bvrstrco.com";

  return generateCollectionMetadata({
    title: `${collection.title} - ${params.name}`,
    description:
      collection.description ||
      `Shop the ${collection.title} collection from ${params.name}. Curated products from our partner store.`,
    image: collection.image
      ? {
          url: collection.image.url,
          alt: collection.image.altText || `${collection.title} Collection`,
        }
      : undefined,
    productCount,
    canonical: `${siteUrl}/stores/${params.name}/collections/${params.handle}`,
  });
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
      <div className="h-full w-full basis-full lg:basis-4/6 my-10">
        <Suspense
          fallback={
            <div className="relative aspect-square h-full max-h-[550px] w-full overflow-hidden" />
          }
        >
          <h1 className="text-md font-bold mb-2">{collection.title}</h1>
          <p className="text-sm text-foreground mb-4">
            {collection.description}
          </p>
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
                                product.featuredImage.altText || product.title,
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
                    <h3 className="text-xs font-medium text-foreground">
                      {product.title}
                    </h3>
                  </Link>

                  <Price
                    className="text-xs text-muted-foreground font-semibold"
                    amount={product.priceRange.minVariantPrice.amount}
                    currencyCode={
                      product.priceRange.minVariantPrice.currencyCode
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        </Suspense>
      </div>
    </>
  );
}
