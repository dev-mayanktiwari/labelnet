import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"], // Output both module formats
  // dts: true, // Generate .d.ts
  sourcemap: true,
  clean: true,
  outDir: "dist",
  splitting: false,
  minify: false,
  target: "es2020",
});
