import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { getAdditionalCollectionDetailsByHandle } from "@/server/sanity/actions";
import { ProductProvider } from "@/components/product/product-provider";
import { ProductImageHover } from "@/components/product/product-image-hover";
import { getCollection, getCollectionProducts } from "@/lib/shopify";
import { generateCollectionMetadata } from "@/lib/metadata";
import { Suspense } from "react";
import Link from "next/link";
import { Price } from "@/components/product/product-price";
import { Skeleton } from "@/components/ui/skeleton";

export async function generateMetadata(props: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const collection = await getCollection(params.handle);
  const products = await getCollectionProducts({ collection: params.handle });

  if (!collection) return notFound();

  const { url, width, height, altText: alt } = products[0]?.images[0] || {};
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://bvrstco.com";

  return generateCollectionMetadata({
    title: collection.seo.title || collection.title,
    description:
      collection.seo.description ||
      collection.description ||
      `BVR ST CO | ${collection.title}`,
    image: url
      ? {
          url,
          width,
          height,
          alt: alt || `${collection.title} Collection`,
        }
      : undefined,
    productCount: products.length,
    canonical: `${siteUrl}/collections/${params.handle}`,
  });
}

export default async function Page(props: {
  params: Promise<{ handle: string }>;
}) {
  const params = await props.params;
  const collection = await getCollection(params.handle);
  const products = await getCollectionProducts({ collection: params.handle });
  const details = await getAdditionalCollectionDetailsByHandle(params.handle);

  if (!collection) return notFound();

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Collection",
    name: collection.title,
    description: collection.description,
  };

  return (
    <>
      {details.data && (
        <Link
          href={`/collections/${params.handle}/lookbook`}
          className="relative w-full mb-20"
          id="collection-lookbook-link"
          data-umami-event="Collection lookbook viewed"
        >
          <AspectRatio ratio={3 / 1} className="w-full">
            <div
              className="relative h-full w-full overflow-hidden p-4 bg-cover bg-center"
              style={{
                backgroundImage: details?.data?.banner
                  ? `url(${details.data.banner.url})`
                  : "",
              }}
            ></div>
          </AspectRatio>
        </Link>
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productJsonLd),
        }}
      />
      <div className="mx-auto my-10 min-h-screen max-w-screen-2xl px-4">
        <div className="flex flex-col gap-24">
          <div className="flex max-w-3xl flex-col gap-4">
            <h1 className="text-md font-bold uppercase">{collection.title}</h1>
            <p className="text-xs">{collection.description}</p>
          </div>

          <div className="h-full w-full basis-full lg:basis-4/6">
            <Suspense
              fallback={
                <Skeleton className="relative aspect-square h-full max-h-[550px] w-full overflow-hidden" />
              }
            >
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-10 lg:grid-cols-3">
                {products.map((product) => (
                  <div key={product.id} className="group">
                    <div className="relative aspect-square overflow-hidden rounded-md">
                      {product.images[0] && (
                        <Link
                          href={`/products/${product.handle}`}
                          id="product-viewed-button"
                          data-umami-event="Product viewed button"
                        >
                          <ProductProvider>
                            <ProductImageHover images={product.images} />
                          </ProductProvider>
                        </Link>
                      )}
                    </div>
                    <div className="mt-3 space-y-1">
                      <div className="flex justify-between items-center">
                        <Link
                          href={`/products/${product.handle}`}
                          id="product-title-link"
                          data-umami-event="Product title clicked"
                        >
                          <h3 className="text-xs font-medium text-foreground">
                            {product.title}
                          </h3>
                        </Link>
                        <Price
                          className="text-xs text-foreground"
                          amount={product.priceRange.maxVariantPrice.amount}
                          currencyCode={
                            product.priceRange.maxVariantPrice.currencyCode
                          }
                        />
                      </div>

                      {product.variants?.[0]?.selectedOptions?.find(
                        (option) => option.name.toLowerCase() === "color",
                      ) && (
                        <p className="text-xs text-gray-500">
                          {
                            product.variants[0].selectedOptions.find(
                              (option) => option.name.toLowerCase() === "color",
                            )?.value
                          }
                        </p>
                      )}
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
