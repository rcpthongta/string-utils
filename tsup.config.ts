import { defineConfig, Options } from "tsup";

export default defineConfig((): Options[] => {
  const base: Options = {
    tsconfig: "./tsconfig.build.json",
    dts: false,
    platform: "neutral",
    splitting: false,
    sourcemap: true
  };

  return [
    {
      entry: ["src/index.ts"],
      format: "cjs",
      minify: false,
      outDir: "./dist/cjs",
      outExtension: () => {
        return {
          js: ".cjs"
        };
      },
      ...base
    },
    {
      entry: ["src/index.ts"],
      format: "esm",
      minify: false,
      outDir: "./dist/esm",
      outExtension: () => {
        return {
          js: ".mjs"
        };
      },
      ...base
    },
    {
      entry: ["src/index.ts"],
      format: "iife",
      minify: true,
      globalName: "stringUtils",
      outDir: "./dist/iife",
      outExtension: () => {
        return {
          js: ".global.js"
        };
      },
      ...base
    }
  ];
});
