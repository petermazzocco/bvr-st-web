import { Price } from "@/components/product/product-price";

export const Label = ({
  title,
  amount,
  currencyCode,
}: {
  title: string;
  amount: string;
  currencyCode: string;
}) => {
  return (
    <div className="flex flex-col items-start gap-2 text-left text-sm">
      <h3 className="text-md flex-grow font-semibold leading-none tracking-tight">
        {title}
      </h3>
      <Price
        className="flex-none text-xs"
        amount={amount}
        currencyCode={currencyCode}
        currencyCodeClassName="hidden @[275px]/label:inline"
      />
    </div>
  );
};
