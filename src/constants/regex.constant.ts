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
