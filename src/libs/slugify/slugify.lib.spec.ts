import { describe, expect, test } from "vitest";

import { slugify } from "./slugify.lib";

describe("slugify", (): void => {
  describe("given a string containing standard text", (): void => {
    test("converts text to a lowercase slug", (): void => {
      expect(slugify("Hello World")).toBe("hello-world");
      expect(slugify("Hello World!")).toBe("hello-world");
      expect(slugify("Hello World 123")).toBe("hello-world-123");
    });

    test("preserves alphanumeric characters", (): void => {
      expect(slugify("Hello123")).toBe("hello123");
      expect(slugify("12345")).toBe("12345");
      expect(slugify("Version 2.0")).toBe("version-2-0");
    });

    test("collapses consecutive non-alphanumeric characters into one separator", (): void => {
      expect(slugify("Hello   World")).toBe("hello-world");
      expect(slugify("Hello---World")).toBe("hello-world");
      expect(slugify("Hello...World")).toBe("hello-world");
      expect(slugify("Hello & World")).toBe("hello-world");
      expect(slugify("Hello - & - World")).toBe("hello-world");
    });

    test("trims leading and trailing separators", (): void => {
      expect(slugify("  Hello World  ")).toBe("hello-world");
      expect(slugify("---Hello World---")).toBe("hello-world");
      expect(slugify("...Hello World...")).toBe("hello-world");
      expect(slugify("!!!Hello World!!!")).toBe("hello-world");
    });
  });

  describe("given accented and unicode characters", (): void => {
    test("normalizes accented Latin characters", (): void => {
      expect(slugify("Crème Brûlée")).toBe("creme-brulee");
      expect(slugify("café")).toBe("cafe");
      expect(slugify("naïve")).toBe("naive");
      expect(slugify("résumé")).toBe("resume");
    });

    test("normalizes uppercase accented characters before lowercasing", (): void => {
      expect(slugify("ÉLÈVE À PARIS")).toBe("eleve-a-paris");
      expect(slugify("À Propos")).toBe("a-propos");
    });

    test("removes combining diacritical marks from Latin characters", (): void => {
      expect(slugify("e\u0301")).toBe("e");
      expect(slugify("Cafe\u0301")).toBe("cafe");
    });

    test("supports CJK characters (Chinese, Japanese, Korean)", (): void => {
      expect(slugify("Hello 世界")).toBe("hello-世界");
      expect(slugify("你好 世界")).toBe("你好-世界");
      expect(slugify("中文")).toBe("中文");
      expect(slugify("こんにちは 世界")).toBe("こんにちは-世界");
      expect(slugify("カタカナ テスト")).toBe("カタカナ-テスト");
      expect(slugify("안녕하세요 세계")).toBe("안녕하세요-세계");
    });

    test("supports Cyrillic characters", (): void => {
      expect(slugify("Привет, мир!")).toBe("привет-мир");
      expect(slugify("Быстрая лиса")).toBe("быстрая-лиса");
    });

    test("supports Arabic characters", (): void => {
      expect(slugify("مرحبا بالعالم")).toBe("مرحبا-بالعالم");
      expect(slugify("أهلا و سهلا")).toBe("أهلا-و-سهلا");
    });

    test("supports Thai characters and combining marks", (): void => {
      expect(slugify("สวัสดี โลก")).toBe("สวัสดี-โลก");
      expect(slugify("ภาษาไทย 101")).toBe("ภาษาไทย-101");
    });

    test("supports Greek, Hebrew, and Devanagari scripts", (): void => {
      expect(slugify("Γειά σου Κόσμε")).toBe("γεια-σου-κοσμε");
      expect(slugify("שלום עולם")).toBe("שלום-עולם");
      expect(slugify("नमस्ते दुनिया")).toBe("नमस्ते-दुनिया");
    });
  });

  describe("given a string with whitespace", (): void => {
    test("converts whitespace between words into separators", (): void => {
      expect(slugify("Hello World")).toBe("hello-world");
      expect(slugify("Hello\tWorld")).toBe("hello-world");
      expect(slugify("Hello\nWorld")).toBe("hello-world");
      expect(slugify("Hello\r\nWorld")).toBe("hello-world");
    });

    test("handles unicode whitespace", (): void => {
      expect(slugify("Hello\u00A0World")).toBe("hello-world");
      expect(slugify("Hello\u2003World")).toBe("hello-world");
      expect(slugify("Hello\u3000World")).toBe("hello-world");
    });

    test("returns an empty string for whitespace-only input", (): void => {
      expect(slugify(" ")).toBe("");
      expect(slugify("   ")).toBe("");
      expect(slugify("\t\n\r")).toBe("");
      expect(slugify("\u00A0\u2003\u3000")).toBe("");
    });
  });

  describe("given the lower option", (): void => {
    test("converts the result to lowercase by default", (): void => {
      expect(slugify("Hello WORLD")).toBe("hello-world");
      expect(slugify("ПРИВЕТ МИР")).toBe("привет-мир");
    });

    test("preserves letter casing when lower is false", (): void => {
      expect(slugify("Hello WORLD", { lower: false })).toBe("Hello-WORLD");
      expect(slugify("Crème Brûlée", { lower: false })).toBe("Creme-Brulee");
      expect(slugify("Привет, МИР!", { lower: false })).toBe("Привет-МИР");
    });

    test("converts the result to lowercase when lower is true", (): void => {
      expect(slugify("Hello WORLD", { lower: true })).toBe("hello-world");
      expect(slugify("Привет МИР", { lower: true })).toBe("привет-мир");
    });
  });

  describe("given the separator option", (): void => {
    test("uses a custom separator", (): void => {
      expect(slugify("Hello World", { separator: "_" })).toBe("hello_world");
      expect(slugify("Hello World", { separator: "." })).toBe("hello.world");
      expect(slugify("Hello World", { separator: "~" })).toBe("hello~world");
      expect(slugify("你好 世界", { separator: "_" })).toBe("你好_世界");
    });

    test("supports multi-character separators", (): void => {
      expect(slugify("Hello World", { separator: "--" })).toBe("hello--world");
      expect(slugify("Hello World", { separator: "__" })).toBe("hello__world");
      expect(slugify("Hello World", { separator: "..." })).toBe("hello...world");
      expect(slugify("สวัสดี โลก", { separator: "--" })).toBe("สวัสดี--โลก");
    });

    test("trims repeated custom separators from the boundaries", (): void => {
      expect(slugify("  Hello World  ", { separator: "--" })).toBe("hello--world");
      expect(slugify("Hello World", { separator: "__" })).toBe("hello__world");
      expect(slugify("---Hello World---", { separator: "--" })).toBe("hello--world");
    });

    test("removes non-alphanumeric characters when the separator is empty", (): void => {
      expect(slugify("Hello, World!", { separator: "" })).toBe("helloworld");
      expect(slugify("Foo & Bar", { separator: "" })).toBe("foobar");
      expect(slugify("你好, 世界!", { separator: "" })).toBe("你好世界");
      expect(slugify("สวัสดี, โลก!", { separator: "" })).toBe("สวัสดีโลก");
    });

    test("preserves letter casing when the separator is empty and lower is false", (): void => {
      expect(
        slugify("Hello, World!", {
          separator: "",
          lower: false
        })
      ).toBe("HelloWorld");

      expect(
        slugify("Foo & Bar", {
          separator: "",
          lower: false
        })
      ).toBe("FooBar");

      expect(
        slugify("Привет, Мир!", {
          separator: "",
          lower: false
        })
      ).toBe("ПриветМир");
    });
  });

  describe("given special replacement-token strings as separators", (): void => {
    test("preserves $& as a literal separator", (): void => {
      expect(slugify("Hello World", { separator: "$&" })).toBe("hello$&world");
    });

    test("preserves $1 as a literal separator", (): void => {
      expect(slugify("Hello World", { separator: "$1" })).toBe("hello$1world");
    });

    test("preserves $` as a literal separator", (): void => {
      expect(slugify("Hello World", { separator: "$`" })).toBe("hello$`world");
    });

    test("preserves $' as a literal separator", (): void => {
      expect(slugify("Hello World", { separator: "$'" })).toBe("hello$'world");
    });
  });

  describe("given separators containing regular expression characters", (): void => {
    test("supports regex metacharacters as separators", (): void => {
      expect(slugify("Hello World", { separator: "." })).toBe("hello.world");
      expect(slugify("Hello World", { separator: "+" })).toBe("hello+world");
      expect(slugify("Hello World", { separator: "*" })).toBe("hello*world");
      expect(slugify("Hello World", { separator: "?" })).toBe("hello?world");
      expect(slugify("Hello World", { separator: "[" })).toBe("hello[world");
      expect(slugify("Hello World", { separator: "[]" })).toBe("hello[]world");
    });
  });

  describe("given punctuation and symbols", (): void => {
    test("replaces punctuation with separators", (): void => {
      expect(slugify("Hello, World!")).toBe("hello-world");
      expect(slugify("Hello: World;")).toBe("hello-world");
      expect(slugify("Hello / World")).toBe("hello-world");
      expect(slugify("Hello @ World")).toBe("hello-world");
      expect(slugify("Hello (World) [123]")).toBe("hello-world-123");
    });

    test("replaces emoji with separators", (): void => {
      expect(slugify("Hello 🔥 World")).toBe("hello-world");
      expect(slugify("🔥 Hello World 🔥")).toBe("hello-world");
      expect(slugify("Hello🔥World")).toBe("hello-world");
    });

    test("returns an empty string when the input contains only symbols, punctuation, or emoji", (): void => {
      expect(slugify("🔥")).toBe("");
      expect(slugify("!!!")).toBe("");
      expect(slugify("---")).toBe("");
      expect(slugify("@#$%^&*()")).toBe("");
    });
  });

  describe("given already slugified text", (): void => {
    test("preserves an existing valid slug", (): void => {
      expect(slugify("hello-world")).toBe("hello-world");
      expect(slugify("你好-世界")).toBe("你好-世界");
    });

    test("normalizes an invalid slug", (): void => {
      expect(slugify("Hello--World")).toBe("hello-world");
      expect(slugify("hello___world")).toBe("hello-world");
      expect(slugify("--hello--world--")).toBe("hello-world");
    });
  });

  describe("given a slugified result", (): void => {
    test("is idempotent", (): void => {
      const inputs: string[] = [
        "Hello World",
        "Foo & Bar",
        "Crème Brûlée",
        "Привет, мир!",
        "你好 世界",
        "สวัสดี โลก",
        "Version 2.0",
        "hello-world"
      ];

      for (let index: number = 0; index < inputs.length; index++) {
        const input: string = inputs[index];
        const result: string = slugify(input);

        expect(slugify(result)).toBe(result);
      }
    });
  });

  describe("given an empty or nullish value", (): void => {
    test("returns an empty string for an empty string", (): void => {
      expect(slugify("")).toBe("");
      expect(slugify("", { separator: "_" })).toBe("");
    });

    test("returns an empty string for null", (): void => {
      expect(slugify(null)).toBe("");
      expect(slugify(null, { separator: "_" })).toBe("");
    });

    test("returns an empty string for undefined", (): void => {
      expect(slugify(undefined)).toBe("");
      expect(slugify(undefined, { separator: "_" })).toBe("");
    });
  });
});
