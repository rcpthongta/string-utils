import { uncapitalize } from "./uncapitalize.lib";

describe("uncapitalize", (): void => {
  describe("given a valid string with text content", (): void => {
    it("should uncapitalize the first letter of an uppercase string", (): void => {
      expect(uncapitalize("Hello")).toBe("hello");
    });

    it("should keep the first letter lowercase if it is already lowercase", (): void => {
      expect(uncapitalize("hello")).toBe("hello");
    });

    it("should uncapitalize only the first character and leave the rest unchanged", (): void => {
      expect(uncapitalize("HELLO WORLD")).toBe("hELLO WORLD");
    });

    it("should treat leading whitespace as the first character and remain unchanged", (): void => {
      expect(uncapitalize("  HELLO")).toBe("  HELLO");
    });
  });

  describe("given an empty string", (): void => {
    it("should return an empty string", (): void => {
      expect(uncapitalize("")).toBe("");
    });
  });

  describe("given null or undefined", (): void => {
    it("should return null when input is null", (): void => {
      expect(uncapitalize(null)).toBeNull();
    });

    it("should return undefined when input is undefined", (): void => {
      expect(uncapitalize(undefined)).toBeUndefined();
    });
  });
});
