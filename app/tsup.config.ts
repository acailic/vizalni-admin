import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["index.ts"],
  format: ["cjs", "esm"],
  dts: true,
  clean: true,
  sourcemap: true,
  splitting: true,
  treeshake: true,
  minify: true,
  external: [
    // Peer dependencies
    "react",
    "react-dom",
    "next",
    "@babel/runtime",
    // External dependencies that consumers should install
    "@lingui/react",
    "@lingui/core",
    "d3-format",
    "d3-time-format",
    "make-plural",
    "fp-ts",
    "io-ts",
  ],
});
