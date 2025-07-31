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
import { useSearchParams, useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";

export const AffiliateSelection = ({
  affiliates,
}: {
  affiliates: Affiliate[];
}) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Get current affiliate from URL params, but only if it's valid
  const rawAffiliate = searchParams.get("affiliate");
  const currentAffiliate = affiliates.some(a => a.code.toString() === rawAffiliate) 
    ? rawAffiliate 
    : null;

  // Remove invalid affiliate param from URL
  useEffect(() => {
    if (rawAffiliate && !currentAffiliate && affiliates.length > 0) {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("affiliate");
      const newUrl = params.toString() 
        ? `?${params.toString()}` 
        : "";
      router.replace(newUrl, { scroll: false });
    }
  }, [rawAffiliate, currentAffiliate, affiliates, router, searchParams]);

  // Update URL function similar to variant selector
  const updateURL = useCallback((affiliateCode: string) => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set("affiliate", affiliateCode);
    router.push(`?${newParams.toString()}`, { scroll: false });
  }, [router, searchParams]);

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
    <form>
      <Select
        value={currentAffiliate || ""} // Set current value from URL params
        onValueChange={(value) => {
          updateURL(value);
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
    </form>
  );
};
