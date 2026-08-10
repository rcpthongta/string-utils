/**
 * Converts the first character of a string to lower case.
 *
 * @param str - The input string to uncapitalize.
 * @returns The uncapitalized string, or the original input if empty/null/undefined.
 *
 * @example
 *
 * uncapitalize("Hello");       // "hello"
 * uncapitalize("HELLO");       // "hELLO"
 * uncapitalize("Hello World"); // "hello World"
 * uncapitalize("  HELLO");     // "  HELLO" (leading whitespace is treated as index 0)
 * uncapitalize("");            // ""
 * uncapitalize(null);          // null
 * uncapitalize(undefined);     // undefined
 */
export function uncapitalize<T extends string | null | undefined>(str: T): T {
  if (!str) {
    return str;
  }

  return (str.charAt(0).toLowerCase() + str.slice(1)) as T;
}
