import { describe, expect, test } from "vitest";

import { redact } from "./redact.lib";

describe("redact", (): void => {
  describe("short ASCII", (): void => {
    test("redacts the entire string with asterisks by default", (): void => {
      expect(redact("0812345678")).toBe("**********");
      expect(redact("Hello World")).toBe("***********");
    });

    test("redacts using a custom replacement string", (): void => {
      expect(redact("0812345678", "#")).toBe("##########");
      expect(redact("12345", "XX")).toBe("XXXXXXXXXX");
    });

    test("preserves the specified number of starting characters", (): void => {
      expect(redact("0812345678", 2)).toBe("08********");
      expect(redact("0812345678", 4)).toBe("0812******");
      expect(redact("0812345678", 10)).toBe("0812345678");
      expect(redact("0812345678", 12)).toBe("0812345678");
      expect(redact("0812345678", -1)).toBe("**********");
      expect(redact("0812345678", 0)).toBe("**********");
      expect(redact("0812345678", Number.NaN)).toBe("**********");
      expect(redact("0812345678", Number.POSITIVE_INFINITY)).toBe("**********");
      expect(redact("0812345678", 2.9)).toBe("08********");
    });
  });

  describe("options object", (): void => {
    test("handles visibleStart and visibleEnd", (): void => {
      expect(redact("0812345678", { visibleStart: 3, visibleEnd: 2 })).toBe("081*****78");
      expect(redact("0812345678", { visibleStart: 2, replacement: "#" })).toBe("08########");
      expect(redact("0812345678", { visibleEnd: 2, replacement: "#" })).toBe("########78");
      expect(redact("0812345678", { visibleEnd: 2 })).toBe("********78");
      expect(redact("0812345678", { visibleStart: 2 })).toBe("08********");
      expect(redact("0812345678", { replacement: "#" })).toBe("##########");
      expect(redact("0812345678", {})).toBe("**********");
      expect(redact("0812345678", { visibleStart: 3, visibleEnd: 2, replacement: "#" })).toBe("081#####78");
      expect(redact("1234567890", { visibleStart: 4, visibleEnd: 4, replacement: "X" })).toBe("1234XX7890");
      expect(redact("12345", { visibleStart: 0, visibleEnd: 0 })).toBe("*****");
      expect(redact("12345", { visibleStart: -2, visibleEnd: -3 })).toBe("*****");
      expect(redact("12345", { visibleStart: Number.NaN, visibleEnd: Number.NaN })).toBe("*****");
      expect(redact("12345", { visibleStart: Number.POSITIVE_INFINITY, visibleEnd: 0 })).toBe("*****");
      expect(redact("12345", { visibleStart: 0, visibleEnd: Number.POSITIVE_INFINITY })).toBe("*****");
      expect(redact("12345", { visibleStart: 2.7, visibleEnd: 1.2 })).toBe("12**5");
    });

    test("returns the original string when visibility exceeds length", (): void => {
      expect(redact("123", { visibleStart: 2, visibleEnd: 2 })).toBe("123");
      expect(redact("123", { visibleStart: 3 })).toBe("123");
      expect(redact("123", { visibleEnd: 3 })).toBe("123");
      expect(redact("123", { visibleStart: 4 })).toBe("123");
    });

    test("returns the original string when surrogate adjustments cover the whole string", (): void => {
      expect(redact("😀a", { visibleStart: 1, visibleEnd: 1 })).toBe("😀a");
      expect(redact("a😀", { visibleStart: 1, visibleEnd: 1 })).toBe("a😀");
      expect(redact("😀😀", { visibleStart: 1, visibleEnd: 1 })).toBe("😀😀");
    });
  });

  describe("Unicode and combining marks", (): void => {
    test("redacts Unicode characters using default UTF-16 mode", (): void => {
      expect(redact("Привет")).toBe("******");
      expect(redact("你好世界")).toBe("****");
      expect(redact("مرحبا")).toBe("*****");
      expect(redact("สวัสดี")).toBe("******");
      expect(redact("café")).toBe("****");
      expect(redact("cafe\u0301")).toBe("*****");
      expect(redact(" \u00A0 \u3000 ")).toBe("*****");
      expect(redact("😀")).toBe("**");
      expect(redact("😀", { mode: "utf16" })).toBe("**");
    });

    test("prevents surrogate pair splitting in default mode", (): void => {
      expect(redact("😀1234", 1)).toBe("😀****");
      expect(redact("1234😀", { visibleEnd: 1 })).toBe("****😀");
      expect(redact("😀1234😀", { visibleStart: 1, visibleEnd: 1 })).toBe("😀****😀");
      expect(redact("\uD83D", { mode: "utf16" })).toBe("*");
      expect(redact("\uDC00", { mode: "utf16" })).toBe("*");
      expect(redact("\uD83D\uD83D", 1)).toBe("\uD83D*");
      expect(redact("\uD83D\uD83D", { visibleEnd: 1 })).toBe("*\uD83D");
      expect(redact("a\uDC00", { visibleEnd: 1 })).toBe("*\uDC00");
    });

    test("redacts per Unicode code point when mode is 'codePoint'", (): void => {
      expect(redact("😀", { mode: "codePoint" })).toBe("*");
      expect(redact("😀😀😀", { mode: "codePoint" })).toBe("***");
      expect(redact("😀😀😀", { mode: "codePoint", replacement: "#" })).toBe("###");
      expect(redact("cafe\u0301", { mode: "codePoint" })).toBe("*****");
      expect(redact("😀123😀", { visibleStart: 1, visibleEnd: 1, mode: "codePoint" })).toBe("😀***😀");
      expect(redact("😀123😀", { visibleStart: 1, mode: "codePoint" })).toBe("😀****");
      expect(redact("😀123😀", { visibleEnd: 1, mode: "codePoint" })).toBe("****😀");
      expect(redact("😀", { visibleStart: 1, mode: "codePoint" })).toBe("😀");
      expect(redact("😀😁", { visibleStart: 1, visibleEnd: 1, mode: "codePoint" })).toBe("😀😁");
      expect(redact("😀😁", { visibleStart: 3, mode: "codePoint" })).toBe("😀😁");
      expect(redact("\uD83D", { mode: "codePoint" })).toBe("*");
      expect(redact("\uD83Da", { mode: "codePoint" })).toBe("**");
    });

    test("redacts per grapheme cluster when mode is 'grapheme'", (): void => {
      expect(redact("😀", { mode: "grapheme" })).toBe("*");
      expect(redact("😀😀😀", { mode: "grapheme" })).toBe("***");
      expect(redact("😀😀😀", { mode: "grapheme", replacement: "#" })).toBe("###");
      expect(redact("👨‍👩‍👧‍👦", { mode: "grapheme" })).toBe("*");
      expect(redact("cafe\u0301", { mode: "grapheme" })).toBe("****");
      expect(redact("😀123😀", { visibleStart: 1, visibleEnd: 1, mode: "grapheme" })).toBe("😀***😀");
      expect(redact("😀123😀", { visibleStart: 1, mode: "grapheme" })).toBe("😀****");
      expect(redact("😀123😀", { visibleEnd: 1, mode: "grapheme" })).toBe("****😀");
      expect(redact("😀", { visibleStart: 1, mode: "grapheme" })).toBe("😀");
      expect(redact("👨‍👩‍👧‍👦👨‍👩‍👧‍👦", { visibleStart: 1, visibleEnd: 1, mode: "grapheme" })).toBe("👨‍👩‍👧‍👦👨‍👩‍👧‍👦");
      expect(redact("👨‍👩‍👧‍👦👨‍👩‍👧‍👦", { visibleStart: 3, mode: "grapheme" })).toBe("👨‍👩‍👧‍👦👨‍👩‍👧‍👦");
    });
  });

  describe("empty and nullish", (): void => {
    test("returns an empty string", (): void => {
      expect(redact("")).toBe("");
      expect(redact(null)).toBe("");
      expect(redact(undefined)).toBe("");
      expect(redact("", "#")).toBe("");
      expect(redact(null, "#")).toBe("");
      expect(redact(undefined, 2)).toBe("");
      expect(redact(null, { visibleStart: 2 })).toBe("");
    });
  });
});
