/**
 * Matches one or more consecutive whitespace characters.
 */
export const CONSECUTIVE_WHITESPACE_REGEX: RegExp = /\s+/g;

/**
 * Matches Unicode combining diacritical marks in the U+0300–U+036F range.
 */
export const DIACRITICS_REGEX: RegExp = /[\u0300-\u036f]/g;

/**
 * Matches indexed format placeholders with optional dot-separated property paths.
 *
 * Captures the full path inside the braces (e.g., `"0"`, `"0.name"`, `"1.items.0.label"`).
 */
export const FORMAT_PLACEHOLDER_REGEX: RegExp = /\{(\d+(?:\.\w+)*)\}/g;

/**
 * Matches one or more consecutive characters that are not Unicode letters, combining marks, or numbers.
 */
export const NON_ALPHANUMERIC_REGEX: RegExp = /[^\p{L}\p{M}\p{N}]+/gu;

/**
 * Matches strings that contain whitespace requiring normalization.
 *
 * This includes non-space whitespace characters, consecutive spaces, leading spaces, and trailing spaces.
 */
export const WHITESPACE_TEST_REGEX: RegExp = /[^\S ]| {2,}|^ | $/;

/**
 * Matches individual words, acronyms, and Unicode number sequences.
 *
 * The pattern recognizes:
 * - Cased and non-cased words, including letters with combining marks.
 * - Acronyms consisting of consecutive uppercase letters.
 * - Unicode number sequences.
 */
export const WORD_REGEX: RegExp =
  /(?:\p{Lu}\p{M}*)?[\p{Ll}\p{Lo}][\p{Ll}\p{Lo}\p{M}]*|\p{Lu}[\p{Lu}\p{M}]*(?![\p{Ll}\p{Lo}])|\p{N}+/gu;
