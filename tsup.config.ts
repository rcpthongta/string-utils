import { defineConfig, Options } from "tsup";

export default defineConfig((): Options[] => {
  const base: Options = {
    dts: false,
    minify: false,
    platform: "neutral",
    splitting: false,
    sourcemap: true
  };

  return [
    {
      entry: ["src/index.ts"],
      format: "cjs",
      outDir: "./dist/cjs",
      outExtension: () => {
        return {
          js: ".cjs"
        };
      },
      tsconfig: "./tsconfig.cjs.json",
      ...base
    },
    {
      entry: ["src/index.ts"],
      format: "esm",
      outDir: "./dist/esm",
      outExtension: () => {
        return {
          js: ".mjs"
        };
      },
      tsconfig: "./tsconfig.esm.json",
      ...base
    }
  ];
});
