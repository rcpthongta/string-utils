import { hasText } from "./has-text.lib";

/**
 * Returns a default value if the given input string is empty, null, undefined, or contains only whitespace.
 *
 * @param str - The input string to check.
 * @param defaultValue - The default value to return if the input is blank.
 * @returns The original string if it contains text; otherwise, the `defaultValue`.
 *
 * @example
 *
 * defaultIfBlank("Hello", "default");   // "Hello"
 * defaultIfBlank("   ", "default");     // "default" (whitespace-only returns default)
 * defaultIfBlank("", "default");        // "default"
 * defaultIfBlank(null, "default");      // "default"
 * defaultIfBlank(undefined, "default"); // "default"
 *
 */
export function defaultIfBlank(str: string | null | undefined, defaultValue: string): string {
  return hasText(str) ? str : defaultValue;
}
