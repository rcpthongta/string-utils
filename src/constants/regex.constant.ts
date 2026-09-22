/**
 * Matches one or more consecutive whitespace characters.
 */
export const CONSECUTIVE_WHITESPACE_REGEX: RegExp = /\s+/g;

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
