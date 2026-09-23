import { describe, test, TestContext } from "vitest";

import { collapseWhitespace } from "./collapse-whitespace.lib";

const normalizedShort: string = "Hello World";
const mixedWhitespaceShort: string = " \tHello \n\t World \r ";
const normalizedLong: string = "the quick brown fox jumps over the lazy dog ".repeat(100);
const mixedWhitespaceLong: string = "the  quick\tbrown\n\nfox   jumps\r\nover   the\tlazy  dog ".repeat(100);
const input1KB: string = "the  quick\tbrown\nfox   jumps\r\nover   the\tlazy  dog ".repeat(20);
const input10KB: string = "the  quick\tbrown\nfox   jumps\r\nover   the\tlazy  dog ".repeat(200);
const input100KB: string = "the  quick\tbrown\nfox   jumps\r\nover   the\tlazy  dog ".repeat(2000);
const separatorHeavyInput: string = "foo                              bar".repeat(1000);
const whitespaceOnlyInput: string = " ".repeat(1000);

const mixedUnicodeWhitespace: string = "Hello\u00A0\u3000\u2009World\u2003\u00A0".repeat(100);

describe("collapseWhitespace", (): void => {
  test("given common short inputs", ({ bench }: TestContext): void => {
    bench("already normalized", (): void => {
      collapseWhitespace(normalizedShort);
    });

    bench("consecutive spaces", (): void => {
      collapseWhitespace("Hello  World");
    });

    bench("leading and trailing whitespace", (): void => {
      collapseWhitespace("  Hello World  ");
    });

    bench("mixed whitespace", (): void => {
      collapseWhitespace(mixedWhitespaceShort);
    });
  });

  test("given long inputs", ({ bench }: TestContext): void => {
    bench("already normalized long input", (): void => {
      collapseWhitespace(normalizedLong);
    });

    bench("mixed whitespace long input", (): void => {
      collapseWhitespace(mixedWhitespaceLong);
    });
  });

  test("given inputs of increasing size", ({ bench }: TestContext): void => {
    bench("approximately 1 KB input", (): void => {
      collapseWhitespace(input1KB);
    });

    bench("approximately 10 KB input", (): void => {
      collapseWhitespace(input10KB);
    });

    bench("approximately 100 KB input", (): void => {
      collapseWhitespace(input100KB);
    });
  });

  test("given Unicode whitespace", ({ bench }: TestContext): void => {
    bench("non-breaking spaces", (): void => {
      collapseWhitespace("Hello\u00A0\u00A0World");
    });

    bench("ideographic spaces", (): void => {
      collapseWhitespace("Hello\u3000\u3000World");
    });

    bench("thin and em spaces", (): void => {
      collapseWhitespace("Hello\u2009\u2003World");
    });

    bench("mixed Unicode whitespace", (): void => {
      collapseWhitespace(mixedUnicodeWhitespace);
    });
  });

  test("given separator-heavy input", ({ bench }: TestContext): void => {
    bench("long repeated spaces", (): void => {
      collapseWhitespace(separatorHeavyInput);
    });

    bench("whitespace-only input", (): void => {
      collapseWhitespace(whitespaceOnlyInput);
    });
  });

  test("given an empty or nullish value", ({ bench }: TestContext): void => {
    bench("empty string", (): void => {
      collapseWhitespace("");
    });

    bench("null", (): void => {
      collapseWhitespace(null);
    });

    bench("undefined", (): void => {
      collapseWhitespace(undefined);
    });
  });
});
