import { describe, expect, test } from "vitest";

import { createFormatter, format } from "./format.lib";

describe("format", (): void => {
  describe("basic indexed placeholders", (): void => {
    test("replaces a single placeholder with a string argument", (): void => {
      expect(format("Hello {0}!", "World")).toBe("Hello World!");
    });

    test("replaces multiple placeholders with their respective arguments", (): void => {
      expect(format("{0} + {1} = {2}", 1, 2, 3)).toBe("1 + 2 = 3");
    });

    test("replaces repeated occurrences of the same index", (): void => {
      expect(format("{0} and {0}", "echo")).toBe("echo and echo");
    });

    test("replaces placeholders at the start and end of the template", (): void => {
      expect(format("{0}{1}", "A", "B")).toBe("AB");
    });

    test("handles a template with only a placeholder", (): void => {
      expect(format("{0}", "value")).toBe("value");
    });
  });

  describe("primitive type arguments", (): void => {
    test("converts a number argument to its string representation", (): void => {
      expect(format("Count: {0}", 42)).toBe("Count: 42");
      expect(format("Pi: {0}", 3.14)).toBe("Pi: 3.14");
      expect(format("Negative: {0}", -1)).toBe("Negative: -1");
      expect(format("Zero: {0}", 0)).toBe("Zero: 0");
    });

    test("converts NaN to the string 'NaN'", (): void => {
      expect(format("Value: {0}", NaN)).toBe("Value: NaN");
    });

    test("converts Infinity to the string 'Infinity'", (): void => {
      expect(format("Value: {0}", Infinity)).toBe("Value: Infinity");
    });

    test("converts -Infinity to the string '-Infinity'", (): void => {
      expect(format("Value: {0}", -Infinity)).toBe("Value: -Infinity");
    });

    test("converts a boolean argument to its string representation", (): void => {
      expect(format("Active: {0}", true)).toBe("Active: true");
      expect(format("Disabled: {0}", false)).toBe("Disabled: false");
    });

    test("converts a null argument to the string 'null'", (): void => {
      expect(format("Value: {0}", null)).toBe("Value: null");
    });

    test("converts an undefined argument to the string 'undefined'", (): void => {
      expect(format("Value: {0}", undefined)).toBe("Value: undefined");
    });
  });

  describe("dot-notation object access", (): void => {
    test("resolves a top-level property", (): void => {
      expect(format("Hello {0.name}", { name: "Alice" })).toBe("Hello Alice");
    });

    test("resolves multiple properties from the same object", (): void => {
      expect(format("{0.first} {0.last}", { first: "John", last: "Doe" })).toBe("John Doe");
    });

    test("resolves a deeply nested property", (): void => {
      const data: Record<string, unknown> = {
        users: [{ name: "Bob", age: 30 }]
      };
      expect(format("{0.users.0.name} is {0.users.0.age}", data)).toBe("Bob is 30");
    });

    test("resolves a numeric property on a nested object", (): void => {
      expect(
        format("Hello {0.name}, you have {0.messages.0} new messages.", {
          name: "John",
          messages: [5]
        })
      ).toBe("Hello John, you have 5 new messages.");
    });

    test("returns 'undefined' for a missing property path", (): void => {
      expect(format("{0.x.y}", { x: {} })).toBe("undefined");
    });

    test("returns 'undefined' for a path through a null property", (): void => {
      expect(format("{0.a.b}", { a: null })).toBe("undefined");
    });
  });

  describe("dot-notation array access", (): void => {
    test("resolves array elements by index", (): void => {
      expect(format("First: {0.0}, Second: {0.1}", ["Alice", "Bob"])).toBe("First: Alice, Second: Bob");
    });

    test("resolves nested arrays", (): void => {
      expect(format("{0.0.0}", [["deep"]])).toBe("deep");
    });

    test("returns 'undefined' for an out-of-bounds array index", (): void => {
      expect(format("{0.5}", ["only"])).toBe("undefined");
    });
  });

  describe("dot-notation array of objects", (): void => {
    test("resolves object properties inside arrays", (): void => {
      const users: Array<Record<string, unknown>> = [
        { name: "Alice", role: "admin" },
        { name: "Bob", role: "user" }
      ];
      expect(format("{0.0.name} ({0.0.role}), {0.1.name} ({0.1.role})", users)).toBe("Alice (admin), Bob (user)");
    });
  });

  describe("whole object and array arguments", (): void => {
    test("serializes a plain object via JSON.stringify", (): void => {
      expect(format("{0}", { key: "val" })).toBe('{"key":"val"}');
    });

    test("serializes an array via JSON.stringify", (): void => {
      expect(format("{0}", [1, 2, 3])).toBe("[1,2,3]");
    });

    test("serializes a nested object via JSON.stringify", (): void => {
      expect(format("{0}", { a: { b: 1 } })).toBe('{"a":{"b":1}}');
    });

    test("returns 'undefined' for a Symbol argument", (): void => {
      expect(format("{0}", Symbol("test"))).toBe("undefined");
    });

    test("returns 'undefined' for a Function argument", (): void => {
      expect(format("{0}", (): void => {})).toBe("undefined");
    });

    test("returns 'undefined' for a circular object", (): void => {
      const circular: Record<string, unknown> = {};
      circular["self"] = circular;
      expect(format("{0}", circular)).toBe("undefined");
    });
  });

  describe("mixed type arguments", (): void => {
    test("interpolates string, number, and boolean arguments", (): void => {
      expect(format("{0} has {1} items, active: {2}", "Cart", 5, true)).toBe("Cart has 5 items, active: true");
    });

    test("interpolates object and array arguments with dot-notation", (): void => {
      expect(format("{0.name} bought {1.0} and {1.1}", { name: "Alice" }, ["Apple", "Banana"])).toBe(
        "Alice bought Apple and Banana"
      );
    });
  });

  describe("no-placeholder templates", (): void => {
    test("returns the template string as-is", (): void => {
      expect(format("plain text")).toBe("plain text");
    });

    test("returns the template as-is even when arguments are provided", (): void => {
      expect(format("no placeholders", "arg1", "arg2")).toBe("no placeholders");
    });

    test("returns the template as-is for an empty-arguments call", (): void => {
      expect(format("hello")).toBe("hello");
    });
  });

  describe("missing or out-of-range indices", (): void => {
    test("returns 'undefined' for a missing argument index", (): void => {
      expect(format("{0} {1}", "only")).toBe("only undefined");
    });

    test("returns 'undefined' for an out-of-range index", (): void => {
      expect(format("{5}", "a", "b")).toBe("undefined");
    });

    test("returns 'undefined' when root argument is null with a dot path", (): void => {
      expect(format("{0.name}", null)).toBe("undefined");
    });

    test("returns 'undefined' when root argument is undefined with a dot path", (): void => {
      expect(format("{0.name}", undefined)).toBe("undefined");
    });
  });

  describe("malformed placeholders", (): void => {
    test("preserves braces that do not match the placeholder pattern", (): void => {
      expect(format("{ 0 }", "value")).toBe("{ 0 }");
      expect(format("{}", "value")).toBe("{}");
      expect(format("{abc}", "value")).toBe("{abc}");
    });

    test("preserves unclosed braces", (): void => {
      expect(format("{0 is open", "value")).toBe("{0 is open");
    });

    test("preserves placeholders with negative indices", (): void => {
      expect(format("{-1}", "value")).toBe("{-1}");
    });

    test("preserves placeholders with leading dot paths", (): void => {
      expect(format("{.name}", "value")).toBe("{.name}");
    });

    test("preserves placeholders with trailing dots", (): void => {
      expect(format("{0.}", "value")).toBe("{0.}");
    });

    test("preserves placeholders with consecutive dots", (): void => {
      expect(format("{0..name}", "value")).toBe("{0..name}");
    });

    test("replaces only the inner placeholder when braces are doubled", (): void => {
      expect(format("{{0}}", "value")).toBe("{value}");
    });
  });

  describe("prototype and inherited properties", (): void => {
    test("resolves own properties", (): void => {
      const obj: Record<string, unknown> = { own: "value" };
      expect(format("{0.own}", obj)).toBe("value");
    });

    test("resolves inherited properties from the prototype chain", (): void => {
      const proto: Record<string, unknown> = { inherited: "parent" };
      const obj: Record<string, unknown> = Object.create(proto) as Record<string, unknown>;
      expect(format("{0.inherited}", obj)).toBe("parent");
    });

    test("returns 'undefined' for function-valued properties", (): void => {
      expect(format("{0.toString}", {})).toBe("undefined");
    });
  });

  describe("Unicode and combining marks", (): void => {
    test("handles CJK characters", (): void => {
      expect(format("Hello {0}", "世界")).toBe("Hello 世界");
    });

    test("handles Thai characters", (): void => {
      expect(format("สวัสดี {0}", "โลก")).toBe("สวัสดี โลก");
    });

    test("handles Arabic characters", (): void => {
      expect(format("{0} {1}", "مرحبا", "بالعالم")).toBe("مرحبا بالعالم");
    });

    test("handles combining marks", (): void => {
      expect(format("cafe\u0301: {0}", "open")).toBe("cafe\u0301: open");
    });

    test("handles emoji", (): void => {
      expect(format("{0} {1}", "Hello", "🌍")).toBe("Hello 🌍");
    });
  });

  describe("empty and nullish", (): void => {
    test("returns an empty string", (): void => {
      expect(format("")).toBe("");
      expect(format(null)).toBe("");
      expect(format(undefined)).toBe("");
    });
  });
});

describe("createFormatter", (): void => {
  describe("valid template", (): void => {
    test("returns a reusable function that formats arguments", (): void => {
      const greet: (...args: unknown[]) => string = createFormatter("Hello {0}, welcome to {1}!");
      expect(greet("Alice", "Wonderland")).toBe("Hello Alice, welcome to Wonderland!");
      expect(greet("Bob", "the Matrix")).toBe("Hello Bob, welcome to the Matrix!");
    });

    test("supports dot-notation in the pre-bound template", (): void => {
      const fmt: (...args: unknown[]) => string = createFormatter("{0.name} is {0.age} years old");
      expect(fmt({ name: "Alice", age: 30 })).toBe("Alice is 30 years old");
      expect(fmt({ name: "Bob", age: 25 })).toBe("Bob is 25 years old");
    });

    test("returns the template as-is when the formatter is called with no arguments", (): void => {
      const fmt: (...args: unknown[]) => string = createFormatter("Hello {0}!");
      expect(fmt()).toBe("Hello undefined!");
    });
  });

  describe("no-placeholder template", (): void => {
    test("returns the template as-is on every call", (): void => {
      const fmt: (...args: unknown[]) => string = createFormatter("static text");
      expect(fmt()).toBe("static text");
      expect(fmt("ignored")).toBe("static text");
    });
  });

  describe("empty and nullish", (): void => {
    test("returns a function that always returns an empty string", (): void => {
      const fmtEmpty: (...args: unknown[]) => string = createFormatter("");
      expect(fmtEmpty("anything")).toBe("");

      const fmtNull: (...args: unknown[]) => string = createFormatter(null);
      expect(fmtNull("anything")).toBe("");

      const fmtUndefined: (...args: unknown[]) => string = createFormatter(undefined);
      expect(fmtUndefined("anything")).toBe("");
    });
  });
});
