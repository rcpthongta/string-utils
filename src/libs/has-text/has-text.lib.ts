const NON_WHITESPACE_REGEX: RegExp = /\S/;

/**
 * Checks whether a value is a string containing at least one non-whitespace character.
 *
 * @param value - The value to check.
 * @returns `true` if the value is a string containing at least one non-whitespace character; otherwise, `false`.
 *
 * @example
 *
 * hasText("Hello World"); // true
 * hasText("   ");         // false
 * hasText("");            // false
 * hasText(123);           // false
 * hasText(null);          // false
 * hasText(undefined);     // false
 */
export function hasText(value: unknown): value is string {
  return typeof value === "string" && NON_WHITESPACE_REGEX.test(value);
}
