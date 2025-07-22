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
import { getAdditionalDetailsByHandle } from "@/server/sanity/actions";
import { AdditionalDetails } from "@/lib/types";

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

// Component for rendering additional details
function AdditionalDetailsSection({ details }: { details: AdditionalDetails }) {
  return (
    <div className="mx-auto max-w-screen-2xl px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Additional Images */}
        {details.additionalImages && details.additionalImages.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">More Views</h2>
            <div className="grid grid-cols-2 gap-4">
              {details.additionalImages.map((image, index) => (
                <div
                  key={index}
                  className="aspect-square overflow-hidden rounded-lg bg-gray-100"
                >
                  <img
                    src={image.url}
                    alt={`Additional view ${index + 1}`}
                    className="h-full w-full object-cover object-center hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Product Details Grid */}
        <div className="space-y-8">
          {/* Fabric Details */}
          {details.fabricDetails && details.fabricDetails.length > 0 && (
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
                Fabric & Materials
              </h3>
              <div className="space-y-3">
                {details.fabricDetails.map((item, index) => (
                  <div key={index} className="border-l-4 border-blue-600 pl-4">
                    <h4 className="font-medium text-gray-900">{item.title}</h4>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Features */}
          {details.features && details.features.length > 0 && (
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Key Features
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {details.features.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {feature.title}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Care Instructions */}
          {details.careInstructions && details.careInstructions.length > 0 && (
            <div className="bg-amber-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-amber-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
                Care Instructions
              </h3>
              <div className="space-y-3">
                {details.careInstructions.map((instruction, index) => (
                  <div key={index} className="border-l-4 border-amber-600 pl-4">
                    <h4 className="font-medium text-gray-900">
                      {instruction.title}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {instruction.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Additional Specifications */}
          {details.additionalSpecs && details.additionalSpecs.length > 0 && (
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                Specifications
              </h3>
              <dl className="grid grid-cols-1 gap-3">
                {details.additionalSpecs.map((spec, index) => (
                  <div
                    key={index}
                    className="flex justify-between py-2 border-b border-gray-200 last:border-b-0"
                  >
                    <dt className="font-medium text-gray-900">{spec.key}</dt>
                    <dd className="text-gray-600">{spec.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default async function Page(props: {
  params: Promise<{ handle: string }>;
}) {
  const params = await props.params;
  const product = await getProduct(params.handle);
  if (!product) return notFound();

  // Fetch additional details
  const additionalDetailsResult = await getAdditionalDetailsByHandle(
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
