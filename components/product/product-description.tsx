import { VariantSelector } from "@/components/product/variant-selector";
import { Price } from "@/components/product/product-price";
import { Product } from "@/lib/shopify/types";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { Separator } from "../ui/separator";

export function ProductDescription({ product }: { product: Product }) {
  return (
    <>
      <div className="mb-2 flex flex-row items-center justify-between">
        <h1 className=" text-sm font-semibold">{product.title}</h1>
        <div className="flex flex-col items-center gap-2">
          <div className="mr-auto w-auto p-2 text-sm font-semibold">
            <Price
              amount={product.priceRange.maxVariantPrice.amount}
              currencyCode={product.priceRange.maxVariantPrice.currencyCode}
            />
          </div>
        </div>
      </div>
      <VariantSelector options={product.options} variants={product.variants} />
      {/* {product.descriptionHtml ? (
        <Prose
          className="mb-6 text-sm leading-tight text-muted-foreground"
          html={product.descriptionHtml}
        />
      ) : null} */}

      <div className="mb-6 text-xs leading-tight text-muted-foreground flex flex-row items-center justify-between">
        <p>Model is 5&apos;10&quot; wearing a size Large</p>
        <p className="cursor-pointer underline">Size Chart</p>
      </div>
      <Separator className="my-4" />
      <AddToCartButton product={product} />
      <div className="mt-4 flex flex-col gap-1 bg-muted h-fit w-full rounded-md text-xs font-muted-foreground font-semibold p-2">
        <p>Earn {Number(product.priceRange.maxVariantPrice.amount)} points</p>
        <p>In Stock</p>
      </div>
    </>
  );
}
