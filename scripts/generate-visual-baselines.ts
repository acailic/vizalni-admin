#!/usr/bin/env ts-node

/**
 * Generate Initial Baseline Screenshots
 *
 * This script generates baseline screenshots for all visual regression tests.
 * Run this after creating new tests or making intentional visual changes.
 *
 * Usage:
 *   yarn generate-visual-baselines
 *   yarn generate-visual-baselines --chart=line
 *   yarn generate-visual-baselines --viewport=desktop
 */

import { execSync } from "child_process";
import { existsSync, mkdirSync } from "fs";
import { join } from "path";

const BASELINE_DIR = "./app/tests/visual/__screenshots__";
const CHARTS = ["line", "bar", "column", "area", "pie"];
const VIEWPORTS = ["desktop", "laptop", "tablet", "mobile"];
const LOCALES = ["en", "sr-Latn", "sr-Cyrl"];
const THEMES = ["light", "dark"];

interface GenerateOptions {
  chart?: string;
  viewport?: string;
  locale?: string;
  theme?: string;
  update?: boolean;
}

function parseArgs(): GenerateOptions {
  const args = process.argv.slice(2);
  const options: GenerateOptions = {
    update: true, // Default to updating baselines
  };

  for (const arg of args) {
    if (arg.startsWith("--chart=")) {
      options.chart = arg.split("=")[1];
    } else if (arg.startsWith("--viewport=")) {
      options.viewport = arg.split("=")[1];
    } else if (arg.startsWith("--locale=")) {
      options.locale = arg.split("=")[1];
    } else if (arg.startsWith("--theme=")) {
      options.theme = arg.split("=")[1];
    } else if (arg === "--no-update") {
      options.update = false;
    }
  }

  return options;
}

function ensureBaselineDir() {
  if (!existsSync(BASELINE_DIR)) {
    mkdirSync(BASELINE_DIR, { recursive: true });
    console.log(`✅ Created baseline directory: ${BASELINE_DIR}`);
  }
}

function buildTestPattern(options: GenerateOptions): string {
  const parts: string[] = [];

  if (options.chart) {
    parts.push(options.chart);
  }

  if (parts.length === 0) {
    return ""; // Run all tests
  }

  return parts.join("|");
}

function buildPlaywrightArgs(options: GenerateOptions): string[] {
  const args = ["test", "--config=playwright.visual.config.ts"];

  if (options.update) {
    args.push("--update-snapshots");
  }

  const pattern = buildTestPattern(options);
  if (pattern) {
    args.push(`--grep=${pattern}`);
  }

  return args;
}

function runCommand(command: string, description: string) {
  console.log(`\n📸 ${description}...`);
  console.log(`   Command: ${command}\n`);

  try {
    execSync(command, {
      stdio: "inherit",
      env: {
        ...process.env,
        // Ensure consistent rendering
        CI: "true",
      },
    });
    console.log(`✅ ${description} - Complete`);
  } catch (error) {
    console.error(`❌ ${description} - Failed`);
    throw error;
  }
}

async function generateBaselines(options: GenerateOptions) {
  console.log("🎨 Visual Regression Baseline Generator\n");
  console.log("Configuration:");
  console.log(`  Charts: ${options.chart || "All"}`);
  console.log(`  Viewports: ${options.viewport || "All"}`);
  console.log(`  Locales: ${options.locale || "All"}`);
  console.log(`  Themes: ${options.theme || "All"}`);
  console.log(`  Update: ${options.update ? "Yes" : "No"}\n`);

  // Ensure baseline directory exists
  ensureBaselineDir();

  // Build Playwright command
  const playwrightArgs = buildPlaywrightArgs(options);
  const command = `npx playwright ${playwrightArgs.join(" ")}`;

  // Run tests to generate baselines
  runCommand(command, "Generating baseline screenshots");

  console.log("\n✨ Baseline generation complete!\n");
  console.log("📁 Baselines saved to:");
  console.log(`   ${BASELINE_DIR}\n`);

  // Print summary
  console.log("📊 Summary:");
  console.log(`   Charts tested: ${options.chart || CHARTS.join(", ")}`);
  console.log(
    `   Viewports tested: ${options.viewport || VIEWPORTS.join(", ")}`
  );
  console.log(`   Locales tested: ${options.locale || LOCALES.join(", ")}`);
  console.log(`   Themes tested: ${options.theme || THEMES.join(", ")}\n`);

  console.log("💡 Next steps:");
  console.log("   1. Review generated baselines");
  console.log("   2. Commit baselines to version control");
  console.log("   3. Run 'yarn test:visual' to verify\n");
}

// Main execution
(async () => {
  try {
    const options = parseArgs();
    await generateBaselines(options);
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Baseline generation failed\n");
    process.exit(1);
  }
})();
