import { clsx, type ClassValue } from "clsx";
import { ReadonlyURLSearchParams } from "next/navigation";
import { twMerge } from "tailwind-merge";
import Cookies from "js-cookie";
import { AUCTION_PRODUCT_TAG } from "@/lib/constants";
import { Product } from "@/lib/shopify/types";

// Note: Authentication token functions have been removed since we now use
// HTTP-only cookies for security. Token management is handled server-side.
// Client-side auth state is provided via AuthProvider props from the server.

/**
 * Creates a complete URL by combining a pathname with URL search parameters
 * @param pathname - The base path for the URL (e.g., "/products")
 * @param params - URLSearchParams object containing query parameters
 * @returns Complete URL string with pathname and query string
 * @example
 * ```typescript
 * const params = new URLSearchParams({ page: "1", category: "shoes" });
 * createUrl("/products", params); // Returns "/products?page=1&category=shoes"
 * ```
 */
export const createUrl = (
  pathname: string,
  params: URLSearchParams | ReadonlyURLSearchParams,
) => {
  const paramsString = params.toString();
  const queryString = `${paramsString.length ? "?" : ""}${paramsString}`;
  return `${pathname}${queryString}`;
};

/**
 * Ensures a string starts with a specific prefix, adding it if missing
 * @param stringToCheck - The string to validate
 * @param startsWith - The required prefix
 * @returns The string with the prefix guaranteed to be present
 * @example
 * ```typescript
 * ensureStartsWith("example.com", "https://"); // Returns "https://example.com"
 * ensureStartsWith("https://example.com", "https://"); // Returns "https://example.com"
 * ```
 */
export const ensureStartsWith = (stringToCheck: string, startsWith: string) =>
  stringToCheck.startsWith(startsWith)
    ? stringToCheck
    : `${startsWith}${stringToCheck}`;

/**
 * Validates that all required Shopify environment variables are present and properly formatted
 * Checks for required variables and validates SHOPIFY_STORE_DOMAIN format
 * @throws Error if any required environment variables are missing or malformed
 */
export const validateEnvironmentVariables = () => {
  const requiredEnvironmentVariables = [
    "SHOPIFY_STORE_DOMAIN",
    "SHOPIFY_STOREFRONT_ACCESS_TOKEN",
  ];
  const missingEnvironmentVariables = [] as string[];
  requiredEnvironmentVariables.forEach((envVar) => {
    if (!process.env[envVar]) {
      missingEnvironmentVariables.push(envVar);
    }
  });
  if (missingEnvironmentVariables.length) {
    throw new Error(
      `The following environment variables are missing. Your site will not work without them. Read more: https://vercel.com/docs/integrations/shopify#configure-environment-variables\n\n${missingEnvironmentVariables.join(
        "\n",
      )}\n`,
    );
  }
  if (
    process.env.SHOPIFY_STORE_DOMAIN?.includes("[") ||
    process.env.SHOPIFY_STORE_DOMAIN?.includes("]")
  ) {
    throw new Error(
      "Your `SHOPIFY_STORE_DOMAIN` environment variable includes brackets (ie. `[` and / or `]`). Your site will not work with them there. Please remove them.",
    );
  }
};

/**
 * Utility function for conditionally joining CSS class names
 * Combines clsx for conditional classes with tailwind-merge to handle Tailwind CSS conflicts
 * @param inputs - Array of class values (strings, objects, arrays, etc.)
 * @returns Merged and deduplicated class string
 * @example
 * ```typescript
 * cn("px-4 py-2", isActive && "bg-blue-500", "text-white");
 * // Returns optimized class string with no conflicts
 * ```
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isAuctionProduct(product: Product): boolean {
  return product.tags.includes(AUCTION_PRODUCT_TAG);
}
