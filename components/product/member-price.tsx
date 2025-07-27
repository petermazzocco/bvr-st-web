import { Price } from "./product-price";

interface MemberPriceProps {
  amount: string;
  currencyCode: string;
  isMember?: boolean;
  className?: string;
}

export function MemberPrice({
  amount,
  currencyCode,
  isMember,
  className,
}: MemberPriceProps) {
  if (!isMember) {
    return (
      <Price
        amount={amount}
        currencyCode={currencyCode}
        className={className}
      />
    );
  }

  // Calculate 10% discount
  const originalPrice = parseFloat(amount);
  const discountedPrice = originalPrice * 0.9;

  return (
    <div className={`flex flex-row items-center gap-2 ${className}`}>
      {/* Discounted price */}
      <Price
        amount={discountedPrice.toFixed(2)}
        currencyCode={currencyCode}
        className="text-sm font-semibold text-foreground"
      />
      {/* Original price with strikethrough */}
      <Price
        amount={amount}
        currencyCode={currencyCode}
        className="text-xs text-muted-foreground line-through"
      />
    </div>
  );
}
