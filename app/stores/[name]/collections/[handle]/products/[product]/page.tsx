import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ProductProvider } from "@/components/product/product-provider";
import { PartnerProductDescription } from "@/components/product/partner-product-description";
import { Gallery } from "@/components/product/product-gallery";
import { getPartnerStoreProductByHandle } from "@/server/vendor/actions";
import { generateProductMetadata } from "@/lib/metadata";

export async function generateMetadata(props: {
  params: Promise<{ name: string; handle: string; product: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const productResult = await getPartnerStoreProductByHandle(
    params.name,
    params.product,
  );

  if (!productResult.success || !productResult.data) return notFound();

  const product = productResult.data.productByHandle;
  const featuredImage = product.featuredImage;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://bvrstco.com";

  return generateProductMetadata({
    title: `${product.title} - ${params.name}`,
    description:
      product.description ||
      `BVR ST CO | ${product.title} from ${params.name}.`,
    image: featuredImage
      ? {
          url: featuredImage.url,
          alt: featuredImage.altText || product.title,
        }
      : undefined,
    price: {
      amount: product.priceRange.minVariantPrice.amount,
      currency: product.priceRange.minVariantPrice.currencyCode,
    },
    availability: product.variants.edges.some(
      (edge) => edge.node.availableForSale,
    ),
    sku: product.id,
    canonical: `${siteUrl}/stores/${params.name}/collections/${params.handle}/products/${params.product}`,
  });
}

export default async function Page(props: {
  params: Promise<{ name: string; handle: string; product: string }>;
}) {
  const params = await props.params;
  const productResult = await getPartnerStoreProductByHandle(
    params.name,
    params.product,
  );

  if (!productResult.success || !productResult.data) return notFound();

  const product = productResult.data.productByHandle;

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: product.featuredImage.url,
    offers: {
      "@type": "AggregateOffer",
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
                images={product.images.edges.slice(0, 5).map((edge) => ({
                  src: edge.node.url,
                  altText: edge.node.altText || "",
                }))}
              />
            </Suspense>
          </div>
          <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-4 md:p-8">
            <div className="w-full md:max-w-md lg:max-w-lg">
              <Suspense fallback={null}>
                <PartnerProductDescription
                  product={product}
                  storeName={params.name}
                />
              </Suspense>
            </div>
          </div>
        </div>
        {/* Related products section can be added later */}
      </ProductProvider>
    </>
  );
}
