/**
 * Checks whether a value is a non-empty string.
 *
 * @param value - The value to check.
 * @returns `true` if the value is a non-empty string; otherwise, `false`.
 *
 * @example
 *
 * hasLength("Hello World"); // true
 * hasLength("   ");         // true
 * hasLength("");            // false
 * hasLength(123);           // false
 * hasLength(null);          // false
 * hasLength(undefined);     // false
 */
export function hasLength(value: unknown): value is string {
  return typeof value === "string" && value.length > 0;
}
