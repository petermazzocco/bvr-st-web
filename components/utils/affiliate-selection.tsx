"use client";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Affiliate } from "@/lib/types";
import { Skeleton } from "../ui/skeleton";
import { useSearchParams, usePathname } from "next/navigation";
import { useCallback } from "react";

export const AffiliateSelection = ({
  affiliates,
}: {
  affiliates: Affiliate[];
}) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // Get current affiliate from URL params
  const currentAffiliate = searchParams.get("affiliate");

  // On selection, set the affiliate code in the URL
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      return params.toString();
    },
    [searchParams],
  );

  // Don't render until we have data
  if (!affiliates || affiliates.length === 0) {
    return (
      <div>
        <Skeleton />
      </div>
    );
  }

  // Find the selected affiliate data to show the name
  const selectedAffiliate = affiliates.find(
    (a) => a.code.toString() === currentAffiliate,
  );

  return (
    <Select
      value={currentAffiliate || ""} // Set current value from URL params
      onValueChange={(value) => {
        const queryString = createQueryString("affiliate", value);
        window.location.href = `${pathname}?${queryString}`;
      }}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Support An Athlete">
          {selectedAffiliate ? selectedAffiliate.name : "Support An Athlete"}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Athletes</SelectLabel>
          {affiliates.map((affiliate, index) => (
            <SelectItem
              key={affiliate?.code?.toString() || `affiliate-${index}`}
              value={affiliate?.code?.toString() || `affiliate-${index}`}
            >
              {affiliate?.name || "Loading..."}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
