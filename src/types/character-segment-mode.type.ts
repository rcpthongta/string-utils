/**
 * Character segmentation mode used to determine character boundaries.
 *
 * - `"utf16"`: Operates on UTF-16 code units (fastest, default).
 * - `"codePoint"`: Operates on Unicode code points (handles single emojis and surrogate pairs).
 * - `"grapheme"`: Operates on user-perceived grapheme clusters (handles complex emoji sequences and combining marks).
 */
export type CharacterSegmentMode = "utf16" | "codePoint" | "grapheme";
