import {
  CAMEL_CASE_PATTERN,
  DASH,
  DIACRITICS_PATTERN,
  KEBAB_REPLACEMENT,
  NON_ALPHANUMERIC_PATTERN,
  TRIM_HYPHENS_PATTERN
} from "../constants";

import { hasText } from "./has-text.lib";

/**
 * Converts a given string into a URL-friendly slug format.
 *
 * @remarks
 * - Removes accents/diacritics from characters (e.g., "é" becomes "e").
 * - Converts camelCase and PascalCase boundaries into hyphens.
 * - Replaces spaces, underscores, and non-alphanumeric characters with hyphens.
 * - Collapses multiple consecutive hyphens into a single hyphen.
 * - Trims leading and trailing hyphens.
 * - Converts the entire resulting string to lowercase.
 *
 * @param str - The input string to convert.
 * @returns The converted URL-friendly slug string.
 *
 * @example
 *
 * slugify("hello world");      // "hello-world"
 * slugify("some-hyphen-text"); // "some-hyphen-text"
 * slugify("user_first_name");  // "user-first-name"
 * slugify("userFirstName");    // "user-first-name"
 * slugify("PascalCase");       // "pascal-case"
 * slugify("Café & Restaurant");// "cafe-restaurant"
 * slugify("  -- Hello, World!! -- "); // "hello-world"
 * slugify("");                 // ""
 * slugify(null);               // ""
 * slugify(undefined);          // ""
 */
export function slugify(str: string | null | undefined): string {
  if (!hasText(str)) return "";

  return str
    .normalize("NFD")
    .replace(DIACRITICS_PATTERN, "")
    .replace(CAMEL_CASE_PATTERN, KEBAB_REPLACEMENT)
    .toLowerCase()
    .replace(NON_ALPHANUMERIC_PATTERN, DASH)
    .replace(TRIM_HYPHENS_PATTERN, "");
}
