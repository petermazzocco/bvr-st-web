import { getProduct, getProductRecommendations } from "@/lib/shopify";
import Link from "next/link";

export async function RelatedProducts({ id }: { id: string }) {
  const relatedProducts = await getProductRecommendations(id);

  if (!relatedProducts.length) return null;

  return (
    <div className="py-8">
      <h2 className="mb-4 text-2xl font-bold">Related Products</h2>
      <ul className="scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-300 flex w-full gap-4 overflow-x-auto pt-1">
        {relatedProducts.slice(0, 4).map((product) => (
          <li
            key={product.handle}
            className="aspect-square w-full flex-none min-[475px]:w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5"
          >
            <Link
              className="relative h-full w-full"
              href={`/product/${product.handle}`}
              prefetch={true}
            ></Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
