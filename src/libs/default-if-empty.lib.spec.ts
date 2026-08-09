import { defaultIfEmpty } from "./default-if-empty.lib";

describe("defaultIfEmpty", (): void => {
  describe("given a valid string with content or whitespace", (): void => {
    it("should return the original string for standard text", (): void => {
      expect(defaultIfEmpty("Hello", "default")).toBe("Hello");
    });

    it("should return the original whitespace-only string (whitespace is kept)", (): void => {
      expect(defaultIfEmpty("   ", "default")).toBe("   ");
    });
  });

  describe("given an empty string", (): void => {
    it("should return the default value for an empty string", (): void => {
      expect(defaultIfEmpty("", "default")).toBe("default");
    });
  });

  describe("given null or undefined", (): void => {
    it("should return the default value for null", (): void => {
      expect(defaultIfEmpty(null, "default")).toBe("default");
    });

    it("should return the default value for undefined", (): void => {
      expect(defaultIfEmpty(undefined, "default")).toBe("default");
    });
  });
});
