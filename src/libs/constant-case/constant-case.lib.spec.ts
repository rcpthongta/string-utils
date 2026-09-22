import { describe, expect, test } from "vitest";

import { constantCase } from "./constant-case.lib";

describe("constantCase", (): void => {
  describe("given a standard string with separators", (): void => {
    test("converts separated words to CONSTANT_CASE", (): void => {
      expect(constantCase("foo-bar")).toBe("FOO_BAR");
      expect(constantCase("foo_bar")).toBe("FOO_BAR");
      expect(constantCase("foo.bar")).toBe("FOO_BAR");
      expect(constantCase("foo bar")).toBe("FOO_BAR");
      expect(constantCase("--foo-bar--")).toBe("FOO_BAR");
      expect(constantCase("__foo_bar__")).toBe("FOO_BAR");
      expect(constantCase("  foo bar  ")).toBe("FOO_BAR");
    });

    test("handles mixed separators", (): void => {
      expect(constantCase("foo-bar_baz.qux")).toBe("FOO_BAR_BAZ_QUX");
      expect(constantCase("foo / bar \\ baz")).toBe("FOO_BAR_BAZ");
      expect(constantCase("foo!!!bar")).toBe("FOO_BAR");
      expect(constantCase("foo---bar")).toBe("FOO_BAR");
      expect(constantCase("foo...bar")).toBe("FOO_BAR");
    });
  });

  describe("given an uppercase string with separators", (): void => {
    test("normalizes uppercase words to CONSTANT_CASE", (): void => {
      expect(constantCase("FOO-BAR")).toBe("FOO_BAR");
      expect(constantCase("FOO_BAR")).toBe("FOO_BAR");
      expect(constantCase("FOO BAR")).toBe("FOO_BAR");
      expect(constantCase("FOO-BAR-BAZ")).toBe("FOO_BAR_BAZ");
    });
  });

  describe("given camelCase and PascalCase strings", (): void => {
    test("converts camelCase to CONSTANT_CASE", (): void => {
      expect(constantCase("fooBar")).toBe("FOO_BAR");
      expect(constantCase("xmlHttpRequest")).toBe("XML_HTTP_REQUEST");
    });

    test("converts PascalCase to CONSTANT_CASE", (): void => {
      expect(constantCase("FooBar")).toBe("FOO_BAR");
      expect(constantCase("XmlHttpRequest")).toBe("XML_HTTP_REQUEST");
    });
  });

  describe("given acronyms and mixed casing", (): void => {
    test("splits acronyms at word boundaries", (): void => {
      expect(constantCase("HTTPResponseCode")).toBe("HTTP_RESPONSE_CODE");
      expect(constantCase("JSONDataAPI")).toBe("JSON_DATA_API");
      expect(constantCase("XMLHttpRequest")).toBe("XML_HTTP_REQUEST");
      expect(constantCase("parseHTTPResponse")).toBe("PARSE_HTTP_RESPONSE");
      expect(constantCase("getURLValue")).toBe("GET_URL_VALUE");
    });
  });

  describe("given strings containing numbers", (): void => {
    test("handles numbers as separate words", (): void => {
      expect(constantCase("version 2.0")).toBe("VERSION_2_0");
      expect(constantCase("version-2-0")).toBe("VERSION_2_0");
      expect(constantCase("version_2_0")).toBe("VERSION_2_0");
      expect(constantCase("2foo")).toBe("2_FOO");
      expect(constantCase("foo2bar")).toBe("FOO_2_BAR");
    });

    test("preserves numeric-only words", (): void => {
      expect(constantCase("123")).toBe("123");
      expect(constantCase("123-456")).toBe("123_456");
      expect(constantCase("123_456_789")).toBe("123_456_789");
    });
  });

  describe("given accents and Unicode letters", (): void => {
    test("preserves accented letters while uppercasing words", (): void => {
      expect(constantCase("crème-brûlée")).toBe("CRÈME_BRÛLÉE");
      expect(constantCase("jalapeño popper")).toBe("JALAPEÑO_POPPER");
      expect(constantCase("École Normale")).toBe("ÉCOLE_NORMALE");
    });

    test("converts Cyrillic words to uppercase", (): void => {
      expect(constantCase("Привет Мир")).toBe("ПРИВЕТ_МИР");
      expect(constantCase("привет-мир")).toBe("ПРИВЕТ_МИР");
      expect(constantCase("ПРИВЕТ МИР")).toBe("ПРИВЕТ_МИР");
    });
  });

  describe("given non-cased scripts", (): void => {
    test("joins CJK, Hiragana, and Hangul words with underscores", (): void => {
      expect(constantCase("こんにちは 世界")).toBe("こんにちは_世界");
      expect(constantCase("你好 世界")).toBe("你好_世界");
      expect(constantCase("안녕하세요 세계")).toBe("안녕하세요_세계");
    });

    test("joins Arabic words with underscores without case transformation", (): void => {
      expect(constantCase("مرحبا بالعالم")).toBe("مرحبا_بالعالم");
    });

    test("handles mixed Latin and non-cased scripts", (): void => {
      expect(constantCase("hello 世界")).toBe("HELLO_世界");
      expect(constantCase("foo-こんにちは")).toBe("FOO_こんにちは");
      expect(constantCase("hello 世界 Привет")).toBe("HELLO_世界_ПРИВЕТ");
    });
  });

  describe("given decomposed Unicode characters", (): void => {
    test("preserves combining marks", (): void => {
      expect(constantCase("cafe\u0301 noir")).toBe("CAFE\u0301_NOIR");
      expect(constantCase("Cafe\u0301 Noir")).toBe("CAFE\u0301_NOIR");
    });
  });

  describe("given strings with no extractable words", (): void => {
    test("returns an empty string for symbol-only inputs", (): void => {
      expect(constantCase("---")).toBe("");
      expect(constantCase("___")).toBe("");
      expect(constantCase("...")).toBe("");
      expect(constantCase("!!!")).toBe("");
      expect(constantCase("@#$%^&*")).toBe("");
    });
  });

  describe("given a CONSTANT_CASE result", (): void => {
    test("is idempotent", (): void => {
      const inputs: string[] = [
        "foo-bar",
        "FOO_BAR",
        "fooBar",
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
        const result: string = constantCase(input);

        expect(constantCase(result)).toBe(result);
      }
    });
  });

  describe("given an empty or nullish value", (): void => {
    test("returns an empty string for an empty string", (): void => {
      expect(constantCase("")).toBe("");
    });

    test("returns an empty string for null", (): void => {
      expect(constantCase(null)).toBe("");
    });

    test("returns an empty string for undefined", (): void => {
      expect(constantCase(undefined)).toBe("");
    });
  });
});
