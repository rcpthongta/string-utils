import { describe, test, TestContext } from "vitest";

import { slugify } from "./slugify.lib";

const longSlugText: string = "Get HTTP Response Code -- Version 2.0 API & More! ".repeat(100);
const longUnicodeText: string = "Crème Brûlée -- Привет, мир! -- 你好 世界 -- สวัสดี โลก ".repeat(100);
const longSeparatorsText: string = "---foo---bar___baz...qux!!!$$$%%%".repeat(100);
const longSymbols: string = "!@#$%^&*()_+-=[]{}|;:',.<>?/`~".repeat(100);
const longWhitespace: string = " ".repeat(1000);

describe("slugify", (): void => {
  test("given common short ASCII inputs", ({ bench }: TestContext): void => {
    bench("simple two-word phrase", (): void => {
      slugify("Hello World");
    });

    bench("with custom separator", (): void => {
      slugify("Hello World", { separator: "_" });
    });

    bench("with lower: false", (): void => {
      slugify("Hello World", { lower: false });
    });

    bench("already a valid slug (no-op path)", (): void => {
      slugify("hello-world");
    });
  });

  test("given numbers and acronyms", ({ bench }: TestContext): void => {
    bench("sentence with acronyms and version numbers", (): void => {
      slugify("Get HTTP Response Code -- Version 2.0 API & More!");
    });

    bench("numeric-only input", (): void => {
      slugify("123456789");
    });

    bench("word with numbers", (): void => {
      slugify("version-2-0");
    });
  });

  test("given long inputs", ({ bench }: TestContext): void => {
    bench("long text with acronyms and symbols", (): void => {
      slugify(longSlugText);
    });

    bench("long text with custom separator and no lowercase", (): void => {
      slugify(longSlugText, { separator: "_", lower: false });
    });

    bench("long Unicode text", (): void => {
      slugify(longUnicodeText);
    });

    bench("empty separator (concatenate words)", (): void => {
      slugify(longSlugText, { separator: "" });
    });
  });

  test("given Unicode and combining marks", ({ bench }: TestContext): void => {
    bench("accented Latin (NFD normalization)", (): void => {
      slugify("Crème Brûlée");
    });

    bench("accented Latin with lower: false", (): void => {
      slugify("Crème Brûlée", { lower: false });
    });

    bench("mixed accented and ASCII", (): void => {
      slugify("café au lait & crêpes");
    });

    bench("combining diacritical marks", (): void => {
      slugify("resume\u0301 naïve");
    });

    bench("CJK characters", (): void => {
      slugify("你好 世界 -- こんにちは 世界 -- 안녕하세요 세계");
    });

    bench("Cyrillic script", (): void => {
      slugify("Привет, мир! -- Быстрая коричневая лиса");
    });

    bench("Thai script with combining vowels/tones", (): void => {
      slugify("สวัสดี โลก ภาษาไทย 101");
    });

    bench("Arabic script", (): void => {
      slugify("مرحبا بالعالم -- أهلا و سهلا");
    });
  });

  test("given excessive separators", ({ bench }: TestContext): void => {
    bench("leading and trailing separators", (): void => {
      slugify("---Hello World---");
    });

    bench("consecutive separators", (): void => {
      slugify("foo!!!@@@###bar$$$%%%baz");
    });

    bench("mixed whitespace and punctuation padding", (): void => {
      slugify("  --  foo  __  bar  ..  baz  --  ");
    });

    bench("long separator-heavy input", (): void => {
      slugify(longSeparatorsText);
    });
  });

  test("given non-extractable input", ({ bench }: TestContext): void => {
    bench("symbol-only input", (): void => {
      slugify("!@#$%^&*()_+-=[]{}");
    });

    bench("long symbol-only input", (): void => {
      slugify(longSymbols);
    });

    bench("long whitespace-only input", (): void => {
      slugify(longWhitespace);
    });
  });

  test("given an empty or nullish value", ({ bench }: TestContext): void => {
    bench("empty string", (): void => {
      slugify("");
    });

    bench("null", (): void => {
      slugify(null);
    });

    bench("undefined", (): void => {
      slugify(undefined);
    });
  });
});
