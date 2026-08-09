const configuration = {
  rootDir: "src",
  testEnvironment: "node",
  testRegex: String.raw`.*\.spec\.ts$`,
  transform: {
    "^.+\\.(t|j)s$": "ts-jest"
  },
  moduleFileExtensions: ["js", "json", "ts"],
  collectCoverageFrom: ["**/*.(t|j)s"],
  coveragePathIgnorePatterns: ["index\\.ts$"],
  coverageDirectory: "../coverage",
  verbose: true
};

export default configuration;
