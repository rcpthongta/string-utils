import { EMPTY, HYPHEN, WORD_REGEX } from "../../constants";

import { hasLength } from "../has-length";

/**
 * Converts a string to kebab-case.
 *
 * Handles separators, existing casing styles, acronyms, numbers, Unicode characters, and combining marks.
 *
 * @param value - The string to convert to kebab-case, or `null` or `undefined`.
 * @returns The kebab-case string, or an empty string when `value` is empty, `null`, or `undefined`, or contains no extractable words.
 *
 * @example
 *
 * kebabCase("Foo Bar");          // "foo-bar"
 * kebabCase("--foo-bar--");      // "foo-bar"
 * kebabCase("FOO_BAR");          // "foo-bar"
 * kebabCase("fooBar");           // "foo-bar"
 * kebabCase("XMLHttpRequest");   // "xml-http-request"
 * kebabCase("version 2.0");      // "version-2-0"
 * kebabCase("Привет Мир");       // "привет-мир"
 * kebabCase("你好 世界");         // "你好-世界"
 * kebabCase("cafe\u0301 noir");  // "cafe\u0301-noir"
 * kebabCase("");                 // ""
 * kebabCase(null);               // ""
 * kebabCase(undefined);          // ""
 */
export function kebabCase(value: string | null | undefined): string {
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
    result += HYPHEN + words[index].toLowerCase();
  }

  return result;
}
