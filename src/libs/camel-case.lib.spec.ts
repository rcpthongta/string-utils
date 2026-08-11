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

    it("should handle strings containing numbers correctly", (): void => {
      expect(camelCase("version-2-release")).toBe("version2Release");
      expect(camelCase("user_1_name")).toBe("user1Name");
    });

    it("should handle single character strings", (): void => {
      expect(camelCase("a")).toBe("a");
      expect(camelCase("A")).toBe("a");
    });

    it("should handle trailing separators by stripping them", (): void => {
      expect(camelCase("hello-")).toBe("hello");
      expect(camelCase("hello_")).toBe("hello");
      expect(camelCase("hello ")).toBe("hello");
    });

    it("should handle leading separators by stripping them", (): void => {
      expect(camelCase("-hello")).toBe("hello");
      expect(camelCase("_hello")).toBe("hello");
      expect(camelCase(" hello")).toBe("hello");
    });

    it("should handle consecutive multiple separators correctly", (): void => {
      expect(camelCase("hello--world")).toBe("helloWorld");
      expect(camelCase("foo___bar")).toBe("fooBar");
      expect(camelCase("hello   world")).toBe("helloWorld");
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
