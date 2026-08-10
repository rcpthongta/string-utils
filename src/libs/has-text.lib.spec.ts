import { hasText } from "./has-text.lib";

describe("hasText", (): void => {
  describe("given a valid non-empty string", (): void => {
    it("should return true for standard text", (): void => {
      expect(hasText("Hello World")).toBe(true);
    });

    it("should return true for text with surrounding whitespace", (): void => {
      expect(hasText("   Hello World   ")).toBe(true);
    });

    it("should return true for special characters and emojis", (): void => {
      expect(hasText("🔥")).toBe(true);
      expect(hasText("!@#$%^&*")).toBe(true);
    });
  });

  describe("given an invalid or empty string", (): void => {
    it("should return false for an empty string", (): void => {
      expect(hasText("")).toBe(false);
    });

    it("should return false for a whitespace-only string", (): void => {
      expect(hasText("   ")).toBe(false);
    });

    it("should return false for newline and tab characters", (): void => {
      expect(hasText("\n\t\r")).toBe(false);
    });
  });

  describe("given non-string types", (): void => {
    it("should return false for null and undefined", (): void => {
      expect(hasText(null)).toBe(false);
      expect(hasText(undefined)).toBe(false);
    });

    it("should return false for numbers", (): void => {
      expect(hasText(123)).toBe(false);
      expect(hasText(0)).toBe(false);
      expect(hasText(NaN)).toBe(false);
    });

    it("should return false for booleans", (): void => {
      expect(hasText(true)).toBe(false);
      expect(hasText(false)).toBe(false);
    });

    it("should return false for reference types", (): void => {
      expect(hasText({})).toBe(false);
      expect(hasText([])).toBe(false);
    });

    it("should return false for functions", (): void => {
      expect(hasText(() => {})).toBe(false);
    });
  });
});
