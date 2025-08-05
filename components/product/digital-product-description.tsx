import { VariantSelector } from "@/components/product/variant-selector";
import { MemberPrice } from "@/components/product/member-price";
import { Product } from "@/lib/shopify/types";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { Separator } from "../ui/separator";
import Link from "next/link";
import { AdditionalDetails, Affiliate } from "@/lib/types";
import { AffiliateSelection } from "../utils/affiliate-selection";
import { cookies } from "next/headers";

export async function DigitalProductDescription({
  product,
  isMember,
  details,
  affiliates,
}: {
  product: Product;
  isMember?: boolean;
  details?: AdditionalDetails;
  affiliates?: Affiliate[] | undefined;
}) {
  const cookieStore = await cookies();
  const authTokenCookie = cookieStore.get("bvrstco_auth");
  const authToken = authTokenCookie?.value || null;

  const basePoints = Math.floor(
    Number(product.priceRange.minVariantPrice.amount),
  );
  const earnedPoints = Math.floor(basePoints);

  return (
    <>
      <div className="mb-2 flex flex-row items-center justify-between">
        <h1 className=" text-sm font-semibold">{product.title}</h1>
        <div className="flex flex-col items-center gap-2">
          <div className="mr-auto w-auto p-2 text-sm font-semibold">
            <MemberPrice
              amount={product.priceRange.maxVariantPrice.amount}
              currencyCode={product.priceRange.maxVariantPrice.currencyCode}
              isMember={isMember}
            />
          </div>
        </div>
      </div>
      <div>
        <p className="text-xs font-muted-foreground">{product.description}</p>
      </div>
      <VariantSelector options={product.options} variants={product.variants} />
      <div className="mb-6 text-xs leading-tight text-muted-foreground flex flex-row items-center justify-between">
        {details?.additionalSpecs?.map((spec, index) => (
          <div key={index} className="flex flex-row items-center">
            <span>{spec.value}</span>
          </div>
        ))}
      </div>
      <Separator className="my-4" />
      <div className="flex flex-col gap-4">
        {affiliates && (
          <div className="flex flex-col gap-2">
            <AffiliateSelection affiliates={affiliates} />

            <Link
              href="/about#pricing"
              className="text-xs underline text-muted-foreground"
            >
              Learn more about our affiliate program and transparent pricing
            </Link>
          </div>
        )}

        <AddToCartButton product={product} />
      </div>

      <div className="mt-4 text-xs flex uppercase flex-col gap-1  h-fit w-full rounded-md font-muted-foreground font-semibold ">
        <p>
          {authToken ? (
            <>Earn {Math.round(earnedPoints)} points</>
          ) : (
            <>
              Earn {Math.round(earnedPoints)} points +
              <Link
                className="text-blue-600 cursor-pointer underline hover:underline ml-1"
                href="/signup"
              >
                100 free points for signing up
              </Link>
            </>
          )}
        </p>
      </div>
    </>
  );
}
