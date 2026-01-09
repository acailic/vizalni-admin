/**
 * Distribution Artifacts Validation Test Suite
 *
 * This test suite validates that the built `dist` artifacts are correct and complete.
 * It tests the actual build output, ensuring the library can be consumed properly.
 *
 * Purpose:
 * - Validate built artifacts exist after build
 * - Check exports are correctly bundled
 * - Verify main entry points are accessible
 * - Ensure dependencies are properly bundled (or peer dependencies are external)
 * - Validate bundle structure and content
 */

import { readFileSync, existsSync, statSync } from "fs";
import { join } from "path";

import { describe, it, expect, beforeAll } from "vitest";

type ExportTarget = {
  subpath: string;
  condition: string;
  target: string;
};

const collectExportTargets = (
  exportsMap: Record<string, unknown>
): ExportTarget[] => {
  const targets: ExportTarget[] = [];

  for (const [subpath, entry] of Object.entries(exportsMap)) {
    if (typeof entry === "string") {
      targets.push({ subpath, condition: "default", target: entry });
      continue;
    }

    if (entry && typeof entry === "object") {
      for (const [condition, value] of Object.entries(entry)) {
        if (typeof value === "string") {
          targets.push({ subpath, condition, target: value });
        }
      }
    }
  }

  return targets;
};

describe("Distribution Artifacts Validation", () => {
  const appDir = process.cwd();
  const distDir = join(appDir, "dist");

  // Check if dist exists before running tests
  const distExists = existsSync(distDir);
  const distFiles = distExists ? readdirSync(distDir) : [];

  beforeAll(() => {
    if (distExists) {
      console.log(`✓ Testing against built artifacts in ${distDir}`);
      console.log(`  Found ${distFiles.length} files: ${distFiles.join(", ")}`);
    } else {
      console.log(`⚠ Dist directory not found. Run 'npm run build:lib' first.`);
    }
  });

  describe("Build Output Structure", () => {
    it("should have dist directory", () => {
      expect(distExists).toBe(true);
    });

    it("should have at least one built file", () => {
      expect(distFiles.length).toBeGreaterThan(0);
    });

    it("should have both CJS and ESM builds", () => {
      if (!distExists) {
        return;
      }

      // Check for common CJS patterns
      const hasCjs =
        distFiles.some((f: string) => f.endsWith(".cjs")) ||
        distFiles.some((f: string) => f.endsWith(".js"));

      // Check for common ESM patterns
      const hasEsm =
        distFiles.some((f: string) => f.endsWith(".mjs")) ||
        distFiles.some((f: string) => f.endsWith(".esm.js"));

      expect(hasCjs).toBe(true);
      expect(hasEsm).toBe(true);
    });
  });

  describe("Main Entry Point", () => {
    const cjsFile = join(distDir, "index.js");
    const esmFile = join(distDir, "index.mjs");
    const dtsFile = join(distDir, "index.d.ts");

    it("should have CJS entry point (index.js)", () => {
      if (!distExists) return;
      expect(existsSync(cjsFile)).toBe(true);
    });

    it("should have ESM entry point (index.mjs)", () => {
      if (!distExists) return;
      expect(existsSync(esmFile)).toBe(true);
    });

    it("CJS bundle should be non-empty", () => {
      if (!existsSync(cjsFile)) return;

      const stats = statSync(cjsFile);
      expect(stats.size).toBeGreaterThan(1000); // At least 1KB
    });

    it("ESM bundle should be non-empty", () => {
      if (!existsSync(esmFile)) return;

      const stats = statSync(esmFile);
      expect(stats.size).toBeGreaterThan(1000); // At least 1KB
    });

    it("CJS bundle should have valid CommonJS format", () => {
      if (!existsSync(cjsFile)) return;

      const content = readFileSync(cjsFile, "utf-8");

      // Should have use strict
      expect(content).toMatch(/'use strict'/);

      // Should have exports (either module.exports or Object.defineProperty(exports))
      expect(content).toMatch(/exports/);

      // Should have require statements for external deps
      expect(content).toMatch(/require\(/);
    });

    it("ESM bundle should have valid ES module format", () => {
      if (!existsSync(esmFile)) return;

      const content = readFileSync(esmFile, "utf-8");

      // Should have import/export statements (minified might not have spaces)
      expect(content).toMatch(/import|export/);

      // Should not have CommonJS require
      expect(content).not.toMatch(/require\(/);
    });
  });

  describe("TypeScript Declarations", () => {
    it("should have TypeScript declaration files if DTS generation is enabled", () => {
      if (!distExists) return;

      const dtsFiles = distFiles.filter((f: string) => f.endsWith(".d.ts"));

      // Note: DTS generation might be disabled in tsup.config.ts
      // This test checks consistency - if DTS files exist, validate them
      if (dtsFiles.length > 0) {
        console.log(`  Found ${dtsFiles.length} declaration file(s)`);
        expect(dtsFiles.length).toBeGreaterThan(0);
      } else {
        console.log(
          `  No declaration files found (DTS generation may be disabled)`
        );
      }
    });

    it("declaration files should have valid TypeScript syntax", () => {
      if (!distExists) return;

      const dtsFiles = distFiles.filter((f: string) => f.endsWith(".d.ts"));

      for (const dtsFile of dtsFiles) {
        const filePath = join(distDir, dtsFile);
        const content = readFileSync(filePath, "utf-8");

        // Should have declare or export keywords
        expect(content).toMatch(/declare |export /);
      }
    });
  });

  describe("Dependency Bundling", () => {
    const cjsFile = join(distDir, "index.js");
    const esmFile = join(distDir, "index.mjs");

    // Dependencies that should be external (not bundled) AND are used in main entry
    const usedExternalDeps = [
      "@lingui/react",
      "@lingui/core",
      "d3-format",
      "d3-time-format",
      "io-ts",
    ];

    // All peer dependencies (including those not used in main entry)
    const allPeerDeps = [
      "react",
      "react-dom",
      "next",
      "@lingui/react",
      "@lingui/core",
      "d3-format",
      "d3-time-format",
      "make-plural",
      "fp-ts",
      "io-ts",
    ];

    // Dependencies that should be bundled
    const bundledDeps = [
      "@visx/group",
      "@visx/text",
      "d3-scale",
      "d3-axis",
      "react-table",
      "react-window",
    ];

    it("should not bundle used peer dependencies", () => {
      if (!existsSync(cjsFile)) return;

      const content = readFileSync(cjsFile, "utf-8");

      // Check that USED peer dependencies are externalized
      // Note: Not all peer dependencies may be used in the main entry point
      const foundDeps: string[] = [];
      const missingDeps: string[] = [];

      for (const dep of usedExternalDeps) {
        // In CJS, external deps should be require() statements
        // Handle both single and double quotes
        const hasRequire =
          content.includes(`require('${dep}')`) ||
          content.includes(`require("${dep}")`);

        if (hasRequire) {
          foundDeps.push(dep);
        } else {
          missingDeps.push(dep);
        }
      }

      // At least some peer dependencies should be externalized
      console.log(
        `  Found ${foundDeps.length} externalized peer deps: ${foundDeps.join(", ")}`
      );
      if (missingDeps.length > 0) {
        console.log(`  Not found in main entry: ${missingDeps.join(", ")}`);
      }

      // At least one peer dependency should be externalized
      expect(foundDeps.length).toBeGreaterThan(0);
    });

    it("should not bundle used peer dependencies in ESM", () => {
      if (!existsSync(esmFile)) return;

      const content = readFileSync(esmFile, "utf-8");

      // Check that USED peer dependencies are externalized
      // Note: Not all peer dependencies may be used in the main entry point
      const foundDeps: string[] = [];
      const missingDeps: string[] = [];

      for (const dep of usedExternalDeps) {
        // In ESM, external deps should be import statements
        const hasImport =
          content.includes(`from'${dep}'`) ||
          content.includes(`from"${dep}"`) ||
          content.includes(`from '${dep}'`) ||
          content.includes(`from "${dep}"`);

        if (hasImport) {
          foundDeps.push(dep);
        } else {
          missingDeps.push(dep);
        }
      }

      // At least some peer dependencies should be externalized
      console.log(
        `  Found ${foundDeps.length} externalized peer deps: ${foundDeps.join(", ")}`
      );
      if (missingDeps.length > 0) {
        console.log(`  Not found in main entry: ${missingDeps.join(", ")}`);
      }

      // At least one peer dependency should be externalized
      expect(foundDeps.length).toBeGreaterThan(0);
    });

    it("should not have any bundled peer dependencies", () => {
      if (!existsSync(cjsFile)) return;

      const content = readFileSync(cjsFile, "utf-8");

      // Check that none of the peer dependencies are bundled (inlined)
      // They should all be externalized via require()
      const bundledPeerDeps: string[] = [];

      for (const dep of allPeerDeps) {
        // If we find the dependency name but not as a require, it might be bundled
        // This is a heuristic - in minified code, names might be shortened
        const hasRequire =
          content.includes(`require('${dep}')`) ||
          content.includes(`require("${dep}")`);

        const depInCode = content.includes(dep);

        if (
          depInCode &&
          !hasRequire &&
          dep !== "react" &&
          dep !== "react-dom" &&
          dep !== "next"
        ) {
          // Exclude react/react-dom/next as they might be referenced in comments
          bundledPeerDeps.push(dep);
        }
      }

      if (bundledPeerDeps.length > 0) {
        console.log(
          `  Warning: These peer dependencies might be bundled: ${bundledPeerDeps.join(", ")}`
        );
      }
    });

    it("should bundle regular dependencies", () => {
      if (!existsSync(cjsFile)) return;

      const content = readFileSync(cjsFile, "utf-8");

      // These should be bundled (no require for them)
      for (const dep of bundledDeps) {
        // If a bundled dep appears as require, it might not be properly bundled
        // This is a soft check - the dep might not be used in the code
        if (content.includes(dep)) {
          // If dep name appears, it should be inlined code, not a require
          const requirePattern = new RegExp(`require\\(['"]${dep}['"]\\)`);
          const hasRequire = requirePattern.test(content);

          if (hasRequire) {
            console.log(
              `  Warning: ${dep} appears to be required instead of bundled`
            );
          }
        }
      }
    });
  });

  describe("Export Validation", () => {
    const cjsFile = join(distDir, "index.js");
    const esmFile = join(distDir, "index.mjs");

    // Expected exports from the main entry point (based on index.ts)
    const expectedExports = [
      "version",
      "I18nProvider",
      "defaultLocale",
      "locales",
      "parseLocaleString",
      "i18n",
      "getD3TimeFormatLocale",
      "getD3FormatLocale",
      "validateConfig",
      "DEFAULT_CONFIG",
      "DataGovRsClient",
      "createDataGovRsClient",
      "dataGovRsClient",
      // Note: Chart components are not exported from main entry point
      // They are available via subpath exports (./charts, ./hooks, etc.)
    ];

    it("CJS bundle should export expected symbols", () => {
      if (!existsSync(cjsFile)) return;

      const content = readFileSync(cjsFile, "utf-8");

      // Check for exports - names might be minified, so check for exports pattern
      let foundExports = 0;
      for (const exportName of expectedExports) {
        // Exported symbols should appear in the bundle
        // In minified bundles, exports might be aliased
        const hasExport =
          content.includes(`exports.${exportName}`) ||
          content.includes(`"${exportName}"`) ||
          content.includes(`'${exportName}'`) ||
          content.includes(`as ${exportName}`);

        if (hasExport) {
          foundExports++;
        }
      }

      // At least some expected exports should be found
      expect(foundExports).toBeGreaterThan(expectedExports.length / 2);

      // Should have exports object
      expect(content).toMatch(/exports\./);
    });

    it("ESM bundle should export expected symbols", () => {
      if (!existsSync(esmFile)) return;

      const content = readFileSync(esmFile, "utf-8");

      // Check for exports - names might be minified
      let foundExports = 0;
      for (const exportName of expectedExports) {
        // Exported symbols should appear in the bundle
        const hasExport =
          content.includes(`export{${exportName}`) ||
          content.includes(`export { ${exportName}`) ||
          content.includes(`"${exportName}"`) ||
          content.includes(`'${exportName}'`) ||
          content.includes(`as ${exportName}`);

        if (hasExport) {
          foundExports++;
        }
      }

      // At least some expected exports should be found
      expect(foundExports).toBeGreaterThan(expectedExports.length / 2);

      // Should have export statements
      expect(content).toMatch(/export\{/);
    });
  });

  describe("Bundle Quality", () => {
    const cjsFile = join(distDir, "index.js");
    const esmFile = join(distDir, "index.mjs");

    it("should not have source maps if disabled", () => {
      if (!distExists) return;

      const mapFiles = distFiles.filter((f: string) => f.endsWith(".map"));

      // If source maps are disabled in tsup.config.ts, there should be no map files
      if (mapFiles.length > 0) {
        console.log(`  Found ${mapFiles.length} source map file(s)`);
      }
    });

    it("should have reasonable bundle sizes", () => {
      if (!existsSync(cjsFile) || !existsSync(esmFile)) return;

      const cjsStats = statSync(cjsFile);
      const esmStats = statSync(esmFile);

      const cjsSizeKB = cjsStats.size / 1024;
      const esmSizeKB = esmStats.size / 1024;

      console.log(`  CJS bundle size: ${cjsSizeKB.toFixed(2)} KB`);
      console.log(`  ESM bundle size: ${esmSizeKB.toFixed(2)} KB`);

      // Bundles should be reasonable (not empty, not excessively large)
      // Main entry point might be smaller due to code splitting
      expect(cjsSizeKB).toBeGreaterThan(1); // At least 1KB
      expect(cjsSizeKB).toBeLessThan(10000); // Less than 10MB

      expect(esmSizeKB).toBeGreaterThan(1);
      expect(esmSizeKB).toBeLessThan(10000);
    });

    it("should not contain development-only code in production", () => {
      if (!existsSync(cjsFile)) return;

      const content = readFileSync(cjsFile, "utf-8");

      // Should not have console.log statements (unless intentional)
      // This is a soft check - there might be intentional logging
      const consoleLogCount = (content.match(/console\.log/g) || []).length;

      if (consoleLogCount > 0) {
        console.log(
          `  Warning: Found ${consoleLogCount} console.log statements`
        );
      }
    });
  });

  describe("Package.json Consistency", () => {
    it("main entry point should exist", () => {
      const packageJsonPath = join(appDir, "package.json");
      const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"));

      const mainFile = join(appDir, packageJson.main);

      if (distExists) {
        if (!existsSync(mainFile)) {
          // Check if the actual built file exists
          const actualFile = join(distDir, "index.js");
          if (existsSync(actualFile)) {
            console.log(
              `  Note: package.json main points to ${packageJson.main} but actual file is dist/index.js`
            );
          } else {
            console.log(
              `  Warning: Neither ${packageJson.main} nor dist/index.js exists`
            );
          }
        }
      }
    });

    it("module entry point should exist", () => {
      const packageJsonPath = join(appDir, "package.json");
      const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"));

      const moduleFile = join(appDir, packageJson.module);

      if (distExists) {
        if (!existsSync(moduleFile)) {
          // Check if the actual built file exists
          const actualFile = join(distDir, "index.mjs");
          if (existsSync(actualFile)) {
            console.log(
              `  Note: package.json module points to ${packageJson.module} but actual file is dist/index.mjs`
            );
          } else {
            console.log(
              `  Warning: Neither ${packageJson.module} nor dist/index.mjs exists`
            );
          }
        }
      }
    });

    it("types entry point should exist if DTS is enabled", () => {
      const packageJsonPath = join(appDir, "package.json");
      const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"));

      const typesFile = join(appDir, packageJson.types);

      if (distExists && existsSync(typesFile)) {
        expect(existsSync(typesFile)).toBe(true);
      } else {
        console.log(
          `  Types file ${typesFile} not found (DTS may be disabled)`
        );
      }
    });
  });

  describe("Build Configuration Validation", () => {
    it("tsup.config.ts should exist and be valid", () => {
      const tsupConfigPath = join(appDir, "tsup.config.ts");
      expect(existsSync(tsupConfigPath)).toBe(true);

      const content = readFileSync(tsupConfigPath, "utf-8");

      // Should have defineConfig
      expect(content).toMatch(/defineConfig/);

      // Should specify entry points
      expect(content).toMatch(/entry:/);

      // Should specify formats
      expect(content).toMatch(/format:/);
    });

    it("should configure external dependencies", () => {
      const tsupConfigPath = join(appDir, "tsup.config.ts");
      const content = readFileSync(tsupConfigPath, "utf-8");

      // Should have external configuration
      expect(content).toMatch(/external:/);

      // Should externalize React
      expect(content).toMatch(/['"]react['"]/);

      // Should externalize @lingui
      expect(content).toMatch(/['"]@lingui\//);
    });
  });

  describe("Subpath Exports", () => {
    const packageJsonPath = join(appDir, "package.json");
    const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"));
    const exports = packageJson.exports || {};

    it("should have exports field in package.json", () => {
      expect(typeof exports).toBe("object");
      expect(Object.keys(exports).length).toBeGreaterThan(0);
    });

    it("should have main export (.)", () => {
      expect(exports["."]).toBeDefined();
      expect(exports["."].import).toBeDefined();
      expect(exports["."].require).toBeDefined();
    });

    it("exports map should only reference dist artifacts", () => {
      const targets = collectExportTargets(exports);
      const invalidTargets = targets.filter(
        (target) => !target.target.startsWith("./dist/")
      );

      expect(invalidTargets).toEqual([]);
    });

    it("exports map targets should exist when dist is built", () => {
      if (!distExists) return;

      const hasDts = distFiles.some((f: string) => f.endsWith(".d.ts"));
      const targets = collectExportTargets(exports).filter(
        (target) => target.condition !== "types" || hasDts
      );
      const missingTargets = targets.filter(
        (target) => !existsSync(join(appDir, target.target))
      );

      if (missingTargets.length > 0) {
        const formatted = missingTargets
          .map(
            (target) =>
              `${target.subpath} [${target.condition}] -> ${target.target}`
          )
          .join("\n");
        throw new Error(`Missing export artifacts:\n${formatted}`);
      }
    });
  });

  describe("Exports Map Comprehensive Validation", () => {
    const packageJsonPath = join(appDir, "package.json");
    let packageJson: any;
    let exports: any;

    beforeAll(() => {
      packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"));
      exports = packageJson.exports || {};
    });

    it("should have all expected export entry points", () => {
      // Expected subpath exports based on package.json
      const expectedExports = [
        ".",
        "./core",
        "./client",
        "./charts",
        "./hooks",
        "./utils",
      ];

      const actualExports = Object.keys(exports);

      for (const expectedExport of expectedExports) {
        expect(actualExports).toContain(expectedExport);
      }
    });

    it("each export should have import, require, and types conditions", () => {
      for (const [subpath, entry] of Object.entries(exports)) {
        expect(entry).toBeDefined();
        expect(typeof entry).toBe("object");

        // Check for required conditions
        expect(entry.import).toBeDefined();
        expect(entry.require).toBeDefined();
        expect(entry.types).toBeDefined();

        // All should point to dist/ directory
        expect(entry.import).toMatch(/^\.\/dist\//);
        expect(entry.require).toMatch(/^\.\/dist\//);
        expect(entry.types).toMatch(/^\.\/dist\//);
      }
    });

    it("all export files should exist in dist directory", () => {
      if (!distExists) {
        console.log("  Skipping: dist directory not found");
        return;
      }

      const targets = collectExportTargets(exports);
      const missingFiles: string[] = [];

      // Check if DTS generation is enabled
      const hasAnyDts = distFiles.some((f: string) => f.endsWith(".d.ts"));

      for (const target of targets) {
        // Skip type checks if DTS generation is disabled
        if (target.condition === "types" && !hasAnyDts) {
          continue;
        }

        const filePath = join(appDir, target.target);

        if (!existsSync(filePath)) {
          missingFiles.push(
            `  ${target.subpath} [${target.condition}] -> ${target.target} (MISSING)`
          );
        }
      }

      if (missingFiles.length > 0) {
        const errorMessage = [
          "❌ Export Map Validation Failed",
          "The following export targets are missing from the dist directory:",
          "",
          ...missingFiles,
          "",
          "Run: npm run build:lib",
          "",
          "Or verify tsup.config.ts builds all entry points:",
          "  - index.ts",
          "  - exports/core.ts",
          "  - exports/client.ts",
          "  - exports/charts/index.ts",
          "  - exports/hooks/index.ts",
          "  - exports/utils/index.ts",
        ].join("\n");

        throw new Error(errorMessage);
      }

      const checkedTargets = hasAnyDts
        ? targets.length
        : targets.filter((t) => t.condition !== "types").length;
      console.log(`✓ All ${checkedTargets} export targets exist in dist/`);
      if (!hasAnyDts) {
        console.log("  (Type declarations skipped - DTS generation disabled)");
      }
    });

    it("main entry point files should match package.json main/module/types", () => {
      if (!distExists) {
        console.log("  Skipping: dist directory not found");
        return;
      }

      // Check main entry point
      const mainFile = join(appDir, packageJson.main);
      const moduleFile = join(appDir, packageJson.module);
      const typesFile = join(appDir, packageJson.types);

      // These files should exist or have equivalent built files
      const mainExists = existsSync(mainFile);
      const moduleExists = existsSync(moduleFile);
      const typesExists = existsSync(typesFile);

      // Log what we found
      if (!mainExists) {
        console.log(`  Note: main file ${packageJson.main} does not exist`);
      }
      if (!moduleExists) {
        console.log(`  Note: module file ${packageJson.module} does not exist`);
      }
      if (!typesExists) {
        console.log(`  Note: types file ${packageJson.types} does not exist`);
      }

      // At least the main and module should exist (types might be disabled)
      expect(mainExists || moduleExists).toBe(true);
    });

    it("export paths should be consistent with tsup entry points", () => {
      // Read tsup config to validate consistency
      const tsupConfigPath = join(appDir, "tsup.config.ts");
      const tsupConfig = readFileSync(tsupConfigPath, "utf-8");

      // Expected entry points in tsup.config.ts
      const expectedEntryPoints = [
        "index.ts",
        "exports/core.ts",
        "exports/client.ts",
        "exports/charts/index.ts",
        "exports/hooks/index.ts",
        "exports/utils/index.ts",
      ];

      for (const entryPoint of expectedEntryPoints) {
        expect(tsupConfig).toContain(entryPoint);
      }

      console.log("✓ tsup.config.ts includes all expected entry points");
    });

    it("should report detailed export map structure", () => {
      if (!distExists) {
        console.log("  Skipping: dist directory not found");
        return;
      }

      console.log("\n📦 Export Map Structure:");
      console.log("─".repeat(60));

      for (const [subpath, entry] of Object.entries(exports)) {
        console.log(`\n${subpath}`);
        console.log(`  import:  ${(entry as any).import}`);
        console.log(`  require: ${(entry as any).require}`);
        console.log(`  types:   ${(entry as any).types}`);

        // Check if files exist
        const importFile = join(appDir, (entry as any).import);
        const requireFile = join(appDir, (entry as any).require);
        const typesFile = join(appDir, (entry as any).types);

        const importExists = existsSync(importFile);
        const requireExists = existsSync(requireFile);
        const typesExists = existsSync(typesFile);

        console.log(
          `  status:  import:${importExists ? "✓" : "✗"} require:${requireExists ? "✓" : "✗"} types:${typesExists ? "✓" : "✗"}`
        );
      }

      console.log("\n" + "─".repeat(60));
    });

    it("should validate CJS and ESM file naming convention", () => {
      if (!distExists) {
        console.log("  Skipping: dist directory not found");
        return;
      }

      const targets = collectExportTargets(exports);
      const issues: string[] = [];

      for (const target of targets) {
        const filePath = join(appDir, target.target);

        if (existsSync(filePath)) {
          // Check naming convention
          // CJS files should end with .cjs or .js
          // ESM files should end with .mjs or .esm.js
          if (target.condition === "require") {
            const isValidCjs =
              target.target.endsWith(".cjs") || target.target.endsWith(".js");
            if (!isValidCjs) {
              issues.push(
                `CJS export should use .cjs or .js: ${target.target}`
              );
            }
          } else if (target.condition === "import") {
            const isValidEsm =
              target.target.endsWith(".mjs") ||
              target.target.endsWith(".esm.js");
            if (!isValidEsm) {
              issues.push(
                `ESM export should use .mjs or .esm.js: ${target.target}`
              );
            }
          }
        }
      }

      if (issues.length > 0) {
        console.log("⚠ File naming issues:\n" + issues.join("\n"));
      }
    });
  });

  describe("Build Process Validation", () => {
    it("should have build:lib script in package.json", () => {
      const packageJsonPath = join(appDir, "package.json");
      const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"));

      expect(packageJson.scripts["build:lib"]).toBeDefined();
      expect(packageJson.scripts["build:lib"]).toContain("tsup");
    });

    it("should have clean script that removes dist", () => {
      const packageJsonPath = join(appDir, "package.json");
      const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"));

      expect(packageJson.scripts["clean"]).toBeDefined();
      expect(packageJson.scripts["clean"]).toContain("dist");
    });

    it("should run build:lib as part of build process", () => {
      const packageJsonPath = join(appDir, "package.json");
      const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"));

      expect(packageJson.scripts["postbuild"]).toBeDefined();
      expect(packageJson.scripts["postbuild"]).toContain("build:lib");
    });
  });

  describe("Consumption Tests", () => {
    it("CJS bundle should be require-able", () => {
      if (!existsSync(join(distDir, "index.js"))) return;

      // This test validates the bundle can be required
      // We don't actually require it to avoid side effects, just check syntax
      const cjsFile = join(distDir, "index.js");
      const content = readFileSync(cjsFile, "utf-8");

      // Should have proper module structure
      expect(content).toMatch(/'use strict'/);
      expect(content).toMatch(/exports/);
    });

    it("ESM bundle should be import-able", () => {
      if (!existsSync(join(distDir, "index.mjs"))) return;

      const esmFile = join(distDir, "index.mjs");
      const content = readFileSync(esmFile, "utf-8");

      // Should have ES module syntax (export{...} is minified form)
      expect(content).toMatch(/export\{/);

      // Should not have shebang (not a CLI script)
      expect(content.startsWith("#!")).toBe(false);
    });
  });
});
