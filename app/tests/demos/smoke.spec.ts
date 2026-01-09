/**
 * Demo Configuration Smoke Tests
 *
 * Ensures all demo configurations are valid and complete.
 * These tests run quickly and catch configuration errors early.
 */

import { describe, it, expect } from "vitest";

import {
  DEMO_CONFIGS,
  getDemoConfig,
  getAllDemoIds,
  getDemoTitle,
  getDemoDescription,
} from "@/lib/demos/config";

describe("DEMO_CONFIGS", () => {
  const demoIds = Object.keys(DEMO_CONFIGS);

  it("has at least 10 demo configurations", () => {
    expect(demoIds.length).toBeGreaterThanOrEqual(10);
  });

  describe.each(demoIds)("Demo: %s", (demoId) => {
    const config = DEMO_CONFIGS[demoId];

    it("has an id matching the key", () => {
      expect(config.id).toBe(demoId);
    });

    it("has Serbian title", () => {
      expect(config.title.sr).toBeTruthy();
      expect(typeof config.title.sr).toBe("string");
      expect(config.title.sr.length).toBeGreaterThan(0);
    });

    it("has English title", () => {
      expect(config.title.en).toBeTruthy();
      expect(typeof config.title.en).toBe("string");
      expect(config.title.en.length).toBeGreaterThan(0);
    });

    it("has Serbian description", () => {
      expect(config.description.sr).toBeTruthy();
      expect(config.description.sr.length).toBeGreaterThan(10);
    });

    it("has English description", () => {
      expect(config.description.en).toBeTruthy();
      expect(config.description.en.length).toBeGreaterThan(10);
    });

    it("has valid chartType", () => {
      const validChartTypes = [
        "line",
        "bar",
        "column",
        "area",
        "pie",
        "map",
        "scatterplot",
        "comboLineColumn",
      ];
      expect(validChartTypes).toContain(config.chartType);
    });

    it("has an icon", () => {
      expect(config.icon).toBeTruthy();
    });

    it("has tags array", () => {
      expect(Array.isArray(config.tags)).toBe(true);
    });

    it("has searchQuery defined", () => {
      expect(config.searchQuery).toBeDefined();
      if (Array.isArray(config.searchQuery)) {
        expect(config.searchQuery.length).toBeGreaterThan(0);
      } else {
        expect(typeof config.searchQuery).toBe("string");
      }
    });
  });
});

describe("Demo Helper Functions", () => {
  describe("getDemoConfig", () => {
    it("returns config for valid id", () => {
      const config = getDemoConfig("air-quality");
      expect(config).toBeDefined();
      expect(config?.id).toBe("air-quality");
    });

    it("returns null for invalid id", () => {
      const config = getDemoConfig("nonexistent-demo");
      expect(config).toBeNull();
    });
  });

  describe("getAllDemoIds", () => {
    it("returns array of all demo ids", () => {
      const ids = getAllDemoIds();
      expect(Array.isArray(ids)).toBe(true);
      expect(ids.length).toBeGreaterThan(0);
      expect(ids).toContain("air-quality");
      expect(ids).toContain("healthcare");
    });
  });

  describe("getDemoTitle", () => {
    it("returns Serbian title by default", () => {
      const title = getDemoTitle("air-quality");
      expect(title).toBe(DEMO_CONFIGS["air-quality"].title.sr);
    });

    it("returns English title when specified", () => {
      const title = getDemoTitle("air-quality", "en");
      expect(title).toBe(DEMO_CONFIGS["air-quality"].title.en);
    });

    it("returns id for unknown demo", () => {
      const title = getDemoTitle("unknown-demo");
      expect(title).toBe("unknown-demo");
    });
  });

  describe("getDemoDescription", () => {
    it("returns description in specified locale", () => {
      const descSr = getDemoDescription("air-quality", "sr");
      const descEn = getDemoDescription("air-quality", "en");
      expect(descSr).toBe(DEMO_CONFIGS["air-quality"].description.sr);
      expect(descEn).toBe(DEMO_CONFIGS["air-quality"].description.en);
    });

    it("returns empty string for unknown demo", () => {
      const desc = getDemoDescription("unknown-demo");
      expect(desc).toBe("");
    });
  });
});
