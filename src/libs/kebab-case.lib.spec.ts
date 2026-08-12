import { kebabCase } from "./kebab-case.lib";

describe("kebabCase", (): void => {
  describe("given a valid string", (): void => {
    it("should convert space-separated words to kebab-case", (): void => {
      expect(kebabCase("hello world")).toBe("hello-world");
      expect(kebabCase("hello   world")).toBe("hello-world");
    });

    it("should convert underscore-separated words to kebab-case", (): void => {
      expect(kebabCase("some_hyphen_text")).toBe("some-hyphen-text");
    });

    it("should convert camelCase to kebab-case", (): void => {
      expect(kebabCase("userFirstName")).toBe("user-first-name");
    });

    it("should convert PascalCase to kebab-case", (): void => {
      expect(kebabCase("PascalCase")).toBe("pascal-case");
    });

    it("should handle mixed formats correctly", (): void => {
      expect(kebabCase("user_First NameTest")).toBe("user-first-name-test");
    });

    it("should handle trailing separators by stripping them", (): void => {
      expect(kebabCase("hello-")).toBe("hello");
      expect(kebabCase("hello_")).toBe("hello");
      expect(kebabCase("hello ")).toBe("hello");
    });

    it("should handle leading separators by stripping them", (): void => {
      expect(kebabCase("-hello")).toBe("hello");
      expect(kebabCase("_hello")).toBe("hello");
      expect(kebabCase(" hello")).toBe("hello");
    });
  });

  describe("given an empty or whitespace string", (): void => {
    it("should return an empty string for an empty input", (): void => {
      expect(kebabCase("")).toBe("");
    });

    it("should return an empty string for a whitespace-only input", (): void => {
      expect(kebabCase("   ")).toBe("");
    });
  });

  describe("given null or undefined", (): void => {
    it("should return an empty string for null", (): void => {
      expect(kebabCase(null)).toBe("");
    });

    it("should return an empty string for undefined", (): void => {
      expect(kebabCase(undefined)).toBe("");
    });
  });
});
