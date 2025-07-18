"use client";
import { Price } from "@/components/product/product-price";
import { ProductByHandle } from "@/lib/types";
import { Separator } from "../ui/separator";
import { ExternalLink, AlertTriangle } from "lucide-react";
import { useState } from "react";

interface PartnerProductDescriptionProps {
  product: ProductByHandle;
  storeName: string;
}

export function PartnerProductDescription({
  product,
  storeName,
}: PartnerProductDescriptionProps) {
  const [selectedVariant, setSelectedVariant] = useState(
    product.variants.edges[0]?.node,
  );

  const handleVariantChange = (variantId: string) => {
    const variant = product.variants.edges.find(
      (edge) => edge.node.id === variantId,
    )?.node;
    if (variant) {
      setSelectedVariant(variant);
    }
  };

  const handlePurchase = () => {
    // This would redirect to the partner store's checkout
    window.open(
      `https://partner-store.com/products/${product.handle}`,
      "_blank",
    );
  };

  return (
    <>
      <div className="mb-2 flex flex-row items-center justify-between">
        <h1 className="text-sm font-semibold">{product.title}</h1>
        <div className="flex flex-col items-center gap-2">
          <div className="mr-auto w-auto p-2 text-sm font-semibold">
            <Price
              amount={
                selectedVariant?.price.amount ||
                product.priceRange.maxVariantPrice.amount
              }
              currencyCode={
                selectedVariant?.price.currencyCode ||
                product.priceRange.maxVariantPrice.currencyCode
              }
            />
          </div>
        </div>
      </div>

      {/* Size/Variant Selector */}
      {product.options.map((option) => (
        <div key={option.name} className="mb-4">
          <h3 className="text-sm font-medium mb-2">{option.name}</h3>
          <div className="flex flex-wrap gap-2">
            {option.values.map((value) => {
              const variant = product.variants.edges.find((edge) =>
                edge.node.selectedOptions.some(
                  (opt) => opt.name === option.name && opt.value === value,
                ),
              )?.node;

              return (
                <button
                  key={value}
                  onClick={() => variant && handleVariantChange(variant.id)}
                  disabled={!variant?.availableForSale}
                  className={`px-3 py-1 text-xs border rounded-md transition-colors ${
                    selectedVariant?.selectedOptions.some(
                      (opt) => opt.value === value,
                    )
                      ? "bg-black text-white border-black"
                      : variant?.availableForSale
                        ? "bg-white text-black border-gray-300 hover:border-black"
                        : "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                  }`}
                >
                  {value}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      <Separator className="my-4" />

      {/* Partner Store Purchase Button */}
      <button
        onClick={handlePurchase}
        disabled={!selectedVariant?.availableForSale}
        className={`w-full py-3 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
          selectedVariant?.availableForSale
            ? "bg-black text-white hover:bg-gray-800"
            : "bg-gray-100 text-gray-400 cursor-not-allowed"
        }`}
      >
        <span>Purchase from {storeName}</span>
        <ExternalLink size={16} />
      </button>

      {/* Partner Merchandise Disclaimer */}
      <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-md">
        <div className="flex items-start gap-2">
          <AlertTriangle
            size={16}
            className="text-amber-600 mt-0.5 flex-shrink-0"
          />
          <div className="text-xs text-amber-800">
            <p className="font-semibold mb-1">Partner Merchandise Notice</p>
            <p className="leading-relaxed">
              This product is sold by our partner store{" "}
              <strong>{storeName}</strong>. We are not responsible for product
              quality, shipping, returns, or customer service issues. All
              purchases are handled directly by the partner store. Please
              contact them directly for any concerns.
            </p>
          </div>
        </div>
      </div>

      {/* Product Info */}
      <div className="mt-4 flex flex-col gap-1 bg-muted h-fit w-full rounded-md text-xs font-muted-foreground font-semibold p-2">
        <p className="text-gray-600">
          Stock: {selectedVariant?.quantityAvailable || 0} available
        </p>
        <p
          className={`${
            selectedVariant?.availableForSale
              ? "text-green-600"
              : "text-red-600"
          }`}
        >
          {selectedVariant?.availableForSale ? "In Stock" : "Out of Stock"}
        </p>
      </div>

      {/* Product Description */}
      {product.description && (
        <div className="mt-4">
          <h3 className="text-sm font-medium mb-2">Description</h3>
          <div className="text-xs text-muted-foreground leading-relaxed">
            {product.description}
          </div>
        </div>
      )}
    </>
  );
}
