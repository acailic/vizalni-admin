import { describe, expect, it } from "vitest";

import { GeoPoint, Observation } from "@/domain/data";

import {
  Column3DLayerConfig,
  create3DColumnLayer,
  createColumnColorAccessor,
  createColumnElevationAccessor,
  createDefaultMap3DConfig,
  DEFAULT_COLUMN_COLOR,
  DEFAULT_COLUMN_OPACITY,
  DEFAULT_COLUMN_RADIUS,
  DEFAULT_DISK_RESOLUTION,
  DEFAULT_ELEVATION_SCALE,
  getGeoPointPosition3D,
  validateColumn3DConfig,
} from "./3d-column-layer";

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

describe("3d-column-layer", () => {
  describe("constants", () => {
    it("should have valid default values", () => {
      expect(DEFAULT_COLUMN_RADIUS).toBeGreaterThan(0);
      expect(DEFAULT_ELEVATION_SCALE).toBeGreaterThan(0);
      expect(DEFAULT_COLUMN_OPACITY).toBeGreaterThan(0);
      expect(DEFAULT_COLUMN_OPACITY).toBeLessThanOrEqual(1);
      expect(DEFAULT_DISK_RESOLUTION).toBeGreaterThanOrEqual(3);
    });

    it("should have valid default color", () => {
      // Default color should be a valid CSS color string
      expect(DEFAULT_COLUMN_COLOR).toMatch(/^#[0-9a-fA-F]{6}$/);
    });
  });

  describe("create3DColumnLayer", () => {
    it("should create a 3D column layer with default props", () => {
      const data: GeoPoint[] = [
        createMockGeoPoint(0, 0, createMockObservation(10)),
        createMockGeoPoint(1, 1, createMockObservation(20)),
      ];

      const layer = create3DColumnLayer({
        data,
        getElevation: () => 100,
      });

      expect(layer).toBeDefined();
      expect(layer.id).toBe("column3DLayer");
    });

    it("should create a 3D column layer with custom props", () => {
      const data: GeoPoint[] = [
        createMockGeoPoint(0, 0, createMockObservation(10)),
        createMockGeoPoint(1, 1, createMockObservation(20)),
      ];

      const layer = create3DColumnLayer({
        id: "custom-3d-column",
        data,
        getElevation: (d) =>
          (d.properties.observation?.measureId as number) ?? 0,
        radius: 500,
        elevationScale: 100,
        opacity: 0.5,
        getColor: "#ff0000",
        diskResolution: 12,
      });

      expect(layer).toBeDefined();
      expect(layer.id).toBe("custom-3d-column");
    });

    it("should accept a color accessor function", () => {
      const data: GeoPoint[] = [
        createMockGeoPoint(0, 0, createMockObservation(10)),
        createMockGeoPoint(1, 1, createMockObservation(20)),
      ];

      const layer = create3DColumnLayer({
        data,
        getElevation: () => 100,
        getColor: (d) => {
          const value = d.properties.observation?.measureId as number;
          return value > 15 ? [255, 0, 0] : [0, 255, 0];
        },
      });

      expect(layer).toBeDefined();
    });

    it("should use default radius when not specified", () => {
      const data: GeoPoint[] = [createMockGeoPoint(0, 0)];

      const layer = create3DColumnLayer({
        data,
        getElevation: () => 100,
      });

      expect(layer).toBeDefined();
    });

    it("should support wireframe mode", () => {
      const data: GeoPoint[] = [createMockGeoPoint(0, 0)];

      const layer = create3DColumnLayer({
        data,
        getElevation: () => 100,
        wireframe: true,
      });

      expect(layer).toBeDefined();
    });

    it("should support non-extruded (flat) mode", () => {
      const data: GeoPoint[] = [createMockGeoPoint(0, 0)];

      const layer = create3DColumnLayer({
        data,
        getElevation: () => 100,
        extruded: false,
      });

      expect(layer).toBeDefined();
    });
  });

  describe("createColumnElevationAccessor", () => {
    it("should return elevation from observation", () => {
      const config: Column3DLayerConfig = {
        type: "3d-column",
        height: { field: "measureId" },
      };

      const getValue = (d: Observation) => d.measureId as number | null;
      const getElevation = createColumnElevationAccessor(config, getValue);

      const observation = createMockObservation(42);
      const point = createMockGeoPoint(0, 0, observation);

      expect(getElevation(point)).toBe(42);
    });

    it("should return 0 when observation is undefined", () => {
      const config: Column3DLayerConfig = {
        type: "3d-column",
        height: { field: "measureId" },
      };

      const getValue = (d: Observation) => d.measureId as number | null;
      const getElevation = createColumnElevationAccessor(config, getValue);

      const point = createMockGeoPoint(0, 0);

      expect(getElevation(point)).toBe(0);
    });

    it("should return 0 when value is null", () => {
      const config: Column3DLayerConfig = {
        type: "3d-column",
        height: { field: "measureId" },
      };

      const getValue = (d: Observation) => d.measureId as number | null;
      const getElevation = createColumnElevationAccessor(config, getValue);

      const observation = createMockObservation(null);
      const point = createMockGeoPoint(0, 0, observation);

      expect(getElevation(point)).toBe(0);
    });
  });

  describe("createColumnColorAccessor", () => {
    it("should return color based on value", () => {
      const colorScale = (value: number) => {
        if (value < 50) return "#00ff00";
        return "#ff0000";
      };

      const getValue = (d: Observation) => d.measureId as number | null;
      const getColor = createColumnColorAccessor(colorScale, getValue);

      const observation = createMockObservation(75);
      const point = createMockGeoPoint(0, 0, observation);

      const color = getColor(point);
      expect(color).toEqual([255, 0, 0]);
    });

    it("should return gray color when observation is undefined", () => {
      const colorScale = () => "#ff0000";
      const getValue = (d: Observation) => d.measureId as number | null;
      const getColor = createColumnColorAccessor(colorScale, getValue);

      const point = createMockGeoPoint(0, 0);

      expect(getColor(point)).toEqual([204, 204, 204]);
    });

    it("should return gray color when value is null", () => {
      const colorScale = () => "#ff0000";
      const getValue = (d: Observation) => d.measureId as number | null;
      const getColor = createColumnColorAccessor(colorScale, getValue);

      const observation = createMockObservation(null);
      const point = createMockGeoPoint(0, 0, observation);

      expect(getColor(point)).toEqual([204, 204, 204]);
    });
  });

  describe("getGeoPointPosition3D", () => {
    it("should extract coordinates from GeoPoint", () => {
      const point = createMockGeoPoint(8.5, 47.3);

      const position = getGeoPointPosition3D(point);

      expect(position).toEqual([8.5, 47.3]);
    });

    it("should handle negative coordinates", () => {
      const point = createMockGeoPoint(-122.4, -33.8);

      const position = getGeoPointPosition3D(point);

      expect(position).toEqual([-122.4, -33.8]);
    });
  });

  describe("validateColumn3DConfig", () => {
    it("should validate a valid config", () => {
      const config: Column3DLayerConfig = {
        type: "3d-column",
        height: { field: "value" },
      };

      expect(validateColumn3DConfig(config)).toBe(true);
    });

    it("should validate config with optional fields", () => {
      const config: Column3DLayerConfig = {
        type: "3d-column",
        height: { field: "value" },
        elevationScale: 100,
        radius: 500,
        opacity: 0.7,
        color: "#ff0000",
      };

      expect(validateColumn3DConfig(config)).toBe(true);
    });

    it("should reject config without height field", () => {
      const config = {
        type: "3d-column",
        height: { field: "" },
      } as Column3DLayerConfig;

      expect(validateColumn3DConfig(config)).toBe(false);
    });

    it("should reject invalid elevationScale (zero)", () => {
      const config: Column3DLayerConfig = {
        type: "3d-column",
        height: { field: "value" },
        elevationScale: 0,
      };

      expect(validateColumn3DConfig(config)).toBe(false);
    });

    it("should reject elevationScale over 10000", () => {
      const config: Column3DLayerConfig = {
        type: "3d-column",
        height: { field: "value" },
        elevationScale: 15000,
      };

      expect(validateColumn3DConfig(config)).toBe(false);
    });

    it("should reject invalid radius (zero)", () => {
      const config: Column3DLayerConfig = {
        type: "3d-column",
        height: { field: "value" },
        radius: 0,
      };

      expect(validateColumn3DConfig(config)).toBe(false);
    });

    it("should reject radius over 100000", () => {
      const config: Column3DLayerConfig = {
        type: "3d-column",
        height: { field: "value" },
        radius: 200000,
      };

      expect(validateColumn3DConfig(config)).toBe(false);
    });

    it("should reject negative opacity", () => {
      const config: Column3DLayerConfig = {
        type: "3d-column",
        height: { field: "value" },
        opacity: -0.1,
      };

      expect(validateColumn3DConfig(config)).toBe(false);
    });

    it("should reject opacity over 1", () => {
      const config: Column3DLayerConfig = {
        type: "3d-column",
        height: { field: "value" },
        opacity: 1.5,
      };

      expect(validateColumn3DConfig(config)).toBe(false);
    });
  });

  describe("createDefaultMap3DConfig", () => {
    it("should create a valid default 3D config", () => {
      const config = createDefaultMap3DConfig();

      expect(config.enable3D).toBe(true);
      expect(config.elevationScale).toBe(DEFAULT_ELEVATION_SCALE);
      expect(config.terrainSource).toBeUndefined();
    });
  });
});
