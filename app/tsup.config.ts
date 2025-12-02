import { defineConfig } from "tsup";

const externalDeps = [
  // Peer dependencies that should never be bundled
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
];

export default defineConfig((options) => ({
  entry: ["index.ts"],
  format: ["cjs", "esm"],
  dts: false, // Disable DTS generation temporarily to fix build
  clean: true,
  sourcemap: false, // Disable source maps temporarily to fix build
  splitting: true,
  treeshake: true,
  minify: !options.watch,
  external: externalDeps,
}));
