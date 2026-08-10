/**
 * Converts the first character of a string to upper case.
 *
 * @param str - The input string to capitalize.
 * @returns The capitalized string, or the original input if empty/null/undefined.
 *
 * @example
 *
 * capitalize("hello");       // "Hello"
 * capitalize("HELLO");       // "HELLO"
 * capitalize("hello world"); // "Hello world"
 * capitalize("  hello");     // "  hello" (leading whitespace is treated as index 0)
 * capitalize("");            // ""
 * capitalize(null);          // null
 * capitalize(undefined);     // undefined
 */
export function capitalize<T extends string | null | undefined>(str: T): T {
  if (!str) {
    return str;
  }

  return (str.charAt(0).toUpperCase() + str.slice(1)) as T;
}
