/**
 *
 * Checks if a given value is a valid, non-empty string containing actual text.
 *
 * @remarks
 * - This method acts as a TypeScript Type Guard, narrowing the type of the
 *   input parameter to `string` if the condition evaluates to `true`.
 *
 * @param str The value to check.
 * @returns `true` if the value is a string and its trimmed length is greater than 0; otherwise, `false`.
 *
 * @example
 *
 * hasText("Hello World"); // returns true
 * hasText("   ");         // returns false (only whitespace)
 * hasText("");            // returns false (empty string)
 * hasText(null);          // returns false
 * hasText(undefined);     // returns false
 * hasText(123);           // returns false
 *
 */
export function hasText(str: unknown): str is string {
  return typeof str === "string" && str.trim().length > 0;
}
