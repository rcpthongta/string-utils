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
  describe("given common short inputs", (): void => {
    test("benchmarks common short inputs", async ({ bench }: TestContext): Promise<void> => {
      await bench("non-whitespace text", (): void => {
        hasText(shortText);
      }).run();

      await bench("single non-whitespace character", (): void => {
        hasText("a");
      }).run();

      await bench("single whitespace character", (): void => {
        hasText(" ");
      }).run();

      await bench("whitespace-only string", (): void => {
        hasText("   ");
      }).run();
    });
  });

  describe("given long inputs", (): void => {
    test("benchmarks long inputs", async ({ bench }: TestContext): Promise<void> => {
      await bench("long text", (): void => {
        hasText(longText);
      }).run();

      await bench("1 KB non-whitespace string", (): void => {
        hasText(longText1KB);
      }).run();

      await bench("100 KB non-whitespace string", (): void => {
        hasText(longText100KB);
      }).run();

      await bench("long whitespace-only string", (): void => {
        hasText(longWhitespace);
      }).run();

      await bench("non-whitespace at the beginning", (): void => {
        hasText(longTextWithTrailingWhitespace);
      }).run();

      await bench("non-whitespace at the end", (): void => {
        hasText(longWhitespaceWithTextAtEnd);
      }).run();
    });
  });

  describe("given Unicode input", (): void => {
    test("benchmarks Unicode input", async ({ bench }: TestContext): Promise<void> => {
      await bench("CJK", (): void => {
        hasText("你好世界");
      }).run();

      await bench("Arabic", (): void => {
        hasText("مرحبا بالعالم");
      }).run();

      await bench("Thai", (): void => {
        hasText("สวัสดีชาวโลก");
      }).run();

      await bench("accented Latin", (): void => {
        hasText("café");
      }).run();

      await bench("combining marks", (): void => {
        hasText("cafe\u0301");
      }).run();

      await bench("emoji", (): void => {
        hasText("🎉🚀🌟");
      }).run();
    });
  });

  describe("given Unicode whitespace", (): void => {
    test("benchmarks Unicode whitespace", async ({ bench }: TestContext): Promise<void> => {
      await bench("non-breaking spaces only", (): void => {
        hasText("\u00A0\u00A0\u00A0");
      }).run();

      await bench("ideographic spaces only", (): void => {
        hasText("\u3000\u3000\u3000");
      }).run();

      await bench("mixed Unicode whitespace only", (): void => {
        hasText(" \t\n\r\u00A0\u2003\u202F\u3000 ");
      }).run();

      await bench("text surrounded by Unicode whitespace", (): void => {
        hasText("\u00A0\u3000hello\u2003");
      }).run();
    });
  });

  describe("given symbols and emojis", (): void => {
    test("benchmarks symbols and emojis", async ({ bench }: TestContext): Promise<void> => {
      await bench("symbol-only string", (): void => {
        hasText("!@#$%^&*()");
      }).run();

      await bench("single emoji", (): void => {
        hasText("🔥");
      }).run();

      await bench("multiple emojis", (): void => {
        hasText("🎉🚀🌟");
      }).run();
    });
  });

  describe("given non-string values", (): void => {
    test("benchmarks non-string values", async ({ bench }: TestContext): Promise<void> => {
      await bench("number", (): void => {
        hasText(12345);
      }).run();

      await bench("boolean", (): void => {
        hasText(true);
      }).run();

      await bench("object", (): void => {
        hasText({ length: 5 });
      }).run();

      await bench("object with text property", (): void => {
        hasText({ text: "hello" });
      }).run();

      await bench("array", (): void => {
        hasText(["hello"]);
      }).run();

      await bench("function", (): void => {
        hasText(() => {});
      }).run();

      await bench("symbol", (): void => {
        hasText(Symbol("text"));
      }).run();
    });
  });

  describe("given an empty or nullish value", (): void => {
    test("benchmarks empty and nullish values", async ({ bench }: TestContext): Promise<void> => {
      await bench("empty string", (): void => {
        hasText("");
      }).run();

      await bench("null", (): void => {
        hasText(null);
      }).run();

      await bench("undefined", (): void => {
        hasText(undefined);
      }).run();
    });
  });
});
