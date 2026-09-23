import { describe, expect, test } from "vitest";

import { defaultIfBlank } from "./default-if-blank.lib";

describe("defaultIfBlank", (): void => {
  describe("given a non-blank string", (): void => {
    test("returns the original string", (): void => {
      expect(defaultIfBlank("Hello", "default")).toBe("Hello");
      expect(defaultIfBlank("Hello World", "default")).toBe("Hello World");
      expect(defaultIfBlank("12345", "default")).toBe("12345");
    });

    test("preserves leading and trailing whitespace", (): void => {
      expect(defaultIfBlank("  Hello World  ", "default")).toBe("  Hello World  ");
      expect(defaultIfBlank("\tHello\t", "default")).toBe("\tHello\t");
      expect(defaultIfBlank("\t\n  text  \r\n", "default")).toBe("\t\n  text  \r\n");
    });

    test("preserves Unicode and accented characters", (): void => {
      expect(defaultIfBlank("สวัสดีชาวโลก", "default")).toBe("สวัสดีชาวโลก");
      expect(defaultIfBlank("こんにちは", "default")).toBe("こんにちは");
      expect(defaultIfBlank("café", "default")).toBe("café");
      expect(defaultIfBlank("مرحبا بالعالم", "default")).toBe("مرحبا بالعالم");
      expect(defaultIfBlank("cafe\u0301", "default")).toBe("cafe\u0301");
    });

    test("preserves symbols and emojis", (): void => {
      expect(defaultIfBlank("🔥", "default")).toBe("🔥");
      expect(defaultIfBlank("!@#$%^&*()", "default")).toBe("!@#$%^&*()");
    });

    test("returns the original value when text contains surrounding whitespace", (): void => {
      const value: string = " \t\n Hello World \u00A0 ";

      expect(defaultIfBlank(value, "default")).toBe(value);
    });
  });

  describe("given a whitespace-only string", (): void => {
    test("returns the default value for ASCII whitespace", (): void => {
      expect(defaultIfBlank(" ", "default")).toBe("default");
      expect(defaultIfBlank("   ", "default")).toBe("default");
      expect(defaultIfBlank("\t\n\r\v\f", "default")).toBe("default");
      expect(defaultIfBlank(" \t\n\r ", "default")).toBe("default");
    });

    test("returns the default value for Unicode whitespace", (): void => {
      expect(defaultIfBlank("\u00A0", "default")).toBe("default");
      expect(defaultIfBlank("\u2003", "default")).toBe("default");
      expect(defaultIfBlank("\u202F", "default")).toBe("default");
      expect(defaultIfBlank("\u3000", "default")).toBe("default");
      expect(defaultIfBlank(" \t\n\r\u00A0\u3000 ", "default")).toBe("default");
    });

    test("returns the default value for mixed whitespace", (): void => {
      expect(defaultIfBlank(" \t\n\r\u00A0\u2003\u202F\u3000 ", "default")).toBe("default");
    });
  });

  describe("given a string containing a single non-whitespace character", (): void => {
    test("returns the original string", (): void => {
      expect(defaultIfBlank("a", "default")).toBe("a");
      expect(defaultIfBlank("1", "default")).toBe("1");
      expect(defaultIfBlank("🔥", "default")).toBe("🔥");
      expect(defaultIfBlank("中", "default")).toBe("中");
    });
  });

  describe("given an empty or nullish value", (): void => {
    test("returns the default value for an empty string", (): void => {
      expect(defaultIfBlank("", "default")).toBe("default");
    });

    test("returns the default value for null", (): void => {
      expect(defaultIfBlank(null, "default")).toBe("default");
    });

    test("returns the default value for undefined", (): void => {
      expect(defaultIfBlank(undefined, "default")).toBe("default");
    });
  });
});
