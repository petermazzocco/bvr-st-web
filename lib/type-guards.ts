/**
 * Interface defining the structure of Shopify API errors
 * Used for consistent error handling across the application
 */
export interface ShopifyErrorLike {
  /** HTTP status code from the API response */
  status: number;
  /** Error object containing the error message and details */
  message: Error;
  /** Optional underlying cause of the error */
  cause?: Error;
}

/**
 * Type guard to check if an unknown value is a plain object
 * Excludes arrays, null, and primitive values
 * @param object - Unknown value to check
 * @returns True if the value is a plain object, false otherwise
 * @example
 * ```typescript
 * if (isObject(data)) {
 *   // TypeScript now knows data is Record<string, unknown>
 *   console.log(data.someProperty);
 * }
 * ```
 */
export const isObject = (
  object: unknown,
): object is Record<string, unknown> => {
  return (
    typeof object === "object" && object !== null && !Array.isArray(object)
  );
};

/**
 * Type guard to determine if an unknown error matches the ShopifyErrorLike interface
 * Performs comprehensive checking including prototype chain traversal for Error objects
 * @param error - Unknown error value to check
 * @returns True if the error matches ShopifyErrorLike structure, false otherwise
 * @example
 * ```typescript
 * try {
 *   await shopifyFetch(query);
 * } catch (error) {
 *   if (isShopifyError(error)) {
 *     // TypeScript knows error is ShopifyErrorLike
 *     console.log(`Shopify API Error: ${error.status} - ${error.message}`);
 *   }
 * }
 * ```
 */
export const isShopifyError = (error: unknown): error is ShopifyErrorLike => {
  if (!isObject(error)) return false;
  if (error instanceof Error) return true;
  return findError(error);
};

/**
 * Recursively searches the prototype chain to determine if an object is Error-like
 * Used internally by isShopifyError to handle complex error object hierarchies
 * @param error - Object to examine for Error characteristics
 * @returns True if the object or its prototype chain contains Error-like properties
 */
function findError<T extends object>(error: T): boolean {
  if (Object.prototype.toString.call(error) === "[object Error]") {
    return true;
  }
  const prototype = Object.getPrototypeOf(error) as T | null;
  return prototype === null ? false : findError(prototype);
}
