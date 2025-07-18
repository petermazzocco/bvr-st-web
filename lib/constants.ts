export const AUCTION_PRODUCT_TAG = "product_auction";

/**
 * Configuration object for product sorting and filtering options
 * Used to build sort dropdowns and URL query parameters
 */
export type SortFilterItem = {
  /** Display name shown to users in the sort dropdown */
  title: string;
  /** URL-friendly slug for query parameters (null for default) */
  slug: string | null;
  /** Shopify GraphQL sort key determining the sorting field */
  sortKey: "RELEVANCE" | "BEST_SELLING" | "CREATED_AT" | "PRICE";
  /** Whether to reverse the sort order (true = descending, false = ascending) */
  reverse: boolean;
};

/**
 * Default sorting option when no specific sort is selected
 * Uses relevance-based sorting which is Shopify's default algorithm
 */
export const defaultSort: SortFilterItem = {
  title: "Relevance",
  slug: null,
  sortKey: "RELEVANCE",
  reverse: false,
};

/**
 * Complete array of available sorting options for product listings
 * Used to populate sort dropdowns and handle URL-based sorting
 */
export const sorting: SortFilterItem[] = [
  defaultSort,
  {
    title: "Trending",
    slug: "trending-desc",
    sortKey: "BEST_SELLING",
    reverse: false,
  }, // asc
  {
    title: "Latest arrivals",
    slug: "latest-desc",
    sortKey: "CREATED_AT",
    reverse: true,
  },
  {
    title: "Price: Low to high",
    slug: "price-asc",
    sortKey: "PRICE",
    reverse: false,
  }, // asc
  {
    title: "Price: High to low",
    slug: "price-desc",
    sortKey: "PRICE",
    reverse: true,
  },
];

/**
 * Next.js cache tags for selective revalidation
 * Used with revalidateTag() to invalidate specific cached data when content changes
 */
export const TAGS = {
  /** Tag for collection-related cached data */
  collections: "collections",
  /** Tag for product-related cached data */
  products: "products",
  /** Tag for cart-related cached data */
  cart: "cart",
};

/**
 * Shopify product tag used to hide products from the frontend
 * Products with this tag will be filtered out of public product listings
 */
export const HIDDEN_PRODUCT_TAG = "nextjs-frontend-hidden";

/**
 * Default option title for products with no variants
 * Used when a product doesn't have specific size/color/style options
 */
export const DEFAULT_OPTION = "Default Title";

/**
 * Shopify GraphQL API endpoint path
 * Appended to the store domain to construct the full GraphQL API URL
 * Uses Shopify's 2023-07 API version
 */
export const SHOPIFY_GRAPHQL_API_ENDPOINT = "/api/2023-07/graphql.json";
