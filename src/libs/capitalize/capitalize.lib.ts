import { EMPTY } from "../../constants";

import { hasLength } from "../has-length";

/**
 * Capitalizes the first character of a string while preserving its literal type.
 *
 * @param value - The string to capitalize.
 * @returns The capitalized string with its literal type preserved.
 *
 * @example
 *
 * capitalize("hello");      // "Hello"
 * capitalize("helloWorld"); // "HelloWorld"
 * capitalize("Hello");      // "Hello"
 */
export function capitalize<T extends string>(value: T): Capitalize<T>;

/**
 * Capitalizes the first character of a string.
 *
 * @param value - The string to capitalize, or `null` or `undefined`.
 * @returns The capitalized string, or an empty string when `value` is empty, `null`, or `undefined`.
 *
 * @example
 *
 * capitalize("hello");      // "Hello"
 * capitalize("helloWorld"); // "HelloWorld"
 * capitalize("Hello");      // "Hello"
 * capitalize("");           // ""
 * capitalize(null);         // ""
 * capitalize(undefined);    // ""
 */
export function capitalize(value: string | null | undefined): string;

export function capitalize(value: string | null | undefined): string {
  if (!hasLength(value)) {
    return EMPTY;
  }

  const firstChar: string = value[0];
  const upperFirst: string = firstChar.toUpperCase();

  return firstChar === upperFirst ? value : upperFirst + value.slice(1);
}
