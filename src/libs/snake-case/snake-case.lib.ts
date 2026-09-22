import { EMPTY, UNDERSCORE, WORD_REGEX } from "../../constants";

import { hasLength } from "../has-length";

/**
 * Converts a string to snake_case.
 *
 * Handles separators, existing casing styles, acronyms, numbers, Unicode characters, and combining marks.
 *
 * @param value - The string to convert to snake_case, or `null` or `undefined`.
 * @returns The snake_case string, or an empty string when `value` is empty, `null`, or `undefined`, or contains no extractable words.
 *
 * @example
 *
 * snakeCase("Foo Bar");          // "foo_bar"
 * snakeCase("--foo-bar--");      // "foo_bar"
 * snakeCase("FOO_BAR");          // "foo_bar"
 * snakeCase("fooBar");           // "foo_bar"
 * snakeCase("XMLHttpRequest");   // "xml_http_request"
 * snakeCase("version 2.0");      // "version_2_0"
 * snakeCase("Привет Мир");       // "привет_мир"
 * snakeCase("你好 世界");         // "你好_世界"
 * snakeCase("cafe\u0301 noir");  // "cafe\u0301_noir"
 * snakeCase("");                 // ""
 * snakeCase(null);               // ""
 * snakeCase(undefined);          // ""
 */
export function snakeCase(value: string | null | undefined): string {
  if (!hasLength(value)) {
    return EMPTY;
  }

  const words: RegExpMatchArray | null = value.match(WORD_REGEX);

  if (!words) {
    return EMPTY;
  }

  const length: number = words.length;

  let result: string = words[0].toLowerCase();

  for (let index: number = 1; index < length; index++) {
    result += UNDERSCORE + words[index].toLowerCase();
  }

  return result;
}
