/**
 * Checks if a given value is a valid, non-empty string based on its length.
 *
 * @remarks
 * Acts as a TypeScript Type Guard, narrowing the input parameter type to `string`
 * when the function evaluates to `true`.
 *
 * @param str - The value to check.
 * @returns `true` if the value is a string and its length is greater than 0; otherwise, `false`.
 *
 * @example
 *
 * hasLength("Hello World"); // true
 * hasLength("   ");         // true (includes whitespace)
 * hasLength("");            // false (empty string)
 * hasLength(null);          // false
 * hasLength(undefined);     // false
 * hasLength(123);           // false
 */
export function hasLength(str: unknown): str is string {
  return typeof str === "string" && str.length > 0;
}
