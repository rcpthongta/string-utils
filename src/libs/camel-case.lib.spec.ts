import { camelCase } from "./camel-case.lib";

describe("camelCase", (): void => {
  describe("given a valid string", (): void => {
    it("should convert space-separated words to camelCase with the first word in lowercase", (): void => {
      expect(camelCase("hello world")).toBe("helloWorld");
      expect(camelCase("hello   world")).toBe("helloWorld");
    });

    it("should convert hyphen-separated words to camelCase", (): void => {
      expect(camelCase("some-hyphen-text")).toBe("someHyphenText");
    });

    it("should convert underscore-separated words to camelCase", (): void => {
      expect(camelCase("user_first_name")).toBe("userFirstName");
    });

    it("should preserve or format existing camelCase and PascalCase strings correctly", (): void => {
      expect(camelCase("camelCase")).toBe("camelCase");
      expect(camelCase("PascalCase")).toBe("pascalCase");
    });

    it("should handle mixed formats correctly", (): void => {
      expect(camelCase("user-First Name_test")).toBe("userFirstNameTest");
    });
  });

  describe("given an empty or whitespace string", (): void => {
    it("should return an empty string for an empty input", (): void => {
      expect(camelCase("")).toBe("");
    });

    it("should return an empty string for a whitespace-only input", (): void => {
      expect(camelCase("   ")).toBe("");
    });
  });

  describe("given null or undefined", (): void => {
    it("should return an empty string for null", (): void => {
      expect(camelCase(null)).toBe("");
    });

    it("should return an empty string for undefined", (): void => {
      expect(camelCase(undefined)).toBe("");
    });
  });
});
