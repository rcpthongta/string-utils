import { EMPTY } from "../../constants";

import { hasLength } from "../has-length";

/**
 * Converts the first character of a string to lowercase while preserving its literal type.
 *
 * @param value - The string to uncapitalize.
 * @returns The uncapitalized string with its literal type preserved.
 *
 * @example
 *
 * uncapitalize("Hello");      // "hello"
 * uncapitalize("HelloWorld"); // "helloWorld"
 * uncapitalize("hello");      // "hello"
 */
export function uncapitalize<T extends string>(value: T): Uncapitalize<T>;

/**
 * Converts the first character of a string to lowercase.
 *
 * @param value - The string to uncapitalize, or `null` or `undefined`.
 * @returns The uncapitalized string, or an empty string when `value` is empty, `null`, or `undefined`.
 *
 * @example
 *
 * uncapitalize("Hello");      // "hello"
 * uncapitalize("HelloWorld"); // "helloWorld"
 * uncapitalize("hello");      // "hello"
 * uncapitalize("");           // ""
 * uncapitalize(null);         // ""
 * uncapitalize(undefined);    // ""
 */
export function uncapitalize(value: string | null | undefined): string;

export function uncapitalize(value: string | null | undefined): string {
  if (!hasLength(value)) {
    return EMPTY;
  }

  const firstChar: string = value[0];
  const lowerFirst: string = firstChar.toLowerCase();

  return firstChar === lowerFirst ? value : lowerFirst + value.slice(1);
}
