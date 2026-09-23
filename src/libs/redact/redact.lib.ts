import { ASTERISK, EMPTY } from "../../constants";
import { CharacterSegmentMode } from "../../types";

import { hasLength } from "../has-length";

/**
 * Configuration options for {@link redact}.
 */
export interface RedactOptions {
  /**
   * Number of visible characters to preserve at the start of the string.
   *
   * Non-finite, negative, and zero values default to `0`.
   * Fractional values are truncated toward zero.
   *
   * @default 0
   */
  visibleStart?: number;

  /**
   * Number of visible characters to preserve at the end of the string.
   *
   * Non-finite, negative, and zero values default to `0`.
   * Fractional values are truncated toward zero.
   *
   * @default 0
   */
  visibleEnd?: number;

  /**
   * String used to replace each redacted character.
   *
   * @default "*"
   */
  replacement?: string;

  /**
   * Determines how characters are counted and segmented.
   *
   * @default "utf16"
   */
  mode?: CharacterSegmentMode;
}

const SURROGATE_LEAD_MIN: number = 0xd800;
const SURROGATE_LEAD_MAX: number = 0xdbff;
const SURROGATE_TRAIL_MIN: number = 0xdc00;
const SURROGATE_TRAIL_MAX: number = 0xdfff;

let graphemeSegmenter: Intl.Segmenter | undefined;

/**
 * Lazily creates the `Intl.Segmenter` used for grapheme segmentation.
 */
function getGraphemeSegmenter(): Intl.Segmenter {
  if (!graphemeSegmenter) {
    graphemeSegmenter = new Intl.Segmenter(undefined, { granularity: "grapheme" });
  }

  return graphemeSegmenter;
}

/**
 * Checks whether a UTF-16 code unit is a high surrogate.
 */
function isLeadSurrogate(charCode: number): boolean {
  return charCode >= SURROGATE_LEAD_MIN && charCode <= SURROGATE_LEAD_MAX;
}

/**
 * Checks whether a UTF-16 code unit is a low surrogate.
 */
function isTrailSurrogate(charCode: number): boolean {
  return charCode >= SURROGATE_TRAIL_MIN && charCode <= SURROGATE_TRAIL_MAX;
}

/**
 * Converts a visibility count to a non-negative integer.
 *
 * Fractional values are truncated toward zero. Invalid values become `0`.
 */
function toValidCount(value: number | undefined): number {
  return typeof value === "number" && value > 0 && Number.isFinite(value) ? Math.trunc(value) : 0;
}

/**
 * Adjusts the start boundary forward to prevent splitting a UTF-16 surrogate pair.
 */
function adjustSurrogateStart(value: string, visibleStart: number, length: number): number {
  if (visibleStart > 0 && visibleStart < length) {
    const previousCode: number = value.charCodeAt(visibleStart - 1);

    if (isLeadSurrogate(previousCode)) {
      const currentCode: number = value.charCodeAt(visibleStart);

      if (isTrailSurrogate(currentCode)) {
        return visibleStart + 1;
      }
    }
  }

  return visibleStart;
}

/**
 * Adjusts the end boundary backward to prevent splitting a UTF-16 surrogate pair.
 */
function adjustSurrogateEnd(value: string, visibleEnd: number, length: number): number {
  if (visibleEnd > 0 && visibleEnd < length) {
    const cutIndex: number = length - visibleEnd;
    const currentCode: number = value.charCodeAt(cutIndex);

    if (isTrailSurrogate(currentCode)) {
      const previousCode: number = value.charCodeAt(cutIndex - 1);

      if (isLeadSurrogate(previousCode)) {
        return visibleEnd + 1;
      }
    }
  }

  return visibleEnd;
}

/**
 * Returns the UTF-16 code unit length of the Unicode code point at the specified index.
 */
function getCodePointStep(value: string, charIndex: number, length: number): number {
  const code: number = value.charCodeAt(charIndex);

  if (isLeadSurrogate(code) && charIndex + 1 < length) {
    const nextCode: number = value.charCodeAt(charIndex + 1);

    if (isTrailSurrogate(nextCode)) {
      return 2;
    }
  }

  return 1;
}

/**
 * Counts the total Unicode code points in a string.
 */
function countCodePoints(value: string, length: number): number {
  let charIndex: number = 0;
  let totalCount: number = 0;

  while (charIndex < length) {
    totalCount++;
    charIndex += getCodePointStep(value, charIndex, length);
  }

  return totalCount;
}

/**
 * Collects the starting UTF-16 index of each Unicode code point in a string.
 */
function collectCodePointIndices(value: string, length: number): number[] {
  const indices: number[] = [];

  let charIndex: number = 0;

  while (charIndex < length) {
    indices.push(charIndex);

    charIndex += getCodePointStep(value, charIndex, length);
  }

  return indices;
}

/**
 * Redacts a string using Unicode code point boundaries.
 */
function redactCodePoint(
  value: string,
  visibleStart: number,
  visibleEnd: number,
  replacement: string,
  length: number
): string {
  if (visibleStart === 0 && visibleEnd === 0) {
    return replacement.repeat(countCodePoints(value, length));
  }

  const indices: number[] = collectCodePointIndices(value, length);
  const totalCodePoints: number = indices.length;

  if (visibleStart + visibleEnd >= totalCodePoints) {
    return value;
  }

  const redactCount: number = totalCodePoints - visibleStart - visibleEnd;

  if (visibleStart > 0) {
    const prefixEndIndex: number = indices[visibleStart];

    if (visibleEnd > 0) {
      return (
        value.slice(0, prefixEndIndex) +
        replacement.repeat(redactCount) +
        value.slice(indices[totalCodePoints - visibleEnd])
      );
    }

    return value.slice(0, prefixEndIndex) + replacement.repeat(redactCount);
  }

  return replacement.repeat(redactCount) + value.slice(indices[totalCodePoints - visibleEnd]);
}

/**
 * Counts the grapheme clusters in a string.
 */
function countGraphemes(value: string): number {
  const iterator: Intl.SegmentIterator<Intl.SegmentData> = getGraphemeSegmenter().segment(value)[Symbol.iterator]();

  let totalSegments: number = 0;

  while (!iterator.next().done) {
    totalSegments++;
  }

  return totalSegments;
}

/**
 * Collects the UTF-16 start index of each grapheme cluster in a string.
 */
function collectGraphemeIndices(value: string): number[] {
  const indices: number[] = [];

  for (const segmentData of getGraphemeSegmenter().segment(value)) {
    indices.push(segmentData.index);
  }

  return indices;
}

/**
 * Redacts a string using grapheme cluster boundaries.
 */
function redactGrapheme(value: string, visibleStart: number, visibleEnd: number, replacement: string): string {
  if (visibleStart === 0 && visibleEnd === 0) {
    return replacement.repeat(countGraphemes(value));
  }

  const indices: number[] = collectGraphemeIndices(value);
  const totalSegments: number = indices.length;

  if (visibleStart + visibleEnd >= totalSegments) {
    return value;
  }

  const redactCount: number = totalSegments - visibleStart - visibleEnd;

  if (visibleStart > 0) {
    const prefixEndIndex: number = indices[visibleStart];

    if (visibleEnd > 0) {
      return (
        value.slice(0, prefixEndIndex) +
        replacement.repeat(redactCount) +
        value.slice(indices[totalSegments - visibleEnd])
      );
    }

    return value.slice(0, prefixEndIndex) + replacement.repeat(redactCount);
  }

  return replacement.repeat(redactCount) + value.slice(indices[totalSegments - visibleEnd]);
}

/**
 * Redacts a string using UTF-16 code units while preventing split surrogate pairs.
 */
function redactUtf16(
  value: string,
  visibleStart: number,
  visibleEnd: number,
  replacement: string,
  length: number
): string {
  const totalVisible: number = visibleStart + visibleEnd;

  if (totalVisible >= length) {
    return value;
  }

  const safeStart: number = adjustSurrogateStart(value, visibleStart, length);
  const safeEnd: number = adjustSurrogateEnd(value, visibleEnd, length);
  const safeTotal: number = safeStart + safeEnd;

  if (safeTotal >= length) {
    return value;
  }

  const redactLength: number = length - safeTotal;

  if (safeStart > 0) {
    return safeEnd > 0
      ? value.slice(0, safeStart) + replacement.repeat(redactLength) + value.slice(length - safeEnd)
      : value.slice(0, safeStart) + replacement.repeat(redactLength);
  }

  return safeEnd > 0 ? replacement.repeat(redactLength) + value.slice(length - safeEnd) : replacement.repeat(length);
}

/**
 * Redacts every character in a string with `*`.
 *
 * Each character is replaced with `*`.
 * Returns an empty string when `value` is empty, `null`, or `undefined`.
 *
 * @param value - The string to redact, or `null` or `undefined`.
 * @returns The redacted string, or an empty string when `value` is empty, `null`, or `undefined`.
 *
 * @example
 *
 * redact("0812345678");  // "**********"
 * redact("Hello World"); // "***********"
 * redact("");            // ""
 * redact(null);          // ""
 * redact(undefined);     // ""
 */
export function redact(value: string | null | undefined): string;

/**
 * Redacts every character in a string using a custom replacement string.
 *
 * The replacement string is repeated once for each character.
 * Returns an empty string when `value` is empty, `null`, or `undefined`.
 *
 * @param value - The string to redact, or `null` or `undefined`.
 * @param replacement - The string used to replace each redacted character.
 * @returns The redacted string, or an empty string when `value` is empty, `null`, or `undefined`.
 *
 * @example
 *
 * redact("0812345678", "#");  // "##########"
 * redact("Hello World", "+"); // "+++++++++++"
 * redact("12345", "XX");      // "XXXXXXXXXX"
 * redact("", "#");            // ""
 * redact(null, "#");          // ""
 * redact(undefined, "#");     // ""
 */
export function redact(value: string | null | undefined, replacement: string): string;

/**
 * Redacts a string while preserving a specified number of characters at the beginning.
 *
 * Preserves the first `visibleStart` characters and replaces the rest with `*`.
 * Non-finite, negative, and zero values default to `0`.
 * Fractional values are truncated toward zero.
 *
 * Surrogate pairs at the boundary are preserved without splitting.
 *
 * @param value - The string to redact, or `null` or `undefined`.
 * @param visibleStart - The number of characters to keep visible at the beginning.
 * @returns The partially redacted string, or an empty string when `value` is empty, `null`, or `undefined`.
 *
 * @example
 *
 * redact("0812345678", 2);   // "08********"
 * redact("0812345678", 4);   // "0812******"
 * redact("0812345678", 10);  // "0812345678"
 * redact("0812345678", -1);  // "**********"
 * redact("0812345678", 2.9); // "08********"
 * redact("", 2);             // ""
 * redact(null, 2);           // ""
 * redact(undefined, 2);      // ""
 */
export function redact(value: string | null | undefined, visibleStart: number): string;

/**
 * Redacts a string while preserving the specified number of characters at the beginning and end.
 *
 * The `mode` option determines how characters are counted.
 *
 * Returns the original string when all characters are visible.
 * Returns an empty string when `value` is empty, `null`, or `undefined`.
 *
 * @param value - The string to redact, or `null` or `undefined`.
 * @param options - Redaction options.
 * @returns The redacted string, or an empty string when `value` is empty, `null`, or `undefined`.
 *
 * @example
 *
 * redact("0812345678", { visibleStart: 3, visibleEnd: 2 });                   // "081*****78"
 * redact("0812345678", { visibleStart: 2, replacement: "#" });                // "08########"
 * redact("0812345678", { visibleEnd: 2, replacement: "#" });                  // "########78"
 * redact("1234567890", { visibleStart: 4, visibleEnd: 4, replacement: "X" }); // "1234XX7890"
 * redact("😀😀😀😀", { visibleStart: 1, mode: "codePoint" });               // "😀***"
 * redact("👨‍👩‍👧‍👦👨‍👩‍👧‍👦", { visibleStart: 1, mode: "grapheme" });                     // "👨‍👩‍👧‍👦*"
 * redact("", { visibleStart: 2 });                                            // ""
 * redact(null, { visibleStart: 2 });                                          // ""
 * redact(undefined, { visibleStart: 2 });                                     // ""
 */
export function redact(value: string | null | undefined, options: RedactOptions): string;

export function redact(value: string | null | undefined, options?: string | number | RedactOptions): string {
  if (!hasLength(value)) {
    return EMPTY;
  }

  const length: number = value.length;

  if (options === undefined) {
    return ASTERISK.repeat(length);
  }

  if (typeof options === "string") {
    return options.repeat(length);
  }

  if (typeof options === "number") {
    let visibleStart: number = toValidCount(options);

    if (visibleStart >= length) {
      return value;
    }

    if (visibleStart <= 0) {
      return ASTERISK.repeat(length);
    }

    visibleStart = adjustSurrogateStart(value, visibleStart, length);

    return value.slice(0, visibleStart) + ASTERISK.repeat(length - visibleStart);
  }

  const { visibleStart: startOpt, visibleEnd: endOpt, replacement = ASTERISK, mode = "utf16" }: RedactOptions = options;
  const visibleStart: number = toValidCount(startOpt);
  const visibleEnd: number = toValidCount(endOpt);

  if (mode === "grapheme") {
    return redactGrapheme(value, visibleStart, visibleEnd, replacement);
  }

  if (mode === "codePoint") {
    return redactCodePoint(value, visibleStart, visibleEnd, replacement, length);
  }

  return redactUtf16(value, visibleStart, visibleEnd, replacement, length);
}
