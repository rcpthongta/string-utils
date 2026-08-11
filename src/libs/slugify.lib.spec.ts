import { slugify } from "./slugify.lib";

describe("slugify", (): void => {
  describe("given a valid string", (): void => {
    it("should convert space-separated words to a slug", (): void => {
      expect(slugify("hello world")).toBe("hello-world");
      expect(slugify("hello   world")).toBe("hello-world");
    });

    it("should convert hyphen-separated words to a slug", (): void => {
      expect(slugify("some-hyphen-text")).toBe("some-hyphen-text");
    });

    it("should convert underscore-separated words to a slug", (): void => {
      expect(slugify("user_first_name")).toBe("user-first-name");
    });

    it("should convert camelCase and PascalCase to a slug", (): void => {
      expect(slugify("userFirstName")).toBe("user-first-name");
      expect(slugify("PascalCase")).toBe("pascal-case");
    });

    it("should strip diacritics and accents", (): void => {
      expect(slugify("Café & Restaurant")).toBe("cafe-restaurant");
      expect(slugify("Crème brûlée")).toBe("creme-brulee");
    });

    it("should remove special characters and symbols", (): void => {
      expect(slugify("Hello, World! @2026")).toBe("hello-world-2026");
      expect(slugify("  -- Hello, World!! -- ")).toBe("hello-world");
    });

    it("should handle mixed formats correctly", (): void => {
      expect(slugify("user-First Name_test! #1")).toBe("user-first-name-test-1");
    });
  });

  describe("given an empty or whitespace string", (): void => {
    it("should return an empty string for an empty input", (): void => {
      expect(slugify("")).toBe("");
    });

    it("should return an empty string for a whitespace-only input", (): void => {
      expect(slugify("   ")).toBe("");
    });

    it("should return an empty string if input contains only special characters", (): void => {
      expect(slugify("!@#$%^&*()")).toBe("");
    });
  });

  describe("given null or undefined", (): void => {
    it("should return an empty string for null", (): void => {
      expect(slugify(null)).toBe("");
    });

    it("should return an empty string for undefined", (): void => {
      expect(slugify(undefined)).toBe("");
    });
  });
});
