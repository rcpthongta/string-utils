import { describe, expect, test } from "vitest";

import { kebabCase } from "./kebab-case.lib";

describe("kebabCase", (): void => {
  describe("given separated words", (): void => {
    test("converts common separators to hyphens", (): void => {
      expect(kebabCase("foo-bar")).toBe("foo-bar");
      expect(kebabCase("foo_bar")).toBe("foo-bar");
      expect(kebabCase("foo.bar")).toBe("foo-bar");
      expect(kebabCase("foo bar")).toBe("foo-bar");
    });

    test("removes leading and trailing separators", (): void => {
      expect(kebabCase("--foo-bar--")).toBe("foo-bar");
      expect(kebabCase("__foo_bar__")).toBe("foo-bar");
      expect(kebabCase("..foo.bar..")).toBe("foo-bar");
      expect(kebabCase("  foo bar  ")).toBe("foo-bar");
    });

    test("collapses mixed separators between words", (): void => {
      expect(kebabCase("foo-bar_baz.qux")).toBe("foo-bar-baz-qux");
      expect(kebabCase("foo / bar \\ baz")).toBe("foo-bar-baz");
      expect(kebabCase("foo!!!bar???baz")).toBe("foo-bar-baz");
    });
  });

  describe("given different casing styles", (): void => {
    test("normalizes lowercase and uppercase words", (): void => {
      expect(kebabCase("foo-bar")).toBe("foo-bar");
      expect(kebabCase("FOO-BAR")).toBe("foo-bar");
      expect(kebabCase("FOO_BAR_BAZ")).toBe("foo-bar-baz");
    });

    test("converts camelCase to kebab-case", (): void => {
      expect(kebabCase("fooBar")).toBe("foo-bar");
      expect(kebabCase("fooBarBaz")).toBe("foo-bar-baz");
      expect(kebabCase("xmlHttpRequest")).toBe("xml-http-request");
    });

    test("converts PascalCase to kebab-case", (): void => {
      expect(kebabCase("FooBar")).toBe("foo-bar");
      expect(kebabCase("FooBarBaz")).toBe("foo-bar-baz");
      expect(kebabCase("XmlHttpRequest")).toBe("xml-http-request");
    });
  });

  describe("given acronyms", (): void => {
    test("splits acronym boundaries correctly", (): void => {
      expect(kebabCase("HTTPResponseCode")).toBe("http-response-code");
      expect(kebabCase("JSONDataAPI")).toBe("json-data-api");
      expect(kebabCase("XMLHttpRequest")).toBe("xml-http-request");
    });

    test("handles acronyms at the beginning and end", (): void => {
      expect(kebabCase("HTTPResponse")).toBe("http-response");
      expect(kebabCase("parseHTTP")).toBe("parse-http");
      expect(kebabCase("parseHTTPResponse")).toBe("parse-http-response");
      expect(kebabCase("getURLValue")).toBe("get-url-value");
    });

    test("handles multiple acronyms separated by delimiters", (): void => {
      expect(kebabCase("HTTP-JSON-API-Response")).toBe("http-json-api-response");
    });
  });

  describe("given numbers", (): void => {
    test("separates numbers from adjacent words", (): void => {
      expect(kebabCase("2foo")).toBe("2-foo");
      expect(kebabCase("foo2")).toBe("foo-2");
      expect(kebabCase("foo2bar")).toBe("foo-2-bar");
    });

    test("preserves numeric words", (): void => {
      expect(kebabCase("123")).toBe("123");
      expect(kebabCase("123-456")).toBe("123-456");
      expect(kebabCase("123_456_789")).toBe("123-456-789");
    });

    test("handles decimal-like input as separate words", (): void => {
      expect(kebabCase("version 2.0")).toBe("version-2-0");
      expect(kebabCase("version-2-0")).toBe("version-2-0");
    });
  });

  describe("given Unicode text", (): void => {
    test("preserves accented Latin characters", (): void => {
      expect(kebabCase("crème-brûlée")).toBe("crème-brûlée");
      expect(kebabCase("jalapeño popper")).toBe("jalapeño-popper");
      expect(kebabCase("École Normale")).toBe("école-normale");
    });

    test("handles Cyrillic casing", (): void => {
      expect(kebabCase("Привет Мир")).toBe("привет-мир");
      expect(kebabCase("привет-мир")).toBe("привет-мир");
      expect(kebabCase("ПРИВЕТ МИР")).toBe("привет-мир");
    });

    test("preserves combining marks", (): void => {
      expect(kebabCase("cafe\u0301 noir")).toBe("cafe\u0301-noir");
      expect(kebabCase("Cafe\u0301 Noir")).toBe("cafe\u0301-noir");
    });
  });

  describe("given non-cased scripts", (): void => {
    test("separates CJK words", (): void => {
      expect(kebabCase("你好 世界")).toBe("你好-世界");
    });

    test("separates Hiragana and Hangul words", (): void => {
      expect(kebabCase("こんにちは 世界")).toBe("こんにちは-世界");
      expect(kebabCase("안녕하세요 세계")).toBe("안녕하세요-세계");
    });

    test("separates Arabic words", (): void => {
      expect(kebabCase("مرحبا بالعالم")).toBe("مرحبا-بالعالم");
    });

    test("handles mixed scripts", (): void => {
      expect(kebabCase("hello 世界")).toBe("hello-世界");
      expect(kebabCase("Hello 世界")).toBe("hello-世界");
      expect(kebabCase("foo-こんにちは")).toBe("foo-こんにちは");
      expect(kebabCase("hello 世界 Привет")).toBe("hello-世界-привет");
    });
  });

  describe("given symbols and separators", (): void => {
    test("ignores symbols between words", (): void => {
      expect(kebabCase("foo!!!bar")).toBe("foo-bar");
      expect(kebabCase("foo---bar")).toBe("foo-bar");
      expect(kebabCase("foo...bar")).toBe("foo-bar");
      expect(kebabCase("foo___bar")).toBe("foo-bar");
    });

    test("returns an empty string when no words are extractable", (): void => {
      expect(kebabCase("---")).toBe("");
      expect(kebabCase("___")).toBe("");
      expect(kebabCase("...")).toBe("");
      expect(kebabCase("!!!")).toBe("");
      expect(kebabCase("@#$%^&*")).toBe("");
    });
  });

  describe("given a single word", (): void => {
    test("returns the normalized word without adding separators", (): void => {
      expect(kebabCase("hello")).toBe("hello");
      expect(kebabCase("Hello")).toBe("hello");
      expect(kebabCase("HELLO")).toBe("hello");
    });

    test("preserves a numeric-only word", (): void => {
      expect(kebabCase("123456789")).toBe("123456789");
    });
  });

  describe("given a kebab-case result", (): void => {
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
        const result: string = kebabCase(input);

        expect(kebabCase(result)).toBe(result);
      }
    });
  });

  describe("given an empty or nullish value", (): void => {
    test("returns an empty string for an empty string", (): void => {
      expect(kebabCase("")).toBe("");
    });

    test("returns an empty string for null", (): void => {
      expect(kebabCase(null)).toBe("");
    });

    test("returns an empty string for undefined", (): void => {
      expect(kebabCase(undefined)).toBe("");
    });
  });
});
