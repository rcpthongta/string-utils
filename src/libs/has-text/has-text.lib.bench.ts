import { describe, test, TestContext } from "vitest";

import { hasText } from "./has-text.lib";

const shortText: string = "hello";
const longText: string = "the quick brown fox jumps over the lazy dog ".repeat(100);
const longWhitespace: string = " ".repeat(1_000);
const longWhitespaceWithTextAtEnd: string = " ".repeat(1_000) + "a";
const longTextWithTrailingWhitespace: string = "a" + " ".repeat(1_000);
const longText1KB: string = "a".repeat(1_000);
const longText100KB: string = "a".repeat(100_000);

describe("hasText", (): void => {
  test("given common short inputs", ({ bench }: TestContext): void => {
    bench("non-whitespace text", (): void => {
      hasText(shortText);
    });

    bench("single non-whitespace character", (): void => {
      hasText("a");
    });

    bench("single whitespace character", (): void => {
      hasText(" ");
    });

    bench("whitespace-only string", (): void => {
      hasText("   ");
    });
  });

  test("given long inputs", ({ bench }: TestContext): void => {
    bench("long text", (): void => {
      hasText(longText);
    });

    bench("1 KB non-whitespace string", (): void => {
      hasText(longText1KB);
    });

    bench("100 KB non-whitespace string", (): void => {
      hasText(longText100KB);
    });

    bench("long whitespace-only string", (): void => {
      hasText(longWhitespace);
    });

    bench("non-whitespace at the beginning", (): void => {
      hasText(longTextWithTrailingWhitespace);
    });

    bench("non-whitespace at the end", (): void => {
      hasText(longWhitespaceWithTextAtEnd);
    });
  });

  test("given Unicode input", ({ bench }: TestContext): void => {
    bench("CJK", (): void => {
      hasText("你好世界");
    });

    bench("Arabic", (): void => {
      hasText("مرحبا بالعالم");
    });

    bench("Thai", (): void => {
      hasText("สวัสดีชาวโลก");
    });

    bench("accented Latin", (): void => {
      hasText("café");
    });

    bench("combining marks", (): void => {
      hasText("cafe\u0301");
    });

    bench("emoji", (): void => {
      hasText("🎉🚀🌟");
    });
  });

  test("given Unicode whitespace", ({ bench }: TestContext): void => {
    bench("non-breaking spaces only", (): void => {
      hasText("\u00A0\u00A0\u00A0");
    });

    bench("ideographic spaces only", (): void => {
      hasText("\u3000\u3000\u3000");
    });

    bench("mixed Unicode whitespace only", (): void => {
      hasText(" \t\n\r\u00A0\u2003\u202F\u3000 ");
    });

    bench("text surrounded by Unicode whitespace", (): void => {
      hasText("\u00A0\u3000hello\u2003");
    });
  });

  test("given symbols and emojis", ({ bench }: TestContext): void => {
    bench("symbol-only string", (): void => {
      hasText("!@#$%^&*()");
    });

    bench("single emoji", (): void => {
      hasText("🔥");
    });

    bench("multiple emojis", (): void => {
      hasText("🎉🚀🌟");
    });
  });

  test("given non-string values", ({ bench }: TestContext): void => {
    bench("number", (): void => {
      hasText(12345);
    });

    bench("boolean", (): void => {
      hasText(true);
    });

    bench("object", (): void => {
      hasText({ length: 5 });
    });

    bench("object with text property", (): void => {
      hasText({ text: "hello" });
    });

    bench("array", (): void => {
      hasText(["hello"]);
    });

    bench("function", (): void => {
      hasText(() => {});
    });

    bench("symbol", (): void => {
      hasText(Symbol("text"));
    });
  });

  test("given an empty or nullish value", ({ bench }: TestContext): void => {
    bench("empty string", (): void => {
      hasText("");
    });

    bench("null", (): void => {
      hasText(null);
    });

    bench("undefined", (): void => {
      hasText(undefined);
    });
  });
});
