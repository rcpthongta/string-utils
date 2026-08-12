import type { MaskOptions } from "../interfaces";

/**
 * Masks part of a string with a specified mask character.
 *
 * @remarks
 * Preserves the original string semantics, including whitespace-only strings.
 * Unlike text validation utilities, this function only treats `null`,
 * `undefined`, and empty strings as empty input.
 *
 * Negative `unmaskedStart` and `unmaskedEnd` values are normalized to `0`
 * instead of throwing an error.
 *
 * @param str - The string to mask.
 * @param options - The masking options.
 * @returns The masked string, or an empty string when the input is `null`,
 * `undefined`, or empty.
 *
 * @example
 *
 * mask("0812345678")                                              // "**********"
 * mask("0812345678", { unmaskedStart: 3, unmaskedEnd: 2 });       // "081*****78"
 * mask("1234567890123456", { unmaskedStart: 4, unmaskedEnd: 4 }); // "1234********3456"
 * mask("   ", { unmaskedStart: 1 });                              // " **"
 * mask("", { unmaskedStart: 2 });                                 // ""
 * mask(null);                                                     // ""
 * mask(undefined);                                                // ""
 */
export function mask(str: string | null | undefined, options?: MaskOptions): string {
  if (str == null || str.length === 0) return "";

  const maskChar: string = options?.maskChar ?? "*";
  const unmaskedStart: number = Math.max(0, options?.unmaskedStart ?? 0);
  const unmaskedEnd: number = Math.max(0, options?.unmaskedEnd ?? 0);
  const length: number = str.length;

  if (unmaskedStart + unmaskedEnd >= length) return str;

  const maskedLength: number = length - unmaskedStart - unmaskedEnd;

  return str.slice(0, unmaskedStart) + maskChar.repeat(maskedLength) + (unmaskedEnd > 0 ? str.slice(-unmaskedEnd) : "");
}
