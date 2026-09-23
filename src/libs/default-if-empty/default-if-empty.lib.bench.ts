import { describe, test, TestContext } from "vitest";

import { defaultIfEmpty } from "./default-if-empty.lib";

const longText: string = "the quick brown fox jumps over the lazy dog ".repeat(100);
const longWhitespace: string = " ".repeat(1000);
const longSymbols: string = "!@#$%^&*()_+-=[]{}|;:',.<>?/`~".repeat(50);
const longUnicode: string = "你好世界 مرحبا بالعالم สวัสดี こんにちは café ".repeat(100);
const longTextWithLeadingWhitespace: string = " ".repeat(1000) + "hello";
const longTextWithTrailingWhitespace: string = "hello" + " ".repeat(1000);
const input1KB: string = "the quick brown fox jumps over the lazy dog ".repeat(25);
const input10KB: string = "the quick brown fox jumps over the lazy dog ".repeat(250);
const input100KB: string = "the quick brown fox jumps over the lazy dog ".repeat(2500);

describe("defaultIfEmpty", (): void => {
  test("given common short inputs", ({ bench }: TestContext): void => {
    bench("non-empty text", (): void => {
      defaultIfEmpty("hello", "fallback");
    });

    bench("single character", (): void => {
      defaultIfEmpty("a", "fallback");
    });

    bench("whitespace-only", (): void => {
      defaultIfEmpty("   ", "fallback");
    });

    bench("symbol-only", (): void => {
      defaultIfEmpty("!@#$%^&*", "fallback");
    });
  });

  test("given long inputs", ({ bench }: TestContext): void => {
    bench("long text", (): void => {
      defaultIfEmpty(longText, "fallback");
    });

    bench("long whitespace-only input", (): void => {
      defaultIfEmpty(longWhitespace, "fallback");
    });

    bench("long symbols", (): void => {
      defaultIfEmpty(longSymbols, "fallback");
    });

    bench("long Unicode input", (): void => {
      defaultIfEmpty(longUnicode, "fallback");
    });
  });

  test("given text with surrounding whitespace", ({ bench }: TestContext): void => {
    bench("long leading whitespace", (): void => {
      defaultIfEmpty(longTextWithLeadingWhitespace, "fallback");
    });

    bench("long trailing whitespace", (): void => {
      defaultIfEmpty(longTextWithTrailingWhitespace, "fallback");
    });
  });

  test("given inputs of increasing size", ({ bench }: TestContext): void => {
    bench("approximately 1 KB input", (): void => {
      defaultIfEmpty(input1KB, "fallback");
    });

    bench("approximately 10 KB input", (): void => {
      defaultIfEmpty(input10KB, "fallback");
    });

    bench("approximately 100 KB input", (): void => {
      defaultIfEmpty(input100KB, "fallback");
    });
  });

  test("given Unicode input", ({ bench }: TestContext): void => {
    bench("CJK", (): void => {
      defaultIfEmpty("你好世界", "fallback");
    });

    bench("Arabic", (): void => {
      defaultIfEmpty("مرحبا بالعالم", "fallback");
    });

    bench("Thai", (): void => {
      defaultIfEmpty("สวัสดีชาวโลก", "fallback");
    });

    bench("accented Latin", (): void => {
      defaultIfEmpty("café", "fallback");
    });

    bench("combining marks", (): void => {
      defaultIfEmpty("cafe\u0301", "fallback");
    });
  });

  test("given Unicode whitespace", ({ bench }: TestContext): void => {
    bench("non-breaking space", (): void => {
      defaultIfEmpty("\u00A0", "fallback");
    });

    bench("ideographic space", (): void => {
      defaultIfEmpty("\u3000", "fallback");
    });

    bench("mixed Unicode whitespace", (): void => {
      defaultIfEmpty(" \t\n\r\u00A0\u2003\u202F\u3000 ", "fallback");
    });
  });

  test("given an empty or nullish value", ({ bench }: TestContext): void => {
    bench("empty string", (): void => {
      defaultIfEmpty("", "fallback");
    });

    bench("null", (): void => {
      defaultIfEmpty(null, "fallback");
    });

    bench("undefined", (): void => {
      defaultIfEmpty(undefined, "fallback");
    });
  });
});
