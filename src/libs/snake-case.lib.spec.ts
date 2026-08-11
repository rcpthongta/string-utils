import { snakeCase } from "./snake-case.lib";

describe("snakeCase", (): void => {
  describe("given a valid string", (): void => {
    it("should convert space-separated words to snake_case", (): void => {
      expect(snakeCase("hello world")).toBe("hello_world");
      expect(snakeCase("hello   world")).toBe("hello_world");
    });

    it("should convert hyphen-separated words to snake_case", (): void => {
      expect(snakeCase("some-hyphen-text")).toBe("some_hyphen_text");
    });

    it("should convert camelCase to snake_case", (): void => {
      expect(snakeCase("userFirstName")).toBe("user_first_name");
    });

    it("should convert PascalCase to snake_case", (): void => {
      expect(snakeCase("PascalCase")).toBe("pascal_case");
    });

    it("should handle mixed formats correctly", (): void => {
      expect(snakeCase("user-First NameTest")).toBe("user_first_name_test");
    });
  });

  describe("given an empty or whitespace string", (): void => {
    it("should return an empty string for an empty input", (): void => {
      expect(snakeCase("")).toBe("");
    });

    it("should return an empty string for a whitespace-only input", (): void => {
      expect(snakeCase("   ")).toBe("");
    });
  });

  describe("given null or undefined", (): void => {
    it("should return an empty string for null", (): void => {
      expect(snakeCase(null)).toBe("");
    });

    it("should return an empty string for undefined", (): void => {
      expect(snakeCase(undefined)).toBe("");
    });
  });
});
