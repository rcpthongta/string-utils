import { describe, expect, expectTypeOf, test } from "vitest";

import { hasLength } from "./has-length.lib";

describe("hasLength", (): void => {
  describe("given a non-empty string", (): void => {
    test("returns true for standard text", (): void => {
      expect(hasLength("Hello World")).toBe(true);
      expect(hasLength("12345")).toBe(true);
    });

    test("returns true for a single code unit", (): void => {
      expect(hasLength("a")).toBe(true);
      expect(hasLength(".")).toBe(true);
      expect(hasLength(" ")).toBe(true);
    });

    test("returns true for whitespace-only strings", (): void => {
      expect(hasLength("   ")).toBe(true);
      expect(hasLength("\t\n\r\v\f")).toBe(true);
    });

    test("returns true for symbols and emojis", (): void => {
      expect(hasLength("!@#$%^&*()")).toBe(true);
      expect(hasLength("🔥")).toBe(true);
      expect(hasLength("🎉🚀🌟")).toBe(true);
    });

    test("returns true for Unicode and accented strings", (): void => {
      expect(hasLength("สวัสดีชาวโลก")).toBe(true);
      expect(hasLength("こんにちは")).toBe(true);
      expect(hasLength("你好世界")).toBe(true);
      expect(hasLength("مرحبا بالعالم")).toBe(true);
      expect(hasLength("café")).toBe(true);
      expect(hasLength("cafe\u0301")).toBe(true);
    });
  });

  describe("given a string with different lengths", (): void => {
    test("returns true regardless of string length", (): void => {
      expect(hasLength("a")).toBe(true);
      expect(hasLength("ab")).toBe(true);
      expect(hasLength("a".repeat(1000))).toBe(true);
      expect(hasLength("a".repeat(100_000))).toBe(true);
    });
  });

  describe("given a non-string value", (): void => {
    test("returns false for numbers", (): void => {
      expect(hasLength(0)).toBe(false);
      expect(hasLength(123)).toBe(false);
      expect(hasLength(-456)).toBe(false);
      expect(hasLength(Infinity)).toBe(false);
      expect(hasLength(NaN)).toBe(false);
    });

    test("returns false for booleans", (): void => {
      expect(hasLength(true)).toBe(false);
      expect(hasLength(false)).toBe(false);
    });

    test("returns false for bigint and symbols", (): void => {
      expect(hasLength(100n)).toBe(false);
      expect(hasLength(Symbol("text"))).toBe(false);
    });

    test("returns false for objects with a length property", (): void => {
      expect(hasLength({ length: 0 })).toBe(false);
      expect(hasLength({ length: 5 })).toBe(false);
      expect(hasLength({ value: "hello", length: 5 })).toBe(false);
    });

    test("returns false for arrays", (): void => {
      expect(hasLength([])).toBe(false);
      expect(hasLength(["hello"])).toBe(false);
      expect(hasLength([1, 2, 3])).toBe(false);
    });

    test("returns false for built-in object instances", (): void => {
      expect(hasLength(new Date())).toBe(false);
      expect(hasLength(/hello/)).toBe(false);
    });

    test("returns false for functions regardless of their parameter count", (): void => {
      const functionWithParameters: (_first: unknown, _second: unknown) => void = (
        _first: unknown,
        _second: unknown
      ): void => {};

      expect(hasLength(() => {})).toBe(false);
      expect(hasLength(functionWithParameters)).toBe(false);
    });
  });

  describe("given a type guard usage", (): void => {
    test("narrows an unknown value to string", (): void => {
      const value: unknown = "Hello";

      if (hasLength(value)) {
        expectTypeOf(value).toEqualTypeOf<string>();
      }
    });
  });

  describe("given an empty or nullish value", (): void => {
    test("returns false for an empty string", (): void => {
      expect(hasLength("")).toBe(false);
    });

    test("returns false for null", (): void => {
      expect(hasLength(null)).toBe(false);
    });

    test("returns false for undefined", (): void => {
      expect(hasLength(undefined)).toBe(false);
    });
  });
});
