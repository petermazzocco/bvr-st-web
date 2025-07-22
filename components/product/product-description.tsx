"use client";
import { VariantSelector } from "@/components/product/variant-selector";
import { Price } from "@/components/product/product-price";
import { Product } from "@/lib/shopify/types";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { Separator } from "../ui/separator";
import { useCart } from "@/components/cart/cart-context";
import Link from "next/link";
import { isAuctionProduct } from "@/lib/utils";
import { AuctionProductDescription } from "./auction-product-description";
import { useAuth } from "../auth/auth-context";

export function ProductDescription({ product }: { product: Product }) {
  // Call hooks at the top level, before any conditional logic
  const { isAuthenticated } = useAuth();

  // Check if this is an auction product
  if (isAuctionProduct(product)) {
    return <AuctionProductDescription product={product} />;
  }

  // Regular product flow (your existing code)

  const basePoints = Math.floor(
    Number(product.priceRange.maxVariantPrice.amount),
  );
  const membershipMultiplier = isAuthenticated ? 1.5 : 1;
  const earnedPoints = Math.floor(basePoints * membershipMultiplier);

  const totalStock = product.variants.reduce((total, variant) => {
    return total + (variant.availableForSale ? 1 : 0);
  }, 0);

  const stockStatus =
    totalStock === 0
      ? "Out of Stock"
      : totalStock === product.variants.length
        ? "In Stock"
        : `${totalStock}/${product.variants.length} variants available`;

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

      <div className="mb-6 text-xs leading-tight text-muted-foreground flex flex-row items-center justify-between">
        <p>Model is 5&apos;10&quot; wearing a size Large</p>
        <p className="cursor-pointer underline">Size Chart</p>
      </div>

      <Separator className="my-4" />

      <AddToCartButton product={product} />

      <div className="mt-4 flex uppercase flex-col gap-1 bg-muted h-fit w-full rounded-md text-xs font-muted-foreground font-semibold p-2">
        <p>
          {isAuthenticated ? (
            <>Earn {Math.round(earnedPoints)} points</>
          ) : (
            <>
              Earn {Math.round(earnedPoints)} points +
              <Link
                className="text-blue-600 cursor-pointer hover:underline ml-1"
                href="/signup"
              >
                100 free points for signing up.
              </Link>
            </>
          )}
        </p>
        <p
          className={`${totalStock === 0 ? "text-red-600" : totalStock === product.variants.length ? "text-green-600" : "text-yellow-600"}`}
        >
          {stockStatus}
        </p>
      </div>
      <div className="pt-2 flex flex-row items-center justify-between">
        <Link
          className="text-xs text-muted-foreground cursor-pointer underline   "
          href="/legal/return-policy"
        >
          Return Policy
        </Link>
        <Link
          className="text-xs text-muted-foreground cursor-pointer underline   "
          href="/contact"
        >
          Request Size
        </Link>
      </div>
    </>
  );
}
