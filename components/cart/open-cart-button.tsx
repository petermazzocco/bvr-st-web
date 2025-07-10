import clsx from "clsx";
import { ShoppingBag } from "lucide-react";

export function OpenCartButton({
  className,
  quantity,
}: {
  className?: string;
  quantity?: number;
}) {
  return (
    <div className="relative flex items-center justify-center">
      <ShoppingBag className={clsx("h-4 cursor-pointer", className)} />

      {quantity ? (
        <div className="absolute right-0 top-0 -mr-2 -mt-2 h-4 w-4 rounded bg-orange-600 text-[11px] font-medium text-white">
          {quantity}
        </div>
      ) : null}
    </div>
  );
}
