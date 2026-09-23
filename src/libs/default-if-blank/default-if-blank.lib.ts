import { hasText } from "../has-text";

/**
 * Returns a default value when the given value is empty or contains only whitespace.
 *
 * @param value - The string value to check, or `null` or `undefined`.
 * @param defaultValue - The value to return when `value` is empty, whitespace-only, `null`, or `undefined`.
 * @returns The original `value` when it contains at least one non-whitespace character; otherwise, `defaultValue`.
 *
 * @example
 *
 * defaultIfBlank("Hello", "default");    // "Hello"
 * defaultIfBlank("   ", "default");      // "default"
 * defaultIfBlank("", "default");         // "default"
 * defaultIfBlank(null, "default");       // "default"
 * defaultIfBlank(undefined, "default");  // "default"
 */
export function defaultIfBlank(value: string | null | undefined, defaultValue: string): string {
  return hasText(value) ? value : defaultValue;
}
