import { EMPTY, WORD_REGEX } from "../../constants";

import { hasLength } from "../has-length";

/**
 * Converts a string to PascalCase.
 *
 * Handles separators, existing casing styles, acronyms, numbers, Unicode characters, and combining marks.
 *
 * @param value - The string to convert to PascalCase, or `null` or `undefined`.
 * @returns The PascalCase string, or an empty string when `value` is empty, `null`, or `undefined`, or contains no extractable words.
 *
 * @example
 *
 * pascalCase("Foo Bar");          // "FooBar"
 * pascalCase("--foo-bar--");      // "FooBar"
 * pascalCase("FOO_BAR");          // "FooBar"
 * pascalCase("fooBar");           // "FooBar"
 * pascalCase("XMLHttpRequest");   // "XmlHttpRequest"
 * pascalCase("version 2.0");      // "Version20"
 * pascalCase("Привет Мир");       // "ПриветМир"
 * pascalCase("你好 世界");         // "你好世界"
 * pascalCase("cafe\u0301 noir");  // "Cafe\u0301Noir"
 * pascalCase("---");              // ""
 * pascalCase("");                 // ""
 * pascalCase(null);               // ""
 * pascalCase(undefined);          // ""
 */
export function pascalCase(value: string | null | undefined): string {
  if (!hasLength(value)) {
    return EMPTY;
  }

  const words: RegExpMatchArray | null = value.match(WORD_REGEX);

  if (!words) {
    return EMPTY;
  }

  const length: number = words.length;
  const firstWord: string = words[0];

  let result: string = firstWord[0].toUpperCase() + firstWord.slice(1).toLowerCase();

  for (let index: number = 1; index < length; index++) {
    const word: string = words[index];

    result += word[0].toUpperCase() + word.slice(1).toLowerCase();
  }

  return result;
}
