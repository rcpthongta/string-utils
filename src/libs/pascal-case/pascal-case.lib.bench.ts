import { describe, test, TestContext } from "vitest";

import { pascalCase } from "./pascal-case.lib";

const shortPascalCase: string = "XMLHttpRequestResponseCodeHandler";
const input1KB: string = "get-HTTP-response-code-version-2.0-API ".repeat(20);
const input10KB: string = "get-HTTP-response-code-version-2.0-API ".repeat(200);
const input100KB: string = "get-HTTP-response-code-version-2.0-API ".repeat(2000);
const longUnicodeInput: string = "Привет-Мир café-noir 你好-世界 こんにちは-世界 مرحبا-بالعالم ".repeat(100);
const separatorHeavyInput: string = "---foo---bar___baz...qux!!!".repeat(1000);
const mixedCaseInput: string = "aAaAaAaAaAaAaAaAaAaAaAaAaAaAaA".repeat(1000);

describe("pascalCase", (): void => {
  test("given common short ASCII inputs", ({ bench }: TestContext): void => {
    bench("hyphen-separated lowercase", (): void => {
      pascalCase("foo-bar");
    });

    bench("underscore-separated uppercase", (): void => {
      pascalCase("FOO_BAR");
    });

    bench("camelCase", (): void => {
      pascalCase("fooBar");
    });

    bench("already PascalCase", (): void => {
      pascalCase(shortPascalCase);
    });

    bench("acronym followed by word", (): void => {
      pascalCase("HTTPResponseCode");
    });

    bench("mixed words and numbers", (): void => {
      pascalCase("version-2-0");
    });
  });

  test("given inputs of increasing size", ({ bench }: TestContext): void => {
    bench("approximately 1 KB input", (): void => {
      pascalCase(input1KB);
    });

    bench("approximately 10 KB input", (): void => {
      pascalCase(input10KB);
    });

    bench("approximately 100 KB input", (): void => {
      pascalCase(input100KB);
    });
  });

  test("given Unicode input", ({ bench }: TestContext): void => {
    bench("long Unicode input", (): void => {
      pascalCase(longUnicodeInput);
    });

    bench("combining marks", (): void => {
      pascalCase("cafe\u0301 noir");
    });

    bench("Cyrillic", (): void => {
      pascalCase("Привет Мир");
    });

    bench("CJK", (): void => {
      pascalCase("你好 世界");
    });

    bench("Arabic", (): void => {
      pascalCase("مرحبا بالعالم");
    });
  });

  test("given separator-heavy input", ({ bench }: TestContext): void => {
    bench("long separator-heavy input", (): void => {
      pascalCase(separatorHeavyInput);
    });
  });

  test("given mixed-case input", ({ bench }: TestContext): void => {
    bench("long mixed-case input", (): void => {
      pascalCase(mixedCaseInput);
    });
  });

  test("given simple inputs", ({ bench }: TestContext): void => {
    bench("single word", (): void => {
      pascalCase("hello");
    });

    bench("numeric-only input", (): void => {
      pascalCase("123456789");
    });
  });

  test("given an empty or nullish value", ({ bench }: TestContext): void => {
    bench("empty string", (): void => {
      pascalCase("");
    });

    bench("null", (): void => {
      pascalCase(null);
    });

    bench("undefined", (): void => {
      pascalCase(undefined);
    });
  });
});
