import OpengraphImage from "@/components/utils/opengraph-image";
import { getCollection, getCollectionProducts } from "@/lib/shopify";

export const runtime = "edge";

export default async function Image({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const handle = await params.then(({ handle }) => handle);
  const collection = await getCollection(handle);
  const products = await getCollectionProducts({ collection: handle });
  
  if (!collection) {
    return await OpengraphImage({});
  }

  // Use the first product's image if available
  const firstProductImage = products[0]?.images[0]?.url;

  return await OpengraphImage({
    title: collection.title,
    imgSrc: firstProductImage,
  });
}