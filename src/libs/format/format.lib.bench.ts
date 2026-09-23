import { describe, test, TestContext } from "vitest";

import { createFormatter, format } from "./format.lib";

const manyTemplate: string = "{0} {1} {2} {3} {4} {5} {6} {7} {8} {9} " + "{0} {1} {2} {3} {4} {5} {6} {7} {8} {9}";

const fiftyTemplate: string = Array.from(
  { length: 50 },
  (_value: unknown, index: number): string => `{${index % 10}}`
).join(" ");

const greet: (...args: unknown[]) => string = createFormatter("Hello {0}, welcome to {1}!");
const userFmt: (...args: unknown[]) => string = createFormatter("{0.name} ({0.role}) has {0.stats.score} points");
const fiftyFmt: (...args: unknown[]) => string = createFormatter(fiftyTemplate);
const nullFmt: (...args: unknown[]) => string = createFormatter(null);
const staticFmt: (...args: unknown[]) => string = createFormatter("static text with no braces");

describe("format", (): void => {
  test("short ASCII", ({ bench }: TestContext): void => {
    bench("single placeholder with string", (): void => {
      format("Hello {0}!", "World");
    });

    bench("two placeholders with primitives", (): void => {
      format("{0} has {1} items", "Cart", 5);
    });

    bench("boolean argument", (): void => {
      format("Active: {0}", true);
    });

    bench("no brace in template (early return)", (): void => {
      format("Hello World, no placeholders here");
    });
  });

  test("long input", ({ bench }: TestContext): void => {
    bench("multiple indexed arguments", (): void => {
      format("User {0} scored {1} points on {2}, active: {3}, role: {4}", "Alice", 9500, "2025-01-15", true, "admin");
    });

    bench("dot-notation object access", (): void => {
      format("{0.name} ({0.role}) has {0.stats.score} points", {
        name: "Alice",
        role: "admin",
        stats: { score: 9500 }
      });
    });

    bench("dot-notation array access", (): void => {
      format("First: {0.0}, Second: {0.1}, Third: {0.2}", ["Alice", "Bob", "Charlie"]);
    });

    bench("deep nested array-of-objects", (): void => {
      format("{0.users.0.name} and {0.users.1.name}", {
        users: [{ name: "Alice" }, { name: "Bob" }]
      });
    });

    bench("JSON.stringify fallback for whole object", (): void => {
      format("Data: {0}", { key: "value", nested: { a: 1 } });
    });
  });

  test("Unicode and combining marks", ({ bench }: TestContext): void => {
    bench("CJK arguments", (): void => {
      format("{0}は{1}です", "今日", "良い天気");
    });

    bench("Thai arguments", (): void => {
      format("สวัสดี {0}", "โลก");
    });

    bench("Arabic arguments", (): void => {
      format("{0} {1}", "مرحبا", "بالعالم");
    });

    bench("combining marks in template", (): void => {
      format("cafe\u0301: {0}, re\u0301sume\u0301: {1}", "open", "ready");
    });
  });

  test("excessive placeholders", ({ bench }: TestContext): void => {
    bench("20 placeholders with 10 arguments", (): void => {
      format(manyTemplate, "a", "b", "c", "d", "e", "f", "g", "h", "i", "j");
    });

    bench("repeated same index 10 times", (): void => {
      format("{0} {0} {0} {0} {0} {0} {0} {0} {0} {0}", "echo");
    });

    bench("50 placeholders with 10 arguments", (): void => {
      format(fiftyTemplate, "a", "b", "c", "d", "e", "f", "g", "h", "i", "j");
    });
  });

  test("empty and nullish", ({ bench }: TestContext): void => {
    bench("empty string", (): void => {
      format("");
    });

    bench("null", (): void => {
      format(null);
    });

    bench("undefined", (): void => {
      format(undefined);
    });
  });
});

describe("createFormatter", (): void => {
  test("compile overhead", ({ bench }: TestContext): void => {
    bench("simple template", (): void => {
      createFormatter("Hello {0}!");
    });

    bench("complex dot-notation", (): void => {
      createFormatter("{0.name} ({0.role}) scored {1} on {2.date}");
    });

    bench("20 placeholders", (): void => {
      createFormatter("{0} {1} {2} {3} {4} {5} {6} {7} {8} {9} {0} {1} {2} {3} {4} {5} {6} {7} {8} {9}");
    });
  });

  test("pre-compiled reuse", ({ bench }: TestContext): void => {
    bench("simple template call", (): void => {
      greet("Alice", "Wonderland");
    });

    bench("dot-notation call", (): void => {
      userFmt({ name: "Alice", role: "admin", stats: { score: 9500 } });
    });

    bench("50-placeholder call", (): void => {
      fiftyFmt("a", "b", "c", "d", "e", "f", "g", "h", "i", "j");
    });

    bench("no-placeholder call", (): void => {
      staticFmt("ignored");
    });

    bench("null template call", (): void => {
      nullFmt("anything");
    });
  });
});

describe("format vs createFormatter comparison", (): void => {
  test("simple template", async ({ bench }: TestContext): Promise<void> => {
    const template: string = "Hello {0}, welcome to {1}!";
    const compiled: (...args: unknown[]) => string = createFormatter(template);

    await bench.compare(
      bench("format() one-shot", (): void => {
        format(template, "Alice", "Wonderland");
      }),
      bench("createFormatter() pre-compiled", (): void => {
        compiled("Alice", "Wonderland");
      })
    );
  });

  test("dot-notation template", async ({ bench }: TestContext): Promise<void> => {
    const template: string = "{0.name} ({0.role}) has {0.stats.score} points";
    const compiled: (...args: unknown[]) => string = createFormatter(template);

    await bench.compare(
      bench("format() dot-notation one-shot", (): void => {
        format(template, { name: "Alice", role: "admin", stats: { score: 9500 } });
      }),
      bench("createFormatter() dot-notation pre-compiled", (): void => {
        compiled({ name: "Alice", role: "admin", stats: { score: 9500 } });
      })
    );
  });
});
