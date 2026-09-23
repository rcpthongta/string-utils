import { describe, expect, expectTypeOf, test } from "vitest";

import { capitalize } from "./capitalize.lib";

describe("capitalize", (): void => {
  describe("given a standard string", (): void => {
    test("capitalizes the first lowercase character", (): void => {
      expect(capitalize("hello")).toBe("Hello");
      expect(capitalize("hello world")).toBe("Hello world");
      expect(capitalize("typescript")).toBe("Typescript");
    });

    test("preserves an already uppercase first character", (): void => {
      expect(capitalize("Hello")).toBe("Hello");
      expect(capitalize("HELLO")).toBe("HELLO");
      expect(capitalize("Hello World")).toBe("Hello World");
    });

    test("capitalizes only the first character", (): void => {
      expect(capitalize("hELLO")).toBe("HELLO");
      expect(capitalize("hELLO wORLD")).toBe("HELLO wORLD");
      expect(capitalize("helloWORLD")).toBe("HelloWORLD");
    });

    test("handles a single-character string", (): void => {
      expect(capitalize("a")).toBe("A");
      expect(capitalize("A")).toBe("A");
    });
  });

  describe("given leading whitespace", (): void => {
    test("preserves leading whitespace without capitalizing the next character", (): void => {
      expect(capitalize("  hello")).toBe("  hello");
      expect(capitalize("\thello")).toBe("\thello");
      expect(capitalize("\nhello")).toBe("\nhello");
      expect(capitalize("\r\nhello")).toBe("\r\nhello");
      expect(capitalize("\u00A0hello")).toBe("\u00A0hello");
      expect(capitalize("\u3000hello")).toBe("\u3000hello");
    });

    test("preserves whitespace-only strings", (): void => {
      expect(capitalize("   ")).toBe("   ");
      expect(capitalize("\t")).toBe("\t");
      expect(capitalize("\n")).toBe("\n");
      expect(capitalize("\r\n")).toBe("\r\n");
    });
  });

  describe("given Unicode and accented characters", (): void => {
    test("capitalizes supported cased Unicode characters", (): void => {
      expect(capitalize("éclair")).toBe("Éclair");
      expect(capitalize("ñandú")).toBe("Ñandú");
      expect(capitalize("über")).toBe("Über");
      expect(capitalize("ørebro")).toBe("Ørebro");
      expect(capitalize("σigma")).toBe("Σigma");
    });

    test("preserves scripts without case transformation", (): void => {
      expect(capitalize("สวัสดี")).toBe("สวัสดี");
      expect(capitalize("こんにちは")).toBe("こんにちは");
    });

    test("preserves combining marks after the first character", (): void => {
      expect(capitalize("cafe\u0301")).toBe("Cafe\u0301");
      expect(capitalize("e\u0301clair")).toBe("E\u0301clair");
    });

    test("handles uppercase mappings that contain multiple characters", (): void => {
      expect(capitalize("ßeta")).toBe("SSeta");
    });
  });

  describe("given a string beginning with a non-letter character", (): void => {
    test("preserves the string when the first character is a number", (): void => {
      expect(capitalize("123hello")).toBe("123hello");
    });

    test("preserves the string when the first character is a symbol", (): void => {
      expect(capitalize("!hello")).toBe("!hello");
      expect(capitalize("@hello")).toBe("@hello");
      expect(capitalize("-hello")).toBe("-hello");
      expect(capitalize("_hello")).toBe("_hello");
    });

    test("preserves the string when the first character is an emoji", (): void => {
      expect(capitalize("🔥hello")).toBe("🔥hello");
      expect(capitalize("❤️hello")).toBe("❤️hello");
      expect(capitalize("©hello")).toBe("©hello");
    });
  });

  describe("given a string literal", (): void => {
    test("preserves the transformed literal type", (): void => {
      expectTypeOf(capitalize("hello")).toEqualTypeOf<"Hello">();
      expectTypeOf(capitalize("Hello")).toEqualTypeOf<"Hello">();
    });
  });

  describe("given an already capitalized result", (): void => {
    test("is idempotent", (): void => {
      const inputs: string[] = ["hello", "Hello", "HELLO", "éclair", "Éclair", "σigma", "123hello", "🔥hello"];

      for (let index: number = 0; index < inputs.length; index++) {
        const input: string = inputs[index];
        const result: string = capitalize(input);

        expect(capitalize(result)).toBe(result);
      }
    });
  });

  describe("given an empty or nullish value", (): void => {
    test("returns an empty string for an empty string", (): void => {
      expect(capitalize("")).toBe("");
    });

    test("returns an empty string for null", (): void => {
      expect(capitalize(null)).toBe("");
    });

    test("returns an empty string for undefined", (): void => {
      expect(capitalize(undefined)).toBe("");
    });
  });
});
