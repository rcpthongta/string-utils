import conventionalConfig from "@commitlint/config-conventional";

const configuration = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [2, "always", [...conventionalConfig.rules["type-enum"][2], "merge"]]
  }
};

export default configuration;
