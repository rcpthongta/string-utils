import { capitalize } from "./capitalize.lib";

describe("capitalize", (): void => {
  describe("given a valid string with text content", (): void => {
    it("should capitalize the first letter of a lowercase string", (): void => {
      expect(capitalize("hello")).toBe("Hello");
    });

    it("should keep the first letter uppercase if it is already capitalized", (): void => {
      expect(capitalize("Hello")).toBe("Hello");
    });

    it("should capitalize only the first character and leave the rest unchanged", (): void => {
      expect(capitalize("hELLO wORLD")).toBe("HELLO wORLD");
    });

    it("should treat leading whitespace as the first character and remain unchanged", (): void => {
      expect(capitalize("  hello")).toBe("  hello");
    });
  });

  describe("given an empty string", (): void => {
    it("should return an empty string", (): void => {
      expect(capitalize("")).toBe("");
    });
  });

  describe("given null or undefined", (): void => {
    it("should return null when input is null", (): void => {
      expect(capitalize(null)).toBeNull();
    });

    it("should return undefined when input is undefined", (): void => {
      expect(capitalize(undefined)).toBeUndefined();
    });
  });
});
