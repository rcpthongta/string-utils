import { FIRST_CHAR_PATTERN, SEPARATOR_PATTERN } from "../constants";

import { hasText } from "./has-text.lib";

/**
 * Converts a given string into camelCase format.
 *
 * @remarks
 * - Removes non-alphanumeric separators (such as hyphens, underscores, or spaces)
 *   and capitalizes the first letter of each subsequent word.
 * - The first word remains in lowercase.
 *
 * @param str - The input string to convert.
 * @returns The converted camelCase string.
 *
 * @example
 *
 * camelCase("hello world");      // "helloWorld"
 * camelCase("some-hyphen-text"); // "someHyphenText"
 * camelCase("user_first_name");  // "userFirstName"
 * camelCase("PascalCase");       // "pascalCase"
 * camelCase("");                 // ""
 * camelCase(null);               // ""
 * camelCase(undefined);          // ""
 */
export function camelCase(str: string | null | undefined): string {
  if (!hasText(str)) {
    return "";
  }

  return str
    .replace(SEPARATOR_PATTERN, (_: string, char?: string): string => char?.toUpperCase() ?? "")
    .replace(FIRST_CHAR_PATTERN, (char: string): string => char.toLowerCase());
}
