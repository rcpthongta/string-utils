import { describe, test, TestContext } from "vitest";

import { uncapitalize } from "./uncapitalize.lib";

const longCapitalizedString: string = "The quick brown fox jumps over the lazy dog ".repeat(100);
const longLowercaseString: string = "the quick brown fox jumps over the lazy dog ".repeat(100);
const longPascalCaseString: string = "XmlHttpRequestResponseCodeHandler".repeat(100);
const longSymbols: string = "!@#$%^&*()".repeat(1000);
const longWhitespace: string = " ".repeat(1000);

describe("uncapitalize", (): void => {
  test("short ASCII", ({ bench }: TestContext): void => {
    bench("uppercase first character", (): void => {
      uncapitalize("Hello");
    });

    bench("lowercase first character (no-op)", (): void => {
      uncapitalize("hello");
    });

    bench("single uppercase character", (): void => {
      uncapitalize("A");
    });

    bench("single lowercase character (no-op)", (): void => {
      uncapitalize("a");
    });
  });

  test("long ASCII", ({ bench }: TestContext): void => {
    bench("uppercase first character", (): void => {
      uncapitalize(longCapitalizedString);
    });

    bench("lowercase first character (no-op)", (): void => {
      uncapitalize(longLowercaseString);
    });

    bench("PascalCase", (): void => {
      uncapitalize(longPascalCaseString);
    });
  });

  test("Unicode", ({ bench }: TestContext): void => {
    bench("Latin uppercase first character", (): void => {
      uncapitalize("Élève");
    });

    bench("Latin lowercase first character (no-op)", (): void => {
      uncapitalize("élève");
    });

    bench("Cyrillic uppercase first character", (): void => {
      uncapitalize("Привет Мир");
    });

    bench("Cyrillic lowercase first character (no-op)", (): void => {
      uncapitalize("привет мир");
    });

    bench("CJK (no-op)", (): void => {
      uncapitalize("你好世界");
    });

    bench("Thai (no-op)", (): void => {
      uncapitalize("สวัสดี");
    });
  });

  test("non-letter first character", ({ bench }: TestContext): void => {
    bench("numbers", (): void => {
      uncapitalize("123Hello");
    });

    bench("underscore", (): void => {
      uncapitalize("_Hello");
    });

    bench("symbol", (): void => {
      uncapitalize("@Hello");
    });

    bench("emoji", (): void => {
      uncapitalize("🔥Hello");
    });
  });

  test("leading whitespace", ({ bench }: TestContext): void => {
    bench("spaces", (): void => {
      uncapitalize("   Hello World");
    });

    bench("tabs", (): void => {
      uncapitalize("\tHello World");
    });

    bench("newlines", (): void => {
      uncapitalize("\nHello World");
    });
  });

  test("leading separators", ({ bench }: TestContext): void => {
    bench("hyphens", (): void => {
      uncapitalize("---Hello World");
    });

    bench("symbols", (): void => {
      uncapitalize("!@#$%^&*()Hello");
    });
  });

  test("long no-op strings", ({ bench }: TestContext): void => {
    bench("symbols only", (): void => {
      uncapitalize(longSymbols);
    });

    bench("whitespace only", (): void => {
      uncapitalize(longWhitespace);
    });
  });

  test("empty and nullish", ({ bench }: TestContext): void => {
    bench("empty string", (): void => {
      uncapitalize("");
    });

    bench("null", (): void => {
      uncapitalize(null);
    });

    bench("undefined", (): void => {
      uncapitalize(undefined);
    });
  });
});
