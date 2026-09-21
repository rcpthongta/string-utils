import { describe, expect, test } from "vitest";

import { defaultIfEmpty } from "./default-if-empty.lib";

describe("defaultIfEmpty", (): void => {
  describe("given a non-empty string", (): void => {
    test("returns the original string", (): void => {
      expect(defaultIfEmpty("Hello", "default")).toBe("Hello");
      expect(defaultIfEmpty("Hello World", "default")).toBe("Hello World");
      expect(defaultIfEmpty("12345", "default")).toBe("12345");
    });

    test("preserves whitespace-only strings", (): void => {
      expect(defaultIfEmpty(" ", "default")).toBe(" ");
      expect(defaultIfEmpty("   ", "default")).toBe("   ");
      expect(defaultIfEmpty("\t\n\r", "default")).toBe("\t\n\r");
      expect(defaultIfEmpty(" \t\n\r ", "default")).toBe(" \t\n\r ");
    });

    test("preserves Unicode whitespace characters", (): void => {
      expect(defaultIfEmpty("\u00A0", "default")).toBe("\u00A0");
      expect(defaultIfEmpty("\u2003", "default")).toBe("\u2003");
      expect(defaultIfEmpty("\u202F", "default")).toBe("\u202F");
      expect(defaultIfEmpty("\u3000", "default")).toBe("\u3000");
    });

    test("preserves Unicode and accented characters", (): void => {
      expect(defaultIfEmpty("สวัสดีชาวโลก", "default")).toBe("สวัสดีชาวโลก");
      expect(defaultIfEmpty("こんにちは", "default")).toBe("こんにちは");
      expect(defaultIfEmpty("café", "default")).toBe("café");
      expect(defaultIfEmpty("مرحبا بالعالم", "default")).toBe("مرحبا بالعالم");
      expect(defaultIfEmpty("cafe\u0301", "default")).toBe("cafe\u0301");
    });

    test("preserves symbols and emojis", (): void => {
      expect(defaultIfEmpty("🔥", "default")).toBe("🔥");
      expect(defaultIfEmpty("!@#$%^&*()", "default")).toBe("!@#$%^&*()");
    });

    test("preserves strings containing only a single code unit", (): void => {
      expect(defaultIfEmpty("a", "default")).toBe("a");
      expect(defaultIfEmpty("1", "default")).toBe("1");
      expect(defaultIfEmpty(" ", "default")).toBe(" ");
    });

    test("returns the exact original value without normalization", (): void => {
      const value: string = " \t Hello World \n ";

      expect(defaultIfEmpty(value, "default")).toBe(value);
    });
  });

  describe("given an empty or nullish value", (): void => {
    test("returns the default value for an empty string", (): void => {
      expect(defaultIfEmpty("", "default")).toBe("default");
    });

    test("returns the default value for null", (): void => {
      expect(defaultIfEmpty(null, "default")).toBe("default");
    });

    test("returns the default value for undefined", (): void => {
      expect(defaultIfEmpty(undefined, "default")).toBe("default");
    });
  });
});
