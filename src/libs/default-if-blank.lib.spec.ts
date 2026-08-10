import { defaultIfBlank } from "./default-if-blank.lib";

describe("defaultIfBlank", (): void => {
  describe("given a valid string with text content", (): void => {
    it("should return the original string for standard text", (): void => {
      expect(defaultIfBlank("Hello", "default")).toBe("Hello");
    });
  });

  describe("given a blank or empty string", (): void => {
    it("should return the default value for a whitespace-only string", (): void => {
      expect(defaultIfBlank("   ", "default")).toBe("default");
    });

    it("should return the default value", (): void => {
      expect(defaultIfBlank("", "default")).toBe("default");
    });
  });

  describe("given null or undefined", (): void => {
    it("should return the default value for null", (): void => {
      expect(defaultIfBlank(null, "default")).toBe("default");
    });

    it("should return the default value for undefined", (): void => {
      expect(defaultIfBlank(undefined, "default")).toBe("default");
    });
  });
});
