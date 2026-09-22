import { describe, expect, test } from "vitest";

import { pascalCase } from "./pascal-case.lib";

describe("pascalCase", (): void => {
  describe("given a standard string with separators", (): void => {
    test("returns the PascalCase string", (): void => {
      expect(pascalCase("foo-bar")).toBe("FooBar");
      expect(pascalCase("foo_bar")).toBe("FooBar");
      expect(pascalCase("foo.bar")).toBe("FooBar");
      expect(pascalCase("foo bar")).toBe("FooBar");
      expect(pascalCase("--foo-bar--")).toBe("FooBar");
      expect(pascalCase("__foo_bar__")).toBe("FooBar");
      expect(pascalCase("  foo bar  ")).toBe("FooBar");
    });

    test("handles mixed separators", (): void => {
      expect(pascalCase("foo-bar_baz.qux")).toBe("FooBarBazQux");
      expect(pascalCase("foo / bar \\ baz")).toBe("FooBarBaz");
      expect(pascalCase("foo!!!bar")).toBe("FooBar");
      expect(pascalCase("foo---bar")).toBe("FooBar");
      expect(pascalCase("foo...bar")).toBe("FooBar");
    });
  });

  describe("given an uppercase string with separators", (): void => {
    test("returns the PascalCase string", (): void => {
      expect(pascalCase("FOO-BAR")).toBe("FooBar");
      expect(pascalCase("FOO_BAR")).toBe("FooBar");
      expect(pascalCase("FOO BAR")).toBe("FooBar");
      expect(pascalCase("FOO-BAR-BAZ")).toBe("FooBarBaz");
    });
  });

  describe("given a camelCase string", (): void => {
    test("returns the PascalCase string", (): void => {
      expect(pascalCase("fooBar")).toBe("FooBar");
      expect(pascalCase("fooBarBaz")).toBe("FooBarBaz");
      expect(pascalCase("xmlHttpRequest")).toBe("XmlHttpRequest");
    });
  });

  describe("given a PascalCase string", (): void => {
    test("returns the original PascalCase string", (): void => {
      expect(pascalCase("FooBar")).toBe("FooBar");
      expect(pascalCase("FooBarBaz")).toBe("FooBarBaz");
      expect(pascalCase("XmlHttpRequest")).toBe("XmlHttpRequest");
    });
  });

  describe("given acronyms and mixed casing", (): void => {
    test("handles consecutive uppercase letters", (): void => {
      expect(pascalCase("HTTPResponseCode")).toBe("HttpResponseCode");
      expect(pascalCase("JSONDataAPI")).toBe("JsonDataApi");
      expect(pascalCase("XMLHttpRequest")).toBe("XmlHttpRequest");
      expect(pascalCase("parseHTTPResponse")).toBe("ParseHttpResponse");
      expect(pascalCase("getURLValue")).toBe("GetUrlValue");
    });
  });

  describe("given strings containing numbers", (): void => {
    test("handles numbers as separate words", (): void => {
      expect(pascalCase("version 2.0")).toBe("Version20");
      expect(pascalCase("version-2-0")).toBe("Version20");
      expect(pascalCase("version_2_0")).toBe("Version20");
      expect(pascalCase("2foo")).toBe("2Foo");
      expect(pascalCase("foo2bar")).toBe("Foo2Bar");
    });

    test("preserves numeric-only input", (): void => {
      expect(pascalCase("123")).toBe("123");
      expect(pascalCase("123-456")).toBe("123456");
      expect(pascalCase("123_456_789")).toBe("123456789");
    });
  });

  describe("given strings with accents and Unicode", (): void => {
    test("handles accented letters as part of words", (): void => {
      expect(pascalCase("crème-brûlée")).toBe("CrèmeBrûlée");
      expect(pascalCase("jalapeño popper")).toBe("JalapeñoPopper");
      expect(pascalCase("École Normale")).toBe("ÉcoleNormale");
    });

    test("handles Cyrillic casing", (): void => {
      expect(pascalCase("Привет Мир")).toBe("ПриветМир");
      expect(pascalCase("привет-мир")).toBe("ПриветМир");
      expect(pascalCase("ПРИВЕТ МИР")).toBe("ПриветМир");
    });

    test("preserves combining marks", (): void => {
      expect(pascalCase("cafe\u0301 noir")).toBe("Cafe\u0301Noir");
      expect(pascalCase("Cafe\u0301 Noir")).toBe("Cafe\u0301Noir");
    });
  });

  describe("given non-cased scripts", (): void => {
    test("joins CJK, Hiragana, and Hangul without case transformation", (): void => {
      expect(pascalCase("こんにちは 世界")).toBe("こんにちは世界");
      expect(pascalCase("你好 世界")).toBe("你好世界");
      expect(pascalCase("안녕하세요 세계")).toBe("안녕하세요세계");
    });

    test("joins Arabic words without case transformation", (): void => {
      expect(pascalCase("مرحبا بالعالم")).toBe("مرحبابالعالم");
    });

    test("handles mixed Latin and non-cased scripts", (): void => {
      expect(pascalCase("hello 世界")).toBe("Hello世界");
      expect(pascalCase("Hello 世界")).toBe("Hello世界");
      expect(pascalCase("foo-こんにちは")).toBe("Fooこんにちは");
      expect(pascalCase("hello 世界 Привет")).toBe("Hello世界Привет");
    });
  });

  describe("given strings containing only symbols or separators", (): void => {
    test("returns an empty string when no words are extractable", (): void => {
      expect(pascalCase("---")).toBe("");
      expect(pascalCase("___")).toBe("");
      expect(pascalCase("...")).toBe("");
      expect(pascalCase("!!!")).toBe("");
      expect(pascalCase("@#$%^&*")).toBe("");
    });
  });

  describe("given a single word", (): void => {
    test("returns the capitalized word", (): void => {
      expect(pascalCase("hello")).toBe("Hello");
      expect(pascalCase("Hello")).toBe("Hello");
      expect(pascalCase("HELLO")).toBe("Hello");
    });

    test("preserves a numeric-only word", (): void => {
      expect(pascalCase("123456789")).toBe("123456789");
    });
  });

  describe("given a PascalCase result", (): void => {
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
        const result: string = pascalCase(input);

        expect(pascalCase(result)).toBe(result);
      }
    });
  });

  describe("given an empty or nullish value", (): void => {
    test("returns an empty string for an empty string", (): void => {
      expect(pascalCase("")).toBe("");
    });

    test("returns an empty string for null", (): void => {
      expect(pascalCase(null)).toBe("");
    });

    test("returns an empty string for undefined", (): void => {
      expect(pascalCase(undefined)).toBe("");
    });
  });
});
