import { describe, test, TestContext } from "vitest";

import { redact } from "./redact.lib";

const longText: string = "the quick brown fox jumps over the lazy dog 0812345678 ".repeat(100);
const longUnicode: string = "😀👨‍👩‍👧‍👦cafe\u0301 你好мир ".repeat(100);
const longSeparators: string = "---foo---bar---baz---".repeat(100);

describe("redact", (): void => {
  test("short ASCII", ({ bench }: TestContext): void => {
    bench("default options", (): void => {
      redact("0812345678");
    });

    bench("custom replacement string", (): void => {
      redact("0812345678", "#");
    });

    bench("visibleStart number shorthand", (): void => {
      redact("0812345678", 4);
    });

    bench("options object visibleStart and visibleEnd", (): void => {
      redact("0812345678", { visibleStart: 3, visibleEnd: 2 });
    });
  });

  test("long input", ({ bench }: TestContext): void => {
    bench("long ASCII default", (): void => {
      redact(longText);
    });

    bench("long ASCII with visibleStart and visibleEnd", (): void => {
      redact(longText, { visibleStart: 10, visibleEnd: 10 });
    });

    bench("long ASCII with custom replacement", (): void => {
      redact(longText, { visibleStart: 10, visibleEnd: 10, replacement: "X" });
    });

    bench("long Unicode [codePoint]", (): void => {
      redact(longUnicode, { visibleStart: 5, visibleEnd: 5, mode: "codePoint" });
    });

    bench("long Unicode [grapheme]", (): void => {
      redact(longUnicode, { visibleStart: 5, visibleEnd: 5, mode: "grapheme" });
    });
  });

  test("Unicode and combining marks", ({ bench }: TestContext): void => {
    bench("accented Latin with combining marks (NFD)", (): void => {
      redact("cafe\u0301 noir", { visibleStart: 4 });
    });

    bench("CJK and Arabic words", (): void => {
      redact("你好 世界 مرحبا بالعالم", { visibleStart: 2, visibleEnd: 2 });
    });

    bench("emoji [codePoint]", (): void => {
      redact("😀😀cafe\u0301 noir", { visibleStart: 1, visibleEnd: 1, mode: "codePoint" });
    });

    bench("emoji [grapheme]", (): void => {
      redact("😀👨‍👩‍👧‍👦cafe\u0301 noir", { visibleStart: 1, visibleEnd: 1, mode: "grapheme" });
    });
  });

  test("excessive separators", ({ bench }: TestContext): void => {
    bench("short separators with visibility", (): void => {
      redact("---foo---bar---baz---1234567890---", {
        visibleStart: 5,
        visibleEnd: 5,
        replacement: "*"
      });
    });

    bench("long separators with visibility", (): void => {
      redact(longSeparators, { visibleStart: 10, visibleEnd: 10 });
    });
  });

  test("3-mode comparison", ({ bench }: TestContext): void => {
    bench("ASCII [utf16]", (): void => {
      redact("Hello World", { visibleStart: 2, visibleEnd: 2, mode: "utf16" });
    });

    bench("ASCII [codePoint]", (): void => {
      redact("Hello World", { visibleStart: 2, visibleEnd: 2, mode: "codePoint" });
    });

    bench("ASCII [grapheme]", (): void => {
      redact("Hello World", { visibleStart: 2, visibleEnd: 2, mode: "grapheme" });
    });

    bench("Emoji [utf16]", (): void => {
      redact("😀😀😀😀", { visibleStart: 1, visibleEnd: 1, mode: "utf16" });
    });

    bench("Emoji [codePoint]", (): void => {
      redact("😀😀😀😀", { visibleStart: 1, visibleEnd: 1, mode: "codePoint" });
    });

    bench("Emoji [grapheme]", (): void => {
      redact("😀😀😀😀", { visibleStart: 1, visibleEnd: 1, mode: "grapheme" });
    });

    bench("NFD [utf16]", (): void => {
      redact("cafe\u0301 noir", { visibleStart: 4, visibleEnd: 2, mode: "utf16" });
    });

    bench("NFD [codePoint]", (): void => {
      redact("cafe\u0301 noir", { visibleStart: 4, visibleEnd: 2, mode: "codePoint" });
    });

    bench("NFD [grapheme]", (): void => {
      redact("cafe\u0301 noir", { visibleStart: 4, visibleEnd: 2, mode: "grapheme" });
    });

    bench("ZWJ emoji [utf16]", (): void => {
      redact("👨‍👩‍👧‍👦 👩‍💻", { visibleStart: 1, mode: "utf16" });
    });

    bench("ZWJ emoji [codePoint]", (): void => {
      redact("👨‍👩‍👧‍👦 👩‍💻", { visibleStart: 1, mode: "codePoint" });
    });

    bench("ZWJ emoji [grapheme]", (): void => {
      redact("👨‍👩‍👧‍👦 👩‍💻", { visibleStart: 1, mode: "grapheme" });
    });
  });

  test("empty and nullish", ({ bench }: TestContext): void => {
    bench("empty string", (): void => {
      redact("");
    });

    bench("null", (): void => {
      redact(null);
    });

    bench("undefined", (): void => {
      redact(undefined);
    });
  });
});
