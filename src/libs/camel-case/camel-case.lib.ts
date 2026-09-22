import { EMPTY, WORD_REGEX } from "../../constants";

import { hasLength } from "../has-length";

/**
 * Converts a string to camelCase.
 *
 * Handles separators, existing casing styles, acronyms, numbers, Unicode characters, and combining marks.
 *
 * @param value - The string to convert to camelCase, or `null` or `undefined`.
 * @returns The camelCase string, or an empty string when `value` is empty, `null`, or `undefined`, or contains no extractable words.
 *
 * @example
 *
 * camelCase("Foo Bar");          // "fooBar"
 * camelCase("--foo-bar--");      // "fooBar"
 * camelCase("FOO_BAR");          // "fooBar"
 * camelCase("fooBar");           // "fooBar"
 * camelCase("XMLHttpRequest");   // "xmlHttpRequest"
 * camelCase("version 2.0");      // "version20"
 * camelCase("Привет Мир");       // "приветМир"
 * camelCase("你好 世界");         // "你好世界"
 * camelCase("cafe\u0301 noir");  // "cafe\u0301Noir"
 * camelCase("---");              // ""
 * camelCase("");                 // ""
 * camelCase(null);               // ""
 * camelCase(undefined);          // ""
 */
export function camelCase(value: string | null | undefined): string {
  if (!hasLength(value)) {
    return EMPTY;
  }

  const words: RegExpMatchArray | null = value.match(WORD_REGEX);

  if (!words) {
    return EMPTY;
  }

  const length: number = words.length;
  const firstWord: string = words[0];

  let result: string = firstWord.toLowerCase();

  for (let index: number = 1; index < length; index++) {
    const word: string = words[index];

    result += word[0].toUpperCase() + word.slice(1).toLowerCase();
  }

  return result;
}
