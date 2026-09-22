import { describe, expect, test } from "vitest";

import { snakeCase } from "./snake-case.lib";

describe("snakeCase", (): void => {
  describe("given a standard string with separators", (): void => {
    test("returns the snake_case string", (): void => {
      expect(snakeCase("foo-bar")).toBe("foo_bar");
      expect(snakeCase("foo_bar")).toBe("foo_bar");
      expect(snakeCase("foo.bar")).toBe("foo_bar");
      expect(snakeCase("foo bar")).toBe("foo_bar");
      expect(snakeCase("--foo-bar--")).toBe("foo_bar");
      expect(snakeCase("__foo_bar__")).toBe("foo_bar");
      expect(snakeCase("  foo bar  ")).toBe("foo_bar");
    });

    test("handles mixed separators", (): void => {
      expect(snakeCase("foo-bar_baz.qux")).toBe("foo_bar_baz_qux");
      expect(snakeCase("foo / bar \\ baz")).toBe("foo_bar_baz");
      expect(snakeCase("foo!!!bar")).toBe("foo_bar");
      expect(snakeCase("foo---bar")).toBe("foo_bar");
      expect(snakeCase("foo...bar")).toBe("foo_bar");
    });
  });

  describe("given an uppercase string with separators", (): void => {
    test("returns the snake_case string", (): void => {
      expect(snakeCase("FOO-BAR")).toBe("foo_bar");
      expect(snakeCase("FOO_BAR")).toBe("foo_bar");
      expect(snakeCase("FOO BAR")).toBe("foo_bar");
      expect(snakeCase("FOO-BAR-BAZ")).toBe("foo_bar_baz");
    });
  });

  describe("given a camelCase string", (): void => {
    test("returns the snake_case string", (): void => {
      expect(snakeCase("fooBar")).toBe("foo_bar");
      expect(snakeCase("fooBarBaz")).toBe("foo_bar_baz");
      expect(snakeCase("xmlHttpRequest")).toBe("xml_http_request");
    });
  });

  describe("given a PascalCase string", (): void => {
    test("returns the snake_case string", (): void => {
      expect(snakeCase("FooBar")).toBe("foo_bar");
      expect(snakeCase("FooBarBaz")).toBe("foo_bar_baz");
      expect(snakeCase("XmlHttpRequest")).toBe("xml_http_request");
    });
  });

  describe("given acronyms and mixed casing", (): void => {
    test("handles consecutive uppercase letters", (): void => {
      expect(snakeCase("HTTPResponseCode")).toBe("http_response_code");
      expect(snakeCase("JSONDataAPI")).toBe("json_data_api");
      expect(snakeCase("XMLHttpRequest")).toBe("xml_http_request");
      expect(snakeCase("parseHTTPResponse")).toBe("parse_http_response");
      expect(snakeCase("getURLValue")).toBe("get_url_value");
    });
  });

  describe("given strings containing numbers", (): void => {
    test("handles numbers as separate words", (): void => {
      expect(snakeCase("version 2.0")).toBe("version_2_0");
      expect(snakeCase("version-2-0")).toBe("version_2_0");
      expect(snakeCase("version_2_0")).toBe("version_2_0");
      expect(snakeCase("2foo")).toBe("2_foo");
      expect(snakeCase("foo2bar")).toBe("foo_2_bar");
    });

    test("preserves numeric-only input", (): void => {
      expect(snakeCase("123")).toBe("123");
      expect(snakeCase("123-456")).toBe("123_456");
      expect(snakeCase("123_456_789")).toBe("123_456_789");
    });
  });

  describe("given strings with accents and Unicode", (): void => {
    test("handles accented letters as part of words", (): void => {
      expect(snakeCase("crème-brûlée")).toBe("crème_brûlée");
      expect(snakeCase("jalapeño popper")).toBe("jalapeño_popper");
      expect(snakeCase("École Normale")).toBe("école_normale");
    });

    test("handles Cyrillic casing", (): void => {
      expect(snakeCase("Привет Мир")).toBe("привет_мир");
      expect(snakeCase("привет-мир")).toBe("привет_мир");
      expect(snakeCase("ПРИВЕТ МИР")).toBe("привет_мир");
    });

    test("preserves combining marks", (): void => {
      expect(snakeCase("cafe\u0301 noir")).toBe("cafe\u0301_noir");
      expect(snakeCase("Cafe\u0301 Noir")).toBe("cafe\u0301_noir");
    });
  });

  describe("given non-cased scripts", (): void => {
    test("joins CJK, Hiragana, and Hangul without case transformation", (): void => {
      expect(snakeCase("こんにちは 世界")).toBe("こんにちは_世界");
      expect(snakeCase("你好 世界")).toBe("你好_世界");
      expect(snakeCase("안녕하세요 세계")).toBe("안녕하세요_세계");
    });

    test("joins Arabic words without case transformation", (): void => {
      expect(snakeCase("مرحبا بالعالم")).toBe("مرحبا_بالعالم");
    });

    test("handles mixed Latin and non-cased scripts", (): void => {
      expect(snakeCase("hello 世界")).toBe("hello_世界");
      expect(snakeCase("Hello 世界")).toBe("hello_世界");
      expect(snakeCase("foo-こんにちは")).toBe("foo_こんにちは");
      expect(snakeCase("hello 世界 Привет")).toBe("hello_世界_привет");
    });
  });

  describe("given strings containing only symbols or separators", (): void => {
    test("returns an empty string when no words are extractable", (): void => {
      expect(snakeCase("---")).toBe("");
      expect(snakeCase("___")).toBe("");
      expect(snakeCase("...")).toBe("");
      expect(snakeCase("!!!")).toBe("");
      expect(snakeCase("@#$%^&*")).toBe("");
    });
  });

  describe("given a single word", (): void => {
    test("returns the normalized word without adding separators", (): void => {
      expect(snakeCase("hello")).toBe("hello");
      expect(snakeCase("Hello")).toBe("hello");
      expect(snakeCase("HELLO")).toBe("hello");
    });

    test("preserves a numeric-only word", (): void => {
      expect(snakeCase("123456789")).toBe("123456789");
    });
  });

  describe("given a snake_case result", (): void => {
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
        const result: string = snakeCase(input);

        expect(snakeCase(result)).toBe(result);
      }
    });
  });

  describe("given an empty or nullish value", (): void => {
    test("returns an empty string for an empty string", (): void => {
      expect(snakeCase("")).toBe("");
    });

    test("returns an empty string for null", (): void => {
      expect(snakeCase(null)).toBe("");
    });

    test("returns an empty string for undefined", (): void => {
      expect(snakeCase(undefined)).toBe("");
    });
  });
});
