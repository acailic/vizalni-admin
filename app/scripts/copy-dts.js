const fs = require("fs");
const path = require("path");

const distDir = path.resolve(__dirname, "../dist");

// Ensure target directories exist
const dirs = ["charts", "hooks", "utils"];
dirs.forEach((dir) => {
  const targetDir = path.join(distDir, dir);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }
});

// Copy DTS files from exports/ to their expected locations
const copies = [
  { from: "exports/core.d.ts", to: "core.d.ts" },
  { from: "exports/client.d.ts", to: "client.d.ts" },
  { from: "exports/charts/index.d.ts", to: "charts/index.d.ts" },
  { from: "exports/hooks/index.d.ts", to: "hooks/index.d.ts" },
  { from: "exports/utils/index.d.ts", to: "utils/index.d.ts" },
];

copies.forEach(({ from, to }) => {
  const fromPath = path.join(distDir, from);
  const toPath = path.join(distDir, to);

  if (fs.existsSync(fromPath)) {
    fs.copyFileSync(fromPath, toPath);
    console.log(`✓ Copied ${from} -> ${to}`);
  } else {
    console.log(`⚠ Source not found: ${from}`);
  }
});
