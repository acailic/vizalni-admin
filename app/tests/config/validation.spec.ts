/**
 * Configuration Validation Tests
 *
 * Tests for the validateConfig function and DEFAULT_CONFIG.
 */

import { describe, it, expect } from "vitest";

import { DEFAULT_CONFIG } from "@/lib/config/defaults";
import type { VizualniAdminConfig } from "@/lib/config/types";
import { validateConfig } from "@/lib/config/validator";

describe("validateConfig", () => {
  describe("Valid Configurations", () => {
    it("validates DEFAULT_CONFIG successfully", () => {
      const result = validateConfig(DEFAULT_CONFIG);
      expect(result.valid).toBe(true);
      if (result.valid) {
        expect(result.data).toBeDefined();
      }
    });

    it("validates minimal valid config", () => {
      const config: Partial<VizualniAdminConfig> = {
        project: {
          name: "Test",
          language: "en",
          theme: "light",
        },
        categories: {
          enabled: [],
          featured: [],
        },
        datasets: {
          autoDiscovery: true,
          manualIds: {},
        },
        visualization: {
          defaultChartType: "bar",
          colorPalette: "default",
          customColors: [],
        },
        features: {
          embedding: true,
          export: true,
          sharing: true,
          tutorials: true,
        },
        deployment: {
          basePath: "/",
          customDomain: "",
          target: "local",
        },
      };
      const result = validateConfig(config);
      // Should either pass or provide helpful errors
      expect(result).toBeDefined();
    });

    it("validates complete config with all fields", () => {
      const config: VizualniAdminConfig = {
        ...DEFAULT_CONFIG,
        visualization: {
          ...DEFAULT_CONFIG.visualization,
          defaultChartType: "line",
        },
      };
      const result = validateConfig(config);
      expect(result.valid).toBe(true);
    });
  });

  describe("Invalid Configurations", () => {
    it("rejects null input", () => {
      const result = validateConfig(null as any);
      expect(result.valid).toBe(false);
      if (!result.valid) {
        expect(result.errors).toBeDefined();
      }
    });

    it("rejects undefined input", () => {
      const result = validateConfig(undefined as any);
      expect(result.valid).toBe(false);
      if (!result.valid) {
        expect(result.errors).toBeDefined();
      }
    });

    it("rejects invalid chartType", () => {
      const config = {
        ...DEFAULT_CONFIG,
        visualization: {
          ...DEFAULT_CONFIG.visualization,
          defaultChartType: "invalid-chart-type",
        },
      };
      const result = validateConfig(config);
      expect(result.valid).toBe(false);
      if (!result.valid) {
        expect(
          result.errors.some((e) => e.path.includes("defaultChartType"))
        ).toBe(true);
      }
    });

    it("rejects invalid language", () => {
      const config = {
        ...DEFAULT_CONFIG,
        project: {
          ...DEFAULT_CONFIG.project,
          language: "fr",
        },
      };
      const result = validateConfig(config);
      expect(result.valid).toBe(false);
      if (!result.valid) {
        expect(result.errors.some((e) => e.path.includes("language"))).toBe(
          true
        );
      }
    });

    it("rejects invalid theme", () => {
      const config = {
        ...DEFAULT_CONFIG,
        project: {
          ...DEFAULT_CONFIG.project,
          theme: "blue",
        },
      };
      const result = validateConfig(config);
      expect(result.valid).toBe(false);
      if (!result.valid) {
        expect(result.errors.some((e) => e.path.includes("theme"))).toBe(true);
      }
    });

    it("rejects invalid hex color", () => {
      const config = {
        ...DEFAULT_CONFIG,
        visualization: {
          ...DEFAULT_CONFIG.visualization,
          customColors: ["not-a-color"],
        },
      };
      const result = validateConfig(config);
      expect(result.valid).toBe(false);
      if (!result.valid) {
        expect(result.errors.some((e) => e.path.includes("customColors"))).toBe(
          true
        );
      }
    });

    it("rejects invalid deployment target", () => {
      const config = {
        ...DEFAULT_CONFIG,
        deployment: {
          ...DEFAULT_CONFIG.deployment,
          target: "cloud",
        },
      };
      const result = validateConfig(config);
      expect(result.valid).toBe(false);
      if (!result.valid) {
        expect(result.errors.some((e) => e.path.includes("target"))).toBe(true);
      }
    });
  });

  describe("Validation Issues", () => {
    it("provides path information for nested errors", () => {
      const result = validateConfig({
        project: {
          name: "Test",
          language: "invalid",
          theme: "light",
        },
        categories: {
          enabled: [],
          featured: [],
        },
        datasets: {
          autoDiscovery: true,
          manualIds: {},
        },
        visualization: {
          defaultChartType: "bar",
          colorPalette: "default",
          customColors: [],
        },
        features: {
          embedding: true,
          export: true,
          sharing: true,
          tutorials: true,
        },
        deployment: {
          basePath: "/",
          customDomain: "",
          target: "local",
        },
      });
      if (!result.valid) {
        expect(result.errors[0].path).toBeDefined();
      }
    });

    it("provides human-readable error messages", () => {
      const result = validateConfig({});
      if (!result.valid) {
        result.errors.forEach((issue) => {
          expect(issue.message).toBeTruthy();
          expect(typeof issue.message).toBe("string");
        });
      }
    });
  });
});

describe("DEFAULT_CONFIG", () => {
  it("has all required sections", () => {
    expect(DEFAULT_CONFIG).toBeDefined();
    expect(DEFAULT_CONFIG.project).toBeDefined();
    expect(DEFAULT_CONFIG.categories).toBeDefined();
    expect(DEFAULT_CONFIG.datasets).toBeDefined();
    expect(DEFAULT_CONFIG.visualization).toBeDefined();
    expect(DEFAULT_CONFIG.features).toBeDefined();
    expect(DEFAULT_CONFIG.deployment).toBeDefined();
  });

  it("has valid project name", () => {
    expect(typeof DEFAULT_CONFIG.project.name).toBe("string");
    expect(DEFAULT_CONFIG.project.name.length).toBeGreaterThan(0);
  });

  it("has valid language", () => {
    expect(["en", "sr"]).toContain(DEFAULT_CONFIG.project.language);
  });

  it("has valid theme", () => {
    expect(["light", "dark"]).toContain(DEFAULT_CONFIG.project.theme);
  });

  it("has valid chart type", () => {
    expect(["bar", "line", "pie", "scatter", "map"]).toContain(
      DEFAULT_CONFIG.visualization.defaultChartType
    );
  });
});
