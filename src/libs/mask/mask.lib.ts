import { ASTERISK, EMPTY, HASH, UNICODE_DIGIT_REGEX, UNICODE_LETTER_REGEX } from "../../constants";
import { CharacterSegmentMode } from "../../types";

import { hasLength } from "../has-length";

/**
 * A reusable masking function returned by {@link createMask}.
 *
 * @param value - The string to mask, or `null` or `undefined`.
 * @returns The formatted string, or an empty string when `value` is empty, `null`, or `undefined`.
 */
export type MaskFunction = (value: string | null | undefined) => string;

/**
 * Configuration options for {@link mask} and {@link createMask}.
 */
export interface MaskOptions {
  /**
   * Additional mask patterns to evaluate when the primary pattern does not match.
   *
   * Patterns are evaluated in declaration order.
   *
   * @default []
   */
  fallbackPatterns?: string[];

  /**
   * Determines how characters are counted and segmented.
   *
   * @default "utf16"
   */
  mode?: CharacterSegmentMode;
}

interface CompiledPatternUtf16 {
  readonly pattern: string;
  readonly totalSlots: number;
}

interface CompiledPatternSegments {
  readonly patternSegments: readonly string[];
  readonly totalSlots: number;
}

const LETTER_A: string = "A";
const CODE_HASH: number = 35;
const CODE_ASTERISK: number = 42;
const CODE_LETTER_A: number = 65;
const CODE_ZERO: number = 48;
const CODE_NINE: number = 57;
const CODE_UPPER_A: number = 65;
const CODE_UPPER_Z: number = 90;
const CODE_LOWER_A: number = 97;
const CODE_LOWER_Z: number = 122;
const ASCII_MAX: number = 127;

let graphemeSegmenter: Intl.Segmenter | undefined;

/**
 * Lazily creates the grapheme segmenter used by `"grapheme"` mode.
 */
function getGraphemeSegmenter(): Intl.Segmenter {
  if (!graphemeSegmenter) {
    graphemeSegmenter = new Intl.Segmenter(undefined, { granularity: "grapheme" });
  }

  return graphemeSegmenter;
}

/**
 * Determines whether a character is a supported mask slot token.
 *
 * Supported tokens are `#`, `A`, and `*`.
 */
function isSlotToken(token: string): boolean {
  return token === HASH || token === LETTER_A || token === ASTERISK;
}

/**
 * Determines whether a character represents a decimal digit.
 *
 * Supports ASCII digits (`0-9`) and Unicode decimal digits (`\p{Nd}`).
 */
function isDigit(char: string): boolean {
  const charCode: number = char.charCodeAt(0);

  if (charCode >= CODE_ZERO && charCode <= CODE_NINE) {
    return true;
  }

  return charCode > ASCII_MAX && UNICODE_DIGIT_REGEX.test(char);
}

/**
 * Determines whether a character represents a letter or combining mark.
 *
 * Supports ASCII letters (`a-z`, `A-Z`) and Unicode letters or marks (`[\p{L}\p{M}]`).
 */
function isLetter(char: string): boolean {
  const charCode: number = char.charCodeAt(0);

  if (
    (charCode >= CODE_UPPER_A && charCode <= CODE_UPPER_Z) ||
    (charCode >= CODE_LOWER_A && charCode <= CODE_LOWER_Z)
  ) {
    return true;
  }

  return charCode > ASCII_MAX && UNICODE_LETTER_REGEX.test(char);
}

/**
 * Determines whether the character at the specified UTF-16 index is a decimal digit.
 */
function isDigitAt(value: string, charIndex: number): boolean {
  const charCode: number = value.charCodeAt(charIndex);

  if (charCode >= CODE_ZERO && charCode <= CODE_NINE) {
    return true;
  }

  return charCode > ASCII_MAX && UNICODE_DIGIT_REGEX.test(value[charIndex]);
}

/**
 * Determines whether the character at the specified UTF-16 index is a letter or combining mark.
 */
function isLetterAt(value: string, charIndex: number): boolean {
  const charCode: number = value.charCodeAt(charIndex);

  if (
    (charCode >= CODE_UPPER_A && charCode <= CODE_UPPER_Z) ||
    (charCode >= CODE_LOWER_A && charCode <= CODE_LOWER_Z)
  ) {
    return true;
  }

  return charCode > ASCII_MAX && UNICODE_LETTER_REGEX.test(value[charIndex]);
}

/**
 * Advances to the next decimal digit in a UTF-16 string.
 */
function advanceToDigit(value: string, startIndex: number, length: number): number {
  let currentIndex: number = startIndex;

  while (currentIndex < length && !isDigitAt(value, currentIndex)) {
    currentIndex++;
  }

  return currentIndex;
}

/**
 * Advances to the next letter in a UTF-16 string.
 */
function advanceToLetter(value: string, startIndex: number, length: number): number {
  let currentIndex: number = startIndex;

  while (currentIndex < length && !isLetterAt(value, currentIndex)) {
    currentIndex++;
  }

  return currentIndex;
}

/**
 * Advances to the next value index matching a mask token in UTF-16 mode.
 */
function advanceSlotIndex(patternCharCode: number, value: string, startIndex: number, length: number): number {
  if (patternCharCode === CODE_HASH) {
    return advanceToDigit(value, startIndex, length);
  }

  if (patternCharCode === CODE_LETTER_A) {
    return advanceToLetter(value, startIndex, length);
  }

  return startIndex;
}

/**
 * Advances to the next value segment matching a mask token in segmented mode.
 */
function advanceSlotSegmentIndex(
  patternToken: string,
  valueSegments: readonly string[],
  startIndex: number,
  length: number
): number {
  if (patternToken === HASH) {
    let currentIndex: number = startIndex;

    while (currentIndex < length && !isDigit(valueSegments[currentIndex])) {
      currentIndex++;
    }

    return currentIndex;
  }

  if (patternToken === LETTER_A) {
    let currentIndex: number = startIndex;

    while (currentIndex < length && !isLetter(valueSegments[currentIndex])) {
      currentIndex++;
    }

    return currentIndex;
  }

  return startIndex;
}

/**
 * Verifies that all literal segments match between the pattern and value.
 */
function matchLiteralSegments(
  patternSegments: readonly string[],
  valueSegments: readonly string[],
  length: number
): boolean {
  for (let segmentIndex: number = 0; segmentIndex < length; segmentIndex++) {
    if (patternSegments[segmentIndex] !== valueSegments[segmentIndex]) {
      return false;
    }
  }

  return true;
}

/**
 * Handles matching for patterns that contain no mask slots.
 */
function tryMaskEmptySlotSegments(
  patternSegments: readonly string[],
  patternLength: number,
  valueSegments: readonly string[],
  valueLength: number
): string | null {
  if (patternLength !== valueLength || !matchLiteralSegments(patternSegments, valueSegments, patternLength)) {
    return null;
  }

  return valueSegments.join(EMPTY);
}

/**
 * Counts mask slot tokens (`#`, `A`, and `*`) in a UTF-16 pattern.
 */
function countSlotsInString(pattern: string): number {
  let totalSlots: number = 0;

  for (let charIndex: number = 0; charIndex < pattern.length; charIndex++) {
    const charCode: number = pattern.charCodeAt(charIndex);

    if (charCode === CODE_HASH || charCode === CODE_LETTER_A || charCode === CODE_ASTERISK) {
      totalSlots++;
    }
  }

  return totalSlots;
}

/**
 * Counts mask slot tokens (`#`, `A`, and `*`) in a segmented pattern.
 */
function countSlotsInSegments(segments: readonly string[]): number {
  let totalSlots: number = 0;

  for (let segmentIndex: number = 0; segmentIndex < segments.length; segmentIndex++) {
    if (isSlotToken(segments[segmentIndex])) {
      totalSlots++;
    }
  }

  return totalSlots;
}

/**
 * Splits a string into user-perceived grapheme clusters.
 */
function splitGraphemes(value: string): string[] {
  const segments: string[] = [];

  for (const segmentData of getGraphemeSegmenter().segment(value)) {
    segments.push(segmentData.segment);
  }

  return segments;
}

/**
 * Splits a string into Unicode code points.
 */
function splitCodePoints(value: string): string[] {
  return Array.from(value);
}

/**
 * Compiles a UTF-16 mask pattern with pre-computed slot metadata.
 */
function compilePatternUtf16(pattern: string): CompiledPatternUtf16 {
  return {
    pattern,
    totalSlots: countSlotsInString(pattern)
  };
}

/**
 * Compiles a segmented mask pattern with pre-computed slot metadata.
 */
function compilePatternSegments(patternSegments: string[]): CompiledPatternSegments {
  return {
    patternSegments,
    totalSlots: countSlotsInSegments(patternSegments)
  };
}

/**
 * Checks whether a literal pattern code unit matches the current UTF-16 value code unit.
 */
function isCharLiteralMatched(
  value: string,
  valueIndex: number,
  valueLength: number,
  patternCharCode: number
): boolean {
  return valueIndex < valueLength && value.charCodeAt(valueIndex) === patternCharCode;
}

/**
 * Checks whether a literal pattern segment matches the current value segment.
 */
function isSegmentLiteralMatched(
  valueSegments: readonly string[],
  valueIndex: number,
  valueLength: number,
  patternToken: string
): boolean {
  return valueIndex < valueLength && valueSegments[valueIndex] === patternToken;
}

/**
 * Attempts to apply a UTF-16 mask pattern directly to a string.
 *
 * `#` matches a decimal digit, `A` matches a letter or combining mark, and `*` matches any single UTF-16 code unit. Other characters are treated as literals.
 */
function tryMaskUtf16Raw(pattern: string, totalSlots: number, value: string): string | null {
  if (totalSlots === 0) {
    return pattern === value ? pattern : null;
  }

  const valueLength: number = value.length;

  if (valueLength < totalSlots) {
    return null;
  }

  const patternLength: number = pattern.length;
  let result: string = EMPTY;
  let valueIndex: number = 0;
  let slotsFilled: number = 0;

  for (let patternIndex: number = 0; patternIndex < patternLength; patternIndex++) {
    const patternCharCode: number = pattern.charCodeAt(patternIndex);

    if (patternCharCode === CODE_HASH || patternCharCode === CODE_LETTER_A || patternCharCode === CODE_ASTERISK) {
      valueIndex = advanceSlotIndex(patternCharCode, value, valueIndex, valueLength);

      if (valueIndex >= valueLength) {
        return null;
      }

      result += value[valueIndex];
      valueIndex++;
      slotsFilled++;
    } else {
      result += pattern[patternIndex];

      if (isCharLiteralMatched(value, valueIndex, valueLength, patternCharCode)) {
        valueIndex++;
      }
    }
  }

  return slotsFilled !== totalSlots || valueIndex < valueLength ? null : result;
}

/**
 * Attempts to apply a pre-compiled UTF-16 mask pattern to a string.
 */
function tryMaskUtf16(compiled: CompiledPatternUtf16, value: string): string | null {
  return tryMaskUtf16Raw(compiled.pattern, compiled.totalSlots, value);
}

/**
 * Attempts to apply a segmented mask pattern directly to segmented input.
 *
 * `#` matches a decimal digit, `A` matches a letter or combining mark, and `*` matches any single segment. Other segments are treated as literals.
 */
function tryMaskSegmentsRaw(
  patternSegments: readonly string[],
  totalSlots: number,
  valueSegments: readonly string[]
): string | null {
  const patternLength: number = patternSegments.length;
  const valueLength: number = valueSegments.length;

  if (totalSlots === 0) {
    return tryMaskEmptySlotSegments(patternSegments, patternLength, valueSegments, valueLength);
  }

  if (valueLength < totalSlots) {
    return null;
  }

  let result: string = EMPTY;
  let valueIndex: number = 0;
  let slotsFilled: number = 0;

  for (let patternIndex: number = 0; patternIndex < patternLength; patternIndex++) {
    const patternToken: string = patternSegments[patternIndex];

    if (isSlotToken(patternToken)) {
      valueIndex = advanceSlotSegmentIndex(patternToken, valueSegments, valueIndex, valueLength);

      if (valueIndex >= valueLength) {
        return null;
      }

      result += valueSegments[valueIndex];
      valueIndex++;
      slotsFilled++;
    } else {
      result += patternToken;

      if (isSegmentLiteralMatched(valueSegments, valueIndex, valueLength, patternToken)) {
        valueIndex++;
      }
    }
  }

  if (slotsFilled !== totalSlots || valueIndex < valueLength) {
    return null;
  }

  return result;
}

/**
 * Attempts to apply a pre-compiled segmented mask pattern to segmented input.
 */
function tryMaskSegments(compiled: CompiledPatternSegments, valueSegments: readonly string[]): string | null {
  return tryMaskSegmentsRaw(compiled.patternSegments, compiled.totalSlots, valueSegments);
}

/**
 * Executes pre-compiled UTF-16 patterns in declaration order.
 */
function executeMaskUtf16(compiledPatterns: readonly CompiledPatternUtf16[], value: string): string {
  const totalPatterns: number = compiledPatterns.length;

  for (let patternIndex: number = 0; patternIndex < totalPatterns; patternIndex++) {
    const formatted: string | null = tryMaskUtf16(compiledPatterns[patternIndex], value);

    if (formatted !== null) {
      return formatted;
    }
  }

  return value;
}

/**
 * Executes pre-compiled segmented patterns in declaration order.
 */
function executeMaskSegments(
  compiledPatterns: readonly CompiledPatternSegments[],
  valueSegments: readonly string[],
  value: string
): string {
  const totalPatterns: number = compiledPatterns.length;

  for (let patternIndex: number = 0; patternIndex < totalPatterns; patternIndex++) {
    const formatted: string | null = tryMaskSegments(compiledPatterns[patternIndex], valueSegments);

    if (formatted !== null) {
      return formatted;
    }
  }

  return value;
}

/**
 * Collects non-empty primary and fallback mask patterns in declaration order.
 */
function collectValidPatterns(pattern: string, fallbackPatterns: readonly string[]): string[] {
  const validPatterns: string[] = [];

  if (pattern.length > 0) {
    validPatterns.push(pattern);
  }

  const fallbackCount: number = fallbackPatterns.length;

  for (let fallbackIndex: number = 0; fallbackIndex < fallbackCount; fallbackIndex++) {
    const fallbackItem: string = fallbackPatterns[fallbackIndex];

    if (fallbackItem.length > 0) {
      validPatterns.push(fallbackItem);
    }
  }

  return validPatterns;
}

/**
 * Formats a string according to a mask pattern.
 *
 * Supported slot tokens:
 * - `#`: Decimal digit (`0-9` or `\p{Nd}`).
 * - `A`: Letter or combining mark (`a-z`, `A-Z`, or `[\p{L}\p{M}]`).
 * - `*`: Wildcard character.
 *
 * Returns the original string when `value` does not match the pattern.
 * Returns an empty string when `value` is empty, `null`, or `undefined`.
 *
 * @param value - The string to mask, or `null` or `undefined`.
 * @param pattern - The mask template pattern.
 * @returns The formatted string, or an empty string when `value` is empty, `null`, or `undefined`.
 *
 * @example
 *
 * mask("0812345678", "(###) ###-####");            // "(081) 234-5678"
 * mask("1234567890123456", "#### #### #### ####"); // "1234 5678 9012 3456"
 * mask("ABC1234", "AAA-####");                     // "ABC-1234"
 * mask("K9V1B2", "A#A #A#");                       // "K9V 1B2"
 * mask("12345", "(###) ###-####");                 // "12345"
 * mask("", "(###) ###-####");                      // ""
 * mask(null, "(###) ###-####");                    // ""
 * mask(undefined, "(###) ###-####");               // ""
 */
export function mask(value: string | null | undefined, pattern: string): string;

/**
 * Formats a string according to a mask pattern using custom options.
 *
 * The `mode` option determines how characters are counted.
 *
 * Returns the original string when `value` does not match the pattern or any fallback pattern.
 * Returns an empty string when `value` is empty, `null`, or `undefined`.
 *
 * @param value - The string to mask, or `null` or `undefined`.
 * @param pattern - The primary mask template pattern.
 * @param options - Masking options.
 * @returns The formatted string, or an empty string when `value` is empty, `null`, or `undefined`.
 *
 * @example
 *
 * mask("021234567", "(###) ###-####", { fallbackPatterns: ["(##) ###-####"] });  // "(02) 123-4567"
 * mask("0812345678", "(###) ###-####", { fallbackPatterns: ["(##) ###-####"] }); // "(081) 234-5678"
 * mask("12345", "(###) ###-####", { fallbackPatterns: ["(##) ###-####"] });      // "12345"
 * mask("😀😀123", "**-###", { mode: "codePoint" });                             // "😀😀-123"
 * mask("", "(###) ###-####");                                                    // ""
 * mask(null, "(###) ###-####");                                                  // ""
 * mask(undefined, "(###) ###-####");                                             // ""
 */
export function mask(value: string | null | undefined, pattern: string, options: MaskOptions): string;

export function mask(value: string | null | undefined, pattern: string, options?: MaskOptions): string {
  if (!hasLength(value)) {
    return EMPTY;
  }

  if (!options) {
    if (pattern.length === 0) {
      return value;
    }

    const totalSlots: number = countSlotsInString(pattern);
    const masked: string | null = tryMaskUtf16Raw(pattern, totalSlots, value);

    return masked ?? value;
  }

  const { fallbackPatterns, mode = "utf16" }: MaskOptions = options;

  if (!fallbackPatterns || fallbackPatterns.length === 0) {
    if (pattern.length === 0) {
      return value;
    }

    if (mode === "utf16") {
      const totalSlots: number = countSlotsInString(pattern);
      const masked: string | null = tryMaskUtf16Raw(pattern, totalSlots, value);

      return masked ?? value;
    }

    if (mode === "codePoint") {
      const patternSegments: string[] = splitCodePoints(pattern);
      const totalSlots: number = countSlotsInSegments(patternSegments);
      const valueSegments: string[] = splitCodePoints(value);
      const masked: string | null = tryMaskSegmentsRaw(patternSegments, totalSlots, valueSegments);

      return masked ?? value;
    }

    const patternSegments: string[] = splitGraphemes(pattern);
    const totalSlots: number = countSlotsInSegments(patternSegments);
    const valueSegments: string[] = splitGraphemes(value);
    const masked: string | null = tryMaskSegmentsRaw(patternSegments, totalSlots, valueSegments);

    return masked ?? value;
  }

  const allPatterns: string[] = collectValidPatterns(pattern, fallbackPatterns);

  if (allPatterns.length === 0) {
    return value;
  }

  if (mode === "grapheme") {
    const compiledGraphemes: CompiledPatternSegments[] = allPatterns.map(splitGraphemes).map(compilePatternSegments);

    return executeMaskSegments(compiledGraphemes, splitGraphemes(value), value);
  }

  if (mode === "codePoint") {
    const compiledCodePoints: CompiledPatternSegments[] = allPatterns.map(splitCodePoints).map(compilePatternSegments);

    return executeMaskSegments(compiledCodePoints, splitCodePoints(value), value);
  }

  const compiledUtf16: CompiledPatternUtf16[] = allPatterns.map(compilePatternUtf16);

  return executeMaskUtf16(compiledUtf16, value);
}

/**
 * Creates a reusable masking function for a mask pattern.
 *
 * Returns the original string when `value` does not match the pattern.
 * Returns an empty string when `value` is empty, `null`, or `undefined`.
 *
 * @param pattern - The mask template pattern.
 * @returns A function that masks input strings according to the pattern.
 *
 * @example
 *
 * const maskPhone = createMask("(###) ###-####");
 *
 * maskPhone("0812345678"); // "(081) 234-5678"
 * maskPhone("12345");      // "12345"
 * maskPhone("");           // ""
 * maskPhone(null);         // ""
 * maskPhone(undefined);    // ""
 */
export function createMask(pattern: string): MaskFunction;

/**
 * Creates a reusable masking function using custom options.
 *
 * The `mode` option determines how characters are counted.
 *
 * Returns the original string when `value` does not match the pattern or any fallback pattern.
 * Returns an empty string when `value` is empty, `null`, or `undefined`.
 *
 * @param pattern - The primary mask template pattern.
 * @param options - Masking options.
 * @returns A function that masks input strings according to the pattern and options.
 *
 * @example
 *
 * const maskPhone = createMask("(###) ###-####", { fallbackPatterns: ["(##) ###-####"] });
 *
 * maskPhone("021234567");  // "(02) 123-4567"
 * maskPhone("0812345678"); // "(081) 234-5678"
 * maskPhone("12345");      // "12345"
 * maskPhone("");           // ""
 * maskPhone(null);         // ""
 * maskPhone(undefined);    // ""
 */
export function createMask(pattern: string, options: MaskOptions): MaskFunction;

export function createMask(pattern: string, options?: MaskOptions): MaskFunction {
  const { fallbackPatterns, mode = "utf16" }: MaskOptions = options ?? {};

  if (!fallbackPatterns || fallbackPatterns.length === 0) {
    if (pattern.length === 0) {
      return (value: string | null | undefined): string => {
        return value ?? EMPTY;
      };
    }

    if (mode === "utf16") {
      const totalSlots: number = countSlotsInString(pattern);

      return (value: string | null | undefined): string => {
        if (!hasLength(value)) {
          return EMPTY;
        }

        const masked: string | null = tryMaskUtf16Raw(pattern, totalSlots, value);

        return masked ?? value;
      };
    }

    if (mode === "codePoint") {
      const patternSegments: string[] = splitCodePoints(pattern);
      const totalSlots: number = countSlotsInSegments(patternSegments);

      return (value: string | null | undefined): string => {
        if (!hasLength(value)) {
          return EMPTY;
        }

        const valueSegments: string[] = splitCodePoints(value);
        const masked: string | null = tryMaskSegmentsRaw(patternSegments, totalSlots, valueSegments);

        return masked ?? value;
      };
    }

    const patternSegments: string[] = splitGraphemes(pattern);
    const totalSlots: number = countSlotsInSegments(patternSegments);

    return (value: string | null | undefined): string => {
      if (!hasLength(value)) {
        return EMPTY;
      }

      const valueSegments: string[] = splitGraphemes(value);
      const masked: string | null = tryMaskSegmentsRaw(patternSegments, totalSlots, valueSegments);

      return masked ?? value;
    };
  }

  const allPatterns: string[] = collectValidPatterns(pattern, fallbackPatterns);

  if (allPatterns.length === 0) {
    return (value: string | null | undefined): string => {
      return value ?? EMPTY;
    };
  }

  if (mode === "grapheme") {
    const compiledGraphemes: CompiledPatternSegments[] = allPatterns.map(splitGraphemes).map(compilePatternSegments);

    return (value: string | null | undefined): string => {
      return !hasLength(value) ? EMPTY : executeMaskSegments(compiledGraphemes, splitGraphemes(value), value);
    };
  }

  if (mode === "codePoint") {
    const compiledCodePoints: CompiledPatternSegments[] = allPatterns.map(splitCodePoints).map(compilePatternSegments);

    return (value: string | null | undefined): string => {
      return !hasLength(value) ? EMPTY : executeMaskSegments(compiledCodePoints, splitCodePoints(value), value);
    };
  }

  const compiledUtf16: CompiledPatternUtf16[] = allPatterns.map(compilePatternUtf16);

  return (value: string | null | undefined): string => {
    return !hasLength(value) ? EMPTY : executeMaskUtf16(compiledUtf16, value);
  };
}
