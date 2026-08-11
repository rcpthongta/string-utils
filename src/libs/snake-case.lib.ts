import { CAMEL_CASE_PATTERN, KEBAB_REPLACEMENT, SEPARATOR_PATTERN, UNDER_SCORE } from "../constants";

import { hasText } from "./has-text.lib";

/**
 * Converts a given string into snake_case format.
 *
 * @remarks
 * - Converts spaces, hyphens, and camelCase/PascalCase boundaries into underscores.
 * - Converts the entire resulting string to lowercase.
 *
 * @param str - The input string to convert.
 * @returns The converted snake_case string.
 *
 * @example
 *
 * snakeCase("hello world");     // "hello_world"
 * snakeCase("some-hyphen-text");// "some_hyphen_text"
 * snakeCase("userFirstName");   // "user_first_name"
 * snakeCase("PascalCase");      // "pascal_case"
 * snakeCase("");                // ""
 * snakeCase(null);              // ""
 * snakeCase(undefined);         // ""
 */
export function snakeCase(str: string | null | undefined): string {
  if (!hasText(str)) return "";

  return str
    .replace(CAMEL_CASE_PATTERN, KEBAB_REPLACEMENT)
    .replace(SEPARATOR_PATTERN, (_match: string, char?: string, offset?: number): string => {
      if (!char) return "";

      return offset === 0 ? char : `${UNDER_SCORE}${char}`;
    })
    .toLowerCase();
}
