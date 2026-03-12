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
  "@lingui/macro",
  // All d3 packages - should be peer dependencies for better tree-shaking
  "d3-array",
  "d3-axis",
  "d3-brush",
  "d3-color",
  "d3-delaunay",
  "d3-ease",
  "d3-format",
  "d3-geo",
  "d3-interpolate",
  "d3-scale",
  "d3-scale-chromatic",
  "d3-selection",
  "d3-shape",
  "d3-time-format",
  "d3-transition",
  "d3-zoom",
  // Other external dependencies - use regex to match sub-paths
  /^make-plural/,
  /^fp-ts/,
  /^io-ts/,
];

export default defineConfig((options) => ({
  // Build all entry points to match package.json exports
  entry: {
    index: "index.ts", // Main entry point
    core: "exports/core.ts", // Core utilities
    client: "exports/client.ts", // Client functionality
    // Chart-level entry points for better tree-shaking
    "charts/index": "exports/charts/index.ts", // All charts (backwards compat)
    "charts/LineChart": "exports/charts/LineChart.tsx", // Individual charts
    "charts/BarChart": "exports/charts/BarChart.tsx",
    "charts/ColumnChart": "exports/charts/ColumnChart.tsx",
    "charts/PieChart": "exports/charts/PieChart.tsx",
    "charts/AreaChart": "exports/charts/AreaChart.tsx",
    "charts/MapChart": "exports/charts/MapChart.tsx",
    // Other entry points
    "hooks/index": "exports/hooks/index.ts", // React hooks
    "utils/index": "exports/utils/index.ts", // Utility functions
    "connectors/index": "exports/connectors/index.ts", // Data connectors
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
