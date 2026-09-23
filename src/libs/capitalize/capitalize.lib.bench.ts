import { describe, test, TestContext } from "vitest";

import { capitalize } from "./capitalize.lib";

const longLowercaseString: string = "the quick brown fox jumps over the lazy dog ".repeat(100);
const longCapitalizedString: string = "The quick brown fox jumps over the lazy dog ".repeat(100);
const longCamelCaseString: string = "xmlHttpRequestResponseCodeHandler".repeat(100);
const longSymbols: string = "!@#$%^&*()_+-=[]{}|;:',.<>?/`~".repeat(100);
const longWhitespace: string = " ".repeat(1000);
const input1KB: string = "the quick brown fox jumps over the lazy dog ".repeat(25);
const input10KB: string = "the quick brown fox jumps over the lazy dog ".repeat(250);
const input100KB: string = "the quick brown fox jumps over the lazy dog ".repeat(2500);

describe("capitalize", (): void => {
  test("given common short ASCII inputs", ({ bench }: TestContext): void => {
    bench("lowercase first character", (): void => {
      capitalize("hello");
    });

    bench("uppercase first character (no-op)", (): void => {
      capitalize("Hello");
    });

    bench("mixed-case string", (): void => {
      capitalize("hELLO world");
    });

    bench("single character", (): void => {
      capitalize("a");
    });
  });

  test("given long inputs", ({ bench }: TestContext): void => {
    bench("long lowercase string", (): void => {
      capitalize(longLowercaseString);
    });

    bench("long already-capitalized string", (): void => {
      capitalize(longCapitalizedString);
    });

    bench("long camelCase string", (): void => {
      capitalize(longCamelCaseString);
    });
  });

  test("given inputs of increasing size", ({ bench }: TestContext): void => {
    bench("approximately 1 KB input", (): void => {
      capitalize(input1KB);
    });

    bench("approximately 10 KB input", (): void => {
      capitalize(input10KB);
    });

    bench("approximately 100 KB input", (): void => {
      capitalize(input100KB);
    });
  });

  test("given Unicode input", ({ bench }: TestContext): void => {
    bench("accented Latin", (): void => {
      capitalize("élève");
    });

    bench("combining marks", (): void => {
      capitalize("cafe\u0301");
    });

    bench("Cyrillic", (): void => {
      capitalize("привет мир");
    });

    bench("CJK", (): void => {
      capitalize("你好世界");
    });

    bench("Thai", (): void => {
      capitalize("สวัสดี");
    });

    bench("Arabic", (): void => {
      capitalize("مرحبا بالعالم");
    });
  });

  test("given non-transformable leading characters", ({ bench }: TestContext): void => {
    bench("leading whitespace", (): void => {
      capitalize("   hello world");
    });

    bench("leading separator", (): void => {
      capitalize("---hello world");
    });

    bench("symbols only", (): void => {
      capitalize(longSymbols);
    });

    bench("whitespace only", (): void => {
      capitalize(longWhitespace);
    });
  });

  test("given a Unicode uppercase mapping", ({ bench }: TestContext): void => {
    bench("character with multi-character uppercase mapping", (): void => {
      capitalize("ßeta");
    });
  });

  test("given an empty or nullish value", ({ bench }: TestContext): void => {
    bench("empty string", (): void => {
      capitalize("");
    });

    bench("null", (): void => {
      capitalize(null);
    });

    bench("undefined", (): void => {
      capitalize(undefined);
    });
  });
});
