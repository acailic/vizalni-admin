import fs from "fs";
import path from "path";

import gzipSize from "gzip-size";
import { test, expect } from "vitest";

const distDir = path.join(__dirname, "../../dist");

interface SizeReport {
  totalGzippedSize: number;
  mainGzippedSize?: number;
  chunkSizes: { [file: string]: number };
}

// TODO: Fix gzip-size module import issue
test.skip("bundle size check", () => {
  // Ensure dist directory exists
  if (!fs.existsSync(distDir)) {
    throw new Error("Dist directory not found. Please run build first.");
  }

  const files = fs
    .readdirSync(distDir)
    .filter(
      (f) => f.endsWith(".js") || f.endsWith(".mjs") || f.endsWith(".cjs")
    );

  let totalGzippedSize = 0;
  const chunkSizes: { [file: string]: number } = {};
  let mainGzippedSize: number | undefined;

  for (const file of files) {
    const filePath = path.join(distDir, file);
    const gzippedSize = gzipSize.sync(fs.readFileSync(filePath));
    chunkSizes[file] = gzippedSize;
    totalGzippedSize += gzippedSize;

    // Assume main bundle is index.js or index.mjs
    if (file === "index.js" || file === "index.mjs") {
      mainGzippedSize = gzippedSize;
    }

    console.log(`${file}: ${gzippedSize} bytes gzipped`);
  }

  // Check limits
  expect(totalGzippedSize).toBeLessThan(500 * 1024); // 500KB total gzipped
  if (mainGzippedSize !== undefined) {
    expect(mainGzippedSize).toBeLessThan(300 * 1024); // 300KB main bundle gzipped
  }

  // Check individual chunks (assume <100KB each)
  for (const [, size] of Object.entries(chunkSizes)) {
    expect(size).toBeLessThan(100 * 1024); // 100KB per chunk gzipped
  }

  // Generate size report for tracking
  const report: SizeReport = {
    totalGzippedSize,
    mainGzippedSize,
    chunkSizes,
  };

  const reportPath = path.join(__dirname, "bundle-size-report.json");
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`Size report generated at ${reportPath}`);
});
