import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HIDDEN_PRODUCT_TAG } from "@/lib/constants";
import { getProduct } from "@/lib/shopify";
import { generateProductMetadata } from "@/lib/metadata";
import { ProductProvider } from "@/components/product/product-provider";
import { ProductDescription } from "@/components/product/product-description";
import { Image } from "@/lib/shopify/types";
import { Suspense } from "react";
import { Gallery } from "@/components/product/product-gallery";
import { getAdditionalProductDetailsByHandle } from "@/server/sanity/actions";
import { AdditionalDetailsSection } from "@/components/product/additional-details";

export async function generateMetadata(props: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const product = await getProduct(params.handle);
  if (!product) return notFound();
  const { url, width, height, altText: alt } = product.featuredImage || {};
  const indexable = !product.tags.includes(HIDDEN_PRODUCT_TAG);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://bvrstrco.com";

  return generateProductMetadata({
    title: product.seo.title || product.title,
    description:
      product.seo.description ||
      product.description ||
      `Shop ${product.title} at BVR STR CO. Premium streetwear and fashion with fast shipping and quality guarantee.`,
    image: url
      ? {
          url,
          width,
          height,
          alt: alt || product.title,
        }
      : undefined,
    price: {
      amount: product.priceRange.minVariantPrice.amount,
      currency: product.priceRange.minVariantPrice.currencyCode,
    },
    availability: product.availableForSale,
    sku: product.id,
    canonical: `${siteUrl}/products/${params.handle}`,
    noIndex: !indexable,
  });
}

export default async function Page(props: {
  params: Promise<{ handle: string }>;
}) {
  const params = await props.params;
  const product = await getProduct(params.handle);
  if (!product) return notFound();

  // Fetch additional details
  const additionalDetailsResult = await getAdditionalProductDetailsByHandle(
    params.handle,
  );

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: product.featuredImage.url,
    offers: {
      "@type": "AggregateOffer",
      availability: product.availableForSale
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      priceCurrency: product.priceRange.minVariantPrice.currencyCode,
      highPrice: product.priceRange.maxVariantPrice.amount,
      lowPrice: product.priceRange.minVariantPrice.amount,
    },
  };

  return (
    <>
      <ProductProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(productJsonLd),
          }}
        />
        <div className="min-h-screen flex flex-col md:flex-row">
          <div className="w-full md:w-1/2 h-full">
            <Suspense
              fallback={<div className="w-full h-full overflow-hidden" />}
            >
              <Gallery
                images={product.images.slice(0, 5).map((image: Image) => ({
                  src: image.url,
                  altText: image.altText,
                }))}
              />
            </Suspense>
          </div>
          <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-4 md:p-8">
            <div className="w-full md:max-w-md lg:max-w-lg">
              <Suspense fallback={null}>
                <ProductDescription product={product} />
              </Suspense>
            </div>
          </div>
        </div>

        {/* Additional Details Section */}
        {additionalDetailsResult.success && additionalDetailsResult.data && (
          <AdditionalDetailsSection details={additionalDetailsResult.data} />
        )}

        {/* <div className="mx-auto max-w-screen-2xl px-4">
          <Suspense fallback={null}>
            <RelatedProducts id={product.id} />
          </Suspense>
        </div> */}
      </ProductProvider>
    </>
  );
}
