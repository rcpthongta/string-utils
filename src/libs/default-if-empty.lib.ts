import { hasLength } from "./has-length.lib";

/**
 * Returns a default value if the given input string is empty, null, or undefined.
 *
 * @remarks
 * Uses `hasLength` to evaluate if the input has length.
 *
 * @param str - The input string to check.
 * @param defaultValue - The default value to return if the input is empty.
 * @returns The original string if it has length; otherwise, the `defaultValue`.
 *
 * @example
 * ```ts
 * defaultIfEmpty("Hello", "default");   // "Hello"
 * defaultIfEmpty("   ", "default");     // "   " (whitespace is kept)
 * defaultIfEmpty("", "default");        // "default"
 * defaultIfEmpty(null, "default");      // "default"
 * defaultIfEmpty(undefined, "default"); // "default"
 * ```
 */
export function defaultIfEmpty(str: string | null | undefined, defaultValue: string): string {
  return hasLength(str) ? str : defaultValue;
}
