const { dtsBundleGenerator } = require("dts-bundle-generator");
const path = require("path");
const fs = require("fs");

// Entry points to generate declarations for
const entryPoints = [
  { name: "index", file: "app/index.ts" },
  { name: "core", file: "app/exports/core.ts" },
  { name: "client", file: "app/exports/client.ts" },
  { name: "charts/index", file: "app/exports/charts/index.ts" },
  { name: "hooks/index", file: "app/exports/hooks/index.ts" },
  { name: "utils/index", file: "app/exports/utils/index.ts" },
];

const distDir = path.resolve(__dirname, "../app/dist");

// Ensure dist directory exists
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Generate declarations for each entry point
entryPoints.forEach(({ name, file }) => {
  const outputPath = path.join(distDir, `${name.replace("/", ".")}.d.ts`);

  try {
    dtsBundleGenerator[
      {
        entryPath: path.resolve(__dirname, "..", file),
        outFile: outputPath,
        tsconfigPath: path.resolve(__dirname, "../app/tsconfig.json"),
        outputAsModuleFolder: true,
      }
    ];
    console.log(`✓ Generated ${outputPath}`);
  } catch (error) {
    console.error(`✗ Failed to generate ${name}:`, error.message);
  }
});
