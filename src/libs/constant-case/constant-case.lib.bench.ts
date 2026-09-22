import { describe, test, TestContext } from "vitest";

import { constantCase } from "./constant-case.lib";

const shortPascalCase: string = "XMLHttpRequestResponseCodeHandler";
const input1KB: string = "get-HTTP-response-code-version-2.0-API ".repeat(20);
const input10KB: string = "get-HTTP-response-code-version-2.0-API ".repeat(200);
const input100KB: string = "get-HTTP-response-code-version-2.0-API ".repeat(2000);
const longUnicodeInput: string = "Привет-Мир café-noir 你好-世界 こんにちは-世界 مرحبا-بالعالم ".repeat(100);
const separatorHeavyInput: string = "---foo---bar___baz...qux!!!".repeat(1000);
const mixedCaseInput: string = "aAaAaAaAaAaAaAaAaAaAaAaAaAaAaA".repeat(1000);

describe("constantCase", (): void => {
  test("given common short ASCII inputs", ({ bench }: TestContext): void => {
    bench("hyphen-separated lowercase", (): void => {
      constantCase("foo-bar");
    });

    bench("already CONSTANT_CASE", (): void => {
      constantCase("FOO_BAR");
    });

    bench("camelCase", (): void => {
      constantCase("fooBar");
    });

    bench("PascalCase", (): void => {
      constantCase(shortPascalCase);
    });

    bench("acronym followed by word", (): void => {
      constantCase("HTTPResponseCode");
    });

    bench("mixed words and numbers", (): void => {
      constantCase("version-2-0");
    });
  });

  test("given inputs of increasing size", ({ bench }: TestContext): void => {
    bench("approximately 1 KB input", (): void => {
      constantCase(input1KB);
    });

    bench("approximately 10 KB input", (): void => {
      constantCase(input10KB);
    });

    bench("approximately 100 KB input", (): void => {
      constantCase(input100KB);
    });
  });

  test("given Unicode input", ({ bench }: TestContext): void => {
    bench("long Unicode input", (): void => {
      constantCase(longUnicodeInput);
    });

    bench("combining marks", (): void => {
      constantCase("cafe\u0301 noir");
    });

    bench("Cyrillic", (): void => {
      constantCase("Привет Мир");
    });

    bench("CJK", (): void => {
      constantCase("你好 世界");
    });

    bench("Arabic", (): void => {
      constantCase("مرحبا بالعالم");
    });
  });

  test("given separator-heavy input", ({ bench }: TestContext): void => {
    bench("long separator-heavy input", (): void => {
      constantCase(separatorHeavyInput);
    });
  });

  test("given mixed-case input", ({ bench }: TestContext): void => {
    bench("long mixed-case input", (): void => {
      constantCase(mixedCaseInput);
    });
  });

  test("given simple inputs", ({ bench }: TestContext): void => {
    bench("single word", (): void => {
      constantCase("hello");
    });

    bench("numeric-only input", (): void => {
      constantCase("123456789");
    });
  });

  test("given an empty or nullish value", ({ bench }: TestContext): void => {
    bench("empty string", (): void => {
      constantCase("");
    });

    bench("null", (): void => {
      constantCase(null);
    });

    bench("undefined", (): void => {
      constantCase(undefined);
    });
  });
});
