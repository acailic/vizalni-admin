const fs = require("fs");
const path = require("path");

const distDir = path.resolve(__dirname, "../dist");

// Ensure target directories exist
const dirs = ["charts", "hooks", "utils", "connectors"];
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
  { from: "exports/charts/LineChart.d.ts", to: "charts/LineChart.d.ts" },
  { from: "exports/charts/BarChart.d.ts", to: "charts/BarChart.d.ts" },
  { from: "exports/charts/ColumnChart.d.ts", to: "charts/ColumnChart.d.ts" },
  { from: "exports/charts/PieChart.d.ts", to: "charts/PieChart.d.ts" },
  { from: "exports/charts/AreaChart.d.ts", to: "charts/AreaChart.d.ts" },
  { from: "exports/charts/MapChart.d.ts", to: "charts/MapChart.d.ts" },
  { from: "exports/hooks/index.d.ts", to: "hooks/index.d.ts" },
  { from: "exports/utils/index.d.ts", to: "utils/index.d.ts" },
  { from: "exports/connectors/index.d.ts", to: "connectors/index.d.ts" },
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
