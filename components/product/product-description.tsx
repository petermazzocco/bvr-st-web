import { VariantSelector } from "@/components/product/variant-selector";
import { Price } from "@/components/product/product-price";
import { Prose } from "@/components/product/prose";
import { Product } from "@/lib/shopify/types";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";

export function ProductDescription({ product }: { product: Product }) {
  return (
    <>
      <div className="mb-6 flex flex-col pb-6">
        <h1 className="mb-2 text-4xl font-medium">{product.title}</h1>
        <div className="flex flex-col items-center gap-2">
          <div className="mr-auto w-auto rounded-md p-2 text-lg font-semibold text-primary">
            <Price
              amount={product.priceRange.maxVariantPrice.amount}
              currencyCode={product.priceRange.maxVariantPrice.currencyCode}
            />
          </div>
        </div>
      </div>
      <VariantSelector options={product.options} variants={product.variants} />
      {product.descriptionHtml ? (
        <Prose
          className="mb-6 text-sm leading-tight dark:text-white/[60%]"
          html={product.descriptionHtml}
        />
      ) : null}
      <AddToCartButton product={product} />
    </>
  );
}
