import { CONSECUTIVE_WHITESPACE_REGEX, EMPTY, SPACE, WHITESPACE_TEST_REGEX } from "../../constants";

import { hasLength } from "../has-length";

/**
 * Collapses consecutive whitespace characters into a single space and trims
 * leading and trailing whitespace.
 *
 * @param value - The string value to normalize, or `null` or `undefined`.
 * @returns The normalized string, or an empty string when `value` is empty, `null`, or `undefined`.
 *
 * @example
 *
 * collapseWhitespace("Hello  World");      // "Hello World"
 * collapseWhitespace("  Hello World  ");   // "Hello World"
 * collapseWhitespace("Hello\tWorld\n!");   // "Hello World !"
 * collapseWhitespace("Hello\u00A0World");  // "Hello World" (NBSP)
 * collapseWhitespace("Hello\u3000World");  // "Hello World" (Ideographic space)
 * collapseWhitespace("Hello World");       // "Hello World"
 * collapseWhitespace("");                  // ""
 * collapseWhitespace(null);                // ""
 * collapseWhitespace(undefined);           // ""
 */
export function collapseWhitespace(value: string | null | undefined): string {
  if (!hasLength(value)) {
    return EMPTY;
  }

  return !WHITESPACE_TEST_REGEX.test(value) ? value : value.replace(CONSECUTIVE_WHITESPACE_REGEX, SPACE).trim();
}
