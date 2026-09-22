import { describe, expect, test } from "vitest";

import { camelCase } from "./camel-case.lib";

describe("camelCase", (): void => {
  describe("given a standard string with separators", (): void => {
    test("converts separated words to camelCase", (): void => {
      expect(camelCase("foo-bar")).toBe("fooBar");
      expect(camelCase("foo_bar")).toBe("fooBar");
      expect(camelCase("foo.bar")).toBe("fooBar");
      expect(camelCase("foo bar")).toBe("fooBar");
      expect(camelCase("--foo-bar--")).toBe("fooBar");
      expect(camelCase("__foo_bar__")).toBe("fooBar");
      expect(camelCase("  foo bar  ")).toBe("fooBar");
    });

    test("handles mixed separators", (): void => {
      expect(camelCase("foo-bar_baz.qux")).toBe("fooBarBazQux");
      expect(camelCase("foo / bar \\ baz")).toBe("fooBarBaz");
      expect(camelCase("foo!!!bar")).toBe("fooBar");
      expect(camelCase("foo---bar")).toBe("fooBar");
      expect(camelCase("foo...bar")).toBe("fooBar");
    });
  });

  describe("given an uppercase string with separators", (): void => {
    test("normalizes uppercase words to camelCase", (): void => {
      expect(camelCase("FOO-BAR")).toBe("fooBar");
      expect(camelCase("FOO_BAR")).toBe("fooBar");
      expect(camelCase("FOO BAR")).toBe("fooBar");
      expect(camelCase("FOO-BAR-BAZ")).toBe("fooBarBaz");
    });
  });

  describe("given a PascalCase string", (): void => {
    test("converts PascalCase to camelCase", (): void => {
      expect(camelCase("FooBar")).toBe("fooBar");
      expect(camelCase("FooBarBaz")).toBe("fooBarBaz");
      expect(camelCase("XMLHttpRequest")).toBe("xmlHttpRequest");
    });
  });

  describe("given a camelCase string", (): void => {
    test("preserves the existing camelCase structure", (): void => {
      expect(camelCase("fooBar")).toBe("fooBar");
      expect(camelCase("fooBarBaz")).toBe("fooBarBaz");
      expect(camelCase("xmlHttpRequest")).toBe("xmlHttpRequest");
    });
  });

  describe("given acronyms and mixed casing", (): void => {
    test("handles acronym boundaries correctly", (): void => {
      expect(camelCase("HTTPResponseCode")).toBe("httpResponseCode");
      expect(camelCase("JSONDataAPI")).toBe("jsonDataApi");
      expect(camelCase("XMLHttpRequest")).toBe("xmlHttpRequest");
      expect(camelCase("parseHTTPResponse")).toBe("parseHttpResponse");
      expect(camelCase("getURLValue")).toBe("getUrlValue");
    });
  });

  describe("given numbers in strings", (): void => {
    test("handles numbers as separate words", (): void => {
      expect(camelCase("version 2.0")).toBe("version20");
      expect(camelCase("version-2-0")).toBe("version20");
      expect(camelCase("version_2_0")).toBe("version20");
      expect(camelCase("2foo")).toBe("2Foo");
      expect(camelCase("foo2bar")).toBe("foo2Bar");
    });

    test("preserves numeric-only input", (): void => {
      expect(camelCase("123")).toBe("123");
      expect(camelCase("123-456")).toBe("123456");
      expect(camelCase("123_456_789")).toBe("123456789");
    });
  });

  describe("given accents and Unicode letters", (): void => {
    test("handles accented Latin characters", (): void => {
      expect(camelCase("crème-brûlée")).toBe("crèmeBrûlée");
      expect(camelCase("jalapeño popper")).toBe("jalapeñoPopper");
      expect(camelCase("École Normale")).toBe("écoleNormale");
    });

    test("handles Cyrillic casing", (): void => {
      expect(camelCase("Привет Мир")).toBe("приветМир");
      expect(camelCase("привет-мир")).toBe("приветМир");
      expect(camelCase("ПРИВЕТ МИР")).toBe("приветМир");
    });

    test("preserves combining marks", (): void => {
      expect(camelCase("cafe\u0301 noir")).toBe("cafe\u0301Noir");
      expect(camelCase("Cafe\u0301 Noir")).toBe("cafe\u0301Noir");
    });
  });

  describe("given non-cased scripts", (): void => {
    test("joins CJK, Hiragana, and Hangul without case transformation", (): void => {
      expect(camelCase("こんにちは 世界")).toBe("こんにちは世界");
      expect(camelCase("你好 世界")).toBe("你好世界");
      expect(camelCase("안녕하세요 세계")).toBe("안녕하세요세계");
    });

    test("joins Arabic words without case transformation", (): void => {
      expect(camelCase("مرحبا بالعالم")).toBe("مرحبابالعالم");
    });

    test("handles mixed Latin and non-cased scripts", (): void => {
      expect(camelCase("hello 世界")).toBe("hello世界");
      expect(camelCase("foo-こんにちは")).toBe("fooこんにちは");
      expect(camelCase("Hello 世界")).toBe("hello世界");
    });
  });

  describe("given strings containing only symbols or separators", (): void => {
    test("returns an empty string when no words are extractable", (): void => {
      expect(camelCase("---")).toBe("");
      expect(camelCase("___")).toBe("");
      expect(camelCase("...")).toBe("");
      expect(camelCase("!!!")).toBe("");
      expect(camelCase("@#$%^&*")).toBe("");
    });
  });

  describe("given a camelCase result", (): void => {
    test("is idempotent", (): void => {
      const inputs: string[] = [
        "foo-bar",
        "FOO_BAR",
        "FooBar",
        "HTTPResponseCode",
        "JSONDataAPI",
        "version-2-0",
        "crème-brûlée",
        "Привет Мир",
        "hello 世界"
      ];

      for (let index: number = 0; index < inputs.length; index++) {
        const input: string = inputs[index];
        const result: string = camelCase(input);

        expect(camelCase(result)).toBe(result);
      }
    });
  });

  describe("given an empty or nullish value", (): void => {
    test("returns an empty string for an empty string", (): void => {
      expect(camelCase("")).toBe("");
    });

    test("returns an empty string for null", (): void => {
      expect(camelCase(null)).toBe("");
    });

    test("returns an empty string for undefined", (): void => {
      expect(camelCase(undefined)).toBe("");
    });
  });
});
