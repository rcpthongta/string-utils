import { DIACRITICS_REGEX, DOLLAR_SIGN, EMPTY, HYPHEN, NON_ALPHANUMERIC_REGEX } from "../../constants";

import { hasLength } from "../has-length";

/**
 * Configuration options for {@link slugify}.
 */
export interface SlugifyOptions {
  /**
   * String used to separate words in the slug.
   *
   * @default "-"
   */
  separator?: string;

  /**
   * Whether to convert the output string to lowercase.
   *
   * @default true
   */
  lower?: boolean;
}

/**
 * Trims leading and trailing occurrences of a separator.
 *
 * @param value - The string to trim.
 * @param separator - The separator to remove from the boundaries.
 * @returns The trimmed string.
 */
function trimSeparator(value: string, separator: string): string {
  if (!value || !separator) {
    return value;
  }

  const separatorLength: number = separator.length;

  let startIndex: number = 0;
  let endIndex: number = value.length;

  while (value.startsWith(separator, startIndex)) {
    startIndex += separatorLength;
  }

  while (endIndex > startIndex && value.endsWith(separator, endIndex)) {
    endIndex -= separatorLength;
  }

  return startIndex === 0 && endIndex === value.length ? value : value.slice(startIndex, endIndex);
}

/**
 * Converts a string into a URL-friendly slug using the default options.
 *
 * Latin diacritics and accented characters are normalized to their base
 * characters, while Unicode letters, combining marks, and numbers are
 * preserved.
 *
 * Non-alphanumeric characters are replaced with `-`, consecutive separators
 * are collapsed into a single separator, and leading and trailing separators
 * are removed.
 *
 * The resulting slug is converted to lowercase by default.
 *
 * @param value - The string to transform into a slug, or `null` or `undefined`.
 * @returns The slugified string, or an empty string when `value` is empty, `null`, or `undefined`.
 *
 * @example
 *
 * slugify("Hello World");  // "hello-world"
 * slugify("Foo & Bar");    // "foo-bar"
 * slugify("Crème Brûlée"); // "creme-brulee"
 * slugify("Привет, мир!"); // "привет-мир"
 * slugify("你好 世界");     // "你好-世界"
 * slugify("สวัสดี โลก");     // "สวัสดี-โลก"
 * slugify("Version 2.0");  // "version-2-0"
 * slugify("");             // ""
 * slugify(null);           // ""
 * slugify(undefined);      // ""
 */
export function slugify(value: string | null | undefined): string;

/**
 * Converts a string into a URL-friendly slug using the specified options.
 *
 * Latin diacritics and accented characters are normalized to their base
 * characters, while Unicode letters, combining marks, and numbers are
 * preserved.
 *
 * Non-alphanumeric characters are replaced with the configured separator,
 * consecutive separators are collapsed into a single separator, and leading
 * and trailing separators are removed.
 *
 * By default, the resulting slug is converted to lowercase and uses `-` as
 * the separator. These defaults can be overridden through `options`.
 *
 * An empty separator removes non-alphanumeric characters instead of replacing
 * them with a separator. Separators containing `$` are treated as literal
 * strings rather than JavaScript replacement patterns.
 *
 * @param value - The string to transform into a slug, or `null` or `undefined`.
 * @param options - Configuration options for the separator and letter casing.
 * @returns The slugified string, or an empty string when `value` is empty, `null`, or `undefined`.
 *
 * @example
 *
 * slugify("Hello World", { separator: "_" });              // "hello_world"
 * slugify("Hello World", { separator: "." });              // "hello.world"
 * slugify("Hello World", { separator: "--" });             // "hello--world"
 * slugify("Hello World", { separator: "$&" });             // "hello$&world"
 * slugify("Hello World", { lower: false });                // "Hello-World"
 * slugify("Crème Brûlée", { lower: false });               // "Creme-Brulee"
 * slugify("Привет, МИР!", { lower: false });               // "Привет-МИР"
 * slugify("你好 世界", { separator: "_" });                 // "你好_世界"
 * slugify("สวัสดี โลก", { separator: "" });                  // "สวัสดีโลก"
 * slugify("Hello World", { separator: "", lower: false }); // "HelloWorld"
 * slugify("", { separator: "_" });                         // ""
 * slugify(null, { separator: "_" });                       // ""
 * slugify(undefined, { separator: "_" });                  // ""
 */
export function slugify(value: string | null | undefined, options: SlugifyOptions): string;

export function slugify(value: string | null | undefined, options?: SlugifyOptions): string {
  if (!hasLength(value)) {
    return EMPTY;
  }

  const { separator = HYPHEN, lower = true }: SlugifyOptions = options ?? {};

  let result: string = value.normalize("NFD").replace(DIACRITICS_REGEX, EMPTY).normalize("NFC");

  if (lower) {
    result = result.toLowerCase();
  }

  result = separator.includes(DOLLAR_SIGN)
    ? result.replace(NON_ALPHANUMERIC_REGEX, (): string => separator)
    : result.replace(NON_ALPHANUMERIC_REGEX, separator);

  return trimSeparator(result, separator);
}
