import { describe, test, TestContext } from "vitest";

import { kebabCase } from "./kebab-case.lib";

const longSlug: string = "get-HTTP-response-code-version-2.0-API ".repeat(100);
const longPascalCase: string = "XMLHttpRequestResponseCodeHandler".repeat(100);
const longCamelCase: string = "xmlHttpRequestResponseCodeHandler".repeat(100);
const longAllCaps: string = "MAX_RETRY_COUNT_FOR_HTTP_500_ERRORS ".repeat(100);
const longUnicode: string = "Привет-Мир café-noir 你好-世界 こんにちは-世界 مرحبا-بالعالم ".repeat(100);
const longSeparators: string = "---foo---bar___baz...qux!!!".repeat(100);
const longWhitespace: string = " ".repeat(1_000);
const longSymbols: string = "!@#$%^&*()_+-=[]{}|;:',.<>?/`~".repeat(100);

describe("kebabCase", (): void => {
  test("given common short inputs", ({ bench }: TestContext): void => {
    bench("hyphen-separated lowercase", (): void => {
      kebabCase("foo-bar");
    });

    bench("underscore-separated uppercase", (): void => {
      kebabCase("FOO_BAR");
    });

    bench("camelCase", (): void => {
      kebabCase("fooBar");
    });

    bench("PascalCase", (): void => {
      kebabCase("FooBar");
    });

    bench("single word", (): void => {
      kebabCase("hello");
    });

    bench("single character", (): void => {
      kebabCase("A");
    });
  });

  test("given numbers and acronyms", ({ bench }: TestContext): void => {
    bench("numeric-only input", (): void => {
      kebabCase("123456789");
    });

    bench("word with numbers", (): void => {
      kebabCase("version-2-0");
    });

    bench("number followed by word", (): void => {
      kebabCase("2foo");
    });

    bench("word followed by number", (): void => {
      kebabCase("foo2bar");
    });

    bench("acronym followed by word", (): void => {
      kebabCase("HTTPResponse");
    });

    bench("word followed by acronym", (): void => {
      kebabCase("parseHTTP");
    });

    bench("multiple acronyms", (): void => {
      kebabCase("HTTPJSONAPIResponse");
    });
  });

  test("given long inputs", ({ bench }: TestContext): void => {
    bench("long slug with acronyms and numbers", (): void => {
      kebabCase(longSlug);
    });

    bench("long PascalCase with acronyms", (): void => {
      kebabCase(longPascalCase);
    });

    bench("long camelCase with acronyms", (): void => {
      kebabCase(longCamelCase);
    });

    bench("long ALL_CAPS with numbers", (): void => {
      kebabCase(longAllCaps);
    });

    bench("long Unicode input", (): void => {
      kebabCase(longUnicode);
    });
  });

  test("given Unicode input", ({ bench }: TestContext): void => {
    bench("accented Latin", (): void => {
      kebabCase("crème-brûlée");
    });

    bench("combining marks", (): void => {
      kebabCase("cafe\u0301 noir");
    });

    bench("Cyrillic", (): void => {
      kebabCase("Привет Мир");
    });

    bench("CJK", (): void => {
      kebabCase("你好 世界");
    });

    bench("Hiragana", (): void => {
      kebabCase("こんにちは 世界");
    });

    bench("Hangul", (): void => {
      kebabCase("안녕하세요 세계");
    });

    bench("Arabic", (): void => {
      kebabCase("مرحبا بالعالم");
    });

    bench("Thai", (): void => {
      kebabCase("สวัสดี โลก");
    });

    bench("mixed scripts", (): void => {
      kebabCase("hello 世界 Привет");
    });
  });

  test("given excessive separators", ({ bench }: TestContext): void => {
    bench("leading and trailing separators", (): void => {
      kebabCase("---foo---bar---");
    });

    bench("repeated symbols", (): void => {
      kebabCase("...___foo!!!bar???baz...");
    });

    bench("repeated whitespace", (): void => {
      kebabCase("   foo   bar   baz   ");
    });

    bench("mixed separators", (): void => {
      kebabCase("  --  foo  __  bar  ..  baz  --  ");
    });

    bench("long separator-heavy input", (): void => {
      kebabCase(longSeparators);
    });
  });

  test("given non-extractable input", ({ bench }: TestContext): void => {
    bench("symbol-only input", (): void => {
      kebabCase("!@#$%^&*()_+-=[]{}");
    });

    bench("long symbol-only input", (): void => {
      kebabCase(longSymbols);
    });

    bench("separator-only input", (): void => {
      kebabCase("---___...");
    });

    bench("long whitespace-only input", (): void => {
      kebabCase(longWhitespace);
    });
  });

  test("given an empty or nullish value", ({ bench }: TestContext): void => {
    bench("empty string", (): void => {
      kebabCase("");
    });

    bench("null", (): void => {
      kebabCase(null);
    });

    bench("undefined", (): void => {
      kebabCase(undefined);
    });
  });
});
