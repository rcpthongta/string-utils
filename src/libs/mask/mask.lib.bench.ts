import { describe, test, TestContext } from "vitest";

import { createMask, mask } from "./mask.lib";

const compiledPhoneMask: (value: string | null | undefined) => string = createMask("(###) ###-####");
const compiledFlexibleMask: (value: string | null | undefined) => string = createMask("(###) ###-####", {
  fallbackPatterns: ["(##) ###-####"]
});
const compiledUnicodeMask: (value: string | null | undefined) => string = createMask("*-*-*-*-*-*", {
  mode: "grapheme"
});

const longDigits: string = "0812345678".repeat(100);
const longMixedInput: string = "ABC1234XYZ5678".repeat(50);
const longSeparators: string = "---081---234---5678---".repeat(50);

describe("mask", (): void => {
  test("short ASCII", ({ bench }: TestContext): void => {
    bench("phone number mask", (): void => {
      mask("0812345678", "(###) ###-####");
    });

    bench("credit card mask", (): void => {
      mask("1234567890123456", "#### #### #### ####");
    });

    bench("postal code mask with letters and digits", (): void => {
      mask("K9V1B2", "A#A #A#");
    });
  });

  test("long input", ({ bench }: TestContext): void => {
    bench("long digits non-matching", (): void => {
      mask(longDigits, "(###) ###-####");
    });

    bench("long mixed alphanumeric non-matching", (): void => {
      mask(longMixedInput, "AAA-####-AAA-####");
    });

    bench("long separators non-matching", (): void => {
      mask(longSeparators, "(###) ###-####");
    });

    bench("long serial alphanumeric code", (): void => {
      mask("HTTP20API1234567890XYZ9999ABCD", "AAAA-##-AAA-####-####-####-AAA-####");
    });
  });

  test("Unicode and combining marks", ({ bench }: TestContext): void => {
    bench("Thai letters and digits", (): void => {
      mask("กขค123456", "AAA-###-###");
    });

    bench("combining marks with grapheme mode", (): void => {
      mask("cafe\u0301123456", "AAAA-###-###", { mode: "grapheme" });
    });

    bench("emojis with codePoint mode", (): void => {
      mask("😀😀123456", "**-###-###", { mode: "codePoint" });
    });
  });

  test("excessive separators", ({ bench }: TestContext): void => {
    bench("input heavily padded with separators and hyphens", (): void => {
      mask("---081---234---5678---", "(###) ###-####");
    });
  });

  test("3-mode comparison", ({ bench }: TestContext): void => {
    bench("ASCII [utf16]", (): void => {
      mask("0812345678", "(###) ###-####", { mode: "utf16" });
    });

    bench("ASCII [codePoint]", (): void => {
      mask("0812345678", "(###) ###-####", { mode: "codePoint" });
    });

    bench("ASCII [grapheme]", (): void => {
      mask("0812345678", "(###) ###-####", { mode: "grapheme" });
    });

    bench("Emoji [utf16]", (): void => {
      mask("😀😀😀😀", "**-**", { mode: "utf16" });
    });

    bench("Emoji [codePoint]", (): void => {
      mask("😀😀😀😀", "**-**", { mode: "codePoint" });
    });

    bench("Emoji [grapheme]", (): void => {
      mask("😀😀😀😀", "**-**", { mode: "grapheme" });
    });
  });

  test("empty and nullish", ({ bench }: TestContext): void => {
    bench("empty string", (): void => {
      mask("", "(###) ###-####");
    });

    bench("null", (): void => {
      mask(null, "(###) ###-####");
    });

    bench("undefined", (): void => {
      mask(undefined, "(###) ###-####");
    });
  });
});

describe("createMask", (): void => {
  test("compile overhead", ({ bench }: TestContext): void => {
    bench("simple pattern", (): void => {
      createMask("(###) ###-####");
    });

    bench("alphanumeric pattern", (): void => {
      createMask("AAA-####-AAA-####");
    });

    bench("pattern with fallbackPatterns", (): void => {
      createMask("(###) ###-####", { fallbackPatterns: ["(##) ###-####"] });
    });

    bench("grapheme mode pattern", (): void => {
      createMask("*-*-*-*-*-*", { mode: "grapheme" });
    });
  });

  test("pre-compiled reuse", ({ bench }: TestContext): void => {
    bench("phone number call", (): void => {
      compiledPhoneMask("0812345678");
    });

    bench("fallbackPatterns call", (): void => {
      compiledFlexibleMask("021234567");
    });

    bench("grapheme mode call", (): void => {
      compiledUnicodeMask("👨‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👩‍👧‍👦");
    });
  });
});

describe("mask vs createMask comparison", (): void => {
  test("phone number pattern", async ({ bench }: TestContext): Promise<void> => {
    const pattern: string = "(###) ###-####";
    const compiled: (value: string | null | undefined) => string = createMask(pattern);

    await bench.compare(
      bench("mask() one-shot", (): void => {
        mask("0812345678", pattern);
      }),
      bench("createMask() pre-compiled", (): void => {
        compiled("0812345678");
      })
    );
  });

  test("grapheme mode pattern", async ({ bench }: TestContext): Promise<void> => {
    const pattern: string = "*-*-*-*-*-*";
    const compiled: (value: string | null | undefined) => string = createMask(pattern, { mode: "grapheme" });

    await bench.compare(
      bench("mask() grapheme one-shot", (): void => {
        mask("👨‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👩‍👧‍👦", pattern, { mode: "grapheme" });
      }),
      bench("createMask() grapheme pre-compiled", (): void => {
        compiled("👨‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👩‍👧‍👦");
      })
    );
  });
});
