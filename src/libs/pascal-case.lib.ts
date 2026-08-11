import { FIRST_CHAR_PATTERN, SEPARATOR_PATTERN } from "../constants";

import { hasText } from "./has-text.lib";

/**
 * Converts a given string into PascalCase format.
 *
 * @remarks
 * - Removes non-alphanumeric separators (such as hyphens, underscores, or spaces)
 *   and capitalizes the first letter of each word, including the first word.
 * - The first word starts with a capital letter.
 *
 * @param str - The input string to convert.
 * @returns The converted PascalCase string.
 *
 * @example
 *
 * pascalCase("hello world");     // "HelloWorld"
 * pascalCase("some-hyphen-text");// "SomeHyphenText"
 * pascalCase("user_first_name"); // "UserFirstName"
 * pascalCase("camelCase");       // "CamelCase"
 * pascalCase("");                // ""
 * pascalCase(null);              // ""
 * pascalCase(undefined);         // ""
 */
export function pascalCase(str: string | null | undefined): string {
  if (!hasText(str)) return "";

  return str
    .replace(SEPARATOR_PATTERN, (_match: string, char?: string): string => char?.toUpperCase() ?? "")
    .replace(FIRST_CHAR_PATTERN, (char: string): string => char.toUpperCase());
}
