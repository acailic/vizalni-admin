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
  // Build all entry points to match package.json exports
  entry: [
    "index.ts", // Main entry point
    "exports/core.ts", // Core utilities
    "exports/client.ts", // Client functionality
    "exports/charts/index.ts", // Chart components
    "exports/hooks/index.ts", // React hooks
    "exports/utils/index.ts", // Utility functions
  ],
  format: ["cjs", "esm"],
  dts: false, // Disable DTS generation temporarily to fix build
  clean: true,
  sourcemap: false, // Disable source maps temporarily to fix build
  splitting: true,
  treeshake: true,
  minify: !options.watch,
  external: externalDeps,
  // Configure output to match package.json export paths
  // Entry points will be built as:
  // - index.ts -> dist/index.js, dist/index.mjs
  // - exports/core.ts -> dist/core.js, dist/core.mjs
  // - exports/client.ts -> dist/client.js, dist/client.mjs
  // - exports/charts/index.ts -> dist/charts/index.js, dist/charts/index.mjs
  // - exports/hooks/index.ts -> dist/hooks/index.js, dist/hooks/index.mjs
  // - exports/utils/index.ts -> dist/utils/index.js, dist/utils/index.mjs
}));
