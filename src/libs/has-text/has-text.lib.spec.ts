import { describe, expect, expectTypeOf, test } from "vitest";

import { hasText } from "./has-text.lib";

describe("hasText", (): void => {
  describe("given a string containing text", (): void => {
    test("returns true for standard text", (): void => {
      expect(hasText("Hello World")).toBe(true);
      expect(hasText("12345")).toBe(true);
    });

    test("returns true when text is surrounded by whitespace", (): void => {
      expect(hasText("   Hello World   ")).toBe(true);
      expect(hasText("\t\n  text  \r\n")).toBe(true);
    });

    test("returns true for symbols and emojis", (): void => {
      expect(hasText("!")).toBe(true);
      expect(hasText("!@#$%^&*()")).toBe(true);
      expect(hasText("🔥")).toBe(true);
      expect(hasText("🎉🚀🌟")).toBe(true);
    });

    test("returns true for Unicode and accented text", (): void => {
      expect(hasText("สวัสดีชาวโลก")).toBe(true);
      expect(hasText("こんにちは")).toBe(true);
      expect(hasText("你好世界")).toBe(true);
      expect(hasText("مرحبا بالعالم")).toBe(true);
      expect(hasText("café")).toBe(true);
      expect(hasText("cafe\u0301")).toBe(true);
    });
  });

  describe("given a string containing only whitespace", (): void => {
    test("returns false for ASCII whitespace", (): void => {
      expect(hasText(" ")).toBe(false);
      expect(hasText("   ")).toBe(false);
      expect(hasText("\t\n\r\v\f")).toBe(false);
    });

    test("returns false for Unicode whitespace", (): void => {
      expect(hasText("\u00A0")).toBe(false);
      expect(hasText("\u2003")).toBe(false);
      expect(hasText("\u202F")).toBe(false);
      expect(hasText("\u3000")).toBe(false);
      expect(hasText(" \t\n\r\u00A0\u2003\u202F\u3000 ")).toBe(false);
    });
  });

  describe("given a string containing combining marks", (): void => {
    test("treats combining marks according to the configured whitespace rule", (): void => {
      expect(hasText("cafe\u0301")).toBe(true);
    });
  });

  describe("given a non-string value", (): void => {
    test("returns false for numbers", (): void => {
      expect(hasText(0)).toBe(false);
      expect(hasText(123)).toBe(false);
      expect(hasText(-456)).toBe(false);
      expect(hasText(Infinity)).toBe(false);
      expect(hasText(NaN)).toBe(false);
    });

    test("returns false for booleans", (): void => {
      expect(hasText(true)).toBe(false);
      expect(hasText(false)).toBe(false);
    });

    test("returns false for bigint and symbols", (): void => {
      expect(hasText(100n)).toBe(false);
      expect(hasText(Symbol("text"))).toBe(false);
    });

    test("returns false for objects and arrays", (): void => {
      expect(hasText({})).toBe(false);
      expect(hasText({ text: "hello" })).toBe(false);
      expect(hasText([])).toBe(false);
      expect(hasText(["hello"])).toBe(false);
    });

    test("returns false for functions", (): void => {
      expect(hasText(() => {})).toBe(false);
      expect(hasText(function () {})).toBe(false);
    });
  });

  describe("given a type guard usage", (): void => {
    test("narrows an unknown value to string", (): void => {
      const value: unknown = "Hello";

      if (hasText(value)) {
        expectTypeOf(value).toEqualTypeOf<string>();
      }
    });
  });

  describe("given an empty or nullish value", (): void => {
    test("returns false for an empty string", (): void => {
      expect(hasText("")).toBe(false);
    });

    test("returns false for null", (): void => {
      expect(hasText(null)).toBe(false);
    });

    test("returns false for undefined", (): void => {
      expect(hasText(undefined)).toBe(false);
    });
  });
});
