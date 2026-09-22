import { describe, test, TestContext } from "vitest";

import { camelCase } from "./camel-case.lib";

const shortPascalCase: string = "XMLHttpRequestResponseCodeHandler";
const input1KB: string = "get-HTTP-response-code-version-2.0-API ".repeat(20);
const input10KB: string = "get-HTTP-response-code-version-2.0-API ".repeat(200);
const input100KB: string = "get-HTTP-response-code-version-2.0-API ".repeat(2000);
const longUnicodeInput: string = "Привет-Мир café-noir 你好-世界 こんにちは-世界 مرحبا-بالعالم ".repeat(100);
const separatorHeavyInput: string = "---foo---bar___baz...qux!!!".repeat(1000);
const mixedCaseInput: string = "aAaAaAaAaAaAaAaAaAaAaAaAaAaAaA".repeat(1000);

describe("camelCase", (): void => {
  test("given common short ASCII inputs", ({ bench }: TestContext): void => {
    bench("hyphen-separated lowercase", (): void => {
      camelCase("foo-bar");
    });

    bench("already camelCase", (): void => {
      camelCase("fooBar");
    });

    bench("PascalCase", (): void => {
      camelCase(shortPascalCase);
    });

    bench("acronym followed by word", (): void => {
      camelCase("HTTPResponseCode");
    });

    bench("mixed words and numbers", (): void => {
      camelCase("version-2-0");
    });
  });

  test("given inputs of increasing size", ({ bench }: TestContext): void => {
    bench("approximately 1 KB input", (): void => {
      camelCase(input1KB);
    });

    bench("approximately 10 KB input", (): void => {
      camelCase(input10KB);
    });

    bench("approximately 100 KB input", (): void => {
      camelCase(input100KB);
    });
  });

  test("given Unicode input", ({ bench }: TestContext): void => {
    bench("long Unicode input", (): void => {
      camelCase(longUnicodeInput);
    });

    bench("combining marks", (): void => {
      camelCase("cafe\u0301 noir");
    });
  });

  test("given separator-heavy input", ({ bench }: TestContext): void => {
    bench("long separator-heavy input", (): void => {
      camelCase(separatorHeavyInput);
    });
  });

  test("given mixed-case input", ({ bench }: TestContext): void => {
    bench("long mixed-case input", (): void => {
      camelCase(mixedCaseInput);
    });
  });

  test("given simple fast-path inputs", ({ bench }: TestContext): void => {
    bench("single word", (): void => {
      camelCase("hello");
    });

    bench("numeric-only input", (): void => {
      camelCase("123456789");
    });
  });

  test("given an empty or nullish value", ({ bench }: TestContext): void => {
    bench("empty string", (): void => {
      camelCase("");
    });

    bench("null", (): void => {
      camelCase(null);
    });

    bench("undefined", (): void => {
      camelCase(undefined);
    });
  });
});
