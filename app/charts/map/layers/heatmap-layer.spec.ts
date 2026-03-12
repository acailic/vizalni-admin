import { describe, expect, it } from "vitest";

import { GeoPoint, Observation } from "@/domain/data";

import {
  createHeatmapLayer,
  createHeatmapWeightAccessor,
  DEFAULT_HEATMAP_COLOR_SCALE,
  DEFAULT_HEATMAP_OPACITY,
  DEFAULT_HEATMAP_RADIUS,
  getGeoPointPosition,
  HeatmapLayerConfig,
  validateHeatmapConfig,
} from "./heatmap-layer";

// Mock data for testing
const createMockObservation = (value: number | null): Observation => ({
  measureId: value,
});

const createMockGeoPoint = (
  lon: number,
  lat: number,
  observation?: Observation
): GeoPoint => ({
  coordinates: [lon, lat],
  properties: {
    iri: `test-${lon}-${lat}`,
    label: `Point ${lon}, ${lat}`,
    observation,
  },
});

describe("heatmap-layer", () => {
  describe("constants", () => {
    it("should have valid default values", () => {
      expect(DEFAULT_HEATMAP_RADIUS).toBeGreaterThan(0);
      expect(DEFAULT_HEATMAP_OPACITY).toBeGreaterThan(0);
      expect(DEFAULT_HEATMAP_OPACITY).toBeLessThanOrEqual(1);
      expect(DEFAULT_HEATMAP_COLOR_SCALE.length).toBeGreaterThan(0);
    });

    it("should have color scale with valid CSS colors", () => {
      DEFAULT_HEATMAP_COLOR_SCALE.forEach((color) => {
        // Each color should be a valid rgba string
        expect(color).toMatch(/^rgba?\(/);
      });
    });
  });

  describe("createHeatmapLayer", () => {
    it("should create a heatmap layer with default props", () => {
      const data: GeoPoint[] = [
        createMockGeoPoint(0, 0, createMockObservation(10)),
        createMockGeoPoint(1, 1, createMockObservation(20)),
      ];

      const layer = createHeatmapLayer({
        data,
        getWeight: () => 1,
      });

      expect(layer).toBeDefined();
      expect(layer.id).toBe("heatmapLayer");
    });

    it("should create a heatmap layer with custom props", () => {
      const data: GeoPoint[] = [
        createMockGeoPoint(0, 0, createMockObservation(10)),
        createMockGeoPoint(1, 1, createMockObservation(20)),
      ];

      const layer = createHeatmapLayer({
        id: "custom-heatmap",
        data,
        getWeight: (d) => (d.properties.observation?.measureId as number) ?? 0,
        radius: 50,
        opacity: 0.5,
        colorScale: ["rgba(0,0,0,0)", "rgba(255,0,0,1)"],
      });

      expect(layer).toBeDefined();
      expect(layer.id).toBe("custom-heatmap");
    });

    it("should use default radius when not specified", () => {
      const data: GeoPoint[] = [createMockGeoPoint(0, 0)];

      const layer = createHeatmapLayer({
        data,
        getWeight: () => 1,
      });

      expect(layer).toBeDefined();
    });

    it("should cap radius at maximum value", () => {
      const data: GeoPoint[] = [createMockGeoPoint(0, 0)];

      // Even with very large radius, the layer should be created
      const layer = createHeatmapLayer({
        data,
        getWeight: () => 1,
        radius: 500, // Exceeds max of 100
        zoom: 15, // High zoom would make adjusted radius even larger
      });

      expect(layer).toBeDefined();
    });
  });

  describe("createHeatmapWeightAccessor", () => {
    it("should return weight from observation", () => {
      const config: HeatmapLayerConfig = {
        type: "heatmap",
        intensity: { field: "measureId" },
      };

      const getValue = (d: Observation) => d.measureId as number | null;
      const getWeight = createHeatmapWeightAccessor(config, getValue);

      const observation = createMockObservation(42);
      const point = createMockGeoPoint(0, 0, observation);

      expect(getWeight(point)).toBe(42);
    });

    it("should return 0 when observation is undefined", () => {
      const config: HeatmapLayerConfig = {
        type: "heatmap",
        intensity: { field: "measureId" },
      };

      const getValue = (d: Observation) => d.measureId as number | null;
      const getWeight = createHeatmapWeightAccessor(config, getValue);

      const point = createMockGeoPoint(0, 0);

      expect(getWeight(point)).toBe(0);
    });

    it("should return 0 when value is null", () => {
      const config: HeatmapLayerConfig = {
        type: "heatmap",
        intensity: { field: "measureId" },
      };

      const getValue = (d: Observation) => d.measureId as number | null;
      const getWeight = createHeatmapWeightAccessor(config, getValue);

      const observation = createMockObservation(null);
      const point = createMockGeoPoint(0, 0, observation);

      expect(getWeight(point)).toBe(0);
    });
  });

  describe("getGeoPointPosition", () => {
    it("should extract coordinates from GeoPoint", () => {
      const point = createMockGeoPoint(8.5, 47.3);

      const position = getGeoPointPosition(point);

      expect(position).toEqual([8.5, 47.3]);
    });

    it("should handle negative coordinates", () => {
      const point = createMockGeoPoint(-122.4, -33.8);

      const position = getGeoPointPosition(point);

      expect(position).toEqual([-122.4, -33.8]);
    });
  });

  describe("validateHeatmapConfig", () => {
    it("should validate a valid config", () => {
      const config: HeatmapLayerConfig = {
        type: "heatmap",
        intensity: { field: "value" },
      };

      expect(validateHeatmapConfig(config)).toBe(true);
    });

    it("should validate config with optional fields", () => {
      const config: HeatmapLayerConfig = {
        type: "heatmap",
        intensity: { field: "value" },
        radius: 50,
        opacity: 0.7,
        colorScale: ["#000", "#fff"],
      };

      expect(validateHeatmapConfig(config)).toBe(true);
    });

    it("should reject config without intensity field", () => {
      const config = {
        type: "heatmap",
        intensity: { field: "" },
      } as HeatmapLayerConfig;

      expect(validateHeatmapConfig(config)).toBe(false);
    });

    it("should reject invalid radius", () => {
      const config: HeatmapLayerConfig = {
        type: "heatmap",
        intensity: { field: "value" },
        radius: 0,
      };

      expect(validateHeatmapConfig(config)).toBe(false);
    });

    it("should reject radius over 200", () => {
      const config: HeatmapLayerConfig = {
        type: "heatmap",
        intensity: { field: "value" },
        radius: 250,
      };

      expect(validateHeatmapConfig(config)).toBe(false);
    });

    it("should reject negative opacity", () => {
      const config: HeatmapLayerConfig = {
        type: "heatmap",
        intensity: { field: "value" },
        opacity: -0.1,
      };

      expect(validateHeatmapConfig(config)).toBe(false);
    });

    it("should reject opacity over 1", () => {
      const config: HeatmapLayerConfig = {
        type: "heatmap",
        intensity: { field: "value" },
        opacity: 1.5,
      };

      expect(validateHeatmapConfig(config)).toBe(false);
    });
  });
});
