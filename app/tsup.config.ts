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
  entry: {
    index: "index.ts", // Main entry point
    core: "exports/core.ts", // Core utilities
    client: "exports/client.ts", // Client functionality
    "charts/index": "exports/charts/index.ts", // Chart components
    "hooks/index": "exports/hooks/index.ts", // React hooks
    "utils/index": "exports/utils/index.ts", // Utility functions
  },
  format: ["cjs", "esm"],
  dts: false, // DTS generated via tsc in separate step
  clean: true,
  sourcemap: false,
  splitting: true,
  treeshake: true,
  minify: !options.watch,
  external: externalDeps,
  // Configure output to match package.json export paths
}));
