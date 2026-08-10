import { hasLength } from "./has-length.lib";

describe("hasLength", (): void => {
  describe("given a valid string", (): void => {
    it("should return true for standard text", (): void => {
      expect(hasLength("Hello World")).toBe(true);
    });

    it("should return true for whitespace-only string", (): void => {
      expect(hasLength("   ")).toBe(true);
    });

    it("should return true for special characters and emojis", (): void => {
      expect(hasLength("🔥")).toBe(true);
      expect(hasLength("!@#$%^&*")).toBe(true);
    });
  });

  describe("given an invalid or empty string", (): void => {
    it("should return false for an empty string", (): void => {
      expect(hasLength("")).toBe(false);
    });
  });

  describe("given non-string types", (): void => {
    it("should return false for null and undefined", (): void => {
      expect(hasLength(null)).toBe(false);
      expect(hasLength(undefined)).toBe(false);
    });

    it("should return false for numbers", (): void => {
      expect(hasLength(123)).toBe(false);
      expect(hasLength(0)).toBe(false);
      expect(hasLength(NaN)).toBe(false);
    });

    it("should return false for booleans", (): void => {
      expect(hasLength(true)).toBe(false);
      expect(hasLength(false)).toBe(false);
    });

    it("should return false for reference types", (): void => {
      expect(hasLength({})).toBe(false);
      expect(hasLength([])).toBe(false);
    });

    it("should return false for functions", (): void => {
      expect(hasLength(() => {})).toBe(false);
    });
  });
});
