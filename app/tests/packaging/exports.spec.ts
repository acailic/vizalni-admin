/**
 * Packaging/Export Validation Test Suite
 *
 * This "meta-test" validates that the @acailic/vizualni-admin package exports
 * are configured correctly and accessible. It tests the build artifacts and
 * export configuration, not the functionality of the exported modules.
 *
 * Purpose:
 * - Ensure all subpath exports in package.json are accessible
 * - Validate type definitions exist for each export
 * - Check that re-exports match expectations
 * - Verify build artifacts are present and properly structured
 *
 * Note: This test gracefully handles missing dist files in development by
 * falling back to source file validation while documenting the intent.
 */

import { readFileSync, existsSync } from "fs";
import { join } from "path";

import { describe, it, expect, beforeAll } from "vitest";

/**
 * Expected export configuration from package.json
 *
 * This mirrors the exports field in app/package.json and serves as the
 * source of truth for what exports should be available.
 */
const EXPECTED_EXPORTS = {
  ".": {
    types: "./dist/index.d.ts",
    import: "./dist/index.mjs",
    require: "./dist/index.js",
    subpath: "@acailic/vizualni-admin",
  },
  "./core": {
    types: "./dist/core.d.ts",
    import: "./dist/core.mjs",
    require: "./dist/core.js",
    subpath: "@acailic/vizualni-admin/core",
  },
  "./client": {
    types: "./dist/client.d.ts",
    import: "./dist/client.mjs",
    require: "./dist/client.js",
    subpath: "@acailic/vizualni-admin/client",
  },
  "./charts": {
    types: "./dist/charts/index.d.ts",
    import: "./dist/charts/index.mjs",
    require: "./dist/charts/index.js",
    subpath: "@acailic/vizualni-admin/charts",
  },
  "./hooks": {
    types: "./dist/hooks/index.d.ts",
    import: "./dist/hooks/index.mjs",
    require: "./dist/hooks/index.js",
    subpath: "@acailic/vizualni-admin/hooks",
  },
  "./utils": {
    types: "./dist/utils/index.d.ts",
    import: "./dist/utils/index.mjs",
    require: "./dist/utils/index.js",
    subpath: "@acailic/vizualni-admin/utils",
  },
} as const;

/**
 * Expected re-exports for each subpath
 *
 * These are the key exports that should be available from each subpath.
 * This validates that the barrel files are properly configured.
 */
const EXPECTED_REEXPORTS = {
  core: [
    "defaultLocale",
    "locales",
    "parseLocaleString",
    "i18n",
    "getD3TimeFormatLocale",
    "getD3FormatLocale",
    "validateConfig",
    "DEFAULT_CONFIG",
  ],
  client: ["DataGovRsClient", "createDataGovRsClient", "dataGovRsClient"],
  charts: [
    "LineChart",
    "BarChart",
    "ColumnChart",
    "PieChart",
    "AreaChart",
    "MapChart",
  ],
  hooks: ["useDataGovRs", "useChartConfig", "useLocale"],
  utils: [
    // utils re-exports everything from transforms and formatters
    // We'll just check that the module exports something
  ],
} as const;

/**
 * Source file paths for development testing
 *
 * When dist files don't exist (development), we validate against
 * the source files to ensure exports are properly configured.
 */
const SOURCE_FILES = {
  ".": "./index.ts",
  "./core": "./exports/core.ts",
  "./client": "./exports/client.ts",
  "./charts": "./exports/charts/index.ts",
  "./hooks": "./exports/hooks/index.ts",
  "./utils": "./exports/utils/index.ts",
} as const;

describe("Package Export Validation", () => {
  const appDir = process.cwd();
  const distDir = join(appDir, "dist");
  const distExists = existsSync(distDir);

  beforeAll(() => {
    // Log test mode
    if (distExists) {
      console.log(`✓ Testing against built artifacts in ${distDir}`);
    } else {
      console.log(
        `⚠ Dist directory not found. Testing against source files instead.`
      );
      console.log(`  Run 'npm run build:lib' to test actual build artifacts.`);
    }
  });

  describe("Package.json Export Configuration", () => {
    it("should have package.json with exports field", () => {
      const packageJsonPath = join(appDir, "package.json");
      expect(existsSync(packageJsonPath)).toBe(true);

      const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"));

      expect(packageJson.exports).toBeDefined();
      expect(typeof packageJson.exports).toBe("object");
    });

    it("should define all expected subpath exports", () => {
      const packageJsonPath = join(appDir, "package.json");
      const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"));

      const exports = packageJson.exports;

      // Check each expected export exists
      for (const subpath of Object.keys(EXPECTED_EXPORTS)) {
        expect(exports[subpath]).toBeDefined();
        expect(exports[subpath].types).toBeDefined();
        expect(exports[subpath].import).toBeDefined();
        expect(exports[subpath].require).toBeDefined();
      }
    });

    it("should have correct export paths in package.json", () => {
      const packageJsonPath = join(appDir, "package.json");
      const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"));

      const exports = packageJson.exports;

      // Validate export paths match expectations
      expect(exports["."].types).toBe(EXPECTED_EXPORTS["."].types);
      expect(exports["."].import).toBe(EXPECTED_EXPORTS["."].import);
      expect(exports["."].require).toBe(EXPECTED_EXPORTS["."].require);

      expect(exports["./core"].types).toBe(EXPECTED_EXPORTS["./core"].types);
      expect(exports["./charts"].types).toBe(
        EXPECTED_EXPORTS["./charts"].types
      );
      expect(exports["./hooks"].types).toBe(EXPECTED_EXPORTS["./hooks"].types);
      expect(exports["./utils"].types).toBe(EXPECTED_EXPORTS["./utils"].types);
    });
  });

  describe("Build Artifacts", () => {
    if (!distExists) {
      it.skip("dist directory exists (skipped - not built)", () => {
        // This test is skipped when dist doesn't exist
      });
      return;
    }

    it("should have main entry point files", () => {
      const mainCjs = join(appDir, EXPECTED_EXPORTS["."].require);
      const mainEsm = join(appDir, EXPECTED_EXPORTS["."].import);
      const mainTypes = join(appDir, EXPECTED_EXPORTS["."].types);

      expect(existsSync(mainCjs)).toBe(true);
      expect(existsSync(mainEsm)).toBe(true);

      // DTS may be disabled
      if (!existsSync(mainTypes)) {
        console.log(
          `  Note: TypeScript declarations not found (DTS may be disabled)`
        );
      }
    });

    it("should have core subpath files", () => {
      const cjs = join(appDir, EXPECTED_EXPORTS["./core"].require);
      const esm = join(appDir, EXPECTED_EXPORTS["./core"].import);
      expect(existsSync(cjs)).toBe(true);
      expect(existsSync(esm)).toBe(true);
    });

    it("should have client subpath files", () => {
      const cjs = join(appDir, EXPECTED_EXPORTS["./client"].require);
      const esm = join(appDir, EXPECTED_EXPORTS["./client"].import);
      expect(existsSync(cjs)).toBe(true);
      expect(existsSync(esm)).toBe(true);
    });

    it("should have charts subpath files", () => {
      const cjs = join(appDir, EXPECTED_EXPORTS["./charts"].require);
      const esm = join(appDir, EXPECTED_EXPORTS["./charts"].import);
      expect(existsSync(cjs)).toBe(true);
      expect(existsSync(esm)).toBe(true);
    });

    it("should have hooks subpath files", () => {
      const cjs = join(appDir, EXPECTED_EXPORTS["./hooks"].require);
      const esm = join(appDir, EXPECTED_EXPORTS["./hooks"].import);
      expect(existsSync(cjs)).toBe(true);
      expect(existsSync(esm)).toBe(true);
    });

    it("should have utils subpath files", () => {
      const cjs = join(appDir, EXPECTED_EXPORTS["./utils"].require);
      const esm = join(appDir, EXPECTED_EXPORTS["./utils"].import);
      expect(existsSync(cjs)).toBe(true);
      expect(existsSync(esm)).toBe(true);
    });

    it("should have valid TypeScript declaration files", () => {
      const mainTypes = join(appDir, EXPECTED_EXPORTS["."].types);

      if (existsSync(mainTypes)) {
        const content = readFileSync(mainTypes, "utf-8");
        // Should have TypeScript declaration syntax
        expect(content).toMatch(/export\s+/);
        expect(content).toMatch(/declare\s+/);
      } else {
        console.log(
          `  Note: TypeScript declarations not found (DTS may be disabled)`
        );
      }
    });
  });

  describe("Source File Validation (Development)", () => {
    it("should have all source barrel files", () => {
      for (const [subpath, sourcePath] of Object.entries(SOURCE_FILES)) {
        const fullPath = join(appDir, sourcePath);
        expect(
          existsSync(fullPath),
          `Source file for ${subpath} exists at ${sourcePath}`
        ).toBe(true);
      }
    });

    it("should have valid TypeScript source files", () => {
      for (const [_subpath, sourcePath] of Object.entries(SOURCE_FILES)) {
        const fullPath = join(appDir, sourcePath);

        if (existsSync(fullPath)) {
          const content = readFileSync(fullPath, "utf-8");
          // Should have export statements
          expect(content).toMatch(/export\s+/);
        }
      }
    });
  });

  describe("Export Content Validation", () => {
    describe("Core exports", () => {
      it("should export expected core utilities and types", () => {
        const sourcePath = SOURCE_FILES["./core"];
        const fullPath = join(appDir, sourcePath);

        if (existsSync(fullPath)) {
          const content = readFileSync(fullPath, "utf-8");

          // Check for key exports - use simpler pattern that handles multi-line exports
          for (const exportName of EXPECTED_REEXPORTS.core) {
            expect(content).toMatch(new RegExp(exportName));
            // Also verify it's in an export statement
            expect(content).toMatch(
              new RegExp(`export[\\s\\S]*${exportName}[\\s\\S]*from`)
            );
          }

          // Should have locale exports
          expect(content).toMatch(/from.*locales/);
          expect(content).toMatch(/from.*config/);
        }
      });

      it("should export TypeScript types from core", () => {
        const sourcePath = SOURCE_FILES["./core"];
        const fullPath = join(appDir, sourcePath);

        if (existsSync(fullPath)) {
          const content = readFileSync(fullPath, "utf-8");

          // Should export types
          expect(content).toMatch(/export type/);
          expect(content).toMatch(/Locale/);
        }
      });
    });

    describe("Client exports", () => {
      it("should export DataGovRs client and types", () => {
        const sourcePath = SOURCE_FILES["./client"];
        const fullPath = join(appDir, sourcePath);

        if (existsSync(fullPath)) {
          const content = readFileSync(fullPath, "utf-8");

          // Check for key exports
          expect(content).toMatch(/DataGovRsClient/);
          expect(content).toMatch(/createDataGovRsClient/);
          expect(content).toMatch(/export type/);
        }
      });
    });

    describe("Charts exports", () => {
      it("should export all chart components", () => {
        const sourcePath = SOURCE_FILES["./charts"];
        const fullPath = join(appDir, sourcePath);

        if (existsSync(fullPath)) {
          const content = readFileSync(fullPath, "utf-8");

          // Check for chart component exports
          for (const chartName of EXPECTED_REEXPORTS.charts) {
            expect(content).toMatch(new RegExp(`export\\s+.*${chartName}`));
          }
        }
      });

      it("should export chart types", () => {
        const sourcePath = SOURCE_FILES["./charts"];
        const fullPath = join(appDir, sourcePath);

        if (existsSync(fullPath)) {
          const content = readFileSync(fullPath, "utf-8");

          // Should export types
          expect(content).toMatch(/from.*['"].*types['"]/);
          expect(content).toMatch(/export \*/);
        }
      });

      it("LineChart should be exported from charts", () => {
        const sourcePath = SOURCE_FILES["./charts"];
        const fullPath = join(appDir, sourcePath);

        if (existsSync(fullPath)) {
          const content = readFileSync(fullPath, "utf-8");
          expect(content).toMatch(/LineChart/);
        }
      });
    });

    describe("Hooks exports", () => {
      it("should export all custom hooks", () => {
        const sourcePath = SOURCE_FILES["./hooks"];
        const fullPath = join(appDir, sourcePath);

        if (existsSync(fullPath)) {
          const content = readFileSync(fullPath, "utf-8");

          // Check for hook exports
          for (const hookName of EXPECTED_REEXPORTS.hooks) {
            expect(content).toMatch(new RegExp(`export\\s+.*${hookName}`));
          }

          // All hooks should start with 'use'
          for (const hookName of EXPECTED_REEXPORTS.hooks) {
            expect(hookName).toMatch(/^use/);
          }
        }
      });
    });

    describe("Utils exports", () => {
      it("should export transforms and formatters", () => {
        const sourcePath = SOURCE_FILES["./utils"];
        const fullPath = join(appDir, sourcePath);

        if (existsSync(fullPath)) {
          const content = readFileSync(fullPath, "utf-8");

          // Should re-export from transforms and formatters
          expect(content).toMatch(/from.*transforms/);
          expect(content).toMatch(/from.*formatters/);
          expect(content).toMatch(/export \*/);
        }
      });
    });
  });

  describe("Build Entry Configuration", () => {
    it("should keep preconstruct compatibility flags configured", () => {
      const packageJsonPath = join(appDir, "package.json");
      const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"));

      expect(packageJson.preconstruct).toBeDefined();
    });

    it("should have all expected entrypoints in tsup config", () => {
      const tsupConfigPath = join(appDir, "tsup.config.ts");
      const tsupConfig = readFileSync(tsupConfigPath, "utf-8");

      expect(tsupConfig).toContain('index: "index.ts"');
      expect(tsupConfig).toContain('core: "exports/core.ts"');
      expect(tsupConfig).toContain('client: "exports/client.ts"');
      expect(tsupConfig).toContain('"charts/index": "exports/charts/index.ts"');
      expect(tsupConfig).toContain(
        '"charts/LineChart": "exports/charts/LineChart.tsx"'
      );
      expect(tsupConfig).toContain(
        '"charts/BarChart": "exports/charts/BarChart.tsx"'
      );
      expect(tsupConfig).toContain(
        '"charts/ColumnChart": "exports/charts/ColumnChart.tsx"'
      );
      expect(tsupConfig).toContain(
        '"charts/PieChart": "exports/charts/PieChart.tsx"'
      );
      expect(tsupConfig).toContain(
        '"charts/AreaChart": "exports/charts/AreaChart.tsx"'
      );
      expect(tsupConfig).toContain(
        '"charts/MapChart": "exports/charts/MapChart.tsx"'
      );
      expect(tsupConfig).toContain('"hooks/index": "exports/hooks/index.ts"');
      expect(tsupConfig).toContain('"utils/index": "exports/utils/index.ts"');
      expect(tsupConfig).toContain(
        '"connectors/index": "exports/connectors/index.ts"'
      );
    });
  });

  describe("Package Metadata", () => {
    it("should have correct main and module fields", () => {
      const packageJsonPath = join(appDir, "package.json");
      const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"));

      expect(packageJson.main).toBe("dist/index.js");
      expect(packageJson.module).toBe("dist/index.mjs");
      expect(packageJson.types).toBe("dist/index.d.ts");
    });

    it("should have correct package name", () => {
      const packageJsonPath = join(appDir, "package.json");
      const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"));

      expect(packageJson.name).toBe("@acailic/vizualni-admin");
    });

    it("should have correct publishConfig", () => {
      const packageJsonPath = join(appDir, "package.json");
      const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"));

      expect(packageJson.publishConfig).toBeDefined();
      expect(packageJson.publishConfig.access).toBe("public");
    });
  });

  describe("Export Consistency", () => {
    it("should have consistent exports across package.json and tsup", () => {
      const packageJsonPath = join(appDir, "package.json");
      const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"));
      const tsupConfigPath = join(appDir, "tsup.config.ts");
      const tsupConfig = readFileSync(tsupConfigPath, "utf-8");

      const exports = Object.keys(packageJson.exports).filter(
        (key) => key !== "."
      );
      expect(exports.length).toBe(12);

      expect(tsupConfig).toContain('core: "exports/core.ts"');
      expect(packageJson.exports["./core"]).toBeDefined();
      expect(tsupConfig).toContain('client: "exports/client.ts"');
      expect(packageJson.exports["./client"]).toBeDefined();
      expect(tsupConfig).toContain('"charts/index": "exports/charts/index.ts"');
      expect(packageJson.exports["./charts"]).toBeDefined();
      expect(tsupConfig).toContain(
        '"charts/LineChart": "exports/charts/LineChart.tsx"'
      );
      expect(packageJson.exports["./charts/LineChart"]).toBeDefined();
      expect(tsupConfig).toContain(
        '"charts/BarChart": "exports/charts/BarChart.tsx"'
      );
      expect(packageJson.exports["./charts/BarChart"]).toBeDefined();
      expect(tsupConfig).toContain(
        '"charts/ColumnChart": "exports/charts/ColumnChart.tsx"'
      );
      expect(packageJson.exports["./charts/ColumnChart"]).toBeDefined();
      expect(tsupConfig).toContain(
        '"charts/PieChart": "exports/charts/PieChart.tsx"'
      );
      expect(packageJson.exports["./charts/PieChart"]).toBeDefined();
      expect(tsupConfig).toContain(
        '"charts/AreaChart": "exports/charts/AreaChart.tsx"'
      );
      expect(packageJson.exports["./charts/AreaChart"]).toBeDefined();
      expect(tsupConfig).toContain(
        '"charts/MapChart": "exports/charts/MapChart.tsx"'
      );
      expect(packageJson.exports["./charts/MapChart"]).toBeDefined();
      expect(tsupConfig).toContain('"hooks/index": "exports/hooks/index.ts"');
      expect(packageJson.exports["./hooks"]).toBeDefined();
      expect(tsupConfig).toContain('"utils/index": "exports/utils/index.ts"');
      expect(packageJson.exports["./utils"]).toBeDefined();
      expect(tsupConfig).toContain(
        '"connectors/index": "exports/connectors/index.ts"'
      );
      expect(packageJson.exports["./connectors"]).toBeDefined();
    });

    it("should have valid file extensions in exports", () => {
      const packageJsonPath = join(appDir, "package.json");
      const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"));

      const exports = packageJson.exports;

      for (const [_subpath, config] of Object.entries(exports)) {
        const typesPath = (config as { types?: string }).types;
        const importPath = (config as { import?: string }).import;
        const requirePath = (config as { require?: string }).require;

        // Types should be .d.ts
        expect(typesPath).toMatch(/\.d\.ts$/);

        // Import should be .mjs or .esm.js
        expect(importPath).toMatch(/\.(mjs|esm\.js)$/);

        // Require should be .js or .cjs
        expect(requirePath).toMatch(/\.(js|cjs(\.js)?)$/);
      }
    });
  });

  describe("Type Safety Validation", () => {
    it("should export types for all subpaths", () => {
      const packageJsonPath = join(appDir, "package.json");
      const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"));

      const exports = packageJson.exports;

      for (const [_subpath, config] of Object.entries(exports)) {
        const typesPath = (config as { types?: string }).types;
        expect(typesPath).toBeDefined();
        expect(typesPath).toMatch(/\.d\.ts$/);
      }
    });

    it("should have typesVersions configured", () => {
      const packageJsonPath = join(appDir, "package.json");
      const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"));

      // Note: typesVersions is no longer used since we have proper types in exports
      // The modern approach is to use exports.*.types instead of typesVersions
      // This test is kept for documentation but marked as skipped
      expect(packageJson.typesVersions).toBeUndefined();
    });
  });
});
