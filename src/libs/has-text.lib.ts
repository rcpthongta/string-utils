/**
 * Checks if a given value is a valid, non-empty string containing actual text.
 *
 * @remarks
 * Acts as a TypeScript Type Guard, narrowing the input parameter type to `string`
 * when the function evaluates to `true`.
 *
 * @param str - The value to check.
 * @returns `true` if the value is a string and its trimmed length is greater than 0; otherwise, `false`.
 *
 * @example
 *
 * hasText("Hello World"); // true
 * hasText("   ");         // false (only whitespace)
 * hasText("");            // false (empty string)
 * hasText(123);           // false
 * hasText(null);          // false
 * hasText(undefined);     // false
 */
export function hasText(str: unknown): str is string {
  return typeof str === "string" && str.trim().length > 0;
}
