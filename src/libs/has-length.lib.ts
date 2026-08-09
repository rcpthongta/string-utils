/**
 * Checks if a given value is a valid, non-empty string based on its length.
 *
 * @remarks
 * - This method acts as a TypeScript Type Guard, narrowing the type of the
 *   input parameter to `string` if the condition evaluates to `true`.
 *
 * @param str The value to check.
 * @returns `true` if the value is a string and its length is greater than 0; otherwise, `false`.
 *
 * @example
 *
 * hasLength("Hello World"); // returns true
 * hasLength("   ");         // returns true (includes whitespace)
 * hasLength("");            // returns false (empty string)
 * hasLength(null);          // returns false
 * hasLength(undefined);     // returns false
 * hasLength(123);           // returns false
 *
 */
export function hasLength(str: unknown): str is string {
  return typeof str === "string" && str.length > 0;
}
