import { pascalCase } from "./pascal-case.lib";

describe("pascalCase", (): void => {
  describe("given a valid string", (): void => {
    it("should convert space-separated words to PascalCase", (): void => {
      expect(pascalCase("hello world")).toBe("HelloWorld");
      expect(pascalCase("hello   world")).toBe("HelloWorld");
    });

    it("should convert hyphen-separated words to PascalCase", (): void => {
      expect(pascalCase("some-hyphen-text")).toBe("SomeHyphenText");
    });

    it("should convert underscore-separated words to PascalCase", (): void => {
      expect(pascalCase("user_first_name")).toBe("UserFirstName");
    });

    it("should capitalize the first character of camelCase strings", (): void => {
      expect(pascalCase("camelCase")).toBe("CamelCase");
    });

    it("should preserve existing PascalCase strings", (): void => {
      expect(pascalCase("PascalCase")).toBe("PascalCase");
    });
  });

  describe("given an empty or whitespace string", (): void => {
    it("should return an empty string for an empty input", (): void => {
      expect(pascalCase("")).toBe("");
    });

    it("should return an empty string for a whitespace-only input", (): void => {
      expect(pascalCase("   ")).toBe("");
    });
  });

  describe("given null or undefined", (): void => {
    it("should return an empty string for null", (): void => {
      expect(pascalCase(null)).toBe("");
    });

    it("should return an empty string for undefined", (): void => {
      expect(pascalCase(undefined)).toBe("");
    });
  });
});
