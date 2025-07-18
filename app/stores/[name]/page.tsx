import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import {
  getPartneredStore,
  getPartnerStoreCollections,
} from "@/server/vendor/actions";

export async function generateMetadata(props: {
  params: Promise<{ name: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const store = await getPartneredStore(params.name);

  if (!store.success || !store.data) return notFound();

  return {
    title: store.data?.name,
    description: store.data?.description,
  };
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
      <div className="mx-auto my-10 min-h-screen max-w-screen-2xl px-4">
        <div className="flex flex-col gap-24">
          <div className="flex max-w-3xl flex-col gap-4">
            <h1 className="text-4xl font-bold uppercase">{store.data?.name}</h1>
            <p className="text-base">{store.data?.description}</p>
          </div>

          <div className="h-full w-full basis-full lg:basis-4/6">
            <Suspense
              fallback={
                <div className="relative aspect-square h-full max-h-[550px] w-full overflow-hidden" />
              }
            >
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-10 lg:grid-cols-3">
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
                              className="h-full w-full object-cover object-center group-hover:opacity-75"
                            />
                          </Link>
                        )}
                      </div>
                      <div className="mt-3 space-y-1">
                        <Link
                          href={`/stores/${params.name}/collections/${collection.handle}`}
                        >
                          <h3 className="text-sm font-medium text-gray-900 hover:text-gray-700">
                            {collection.title}
                          </h3>
                        </Link>
                        {collection.description && (
                          <p className="text-xs text-gray-500">
                            {collection.description}
                          </p>
                        )}
                        <p className="text-sm font-semibold text-gray-900">
                          {collection.productCount} products
                        </p>
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
