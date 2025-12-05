import { clsx, type ClassValue } from "clsx";
import { ReadonlyURLSearchParams } from "next/navigation";
import { twMerge } from "tailwind-merge";

/**
 * Creates a complete URL by combining a pathname with URL search parameters
 * @param pathname - The base path for the URL (e.g., "/blog")
 * @param params - URLSearchParams object containing query parameters
 * @returns Complete URL string with pathname and query string
 * @example
 * ```typescript
 * const params = new URLSearchParams({ page: "1", category: "news" });
 * createUrl("/blog", params); // Returns "/blog?page=1&category=news"
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
