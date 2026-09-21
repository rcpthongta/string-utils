import { hasLength } from "../has-length";

/**
 * Returns a default value when the given value is empty, `null`, or `undefined`.
 *
 * @param value - The string value to check, or `null` or `undefined`.
 * @param defaultValue - The value to return when `value` is empty, `null`, or `undefined`.
 * @returns The original `value` when it is a non-empty string; otherwise, `defaultValue`.
 *
 * @example
 *
 * defaultIfEmpty("Hello", "default");    // "Hello"
 * defaultIfEmpty("   ", "default");      // "   "
 * defaultIfEmpty("", "default");         // "default"
 * defaultIfEmpty(null, "default");       // "default"
 * defaultIfEmpty(undefined, "default");  // "default"
 */
export function defaultIfEmpty(value: string | null | undefined, defaultValue: string): string {
  return hasLength(value) ? value : defaultValue;
}
