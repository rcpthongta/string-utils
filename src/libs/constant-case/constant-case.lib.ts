import { EMPTY, UNDERSCORE, WORD_REGEX } from "../../constants";

import { hasLength } from "../has-length";

/**
 * Converts a string to CONSTANT_CASE (SCREAMING_SNAKE_CASE).
 *
 * Handles separators, existing casing styles, acronyms, numbers, Unicode characters, and combining marks.
 *
 * @param value - The string to convert to CONSTANT_CASE, or `null` or `undefined`.
 * @returns The CONSTANT_CASE string, or an empty string when `value` is empty, `null`, or `undefined`, or contains no extractable words.
 *
 * @example
 *
 * constantCase("Foo Bar");          // "FOO_BAR"
 * constantCase("--foo-bar--");      // "FOO_BAR"
 * constantCase("fooBar");           // "FOO_BAR"
 * constantCase("FOO_BAR");          // "FOO_BAR"
 * constantCase("XMLHttpRequest");   // "XML_HTTP_REQUEST"
 * constantCase("version 2.0");      // "VERSION_2_0"
 * constantCase("Привет Мир");       // "ПРИВЕТ_МИР"
 * constantCase("你好 世界");         // "你好_世界"
 * constantCase("cafe\u0301 noir");  // "CAFE\u0301_NOIR"
 * constantCase("");                 // ""
 * constantCase(null);               // ""
 * constantCase(undefined);          // ""
 */
export function constantCase(value: string | null | undefined): string {
  if (!hasLength(value)) {
    return EMPTY;
  }

  const words: RegExpMatchArray | null = value.match(WORD_REGEX);

  if (!words) {
    return EMPTY;
  }

  const length: number = words.length;

  let result: string = words[0].toUpperCase();

  for (let index: number = 1; index < length; index++) {
    result += UNDERSCORE + words[index].toUpperCase();
  }

  return result;
}
