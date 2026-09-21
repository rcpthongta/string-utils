import { describe, test, TestContext } from "vitest";

import { hasLength } from "./has-length.lib";

const shortText: string = "hello";
const longText1KB: string = "a".repeat(1_000);
const longText100KB: string = "a".repeat(100_000);
const whitespaceString: string = " ".repeat(1_000);
const unicodeString: string = "你好世界 مرحبا สวัสดี こんにちは café";

describe("hasLength", (): void => {
  test("given common short inputs", ({ bench }: TestContext): void => {
    bench("non-empty string", (): void => {
      hasLength(shortText);
    });

    bench("single-character string", (): void => {
      hasLength("a");
    });

    bench("whitespace-only string", (): void => {
      hasLength("   ");
    });
  });

  test("given strings of different sizes", ({ bench }: TestContext): void => {
    bench("1 KB string", (): void => {
      hasLength(longText1KB);
    });

    bench("100 KB string", (): void => {
      hasLength(longText100KB);
    });

    bench("long whitespace-only string", (): void => {
      hasLength(whitespaceString);
    });
  });

  test("given Unicode strings", ({ bench }: TestContext): void => {
    bench("Unicode string", (): void => {
      hasLength(unicodeString);
    });

    bench("emoji string", (): void => {
      hasLength("🎉🚀🌟");
    });

    bench("combining-mark string", (): void => {
      hasLength("cafe\u0301");
    });
  });

  test("given non-string values", ({ bench }: TestContext): void => {
    bench("number", (): void => {
      hasLength(12345);
    });

    bench("boolean", (): void => {
      hasLength(true);
    });

    bench("object with length property", (): void => {
      hasLength({ length: 5 });
    });

    bench("array", (): void => {
      hasLength(["a", "b", "c"]);
    });

    bench("function", (): void => {
      hasLength(() => {});
    });
  });

  test("given an empty or nullish value", ({ bench }: TestContext): void => {
    bench("empty string", (): void => {
      hasLength("");
    });

    bench("null", (): void => {
      hasLength(null);
    });

    bench("undefined", (): void => {
      hasLength(undefined);
    });
  });
});
