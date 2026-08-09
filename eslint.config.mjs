import javascript from "@eslint/js";
import markdown from "@eslint/markdown";

import jsonc from "eslint-plugin-jsonc";
import prettier from "eslint-plugin-prettier/recommended";
import promise from "eslint-plugin-promise";
import unusedImports from "eslint-plugin-unused-imports";
import yml from "eslint-plugin-yml";
import eslint from "eslint/config";
import globals from "globals";
import jsoncParser from "jsonc-eslint-parser";
import typescript from "typescript-eslint";
import yamlParser from "yaml-eslint-parser";

const jsFiles = ["**/*.cjs", "**/*.js", "**/*.mjs"];
const tsFiles = ["**/*.ts"];

const configuration = eslint.defineConfig(
  eslint.globalIgnores(["**/coverage/*", "**/dist/*", "**/node_modules/*", "**/.npmrc", "**/package-lock.json"]),
  {
    languageOptions: {
      globals: {
        ...globals.es2023,
        ...globals.node
      }
    }
  },
  {
    ...prettier,
    files: [...jsFiles, ...tsFiles]
  },
  {
    files: [...jsFiles, ...tsFiles],
    plugins: {
      "unused-imports": unusedImports
    },
    rules: {
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "error",
        {
          args: "after-used",
          argsIgnorePattern: "^_",
          vars: "all",
          varsIgnorePattern: "^_"
        }
      ]
    }
  },
  {
    files: [...jsFiles, ...tsFiles],
    plugins: {
      promise: promise
    },
    rules: {
      ...promise.configs["flat/recommended"].rules,
      "promise/always-return": [
        "error",
        {
          ignoreLastCallback: true
        }
      ],
      "promise/no-callback-in-promise": "error",
      "promise/no-multiple-resolved": "error",
      "promise/no-nesting": "error",
      "promise/no-promise-in-callback": "error",
      "promise/no-return-in-finally": "error",
      "promise/spec-only": "error",
      "promise/valid-params": "error"
    }
  },
  {
    files: [...jsFiles, ...tsFiles],
    rules: {
      ...javascript.configs.recommended.rules,
      "no-unused-vars": "off"
    }
  },
  {
    files: tsFiles,
    plugins: {
      "@typescript-eslint": typescript.plugin
    },
    extends: [typescript.configs.recommended, typescript.configs.recommendedTypeChecked],
    languageOptions: {
      parser: typescript.parser,
      parserOptions: {
        project: "tsconfig.eslint.json",
        tsconfigRootDir: import.meta.dirname
      },
      sourceType: "module"
    },
    rules: {
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/no-unsafe-argument": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-unused-vars": "off"
    }
  },
  ...jsonc.configs["flat/recommended-with-jsonc"].map((config) => {
    return {
      ...config,
      files: ["**/*.*rc", "**/*.json", "**/*.json5", "**/*.jsonc", "**/*.jsonl"],
      languageOptions: {
        parser: jsoncParser,
        parserOptions: {
          jsonSyntax: "JSONC"
        }
      },
      rules: {
        ...config.rules,
        "jsonc/array-bracket-newline": "error",
        "jsonc/array-bracket-spacing": "error",
        "jsonc/array-element-newline": "error",
        "jsonc/comma-dangle": "error",
        "jsonc/comma-style": "error",
        "jsonc/indent": ["error", 2],
        "jsonc/key-spacing": "error",
        "jsonc/no-comments": "error",
        "jsonc/no-irregular-whitespace": "error",
        "jsonc/no-octal-escape": "error",
        "jsonc/object-curly-newline": "error",
        "jsonc/object-curly-spacing": "error",
        "jsonc/object-property-newline": "error"
      }
    };
  }),
  ...yml.configs["flat/recommended"].map((config) => {
    return {
      ...config,
      files: ["**/*.yml", "**/*.yaml"],
      languageOptions: {
        parser: yamlParser,
        parserOptions: {
          defaultYAMLVersion: "1.2"
        }
      },
      rules: {
        ...config.rules,
        "yml/block-mapping": "error",
        "yml/block-mapping-question-indicator-newline": "error",
        "yml/block-sequence-hyphen-indicator-newline": "error",
        "yml/block-sequence": "error",
        "yml/file-extension": [
          "error",
          {
            extension: "yml"
          }
        ],
        "yml/flow-mapping-curly-newline": "error",
        "yml/flow-mapping-curly-spacing": "error",
        "yml/flow-sequence-bracket-newline": "error",
        "yml/flow-sequence-bracket-spacing": "error",
        "yml/indent": "error",
        "yml/key-spacing": "error",
        "yml/no-multiple-empty-lines": "error",
        "yml/no-trailing-zeros": "error",
        "yml/plain-scalar": "error",
        "yml/quotes": "error",
        "yml/spaced-comment": "error"
      }
    };
  }),
  ...markdown.configs.recommended
);

export default configuration;
