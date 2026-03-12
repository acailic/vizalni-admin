#!/usr/bin/env node

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const targetUrl =
  process.env.LIGHTHOUSE_URL ||
  process.env.LHCI_URL ||
  `http://localhost:${process.env.PORT || 3000}`;
const outputPath = path.join(process.cwd(), "lighthouse-report.json");
const chromeFlags =
  process.env.LIGHTHOUSE_CHROME_FLAGS || "--headless=new --no-sandbox";

const run = () => {
  try {
    execSync(
      `npx lighthouse "${targetUrl}" --output=json --output-path="${outputPath}" --chrome-flags="${chromeFlags}"`,
      { stdio: "inherit" }
    );
  } catch (error) {
    console.error(
      "Lighthouse run failed. Ensure the app is running before retrying."
    );
    process.exit(1);
  }

  if (!fs.existsSync(outputPath)) {
    console.error("Lighthouse report was not created.");
    process.exit(1);
  }

  try {
    const report = JSON.parse(fs.readFileSync(outputPath, "utf8"));
    const performanceScore = report?.categories?.performance?.score;
    const hasRuntimeError = Boolean(report?.runtimeError);
    const isBlank = report?.finalDisplayedUrl === "about:blank";

    if (hasRuntimeError || isBlank || typeof performanceScore !== "number") {
      console.error(
        "Lighthouse report is invalid (no paint or missing scores). Rerun with the app in the foreground."
      );
      try {
        fs.unlinkSync(outputPath);
      } catch {
        // ignore cleanup errors
      }
      process.exit(1);
    }

    console.log(`Lighthouse report generated at ${outputPath}`);
  } catch (error) {
    console.error("Failed to parse Lighthouse report.");
    process.exit(1);
  }
};

run();
