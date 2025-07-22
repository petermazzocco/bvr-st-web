import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import {
  getPartneredStore,
  getPartnerStoreCollections,
} from "@/server/vendor/actions";
import { generateStoreMetadata } from "@/lib/metadata";

export async function generateMetadata(props: {
  params: Promise<{ name: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const store = await getPartneredStore(params.name);

  if (!store.success || !store.data) return notFound();

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://bvrstrco.com";

  return generateStoreMetadata({
    storeName: store.data.name,
    description:
      store.data.description ||
      `Discover unique products from ${store.data.name}`,
    image:
      store.data.logo || store.data.banner
        ? {
            url: store.data.logo || store.data.banner,
            alt: `${store.data.name} - Partner Store Logo`,
          }
        : undefined,
    canonical: `${siteUrl}/stores/${params.name}`,
  });
}

export default async function Page(props: {
  params: Promise<{ name: string }>;
}) {
  const params = await props.params;
  const store = await getPartneredStore(params.name);
  const collections = await getPartnerStoreCollections(params.name);

  // Safely extract the collections data
  const collectionsData =
    collections.success && collections.data?.edges
      ? collections.data?.edges?.map((edge) => ({
          id: edge.node.id,
          title: edge.node.title,
          handle: edge.node.handle,
          description: edge.node.description,
          image: edge.node.image
            ? {
                url: edge.node.image.url,
                altText: edge.node.image.altText,
              }
            : null,
          productCount: edge.node.products?.edges?.length || 0,
        }))
      : [];

  if (!store.success || !store.data) return notFound();

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Collection",
    name: store.data?.name,
    description: store.data?.description,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productJsonLd),
        }}
      />
      <div className="mx-auto my-10 ">
        <div className="flex flex-col gap-24">
          <div className="h-full w-full basis-full lg:basis-4/6">
            <Suspense
              fallback={
                <div className="relative aspect-square h-full max-h-[550px] w-full overflow-hidden" />
              }
            >
              {" "}
              <h1 className="text-xl font-bold mb-4">Available Collections</h1>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-10 lg:grid-cols-4">
                {collectionsData.length > 0 ? (
                  collectionsData.map((collection) => (
                    <div key={collection.id} className="group">
                      <div className="relative aspect-square overflow-hidden rounded-md">
                        {collection.image?.url && (
                          <Link
                            href={`/stores/${params.name}/collections/${collection.handle}`}
                            id="collection-viewed-button"
                            data-umami-event="Collection viewed button"
                          >
                            <img
                              src={collection.image.url}
                              alt={collection.image.altText || collection.title}
                              className="h-full w-full object-contain p-4 object-center  bg-muted "
                            />
                          </Link>
                        )}
                      </div>
                      <div className="mt-3 space-y-1">
                        <Link
                          href={`/stores/${params.name}/collections/${collection.handle}`}
                        >
                          <h3 className="text-sm font-medium text-foreground">
                            {collection.title}
                          </h3>
                        </Link>
                        {collection.description && (
                          <p className="text-xs text-muted-foreground">
                            {collection.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div>No collections found or error loading collections</div>
                )}
              </div>
            </Suspense>
          </div>
        </div>
      </div>
    </>
  );
}
