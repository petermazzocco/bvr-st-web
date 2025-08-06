import OpengraphImage from "@/components/utils/opengraph-image";
import { getProduct } from "@/lib/shopify";

export const runtime = "edge";

export default async function Image({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const handle = await params.then(({ handle }) => handle);
  const product = await getProduct(handle);
  
  if (!product) {
    return await OpengraphImage({});
  }

  return await OpengraphImage({
    title: product.title,
    imgSrc: product.featuredImage?.url,
  });
}