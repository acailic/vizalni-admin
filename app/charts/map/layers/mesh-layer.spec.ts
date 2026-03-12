import { describe, expect, it } from "vitest";

import { GeoPoint, Observation } from "@/domain/data";

import {
  createDefaultMeshConfig,
  createMeshColorAccessor,
  createMeshDataFromGeoPoints,
  createMeshElevationAccessor,
  createMeshLayer,
  createMeshOrientationAccessor,
  createMeshPositionAccessor,
  createMeshScaleAccessor,
  DEFAULT_MESH_COLOR,
  DEFAULT_MESH_ELEVATION_SCALE,
  DEFAULT_MESH_OPACITY,
  getGeoPointMeshPosition,
  MeshData,
  MeshLayerConfig,
  validateMeshConfig,
} from "./mesh-layer";

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

const createMockMeshData = (
  lon: number,
  lat: number,
  elevation?: number
): MeshData => ({
  position: [lon, lat, elevation ?? 0],
  orientation: [0, 0, 0],
  scale: [1, 1, 1],
});

describe("mesh-layer", () => {
  describe("constants", () => {
    it("should have valid default values", () => {
      expect(DEFAULT_MESH_ELEVATION_SCALE).toBeGreaterThan(0);
      expect(DEFAULT_MESH_OPACITY).toBeGreaterThan(0);
      expect(DEFAULT_MESH_OPACITY).toBeLessThanOrEqual(1);
    });

    it("should have valid default color", () => {
      // Default color should be a valid CSS color string
      expect(DEFAULT_MESH_COLOR).toMatch(/^#[0-9a-fA-F]{6}$/);
    });
  });

  describe("createMeshLayer", () => {
    it("should create a mesh layer with default props", () => {
      const data: MeshData[] = [
        createMockMeshData(0, 0, 10),
        createMockMeshData(1, 1, 20),
      ];

      const layer = createMeshLayer({
        data,
        getPosition: (d) => d.position,
      });

      expect(layer).toBeDefined();
      expect(layer.id).toBe("meshLayer");
    });

    it("should create a mesh layer with custom props", () => {
      const data: MeshData[] = [
        createMockMeshData(0, 0, 10),
        createMockMeshData(1, 1, 20),
      ];

      const layer = createMeshLayer({
        id: "custom-mesh",
        data,
        getPosition: (d) => d.position,
        elevationScale: 2,
        opacity: 0.7,
        wireframe: true,
        getColor: "#ff0000",
      });

      expect(layer).toBeDefined();
      expect(layer.id).toBe("custom-mesh");
    });

    it("should accept a color accessor function", () => {
      const data: MeshData[] = [
        createMockMeshData(0, 0, 10),
        createMockMeshData(1, 1, 20),
      ];

      const layer = createMeshLayer({
        data,
        getPosition: (d) => d.position,
        getColor: (d) => {
          const elevation = d.position[2] ?? 0;
          return elevation > 15 ? [255, 0, 0, 255] : [0, 255, 0, 255];
        },
      });

      expect(layer).toBeDefined();
    });

    it("should accept orientation accessor", () => {
      const data: MeshData[] = [createMockMeshData(0, 0, 10)];

      const layer = createMeshLayer({
        data,
        getPosition: (d) => d.position,
        getOrientation: (d) => d.orientation ?? [0, 0, 0],
      });

      expect(layer).toBeDefined();
    });

    it("should accept scale accessor", () => {
      const data: MeshData[] = [createMockMeshData(0, 0, 10)];

      const layer = createMeshLayer({
        data,
        getPosition: (d) => d.position,
        getScale: (d) => d.scale ?? [1, 1, 1],
      });

      expect(layer).toBeDefined();
    });

    it("should accept string data URL", () => {
      const layer = createMeshLayer({
        data: "https://example.com/mesh-data.json",
        getPosition: (d: MeshData) => d.position,
      });

      expect(layer).toBeDefined();
    });

    it("should accept texture URL", () => {
      const data: MeshData[] = [createMockMeshData(0, 0, 10)];

      const layer = createMeshLayer({
        data,
        getPosition: (d) => d.position,
        texture: "/textures/terrain.png",
      });

      expect(layer).toBeDefined();
    });

    it("should accept mesh geometry", () => {
      const data: MeshData[] = [createMockMeshData(0, 0, 10)];

      const layer = createMeshLayer({
        data,
        getPosition: (d) => d.position,
        mesh: "/models/building.obj",
      });

      expect(layer).toBeDefined();
    });
  });

  describe("createMeshPositionAccessor", () => {
    it("should return position from mesh data", () => {
      const config: MeshLayerConfig = {
        type: "mesh",
        data: [],
      };

      const getPosition = createMeshPositionAccessor(config);
      const meshData = createMockMeshData(8.5, 47.3, 100);

      expect(getPosition(meshData)).toEqual([8.5, 47.3, 100]);
    });

    it("should handle missing elevation", () => {
      const config: MeshLayerConfig = {
        type: "mesh",
        data: [],
      };

      const getPosition = createMeshPositionAccessor(config);
      const meshData: MeshData = {
        position: [8.5, 47.3],
      };

      expect(getPosition(meshData)).toEqual([8.5, 47.3]);
    });
  });

  describe("createMeshOrientationAccessor", () => {
    it("should return orientation from mesh data", () => {
      const getOrientation = createMeshOrientationAccessor();
      const meshData = createMockMeshData(0, 0, 10);

      expect(getOrientation(meshData)).toEqual([0, 0, 0]);
    });

    it("should return default orientation when not specified", () => {
      const getOrientation = createMeshOrientationAccessor();
      const meshData: MeshData = {
        position: [0, 0, 0],
      };

      expect(getOrientation(meshData)).toEqual([0, 0, 0]);
    });
  });

  describe("createMeshScaleAccessor", () => {
    it("should return scaled elevation", () => {
      const getScale = createMeshScaleAccessor(2);
      const meshData = createMockMeshData(0, 0, 10);

      expect(getScale(meshData)).toEqual([1, 1, 2]);
    });

    it("should use default scale when not specified", () => {
      const getScale = createMeshScaleAccessor(1);
      const meshData: MeshData = {
        position: [0, 0, 0],
      };

      expect(getScale(meshData)).toEqual([1, 1, 1]);
    });

    it("should apply elevation scale to z-axis only", () => {
      const getScale = createMeshScaleAccessor(5);
      const meshData: MeshData = {
        position: [0, 0, 0],
        scale: [2, 3, 4],
      };

      expect(getScale(meshData)).toEqual([2, 3, 20]);
    });
  });

  describe("createMeshColorAccessor", () => {
    it("should return color from config", () => {
      const config: MeshLayerConfig = {
        type: "mesh",
        data: [],
        color: "#ff0000",
      };

      const getColor = createMeshColorAccessor(config);

      expect(getColor(createMockMeshData(0, 0, 0))).toEqual([255, 0, 0, 255]);
    });

    it("should return default color when not specified", () => {
      const config: MeshLayerConfig = {
        type: "mesh",
        data: [],
      };

      const getColor = createMeshColorAccessor(config);

      expect(getColor(createMockMeshData(0, 0, 0))).toEqual([
        255, 255, 255, 255,
      ]);
    });
  });

  describe("createMeshDataFromGeoPoints", () => {
    it("should create mesh data from geo points", () => {
      const points: GeoPoint[] = [
        createMockGeoPoint(8.5, 47.3, createMockObservation(100)),
        createMockGeoPoint(9.0, 47.5, createMockObservation(150)),
      ];

      const getElevation = (d: GeoPoint) =>
        (d.properties.observation?.measureId as number) ?? 0;

      const meshData = createMeshDataFromGeoPoints(points, getElevation);

      expect(meshData).toHaveLength(2);
      expect(meshData[0].position).toEqual([8.5, 47.3, 100]);
      expect(meshData[1].position).toEqual([9.0, 47.5, 150]);
    });

    it("should set default scale and orientation", () => {
      const points: GeoPoint[] = [createMockGeoPoint(0, 0)];

      const meshData = createMeshDataFromGeoPoints(points, () => 0);

      expect(meshData[0].scale).toEqual([1, 1, 1]);
      expect(meshData[0].orientation).toEqual([0, 0, 0]);
    });
  });

  describe("createMeshElevationAccessor", () => {
    it("should return elevation from observation", () => {
      const getValue = (d: Observation) => d.measureId as number | null;
      const getElevation = createMeshElevationAccessor(getValue);

      const observation = createMockObservation(42);
      const point = createMockGeoPoint(0, 0, observation);

      expect(getElevation(point)).toBe(42);
    });

    it("should return 0 when observation is undefined", () => {
      const getValue = (d: Observation) => d.measureId as number | null;
      const getElevation = createMeshElevationAccessor(getValue);

      const point = createMockGeoPoint(0, 0);

      expect(getElevation(point)).toBe(0);
    });

    it("should return 0 when value is null", () => {
      const getValue = (d: Observation) => d.measureId as number | null;
      const getElevation = createMeshElevationAccessor(getValue);

      const observation = createMockObservation(null);
      const point = createMockGeoPoint(0, 0, observation);

      expect(getElevation(point)).toBe(0);
    });
  });

  describe("getGeoPointMeshPosition", () => {
    it("should extract coordinates from GeoPoint", () => {
      const point = createMockGeoPoint(8.5, 47.3);

      const position = getGeoPointMeshPosition(point);

      expect(position).toEqual([8.5, 47.3, 0]);
    });

    it("should handle negative coordinates", () => {
      const point = createMockGeoPoint(-122.4, -33.8);

      const position = getGeoPointMeshPosition(point);

      expect(position).toEqual([-122.4, -33.8, 0]);
    });
  });

  describe("validateMeshConfig", () => {
    it("should validate a valid config with array data", () => {
      const config: MeshLayerConfig = {
        type: "mesh",
        data: [createMockMeshData(0, 0, 10)],
      };

      expect(validateMeshConfig(config)).toBe(true);
    });

    it("should validate a valid config with URL data", () => {
      const config: MeshLayerConfig = {
        type: "mesh",
        data: "https://example.com/mesh.json",
      };

      expect(validateMeshConfig(config)).toBe(true);
    });

    it("should validate config with optional fields", () => {
      const config: MeshLayerConfig = {
        type: "mesh",
        data: [createMockMeshData(0, 0, 10)],
        elevationScale: 2,
        opacity: 0.7,
        color: "#ff0000",
        texture: "/texture.png",
      };

      expect(validateMeshConfig(config)).toBe(true);
    });

    it("should reject config without data", () => {
      const config = {
        type: "mesh",
      } as MeshLayerConfig;

      expect(validateMeshConfig(config)).toBe(false);
    });

    it("should reject empty data array", () => {
      const config: MeshLayerConfig = {
        type: "mesh",
        data: [],
      };

      expect(validateMeshConfig(config)).toBe(false);
    });

    it("should reject invalid elevationScale (zero)", () => {
      const config: MeshLayerConfig = {
        type: "mesh",
        data: [createMockMeshData(0, 0, 10)],
        elevationScale: 0,
      };

      expect(validateMeshConfig(config)).toBe(false);
    });

    it("should reject elevationScale over 100", () => {
      const config: MeshLayerConfig = {
        type: "mesh",
        data: [createMockMeshData(0, 0, 10)],
        elevationScale: 150,
      };

      expect(validateMeshConfig(config)).toBe(false);
    });

    it("should reject negative opacity", () => {
      const config: MeshLayerConfig = {
        type: "mesh",
        data: [createMockMeshData(0, 0, 10)],
        opacity: -0.1,
      };

      expect(validateMeshConfig(config)).toBe(false);
    });

    it("should reject opacity over 1", () => {
      const config: MeshLayerConfig = {
        type: "mesh",
        data: [createMockMeshData(0, 0, 10)],
        opacity: 1.5,
      };

      expect(validateMeshConfig(config)).toBe(false);
    });

    it("should reject invalid color", () => {
      const config: MeshLayerConfig = {
        type: "mesh",
        data: [createMockMeshData(0, 0, 10)],
        color: "invalid-color",
      };

      expect(validateMeshConfig(config)).toBe(false);
    });
  });

  describe("createDefaultMeshConfig", () => {
    it("should create a valid default mesh config", () => {
      const config = createDefaultMeshConfig();

      expect(config.type).toBe("mesh");
      expect(config.data).toEqual([]);
      expect(config.elevationScale).toBe(DEFAULT_MESH_ELEVATION_SCALE);
      expect(config.opacity).toBe(DEFAULT_MESH_OPACITY);
      expect(config.color).toBe(DEFAULT_MESH_COLOR);
    });
  });
});
