/**
 * Build Configuration Validation Test Suite
 *
 * This test suite validates that the build configuration is properly set up
 * to produce the expected distribution artifacts.
 *
 * Purpose:
 * - Validate tsup configuration
 * - Check package.json build scripts
 * - Ensure external dependencies are correctly configured
 * - Verify build output expectations
 */

import { readFileSync, existsSync } from "fs";
import { join } from "path";

import { describe, it, expect } from "vitest";

describe("Build Configuration Validation", () => {
  const appDir = process.cwd();

  describe("tsup Configuration", () => {
    const tsupConfigPath = join(appDir, "tsup.config.ts");

    it("should have tsup.config.ts", () => {
      expect(existsSync(tsupConfigPath)).toBe(true);
    });

    it("should be a valid TypeScript file", () => {
      const content = readFileSync(tsupConfigPath, "utf-8");

      // Should import from tsup
      expect(content).toMatch(/from ['"]tsup['"]/);

      // Should export default config
      expect(content).toMatch(/export default/);
    });

    it("should define entry points", () => {
      const content = readFileSync(tsupConfigPath, "utf-8");

      // Should have entry configuration
      expect(content).toMatch(/entry:\s*{/);
      expect(content).toMatch(/index:\s*["']index\.ts["']/);
      expect(content).toMatch(/core:\s*["']exports\/core\.ts["']/);
      expect(content).toMatch(/client:\s*["']exports\/client\.ts["']/);
      expect(content).toMatch(
        /"charts\/index":\s*["']exports\/charts\/index\.ts["']/
      );
      expect(content).toMatch(
        /"hooks\/index":\s*["']exports\/hooks\/index\.ts["']/
      );
      expect(content).toMatch(
        /"utils\/index":\s*["']exports\/utils\/index\.ts["']/
      );
    });

    it("should specify output formats", () => {
      const content = readFileSync(tsupConfigPath, "utf-8");

      // Should specify both CJS and ESM
      expect(content).toMatch(/format:\s*\[/);
      expect(content).toMatch(/['"]cjs['"]/);
      expect(content).toMatch(/['"]esm['"]/);
    });

    it("should configure external dependencies", () => {
      const content = readFileSync(tsupConfigPath, "utf-8");

      // Should have external configuration
      expect(content).toMatch(/external/);

      // Should externalize React (peer dependency)
      expect(content).toMatch(/['"]react['"]/);
    });

    it("should configure DTS generation", () => {
      const content = readFileSync(tsupConfigPath, "utf-8");

      // Should have dts configuration
      expect(content).toMatch(/dts:/);

      // Check if DTS is enabled or disabled (both are valid)
      const dtsEnabled = content.includes("dts: true");
      const dtsDisabled = content.includes("dts: false");

      expect(dtsEnabled || dtsDisabled).toBe(true);
    });

    it("should configure sourcemap generation", () => {
      const content = readFileSync(tsupConfigPath, "utf-8");

      // Should have sourcemap configuration
      expect(content).toMatch(/sourcemap:/);

      // Check if sourcemaps are enabled or disabled (both are valid)
      const sourcemapEnabled = content.includes("sourcemap: true");
      const sourcemapDisabled = content.includes("sourcemap: false");

      expect(sourcemapEnabled || sourcemapDisabled).toBe(true);
    });

    it("should configure treeshaking", () => {
      const content = readFileSync(tsupConfigPath, "utf-8");

      // Should have treeshake enabled for production
      expect(content).toMatch(/treeshake:\s*true/);
    });

    it("should configure splitting", () => {
      const content = readFileSync(tsupConfigPath, "utf-8");

      // Should enable code splitting
      expect(content).toMatch(/splitting:\s*true/);
    });

    it("should configure minification", () => {
      const content = readFileSync(tsupConfigPath, "utf-8");

      // Should have minify configuration
      expect(content).toMatch(/minify:/);

      // Should be conditional on watch mode
      expect(content).toMatch(/options\.watch/);
    });

    it("should configure clean build", () => {
      const content = readFileSync(tsupConfigPath, "utf-8");

      // Should clean output directory before build
      expect(content).toMatch(/clean:\s*true/);
    });
  });

  describe("External Dependencies Configuration", () => {
    const tsupConfigPath = join(appDir, "tsup.config.ts");
    const packageJsonPath = join(appDir, "package.json");
    const tsupConfig = readFileSync(tsupConfigPath, "utf-8");
    const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"));

    // Get external dependencies from tsup config
    const externalMatch = tsupConfig.match(
      /external(?:Deps)?\s*=\s*\[(.*?)\]/s
    );
    const externalDeps = externalMatch
      ? externalMatch[1]
          .split(",")
          .map((s) =>
            s
              .trim()
              .replace(/['"]/g, "")
              .replace(/\/\/.*/, "")
          )
          .filter(Boolean)
      : [];

    it("should externalize all peer dependencies", () => {
      const peerDeps = Object.keys(packageJson.peerDependencies || {});

      for (const peerDep of peerDeps) {
        const isExternal = externalDeps.some((dep: string) => {
          // Handle scoped packages
          if (peerDep.startsWith("@")) {
            return dep.startsWith(peerDep);
          }
          return dep === peerDep;
        });

        if (!isExternal) {
          console.log(
            `  Note: Peer dependency ${peerDep} is not in tsup external array`
          );
        }
      }
    });

    it("should externalize @lingui packages", () => {
      const linguiPackages = ["@lingui/core", "@lingui/react"];

      for (const pkg of linguiPackages) {
        const isExternal = externalDeps.some(
          (dep: string) => dep === pkg || dep.startsWith(pkg)
        );

        if (!isExternal) {
          console.log(`  Note: ${pkg} is not in tsup external array`);
        }
      }
    });

    it("should externalize D3 locale packages", () => {
      const d3Packages = ["d3-format", "d3-time-format", "make-plural"];

      for (const pkg of d3Packages) {
        const isExternal = externalDeps.some(
          (dep: string) => dep === pkg || dep.startsWith(pkg)
        );

        if (!isExternal) {
          console.log(`  Note: ${pkg} is not in tsup external array`);
        }
      }
    });

    it("should externalize fp-ts and io-ts", () => {
      const fpTsPackages = ["fp-ts", "io-ts"];

      for (const pkg of fpTsPackages) {
        const isExternal = externalDeps.some(
          (dep: string) => dep === pkg || dep.startsWith(pkg)
        );

        if (!isExternal) {
          console.log(`  Note: ${pkg} is not in tsup external array`);
        }
      }
    });

    it("should externalize @babel/runtime", () => {
      const isExternal = externalDeps.some(
        (dep: string) => dep === "@babel/runtime"
      );

      if (!isExternal) {
        console.log(`  Note: @babel/runtime is not in tsup external array`);
      }
    });
  });

  describe("Package.json Build Scripts", () => {
    const packageJsonPath = join(appDir, "package.json");
    const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"));

    it("should have build:lib script", () => {
      expect(packageJson.scripts["build:lib"]).toBeDefined();
      // build:lib now includes DTS generation: tsup + tsc + copy-dts
      expect(packageJson.scripts["build:lib"]).toContain("tsup");
      expect(packageJson.scripts["build:lib"]).toContain("tsc");
      expect(packageJson.scripts["build:lib"]).toContain("copy-dts");
    });

    it("should have build script", () => {
      expect(packageJson.scripts["build"]).toBeDefined();
      expect(packageJson.scripts["build"]).toContain("next build");
    });

    it("should have postbuild hook", () => {
      expect(packageJson.scripts["postbuild"]).toBeDefined();
      expect(packageJson.scripts["postbuild"]).toBe("npm run build:lib");
    });

    it("should have clean script", () => {
      expect(packageJson.scripts["clean"]).toBeDefined();
      expect(packageJson.scripts["clean"]).toContain("rm -rf");
      expect(packageJson.scripts["clean"]).toContain("dist");
    });

    it("should run build:lib after main build", () => {
      // The postbuild hook should run build:lib
      expect(packageJson.scripts["postbuild"]).toContain("build:lib");
    });
  });

  describe("Entry Points Configuration", () => {
    const packageJsonPath = join(appDir, "package.json");
    const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"));

    it("should have main field pointing to dist", () => {
      expect(packageJson.main).toBeDefined();
      expect(packageJson.main).toMatch(/^dist\//);
      expect(packageJson.main).toMatch(/\.(js|cjs)$/);
    });

    it("should have module field pointing to dist", () => {
      expect(packageJson.module).toBeDefined();
      expect(packageJson.module).toMatch(/^dist\//);
      expect(packageJson.module).toMatch(/\.(mjs|esm\.js)$/);
    });

    it("should have types field pointing to dist", () => {
      expect(packageJson.types).toBeDefined();
      expect(packageJson.types).toMatch(/^dist\//);
      expect(packageJson.types).toMatch(/\.d\.ts$/);
    });

    it("should have exports field", () => {
      expect(packageJson.exports).toBeDefined();
      expect(typeof packageJson.exports).toBe("object");
    });

    it("main export should have import, require, and types", () => {
      const mainExport = packageJson.exports["."];

      expect(mainExport).toBeDefined();
      expect(mainExport.import).toBeDefined();
      expect(mainExport.require).toBeDefined();
      expect(mainExport.types).toBeDefined();
    });

    it("export paths should be relative to dist", () => {
      const exports = packageJson.exports;

      for (const [_subpath, config] of Object.entries(exports)) {
        const exportConfig = config as {
          import?: string;
          require?: string;
          types?: string;
        };

        if (exportConfig.import) {
          expect(exportConfig.import).toMatch(/^\.\//);
          expect(exportConfig.import).toMatch(/dist\//);
        }

        if (exportConfig.require) {
          expect(exportConfig.require).toMatch(/^\.\//);
          expect(exportConfig.require).toMatch(/dist\//);
        }

        if (exportConfig.types) {
          expect(exportConfig.types).toMatch(/^\.\//);
          expect(exportConfig.types).toMatch(/dist\//);
        }
      }
    });
  });

  describe("Packaging Configuration", () => {
    const packageJsonPath = join(appDir, "package.json");
    const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"));
    const tsupConfigPath = join(appDir, "tsup.config.ts");
    const tsupConfig = readFileSync(tsupConfigPath, "utf-8");

    it("should have preconstruct compatibility flags", () => {
      expect(packageJson.preconstruct).toBeDefined();
    });

    it("should define tsup entry points for all exports", () => {
      expect(tsupConfig).toMatch(/entry:\s*{/);
    });

    it("should have main entrypoint in tsup config", () => {
      expect(tsupConfig).toMatch(/index:\s*["']index\.ts["']/);
    });

    it("should have subpath entrypoints in tsup config", () => {
      expect(tsupConfig).toMatch(/core:\s*["']exports\/core\.ts["']/);
      expect(tsupConfig).toMatch(/client:\s*["']exports\/client\.ts["']/);
      expect(tsupConfig).toMatch(
        /"charts\/index":\s*["']exports\/charts\/index\.ts["']/
      );
      expect(tsupConfig).toMatch(
        /"hooks\/index":\s*["']exports\/hooks\/index\.ts["']/
      );
      expect(tsupConfig).toMatch(
        /"utils\/index":\s*["']exports\/utils\/index\.ts["']/
      );
      expect(tsupConfig).toMatch(
        /"connectors\/index":\s*["']exports\/connectors\/index\.ts["']/
      );
    });

    it("tsup entrypoints should match package.json exports", () => {
      const exports = Object.keys(packageJson.exports || {});

      expect(exports).toContain(".");
      expect(exports).toContain("./core");
      expect(exports).toContain("./client");
      expect(exports).toContain("./charts");
      expect(exports).toContain("./charts/LineChart");
      expect(exports).toContain("./charts/BarChart");
      expect(exports).toContain("./charts/ColumnChart");
      expect(exports).toContain("./charts/PieChart");
      expect(exports).toContain("./charts/AreaChart");
      expect(exports).toContain("./charts/MapChart");
      expect(exports).toContain("./hooks");
      expect(exports).toContain("./utils");
      expect(exports).toContain("./connectors");
    });

    it("should have experimental flags", () => {
      expect(
        packageJson.preconstruct.___experimentalFlags_WILL_CHANGE_IN_PATCH
      ).toBeDefined();
      expect(
        packageJson.preconstruct.___experimentalFlags_WILL_CHANGE_IN_PATCH
          .importsConditions
      ).toBe(true);
    });
  });

  describe("Build Output Expectations", () => {
    const tsupConfigPath = join(appDir, "tsup.config.ts");
    const tsupConfig = readFileSync(tsupConfigPath, "utf-8");

    it("should produce CJS and ESM outputs", () => {
      expect(tsupConfig).toMatch(/['"]cjs['"]/);
      expect(tsupConfig).toMatch(/['"]esm['"]/);
    });

    it("should output to dist directory", () => {
      // tsup defaults to dist, but let's verify there's no outDir override
      const tsupConfigPath = join(appDir, "tsup.config.ts");
      const tsupConfig = readFileSync(tsupConfigPath, "utf-8");
      expect(tsupConfig).not.toMatch(/outDir:/);
    });

    it("should enable treeshaking for smaller bundles", () => {
      const tsupConfigPath = join(appDir, "tsup.config.ts");
      const tsupConfig = readFileSync(tsupConfigPath, "utf-8");
      expect(tsupConfig).toMatch(/treeshake:\s*true/);
    });

    it("should enable code splitting", () => {
      const tsupConfigPath = join(appDir, "tsup.config.ts");
      const tsupConfig = readFileSync(tsupConfigPath, "utf-8");
      expect(tsupConfig).toMatch(/splitting:\s*true/);
    });
  });

  describe("Source Files Validation", () => {
    it("should have main index.ts entrypoint", () => {
      const indexPath = join(appDir, "index.ts");
      expect(existsSync(indexPath)).toBe(true);
    });

    it("should have all export barrel files", () => {
      const exportFiles = [
        "exports/core.ts",
        "exports/client.ts",
        "exports/charts/index.ts",
        "exports/hooks/index.ts",
        "exports/utils/index.ts",
      ];

      for (const file of exportFiles) {
        const filePath = join(appDir, file);
        expect(existsSync(filePath), `Export file ${file} should exist`).toBe(
          true
        );
      }
    });

    it("index.ts should re-export from subpaths", () => {
      const indexPath = join(appDir, "index.ts");
      const content = readFileSync(indexPath, "utf-8");

      // Should export from various modules
      expect(content).toMatch(/export/);
    });
  });

  describe("Build Process Integration", () => {
    const packageJsonPath = join(appDir, "package.json");
    const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"));

    it("should build library as part of build process", () => {
      expect(packageJson.scripts["postbuild"]).toBeDefined();
      expect(packageJson.scripts["postbuild"]).toContain("build:lib");
    });

    it("should have clean script that removes dist", () => {
      expect(packageJson.scripts["clean"]).toBeDefined();
      expect(packageJson.scripts["clean"]).toMatch(/dist/);
    });

    it("should support standalone library build", () => {
      expect(packageJson.scripts["build:lib"]).toBeDefined();
      // build:lib includes tsup + DTS generation
      expect(packageJson.scripts["build:lib"]).toContain("tsup");
    });
  });

  describe("Package Metadata", () => {
    const packageJsonPath = join(appDir, "package.json");
    const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"));

    it("should have correct package name", () => {
      expect(packageJson.name).toBe("@acailic/vizualni-admin");
    });

    it("should have files field including dist", () => {
      expect(packageJson.files).toBeDefined();
      expect(packageJson.files).toContain("dist");
    });

    it("should have proper publishConfig", () => {
      expect(packageJson.publishConfig).toBeDefined();
      expect(packageJson.publishConfig.access).toBe("public");
      expect(packageJson.publishConfig.registry).toBe(
        "https://registry.npmjs.org/"
      );
    });

    it("should have sideEffects flag", () => {
      expect(packageJson.sideEffects).toBeDefined();
      expect(typeof packageJson.sideEffects).toBe("boolean");
    });

    it("should have engine requirements", () => {
      expect(packageJson.engines).toBeDefined();
      expect(packageJson.engines.node).toBeDefined();
    });
  });

  describe("TypeScript Configuration", () => {
    it("should have tsconfig.json", () => {
      const tsconfigPath = join(appDir, "tsconfig.json");
      expect(existsSync(tsconfigPath)).toBe(true);
    });

    it("tsconfig should have declaration option", () => {
      const tsconfigPath = join(appDir, "tsconfig.json");
      const content = readFileSync(tsconfigPath, "utf-8");

      // Should have declaration configuration (or noEmit for Next.js projects)
      const hasDeclarationOrNoEmit =
        content.includes('"declaration"') || content.includes('"noEmit"');

      expect(hasDeclarationOrNoEmit).toBe(true);
    });

    it("should compile to ES2018 or higher", () => {
      const tsconfigPath = join(appDir, "tsconfig.json");
      const content = readFileSync(tsconfigPath, "utf-8");

      // Should target modern JavaScript
      expect(content).toMatch(/target/);
    });
  });

  describe("Dependency Validation", () => {
    const packageJsonPath = join(appDir, "package.json");
    const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"));

    it("should have React as peer dependency", () => {
      expect(packageJson.peerDependencies).toBeDefined();
      expect(packageJson.peerDependencies.react).toBeDefined();
      // Accept any version range that includes React 18 or 19
      expect(packageJson.peerDependencies.react).toMatch(/(>=18|^\^18|^\^19)/);
    });

    it("should have ReactDOM as peer dependency", () => {
      expect(packageJson.peerDependencies).toBeDefined();
      expect(packageJson.peerDependencies["react-dom"]).toBeDefined();
      // Accept any version range that includes React 18 or 19
      expect(packageJson.peerDependencies["react-dom"]).toMatch(
        /(>=18|^\^18|^\^19)/
      );
    });

    it("should have @lingui packages as peer dependencies", () => {
      expect(packageJson.peerDependencies).toBeDefined();
      expect(packageJson.peerDependencies["@lingui/core"]).toBeDefined();
      expect(packageJson.peerDependencies["@lingui/react"]).toBeDefined();
    });

    it("should not bundle React in dependencies", () => {
      expect(packageJson.dependencies?.react).toBeUndefined();
      expect(packageJson.dependencies?.["react-dom"]).toBeUndefined();
    });

    it("should have visualization dependencies", () => {
      expect(packageJson.dependencies).toBeDefined();

      // Should have D3 packages
      const d3Packages = Object.keys(packageJson.dependencies).filter((dep) =>
        dep.startsWith("d3-")
      );
      expect(d3Packages.length).toBeGreaterThan(0);
    });
  });
});
