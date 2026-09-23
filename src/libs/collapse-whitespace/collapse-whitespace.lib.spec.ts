import { describe, expect, test } from "vitest";

import { collapseWhitespace } from "./collapse-whitespace.lib";

describe("collapseWhitespace", (): void => {
  describe("given a string with normal spacing", (): void => {
    test("returns the original string when no normalization is needed", (): void => {
      expect(collapseWhitespace("Hello World")).toBe("Hello World");
      expect(collapseWhitespace("Hello")).toBe("Hello");
    });

    test("preserves a single space between words", (): void => {
      expect(collapseWhitespace("Hello World TypeScript")).toBe("Hello World TypeScript");
    });

    test("collapses consecutive spaces into a single space", (): void => {
      expect(collapseWhitespace("Hello   World")).toBe("Hello World");
      expect(collapseWhitespace("Hello     World     TypeScript")).toBe("Hello World TypeScript");
    });

    test("removes leading and trailing spaces", (): void => {
      expect(collapseWhitespace("   Hello World   ")).toBe("Hello World");
    });
  });

  describe("given a string with special whitespace", (): void => {
    test("collapses tabs, newlines, and carriage returns", (): void => {
      expect(collapseWhitespace("Hello\tWorld")).toBe("Hello World");
      expect(collapseWhitespace("Hello\nWorld")).toBe("Hello World");
      expect(collapseWhitespace("Hello\rWorld")).toBe("Hello World");
      expect(collapseWhitespace("Hello\n\t\rWorld")).toBe("Hello World");
    });

    test("collapses non-breaking spaces", (): void => {
      expect(collapseWhitespace("Hello\u00A0World")).toBe("Hello World");
      expect(collapseWhitespace("\u00A0\u00A0Hello\u00A0World\u00A0\u00A0")).toBe("Hello World");
    });

    test("collapses ideographic spaces", (): void => {
      expect(collapseWhitespace("Hello\u3000World")).toBe("Hello World");
    });

    test("collapses thin spaces and em spaces", (): void => {
      expect(collapseWhitespace("Hello\u2009World\u2003TypeScript")).toBe("Hello World TypeScript");
    });
  });

  describe("given a string with mixed whitespace", (): void => {
    test("collapses mixed whitespace characters into single spaces", (): void => {
      expect(collapseWhitespace(" \tHello \n\t World \r ")).toBe("Hello World");
    });

    test("removes leading and trailing mixed whitespace", (): void => {
      expect(collapseWhitespace("\t\n Hello World \u00A0\r")).toBe("Hello World");
    });
  });

  describe("given a whitespace-only string", (): void => {
    test("returns an empty string", (): void => {
      expect(collapseWhitespace("   \n\t\u00A0\u3000  ")).toBe("");
    });
  });

  describe("given a string containing multiple whitespace boundaries", (): void => {
    test("normalizes every whitespace boundary independently", (): void => {
      expect(collapseWhitespace("  Hello\t\tWorld\n\nTypeScript\u00A0\u00A0Rocks  ")).toBe(
        "Hello World TypeScript Rocks"
      );
    });
  });

  describe("given an already normalized result", (): void => {
    test("is idempotent", (): void => {
      const inputs: string[] = [
        "Hello",
        "Hello World",
        "Hello World TypeScript",
        "Hello\tWorld",
        "  Hello   World  ",
        "\u00A0Hello\u3000World\u2003",
        "   \n\t  "
      ];

      for (let index: number = 0; index < inputs.length; index++) {
        const input: string = inputs[index];
        const result: string = collapseWhitespace(input);

        expect(collapseWhitespace(result)).toBe(result);
      }
    });
  });

  describe("given an empty or nullish value", (): void => {
    test("returns an empty string for an empty string", (): void => {
      expect(collapseWhitespace("")).toBe("");
    });

    test("returns an empty string for null", (): void => {
      expect(collapseWhitespace(null)).toBe("");
    });

    test("returns an empty string for undefined", (): void => {
      expect(collapseWhitespace(undefined)).toBe("");
    });
  });
});
