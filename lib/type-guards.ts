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
