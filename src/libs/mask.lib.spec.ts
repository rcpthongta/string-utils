import { mask } from "./mask.lib";

describe("mask", (): void => {
  describe("given null, undefined, or empty string", (): void => {
    it("should return an empty string for null", (): void => {
      expect(mask(null)).toBe("");
    });

    it("should return an empty string for undefined", (): void => {
      expect(mask(undefined)).toBe("");
    });

    it("should return an empty string for an empty string input", (): void => {
      expect(mask("")).toBe("");
    });
  });

  describe("given default options (no options provided)", (): void => {
    it("should mask the entire string with asterisks", (): void => {
      expect(mask("0812345678")).toBe("**********");
    });
  });

  describe("given custom maskChar option", (): void => {
    it("should use the specified character for masking", (): void => {
      expect(mask("0812345678", { maskChar: "x" })).toBe("xxxxxxxxxx");
      expect(mask("1234567890", { maskChar: "#", unmaskedStart: 2, unmaskedEnd: 2 })).toBe("12######90");
    });
  });

  describe("given unmaskedStart and unmaskedEnd options", (): void => {
    it("should mask the middle portion while keeping start and end visible", (): void => {
      expect(mask("0812345678", { unmaskedStart: 3, unmaskedEnd: 2 })).toBe("081*****78");
    });

    it("should handle longer unmasked sections (e.g., credit card / ID card style)", (): void => {
      expect(mask("1234567890123456", { unmaskedStart: 4, unmaskedEnd: 4 })).toBe("1234********3456");
    });

    it("should handle only unmaskedStart provided", (): void => {
      expect(mask("secretpassword", { unmaskedStart: 4 })).toBe("secr**********");
    });

    it("should handle only unmaskedEnd provided", (): void => {
      expect(mask("secretpassword", { unmaskedEnd: 4 })).toBe("**********word");
    });
  });

  describe("given edge cases where unmasked length exceeds or equals string length", (): void => {
    it("should return the original string if unmaskedStart + unmaskedEnd >= string length", (): void => {
      expect(mask("123", { unmaskedStart: 2, unmaskedEnd: 2 })).toBe("123");
      expect(mask("123", { unmaskedStart: 3, unmaskedEnd: 0 })).toBe("123");
    });
  });

  describe("given negative values for unmasked options", (): void => {
    it("should normalize negative unmaskedStart and unmaskedEnd to 0", (): void => {
      expect(mask("12345", { unmaskedStart: -2, unmaskedEnd: -2 })).toBe("*****");
    });
  });

  describe("given default options (no options provided)", (): void => {
    it("should mask whitespace-only strings like normal strings", (): void => {
      expect(mask("   ")).toBe("***");
    });
  });

  describe("given whitespace strings with options", (): void => {
    it("should handle masking on whitespace strings correctly", (): void => {
      expect(mask("   ", { unmaskedStart: 1 })).toBe(" **");
    });
  });
});
