import { describe, test, TestContext } from "vitest";

import { snakeCase } from "./snake-case.lib";

const shortPascalCase: string = "XMLHttpRequestResponseCodeHandler";
const input1KB: string = "get-HTTP-response-code-version-2.0-API ".repeat(20);
const input10KB: string = "get-HTTP-response-code-version-2.0-API ".repeat(200);
const input100KB: string = "get-HTTP-response-code-version-2.0-API ".repeat(2000);
const longUnicodeInput: string = "Привет-Мир café-noir 你好-世界 こんにちは-世界 مرحبا-بالعالم ".repeat(100);
const separatorHeavyInput: string = "---foo---bar___baz...qux!!!".repeat(1000);
const mixedCaseInput: string = "aAaAaAaAaAaAaAaAaAaAaAaAaAaAaA".repeat(1000);

describe("snakeCase", (): void => {
  test("given common short ASCII inputs", ({ bench }: TestContext): void => {
    bench("hyphen-separated lowercase", (): void => {
      snakeCase("foo-bar");
    });

    bench("underscore-separated uppercase", (): void => {
      snakeCase("FOO_BAR");
    });

    bench("camelCase", (): void => {
      snakeCase("fooBar");
    });

    bench("already snake_case", (): void => {
      snakeCase("foo_bar");
    });

    bench("PascalCase", (): void => {
      snakeCase(shortPascalCase);
    });

    bench("acronym followed by word", (): void => {
      snakeCase("HTTPResponseCode");
    });

    bench("mixed words and numbers", (): void => {
      snakeCase("version-2-0");
    });
  });

  test("given inputs of increasing size", ({ bench }: TestContext): void => {
    bench("approximately 1 KB input", (): void => {
      snakeCase(input1KB);
    });

    bench("approximately 10 KB input", (): void => {
      snakeCase(input10KB);
    });

    bench("approximately 100 KB input", (): void => {
      snakeCase(input100KB);
    });
  });

  test("given Unicode input", ({ bench }: TestContext): void => {
    bench("long Unicode input", (): void => {
      snakeCase(longUnicodeInput);
    });

    bench("combining marks", (): void => {
      snakeCase("cafe\u0301 noir");
    });

    bench("Cyrillic", (): void => {
      snakeCase("Привет Мир");
    });

    bench("CJK", (): void => {
      snakeCase("你好 世界");
    });

    bench("Arabic", (): void => {
      snakeCase("مرحبا بالعالم");
    });
  });

  test("given separator-heavy input", ({ bench }: TestContext): void => {
    bench("long separator-heavy input", (): void => {
      snakeCase(separatorHeavyInput);
    });
  });

  test("given mixed-case input", ({ bench }: TestContext): void => {
    bench("long mixed-case input", (): void => {
      snakeCase(mixedCaseInput);
    });
  });

  test("given simple inputs", ({ bench }: TestContext): void => {
    bench("single word", (): void => {
      snakeCase("hello");
    });

    bench("numeric-only input", (): void => {
      snakeCase("123456789");
    });
  });

  test("given an empty or nullish value", ({ bench }: TestContext): void => {
    bench("empty string", (): void => {
      snakeCase("");
    });

    bench("null", (): void => {
      snakeCase(null);
    });

    bench("undefined", (): void => {
      snakeCase(undefined);
    });
  });
});
