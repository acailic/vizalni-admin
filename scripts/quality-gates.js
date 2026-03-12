#!/usr/bin/env node

/**
 * Local quality gates script
 * Runs all quality checks locally before committing
 */

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const COLORS = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
};

const log = {
  success: (msg) => console.log(`${COLORS.green}✅ ${msg}${COLORS.reset}`),
  error: (msg) => console.log(`${COLORS.red}❌ ${msg}${COLORS.reset}`),
  warning: (msg) => console.log(`${COLORS.yellow}⚠️  ${msg}${COLORS.reset}`),
  info: (msg) => console.log(`${COLORS.blue}ℹ️  ${msg}${COLORS.reset}`),
  header: (msg) => console.log(`\n${COLORS.cyan}🔍 ${msg}${COLORS.reset}`),
};

const ROOT_DIR = path.join(__dirname, "../");
const APP_DIR = path.join(ROOT_DIR, "app");

class QualityGateChecker {
  constructor() {
    this.results = {
      passed: [],
      failed: [],
      warnings: [],
    };
  }

  async runCommand(command, description, options = {}) {
    const { silent = false, timeout = 300000, cwd = ROOT_DIR } = options;

    try {
      log.info(`Running: ${description}`);

      const result = execSync(command, {
        stdio: silent ? "pipe" : "inherit",
        timeout,
        cwd,
      });

      log.success(description);
      this.results.passed.push(description);
      return true;
    } catch (error) {
      log.error(`${description} - ${error.message}`);
      this.results.failed.push({ description, error: error.message });
      return false;
    }
  }

  async checkTestCoverage() {
    log.header("Test Coverage Analysis");

    // Run tests with coverage
    const coveragePassed = await this.runCommand(
      "yarn coverage:report",
      "Run tests with coverage",
      { silent: true }
    );

    if (!coveragePassed) {
      return false;
    }

    try {
      // Check coverage thresholds
      const coverageData = JSON.parse(
        fs.readFileSync("app/coverage-report.json", "utf8")
      );

      const { total } = coverageData;
      const thresholds = {
        lines: 80,
        functions: 80,
        branches: 75,
        statements: 80,
      };

      let coverageOk = true;

      Object.entries(thresholds).forEach(([metric, threshold]) => {
        const actual = total[metric]?.pct || 0;
        if (actual < threshold) {
          log.error(
            `${metric}: ${actual.toFixed(1)}% (minimum: ${threshold}%)`
          );
          coverageOk = false;
        } else {
          log.success(`${metric}: ${actual.toFixed(1)}%`);
        }
      });

      if (coverageOk) {
        this.results.passed.push("Coverage thresholds");
      } else {
        this.results.failed.push({
          description: "Coverage thresholds",
          error: "Below minimum thresholds",
        });
      }

      return coverageOk;
    } catch (error) {
      log.error(`Failed to parse coverage report: ${error.message}`);
      this.results.failed.push({
        description: "Coverage report parsing",
        error: error.message,
      });
      return false;
    }
  }

  async checkAccessibility() {
    log.header("Accessibility Compliance");

    return await this.runCommand(
      "yarn test:accessibility",
      "Accessibility tests"
    );
  }

  async checkPerformance() {
    log.header("Performance Analysis");

    // Check bundle size
    const bundleSizePassed = await this.runCommand(
      "yarn build:static",
      "Build application for bundle analysis",
      { silent: true }
    );

    if (!bundleSizePassed) {
      return false;
    }

    try {
      // Analyze bundle size
      const getDirectorySize = (dirPath) => {
        return fs
          .readdirSync(dirPath, { withFileTypes: true })
          .reduce((sum, entry) => {
            const entryPath = path.join(dirPath, entry.name);
            if (entry.isDirectory()) {
              return sum + getDirectorySize(entryPath);
            }
            if (entry.isFile()) {
              return sum + fs.statSync(entryPath).size;
            }
            return sum;
          }, 0);
      };

      const buildDirs = [
        path.join(APP_DIR, ".next", "static", "chunks"),
        path.join(APP_DIR, "out", "_next", "static", "chunks"),
      ];

      const buildDir = buildDirs.find((dir) => fs.existsSync(dir));
      if (!buildDir) {
        log.error("Bundle size check failed: no Next.js build output found.");
        log.info(
          "Expected one of: app/.next/static/chunks or app/out/_next/static/chunks"
        );
        this.results.failed.push({
          description: "Bundle size",
          error: "Missing Next.js build output",
        });
        return false;
      }

      const bundleSizeBytes = getDirectorySize(buildDir);
      const bundleSizeKB = bundleSizeBytes / 1024;
      const maxSizeKB = 2048; // 2MB

      if (bundleSizeKB > maxSizeKB) {
        log.error(
          `Bundle size: ${bundleSizeKB.toFixed(0)}KB (maximum: ${maxSizeKB}KB)`
        );
        this.results.failed.push({
          description: "Bundle size",
          error: `Exceeds ${maxSizeKB}KB limit`,
        });
        return false;
      } else {
        const relativeDir = path.relative(ROOT_DIR, buildDir);
        log.success(
          `Bundle size (${relativeDir}): ${bundleSizeKB.toFixed(0)}KB`
        );
      }

      // Run performance tests
      return await this.runCommand(
        'npx vitest run --reporter=verbose --testNamePattern="performance"',
        "Performance tests",
        { cwd: APP_DIR }
      );
    } catch (error) {
      log.error(`Performance analysis failed: ${error.message}`);
      this.results.failed.push({
        description: "Performance analysis",
        error: error.message,
      });
      return false;
    }
  }

  async checkCodeQuality() {
    log.header("Code Quality Checks");

    const checks = [
      {
        command: "yarn lint",
        description: "ESLint checks",
      },
      {
        command: "yarn typecheck",
        description: "TypeScript type checking",
      },
      {
        command: "yarn prettier --check .",
        description: "Code formatting",
      },
    ];

    let allPassed = true;

    for (const check of checks) {
      const passed = await this.runCommand(check.command, check.description);
      if (!passed) {
        allPassed = false;
      }
    }

    return allPassed;
  }

  async checkTypeSafety() {
    log.header("Type Safety Checks (app/exports/)");

    // Check for any types in exports directory (excluding D3 idiomatic usage and comments)
    try {
      const { execSync } = require("child_process");
      const result = execSync(
        'grep -rn "\\bany\\b" app/exports --include="*.ts" --include="*.tsx" | ' +
          'grep -v "node_modules" | grep -v ".spec." | ' +
          'grep -v "<[a-zA-Z]*>" | ' + // Exclude D3 generics like <any>
          'grep -v "//.*any" | ' + // Exclude comments
          'grep -v "\\*.*any" | ' + // Exclude JSDoc comments
          'grep -v "works in any" | ' + // Exclude documentation
          'grep -v "if any" | ' + // Exclude "if any" phrases
          'grep -v "as any" | ' + // Exclude D3 type assertions (idiomatic)
          "wc -l",
        { stdio: "pipe", cwd: path.join(__dirname, "../") }
      )
        .toString()
        .trim();

      const anyCount = parseInt(result, 10);

      if (anyCount > 0) {
        log.error(`Found ${anyCount} problematic 'any' types in app/exports/`);
        log.info(
          "D3 type assertions (as any) are excluded from this check as they are idiomatic."
        );
        this.results.failed.push({
          description: "Type safety (no any types in exports)",
          error: `Found ${anyCount} problematic 'any' types`,
        });
        return false;
      } else {
        log.success('No problematic "any" types found in app/exports/');
        this.results.passed.push("Type safety (no any types in exports)");
        return true;
      }
    } catch (error) {
      log.error(`Type safety check failed: ${error.message}`);
      this.results.failed.push({
        description: "Type safety check",
        error: error.message,
      });
      return false;
    }
  }

  async checkLoggingPractices() {
    log.header("Logging Practices Check (app/exports/)");

    try {
      const { execSync } = require("child_process");
      const result = execSync(
        'grep -rn "console\\." app/exports --include="*.ts" --include="*.tsx" | ' +
          'grep -v "node_modules" | grep -v ".spec." | ' +
          'grep -v "\\* console\\." | ' + // Exclude documentation comments
          "wc -l",
        { stdio: "pipe", cwd: path.join(__dirname, "../") }
      )
        .toString()
        .trim();

      const consoleCount = parseInt(result, 10);

      if (consoleCount > 0) {
        log.error(`Found ${consoleCount} console.* statements in app/exports/`);
        log.info(
          'Run: grep -rn "console\\." app/exports --include="*.ts" --include="*.tsx" | grep -v ".spec."'
        );
        this.results.failed.push({
          description: "Logging practices (no console.* in exports)",
          error: `Found ${consoleCount} console.* statements`,
        });
        return false;
      } else {
        log.success("No console.* statements found in app/exports/");
        this.results.passed.push("Logging practices (no console.* in exports)");
        return true;
      }
    } catch (error) {
      log.error(`Logging practices check failed: ${error.message}`);
      this.results.failed.push({
        description: "Logging practices check",
        error: error.message,
      });
      return false;
    }
  }

  async checkCircularDependencies() {
    log.header("Circular Dependency Check (app/exports/)");

    try {
      const { execSync } = require("child_process");
      execSync("npx madge app/exports --circular --extensions ts,tsx", {
        stdio: "pipe",
        cwd: path.join(__dirname, "../"),
      });

      log.success("No circular dependencies found in app/exports/");
      this.results.passed.push("Circular dependency check");
      return true;
    } catch (error) {
      log.error(`Circular dependency check failed: ${error.message}`);
      this.results.failed.push({
        description: "Circular dependency check",
        error: error.message,
      });
      return false;
    }
  }

  async checkSecurity() {
    log.header("Security Analysis");

    // Audit dependencies
    const auditPassed = await this.runCommand(
      "yarn audit --level moderate",
      "Dependency security audit"
    );

    if (!auditPassed) {
      log.warning("Security audit found issues - review and address");
      this.results.warnings.push("Security vulnerabilities detected");
    }

    return auditPassed;
  }

  async checkInternationalization() {
    log.header("Internationalization Tests");

    return await this.runCommand(
      'npx vitest run --reporter=verbose --testNamePattern="serbian|internationalization|i18n"',
      "Serbian language and internationalization tests",
      { cwd: APP_DIR }
    );
  }

  async checkVisualRegression() {
    log.header("Visual Regression Tests");

    return await this.runCommand("yarn test:visual", "Visual regression tests");
  }

  async checkIntegrationTests() {
    log.header("Integration Tests");

    return await this.runCommand("yarn test:integration", "Integration tests");
  }

  printResults() {
    console.log("\n" + "=".repeat(60));
    console.log("🏁 QUALITY GATE RESULTS");
    console.log("=".repeat(60));

    if (this.results.passed.length > 0) {
      console.log(
        `\n${COLORS.green}✅ PASSED (${this.results.passed.length}):${COLORS.reset}`
      );
      this.results.passed.forEach((result) => {
        console.log(`   • ${result}`);
      });
    }

    if (this.results.warnings.length > 0) {
      console.log(
        `\n${COLORS.yellow}⚠️  WARNINGS (${this.results.warnings.length}):${COLORS.reset}`
      );
      this.results.warnings.forEach((warning) => {
        console.log(`   • ${warning}`);
      });
    }

    if (this.results.failed.length > 0) {
      console.log(
        `\n${COLORS.red}❌ FAILED (${this.results.failed.length}):${COLORS.reset}`
      );
      this.results.failed.forEach(({ description, error }) => {
        console.log(`   • ${description}: ${error}`);
      });
    }

    console.log("\n" + "=".repeat(60));

    const totalChecks =
      this.results.passed.length +
      this.results.warnings.length +
      this.results.failed.length;
    const successRate =
      totalChecks > 0
        ? ((this.results.passed.length / totalChecks) * 100).toFixed(1)
        : 0;

    if (this.results.failed.length === 0) {
      console.log(`${COLORS.green}🎉 ALL QUALITY GATES PASSED!${COLORS.reset}`);
      console.log(`Success rate: ${successRate}%`);
      console.log("\n✅ Ready to commit!");
      return true;
    } else {
      console.log(`${COLORS.red}❌ QUALITY GATES FAILED!${COLORS.reset}`);
      console.log(`Success rate: ${successRate}%`);
      console.log("\n⚠️  Fix the issues above before committing.");
      return false;
    }
  }

  async runAll() {
    console.log(`${COLORS.cyan}🚀 Running Quality Gates...${COLORS.reset}`);

    const startTime = Date.now();

    try {
      // Core code quality checks
      await this.checkCodeQuality();
      await this.checkTypeSafety();
      await this.checkLoggingPractices();
      await this.checkCircularDependencies();

      // Testing and compliance
      await this.checkTestCoverage();
      await this.checkAccessibility();
      await this.checkPerformance();
      await this.checkSecurity();
      await this.checkInternationalization();
      await this.checkIntegrationTests();
      await this.checkVisualRegression();
    } catch (error) {
      log.error(`Quality gate execution failed: ${error.message}`);
      this.results.failed.push({
        description: "Quality gate execution",
        error: error.message,
      });
    }

    const duration = Date.now() - startTime;
    log.info(`Quality gates completed in ${(duration / 1000).toFixed(1)}s`);

    return this.printResults();
  }
}

// Run quality gates
if (require.main === module) {
  const checker = new QualityGateChecker();
  checker
    .runAll()
    .then((success) => {
      process.exit(success ? 0 : 1);
    })
    .catch((error) => {
      console.error("Quality gate script failed:", error);
      process.exit(1);
    });
}

module.exports = { QualityGateChecker };
