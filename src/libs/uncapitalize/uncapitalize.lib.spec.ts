import { describe, expect, expectTypeOf, test } from "vitest";

import { uncapitalize } from "./uncapitalize.lib";

describe("uncapitalize", (): void => {
  describe("given a string", (): void => {
    test("uncapitalizes an uppercase first character", (): void => {
      expect(uncapitalize("Hello")).toBe("hello");
      expect(uncapitalize("Hello world")).toBe("hello world");
      expect(uncapitalize("Typescript")).toBe("typescript");
    });

    test("preserves an already lowercase first character", (): void => {
      expect(uncapitalize("hello")).toBe("hello");
      expect(uncapitalize("hello world")).toBe("hello world");
      expect(uncapitalize("helloWorld")).toBe("helloWorld");
    });

    test("uncapitalizes only the first character", (): void => {
      expect(uncapitalize("HELLO")).toBe("hELLO");
      expect(uncapitalize("HELLO wORLD")).toBe("hELLO wORLD");
      expect(uncapitalize("HELLOworld")).toBe("hELLOworld");
    });

    test("handles a single-character string", (): void => {
      expect(uncapitalize("A")).toBe("a");
      expect(uncapitalize("a")).toBe("a");
    });

    test("preserves leading whitespace", (): void => {
      expect(uncapitalize("  Hello")).toBe("  Hello");
      expect(uncapitalize("\tHello")).toBe("\tHello");
      expect(uncapitalize("\nHello")).toBe("\nHello");
      expect(uncapitalize("\r\nHello")).toBe("\r\nHello");
      expect(uncapitalize("\u00A0Hello")).toBe("\u00A0Hello");
      expect(uncapitalize("\u3000Hello")).toBe("\u3000Hello");
    });

    test("preserves whitespace-only strings", (): void => {
      expect(uncapitalize("   ")).toBe("   ");
      expect(uncapitalize("\t")).toBe("\t");
      expect(uncapitalize("\n")).toBe("\n");
    });

    test("supports Unicode and accented characters", (): void => {
      expect(uncapitalize("Éclair")).toBe("éclair");
      expect(uncapitalize("Ñandú")).toBe("ñandú");
      expect(uncapitalize("Über")).toBe("über");
      expect(uncapitalize("Ørebro")).toBe("ørebro");
      expect(uncapitalize("Σigma")).toBe("σigma");
      expect(uncapitalize("สวัสดี")).toBe("สวัสดี");
      expect(uncapitalize("こんにちは")).toBe("こんにちは");
    });

    test("preserves strings starting with non-letter characters", (): void => {
      expect(uncapitalize("123Hello")).toBe("123Hello");
      expect(uncapitalize("!Hello")).toBe("!Hello");
      expect(uncapitalize("@Hello")).toBe("@Hello");
      expect(uncapitalize("-Hello")).toBe("-Hello");
      expect(uncapitalize("_Hello")).toBe("_Hello");
    });

    test("preserves strings starting with symbols and emojis", (): void => {
      expect(uncapitalize("🔥Hello")).toBe("🔥Hello");
      expect(uncapitalize("❤️Hello")).toBe("❤️Hello");
      expect(uncapitalize("©Hello")).toBe("©Hello");
    });
  });

  describe("given a string literal", (): void => {
    test("preserves the transformed literal type", (): void => {
      expectTypeOf(uncapitalize("Hello")).toEqualTypeOf<"hello">();
      expectTypeOf(uncapitalize("hello")).toEqualTypeOf<"hello">();
    });
  });

  describe("given an uncapitalized result", (): void => {
    test("is idempotent", (): void => {
      const inputs: string[] = ["Hello", "hello", "HELLO", "A", "a", "  Hello", "Éclair", "123Hello", "🔥Hello"];

      for (let index: number = 0; index < inputs.length; index++) {
        const input: string = inputs[index];
        const result: string = uncapitalize(input);

        expect(uncapitalize(result)).toBe(result);
      }
    });
  });

  describe("given an empty or nullish value", (): void => {
    test("returns an empty string for an empty string", (): void => {
      expect(uncapitalize("")).toBe("");
    });

    test("returns an empty string for null", (): void => {
      expect(uncapitalize(null)).toBe("");
    });

    test("returns an empty string for undefined", (): void => {
      expect(uncapitalize(undefined)).toBe("");
    });
  });
});
