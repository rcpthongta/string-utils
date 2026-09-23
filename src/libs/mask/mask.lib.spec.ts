import { describe, expect, test } from "vitest";

import { createMask, mask } from "./mask.lib";

describe("mask", (): void => {
  describe("digit patterns (#)", (): void => {
    test("formats phone numbers correctly", (): void => {
      expect(mask("0812345678", "(###) ###-####")).toBe("(081) 234-5678");
      expect(mask("0812345678", "###-###-####")).toBe("081-234-5678");
      expect(mask("1234567", "###-####")).toBe("123-4567");
    });

    test("formats credit card numbers with spaces", (): void => {
      expect(mask("1234567890123456", "#### #### #### ####")).toBe("1234 5678 9012 3456");
    });

    test("formats date strings", (): void => {
      expect(mask("20260822", "####-##-##")).toBe("2026-08-22");
      expect(mask("22082026", "##/##/####")).toBe("22/08/2026");
    });

    test("formats strings with country code prefix literals", (): void => {
      expect(mask("812345678", "+66 ##-###-####")).toBe("+66 81-234-5678");
    });

    test("handles already partially formatted or separator-containing inputs", (): void => {
      expect(mask("081-234-5678", "(###) ###-####")).toBe("(081) 234-5678");
      expect(mask("(081) 234-5678", "(###) ###-####")).toBe("(081) 234-5678");
      expect(mask("123-45-6789", "###-##-####")).toBe("123-45-6789");
    });
  });

  describe("letter patterns (A)", (): void => {
    test("formats letter-only masks", (): void => {
      expect(mask("HELLOWORLD", "AAAAA-AAAAA")).toBe("HELLO-WORLD");
      expect(mask("abcdef", "AA-AA-AA")).toBe("ab-cd-ef");
      expect(mask("ABCD", "AA-AA")).toBe("AB-CD");
      expect(mask("---abc---def", "AAA-AAA")).toBe("abc-def");
    });
  });

  describe("wildcard patterns (*)", (): void => {
    test("accepts any character including digits, letters, and symbols", (): void => {
      expect(mask("A1-B2", "**-**")).toBe("A1-B2");
      expect(mask("ABC123", "***-***")).toBe("ABC-123");
      expect(mask("ABC-123", "***-***")).toBe("ABC-123");
      expect(mask("X#9$", "****")).toBe("X#9$");
    });
  });

  describe("mixed token patterns (#, A, *)", (): void => {
    test("formats postal codes, vehicle plates, and serial numbers", (): void => {
      expect(mask("K9V1B2", "A#A #A#")).toBe("K9V 1B2");
      expect(mask("ABC1234", "AAA-####")).toBe("ABC-1234");
      expect(mask("AB12CD34", "AA##-**##")).toBe("AB12-CD34");
    });
  });

  describe("non-matching input", (): void => {
    test("returns original value when input does not match pattern", (): void => {
      expect(mask("081", "(###) ###-####")).toBe("081");
      expect(mask("0812", "(###) ###-####")).toBe("0812");
      expect(mask("081234", "(###) ###-####")).toBe("081234");
      expect(mask("AB", "AAA-####")).toBe("AB");
      expect(mask("12345678909999", "###-###")).toBe("12345678909999");
      expect(mask("abc", "###-###")).toBe("abc");
      expect(mask("123", "AAA-AAA")).toBe("123");
      expect(mask("---", "AAA")).toBe("---");
      expect(mask("---", "###")).toBe("---");
      expect(mask("12-", "###")).toBe("12-");
      expect(mask("AB-", "AAA")).toBe("AB-");
    });
  });

  describe("fallback patterns", (): void => {
    test("selects exact slot count match when available in declaration order", (): void => {
      const options: { fallbackPatterns: string[] } = {
        fallbackPatterns: ["(##) ###-####"]
      };

      expect(mask("021234567", "(###) ###-####", options)).toBe("(02) 123-4567");
      expect(mask("0812345678", "(###) ###-####", options)).toBe("(081) 234-5678");
    });

    test("chooses best matching pattern from fallback list in declaration order", (): void => {
      const options: { fallbackPatterns: string[] } = {
        fallbackPatterns: ["###-####", "###-###-####"]
      };

      expect(mask("1234567", "##-###-####", options)).toBe("123-4567");
      expect(mask("1234567890", "##-###-####", options)).toBe("123-456-7890");
    });

    test("returns original value when neither primary nor fallback patterns match", (): void => {
      const options: { fallbackPatterns: string[] } = {
        fallbackPatterns: ["(##) ###-####"]
      };

      expect(mask("08123", "(###) ###-####", options)).toBe("08123");
      expect(mask("123456789012", "(###) ###-####", options)).toBe("123456789012");
    });

    test("handles fallback patterns in codePoint mode", (): void => {
      const options: { fallbackPatterns: string[]; mode: "codePoint" } = {
        fallbackPatterns: ["**-###", "***-###"],
        mode: "codePoint"
      };

      expect(mask("😀😀123", "####-###", options)).toBe("😀😀-123");
      expect(mask("😀😀😀123", "####-###", { fallbackPatterns: ["AA-###", "***-###"], mode: "codePoint" })).toBe(
        "😀😀😀-123"
      );
      expect(mask("12", "####-###", options)).toBe("12");
    });

    test("handles fallback patterns in grapheme mode", (): void => {
      const options: { fallbackPatterns: string[]; mode: "grapheme" } = {
        fallbackPatterns: ["*-##", "*-###"],
        mode: "grapheme"
      };

      expect(mask("👨‍👩‍👧‍👦12", "AAA-####", options)).toBe("👨‍👩‍👧‍👦-12");
      expect(mask("👨‍👩‍👧‍👦123", "AAA-####", options)).toBe("👨‍👩‍👧‍👦-123");
      expect(mask("1", "AAA-####", options)).toBe("1");
    });
  });

  describe("Unicode and combining marks", (): void => {
    test("handles Unicode letters and decimal digits across scripts", (): void => {
      expect(mask("กขค123", "AAA-###")).toBe("กขค-123");
      expect(mask("สวัสดี", "AA-AAAA")).toBe("สว-ัสดี");
      expect(mask("๑๒๓๔๕๖", "###-###")).toBe("๑๒๓-๔๕๖");
      expect(mask("กขค123", "AAA-###", { mode: "utf16" })).toBe("กขค-123");
      expect(mask("กขค123", "AAA-###", { mode: "codePoint" })).toBe("กขค-123");
      expect(mask("กขค123", "AAA-###", { mode: "grapheme" })).toBe("กขค-123");
    });

    test("treats surrogate pairs as 2 code units in utf16 mode", (): void => {
      expect(mask("😀", "**", { mode: "utf16" })).toBe("😀");
      expect(mask("😀", "*", { mode: "utf16" })).toBe("😀");
      expect(mask("😀", "*", { mode: "codePoint" })).toBe("😀");
      expect(mask("😀", "*", { mode: "grapheme" })).toBe("😀");
    });

    test("handles codePoint mode with emojis and surrogate pairs", (): void => {
      expect(mask("😀😀123", "**-###", { mode: "codePoint" })).toBe("😀😀-123");
      expect(mask("🎉🎊🎈✨", "**-**", { mode: "codePoint" })).toBe("🎉🎊-🎈✨");
      expect(mask("😀", "**-**", { mode: "codePoint" })).toBe("😀");
      expect(mask("😀-😀", "*-*", { mode: "codePoint" })).toBe("😀-😀");
      expect(mask("😀😀-😀😀", "**-**", { mode: "codePoint" })).toBe("😀😀-😀😀");
      expect(mask("😀abc", "*-###", { mode: "codePoint" })).toBe("😀abc");
      expect(mask("123456", "###", { mode: "codePoint" })).toBe("123456");
      expect(mask("ABCDEF", "AAA", { mode: "codePoint" })).toBe("ABCDEF");
      expect(mask("😀😀", "AA", { mode: "codePoint" })).toBe("😀😀");
      expect(mask("😀😀", "##", { mode: "codePoint" })).toBe("😀😀");
      expect(mask("😀", "*-*", { mode: "codePoint" })).toBe("😀");
    });

    test("handles grapheme mode with complex emojis and combining marks", (): void => {
      expect(mask("👨‍👩‍👧‍👦123", "*-###", { mode: "grapheme" })).toBe("👨‍👩‍👧‍👦-123");
      expect(mask("cafe\u030112", "AAAA-##", { mode: "grapheme" })).toBe("cafe\u0301-12");
      expect(mask("cafe\u0301ABC", "AAAA-AAA", { mode: "grapheme" })).toBe("cafe\u0301-ABC");
      expect(mask("😀", "*-*", { mode: "grapheme" })).toBe("😀");
      expect(mask("😀-😀", "*-*", { mode: "grapheme" })).toBe("😀-😀");
      expect(mask("😀😀-😀😀", "**-**", { mode: "grapheme" })).toBe("😀😀-😀😀");
      expect(mask("😀abc", "*-###", { mode: "grapheme" })).toBe("😀abc");
      expect(mask("123456", "###", { mode: "grapheme" })).toBe("123456");
      expect(mask("ABCDEF", "AAA", { mode: "grapheme" })).toBe("ABCDEF");
      expect(mask("👨‍👩‍👧‍👦", "AA", { mode: "grapheme" })).toBe("👨‍👩‍👧‍👦");
      expect(mask("👨‍👩‍👧‍👦", "##", { mode: "grapheme" })).toBe("👨‍👩‍👧‍👦");
      expect(mask("👨‍👩‍👧‍👦", "*-*", { mode: "grapheme" })).toBe("👨‍👩‍👧‍👦");
    });
  });

  describe("createMask factory", (): void => {
    test("creates a reusable masking function with default options", (): void => {
      const maskPhone: (value: string | null | undefined) => string = createMask("(###) ###-####");

      expect(maskPhone("0812345678")).toBe("(081) 234-5678");
      expect(maskPhone("0899999999")).toBe("(089) 999-9999");
      expect(maskPhone("0812")).toBe("0812");
      expect(maskPhone("")).toBe("");
    });

    test("creates a reusable masking function with fallbackPatterns in utf16, codePoint, and grapheme modes", (): void => {
      const maskFlexiblePhone: (value: string | null | undefined) => string = createMask("(###) ###-####", {
        fallbackPatterns: ["(##) ###-####"]
      });

      expect(maskFlexiblePhone("021234567")).toBe("(02) 123-4567");
      expect(maskFlexiblePhone("0812345678")).toBe("(081) 234-5678");
      expect(maskFlexiblePhone("0812")).toBe("0812");
      expect(maskFlexiblePhone("")).toBe("");

      const maskCPWithFallbacks: (value: string | null | undefined) => string = createMask("####-###", {
        fallbackPatterns: ["**-###"],
        mode: "codePoint"
      });

      expect(maskCPWithFallbacks("😀😀123")).toBe("😀😀-123");
      expect(maskCPWithFallbacks("12")).toBe("12");
      expect(maskCPWithFallbacks("")).toBe("");

      const maskGraphWithFallbacks: (value: string | null | undefined) => string = createMask("AAA-####", {
        fallbackPatterns: ["*-##"],
        mode: "grapheme"
      });

      expect(maskGraphWithFallbacks("👨‍👩‍👧‍👦12")).toBe("👨‍👩‍👧‍👦-12");
      expect(maskGraphWithFallbacks("1")).toBe("1");
      expect(maskGraphWithFallbacks("")).toBe("");
    });

    test("creates a reusable masking function with codePoint and grapheme modes", (): void => {
      const maskCodePoint: (value: string | null | undefined) => string = createMask("**-###", { mode: "codePoint" });
      const maskGrapheme: (value: string | null | undefined) => string = createMask("*-###", { mode: "grapheme" });

      expect(maskCodePoint("😀😀123")).toBe("😀😀-123");
      expect(maskCodePoint("😀")).toBe("😀");
      expect(maskGrapheme("👨‍👩‍👧‍👦123")).toBe("👨‍👩‍👧‍👦-123");
      expect(maskGrapheme("👨‍👩‍👧‍👦")).toBe("👨‍👩‍👧‍👦");
      expect(maskCodePoint("")).toBe("");
      expect(maskGrapheme("")).toBe("");
    });
  });

  describe("empty and unusual patterns", (): void => {
    test("returns original value when pattern is empty and no fallbacks", (): void => {
      expect(mask("Hello World", "")).toBe("Hello World");
      expect(mask("Hello World", "", { mode: "utf16" })).toBe("Hello World");
      expect(mask("Hello World", "", { mode: "codePoint" })).toBe("Hello World");
      expect(mask("Hello World", "", { mode: "grapheme" })).toBe("Hello World");
      expect(mask("Hello World", "", { fallbackPatterns: ["", ""] })).toBe("Hello World");
      expect(mask("Hello World", "", { fallbackPatterns: ["", ""], mode: "codePoint" })).toBe("Hello World");
      expect(mask("Hello World", "", { fallbackPatterns: ["", ""], mode: "grapheme" })).toBe("Hello World");

      expect(createMask("")("Hello World")).toBe("Hello World");
      expect(createMask("", { mode: "codePoint" })("Hello World")).toBe("Hello World");
      expect(createMask("", { mode: "grapheme" })("Hello World")).toBe("Hello World");
      expect(createMask("", { fallbackPatterns: ["", ""] })("Hello World")).toBe("Hello World");
      expect(createMask("", { fallbackPatterns: ["", ""], mode: "codePoint" })("Hello World")).toBe("Hello World");
      expect(createMask("", { fallbackPatterns: ["", ""], mode: "grapheme" })("Hello World")).toBe("Hello World");
      expect(createMask("")("")).toBe("");
    });

    test("handles literal-only patterns matching and non-matching", (): void => {
      expect(mask("---", "---")).toBe("---");
      expect(mask("abc", "---")).toBe("abc");
      expect(mask("---", "---", { mode: "grapheme" })).toBe("---");
      expect(mask("abc", "---", { mode: "grapheme" })).toBe("abc");
      expect(mask("---", "--", { mode: "grapheme" })).toBe("---");
      expect(mask("---", "-x-", { mode: "grapheme" })).toBe("---");
      expect(mask("---", "---", { mode: "codePoint" })).toBe("---");
      expect(mask("abc", "---", { mode: "codePoint" })).toBe("abc");
      expect(mask("---", "--", { mode: "codePoint" })).toBe("---");
      expect(mask("---", "-x-", { mode: "codePoint" })).toBe("---");
    });
  });

  describe("empty and nullish", (): void => {
    test("returns an empty string", (): void => {
      expect(mask("", "(###) ###-####")).toBe("");
      expect(mask("", "(###) ###-####", { fallbackPatterns: ["(##) ###-####"] })).toBe("");
      expect(mask("", "(###) ###-####", { mode: "codePoint" })).toBe("");
      expect(mask("", "(###) ###-####", { mode: "grapheme" })).toBe("");
      expect(mask(null, "(###) ###-####")).toBe("");
      expect(mask(undefined, "(###) ###-####")).toBe("");
      expect(mask(null, "(###) ###-####", { fallbackPatterns: ["(##) ###-####"] })).toBe("");
      expect(mask(undefined, "(###) ###-####", { fallbackPatterns: ["(##) ###-####"] })).toBe("");
      expect(mask(null, "(###) ###-####", { mode: "codePoint" })).toBe("");
      expect(mask(undefined, "(###) ###-####", { mode: "codePoint" })).toBe("");
      expect(mask(null, "(###) ###-####", { mode: "grapheme" })).toBe("");
      expect(mask(undefined, "(###) ###-####", { mode: "grapheme" })).toBe("");

      const compiled: (value: string | null | undefined) => string = createMask("(###) ###-####");
      const compiledCP: (value: string | null | undefined) => string = createMask("**-###", { mode: "codePoint" });
      const compiledGraph: (value: string | null | undefined) => string = createMask("*-###", { mode: "grapheme" });
      const compiledEmpty: (value: string | null | undefined) => string = createMask("");

      const compiledEmptyFallbacks: (value: string | null | undefined) => string = createMask("", {
        fallbackPatterns: ["", ""]
      });

      expect(compiled(null)).toBe("");
      expect(compiled(undefined)).toBe("");
      expect(compiledCP(null)).toBe("");
      expect(compiledCP(undefined)).toBe("");
      expect(compiledGraph(null)).toBe("");
      expect(compiledGraph(undefined)).toBe("");
      expect(compiledEmpty(null)).toBe("");
      expect(compiledEmpty(undefined)).toBe("");
      expect(compiledEmptyFallbacks(null)).toBe("");
      expect(compiledEmptyFallbacks(undefined)).toBe("");
    });
  });
});
