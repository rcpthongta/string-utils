import { describe, test, TestContext } from "vitest";

import { defaultIfBlank } from "./default-if-blank.lib";

const longText: string = "the quick brown fox jumps over the lazy dog ".repeat(100);
const longWhitespace: string = " ".repeat(1000);
const longWhitespaceWithTextAtStart: string = "a" + " ".repeat(1000);
const longWhitespaceWithTextAtEnd: string = " ".repeat(1000) + "a";
const longMixedWhitespace: string = " \t\n\r\u00A0\u2003\u202F\u3000 ".repeat(100);
const longTextWithSurroundingWhitespace: string = " \t\n" + longText + "\u00A0\u3000 ";

describe("defaultIfBlank", (): void => {
  test("given common short inputs", ({ bench }: TestContext): void => {
    bench("non-blank text", (): void => {
      defaultIfBlank("hello", "fallback");
    });

    bench("single non-whitespace character", (): void => {
      defaultIfBlank("a", "fallback");
    });

    bench("text with surrounding whitespace", (): void => {
      defaultIfBlank("  hello  ", "fallback");
    });

    bench("whitespace-only", (): void => {
      defaultIfBlank("   ", "fallback");
    });
  });

  test("given long inputs", ({ bench }: TestContext): void => {
    bench("long non-blank text", (): void => {
      defaultIfBlank(longText, "fallback");
    });

    bench("long whitespace-only input", (): void => {
      defaultIfBlank(longWhitespace, "fallback");
    });

    bench("non-whitespace at the beginning", (): void => {
      defaultIfBlank(longWhitespaceWithTextAtStart, "fallback");
    });

    bench("non-whitespace at the end", (): void => {
      defaultIfBlank(longWhitespaceWithTextAtEnd, "fallback");
    });

    bench("long text with surrounding whitespace", (): void => {
      defaultIfBlank(longTextWithSurroundingWhitespace, "fallback");
    });
  });

  test("given Unicode input", ({ bench }: TestContext): void => {
    bench("CJK", (): void => {
      defaultIfBlank("你好世界", "fallback");
    });

    bench("Arabic", (): void => {
      defaultIfBlank("مرحبا بالعالم", "fallback");
    });

    bench("Thai", (): void => {
      defaultIfBlank("สวัสดีชาวโลก", "fallback");
    });

    bench("accented Latin", (): void => {
      defaultIfBlank("café", "fallback");
    });

    bench("combining marks", (): void => {
      defaultIfBlank("cafe\u0301", "fallback");
    });
  });

  test("given Unicode whitespace", ({ bench }: TestContext): void => {
    bench("non-breaking spaces", (): void => {
      defaultIfBlank("\u00A0\u00A0\u00A0", "fallback");
    });

    bench("ideographic spaces", (): void => {
      defaultIfBlank("\u3000\u3000\u3000", "fallback");
    });

    bench("mixed Unicode whitespace", (): void => {
      defaultIfBlank(longMixedWhitespace, "fallback");
    });
  });

  test("given an empty or nullish value", ({ bench }: TestContext): void => {
    bench("empty string", (): void => {
      defaultIfBlank("", "fallback");
    });

    bench("null", (): void => {
      defaultIfBlank(null, "fallback");
    });

    bench("undefined", (): void => {
      defaultIfBlank(undefined, "fallback");
    });
  });
});
