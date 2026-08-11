import { CAMEL_CASE_PATTERN, DASH, KEBAB_REPLACEMENT, SEPARATOR_PATTERN } from "../constants";

import { hasText } from "./has-text.lib";

/**
 * Converts a given string into kebab-case format.
 *
 * @remarks
 * - Converts spaces, underscores, and camelCase/PascalCase boundaries into hyphens.
 * - Converts the entire resulting string to lowercase.
 *
 * @param str - The input string to convert.
 * @returns The converted kebab-case string.
 *
 * @example
 *
 * kebabCase("hello world");      // "hello-world"
 * kebabCase("some_hyphen_text"); // "some-hyphen-text"
 * kebabCase("userFirstName");    // "user-first-name"
 * kebabCase("PascalCase");       // "pascal-case"
 * kebabCase("");                 // ""
 * kebabCase(null);               // ""
 * kebabCase(undefined);          // ""
 */
export function kebabCase(str: string | null | undefined): string {
  if (!hasText(str)) return "";

  return str
    .replace(CAMEL_CASE_PATTERN, KEBAB_REPLACEMENT)
    .replace(SEPARATOR_PATTERN, (_match: string, char?: string, offset?: number): string => {
      if (!char) return "";

      return offset === 0 ? char : `${DASH}${char}`;
    })
    .toLowerCase();
}
