import { describe, expect, it } from "vitest";

import {
  isSunburstConfig,
  SunburstConfig,
  SunburstNode,
  SunburstFields,
  SunburstVisualOptions,
} from "../sunburst-types";

describe("Sunburst Types", () => {
  describe("SunburstConfig", () => {
    it("should define a valid sunburst config", () => {
      const config: SunburstConfig = {
        chartType: "sunburst",
        fields: {
          hierarchy: [
            { componentId: "level1Field", type: "nominal" },
            { componentId: "level2Field", type: "nominal" },
          ],
          size: {
            componentId: "valueField",
            type: "quantitative",
          },
          color: {
            componentId: "colorField",
          },
        },
      };

      expect(config.chartType).toBe("sunburst");
      expect(config.fields.hierarchy).toHaveLength(2);
      expect(config.fields.hierarchy[0].componentId).toBe("level1Field");
      expect(config.fields.hierarchy[1].componentId).toBe("level2Field");
      expect(config.fields.size.componentId).toBe("valueField");
      expect(config.fields.color.componentId).toBe("colorField");
    });

    it("should support optional visual options", () => {
      const config: SunburstConfig = {
        chartType: "sunburst",
        fields: {
          hierarchy: [{ componentId: "level1Field", type: "nominal" }],
          size: {
            componentId: "valueField",
            type: "quantitative",
          },
          color: {
            componentId: "colorField",
          },
        },
        visualOptions: {
          enableZoomOnClick: true,
          showBreadcrumb: true,
          enableArcHighlight: true,
          enableAnimations: true,
          innerRadiusRatio: 0.3,
          cornerRadius: 2,
          padAngle: 0.01,
        },
      };

      expect(config.visualOptions?.enableZoomOnClick).toBe(true);
      expect(config.visualOptions?.showBreadcrumb).toBe(true);
      expect(config.visualOptions?.enableArcHighlight).toBe(true);
      expect(config.visualOptions?.enableAnimations).toBe(true);
      expect(config.visualOptions?.innerRadiusRatio).toBe(0.3);
      expect(config.visualOptions?.cornerRadius).toBe(2);
      expect(config.visualOptions?.padAngle).toBe(0.01);
    });

    it("should support multiple hierarchy levels", () => {
      const config: SunburstConfig = {
        chartType: "sunburst",
        fields: {
          hierarchy: [
            { componentId: "level1Field", type: "nominal" },
            { componentId: "level2Field", type: "nominal" },
            { componentId: "level3Field", type: "nominal" },
            { componentId: "level4Field", type: "nominal" },
          ],
          size: {
            componentId: "valueField",
            type: "quantitative",
          },
          color: {
            componentId: "colorField",
          },
        },
      };

      expect(config.fields.hierarchy).toHaveLength(4);
    });
  });

  describe("isSunburstConfig", () => {
    it("should return true for sunburst config", () => {
      const config = {
        chartType: "sunburst",
        fields: {
          hierarchy: [{ componentId: "level1Field", type: "nominal" as const }],
          size: {
            componentId: "valueField",
            type: "quantitative" as const,
          },
          color: {
            componentId: "colorField",
          },
        },
      };

      expect(isSunburstConfig(config)).toBe(true);
    });

    it("should return false for non-sunburst config", () => {
      const config = {
        chartType: "bar",
        fields: {},
      };

      expect(isSunburstConfig(config)).toBe(false);
    });

    it("should return false for pie config", () => {
      const config = {
        chartType: "pie",
        fields: {},
      };

      expect(isSunburstConfig(config)).toBe(false);
    });

    it("should return false for treemap config", () => {
      const config = {
        chartType: "treemap",
        fields: {},
      };

      expect(isSunburstConfig(config)).toBe(false);
    });

    it("should return false for sankey config", () => {
      const config = {
        chartType: "sankey",
        fields: {},
      };

      expect(isSunburstConfig(config)).toBe(false);
    });
  });

  describe("SunburstNode", () => {
    it("should define a valid sunburst node", () => {
      const node: SunburstNode = {
        id: "node1",
        name: "Node 1",
        depth: 0,
        value: 100,
        color: "#4e79a7",
        x0: 0,
        x1: Math.PI * 2,
        y0: 0,
        y1: 100,
        percentage: 25,
      };

      expect(node.id).toBe("node1");
      expect(node.name).toBe("Node 1");
      expect(node.depth).toBe(0);
      expect(node.value).toBe(100);
      expect(node.color).toBe("#4e79a7");
      expect(node.percentage).toBe(25);
    });

    it("should support minimal node definition", () => {
      const node: SunburstNode = {
        id: "node1",
        name: "Node 1",
        depth: 0,
        value: 50,
      };

      expect(node.id).toBe("node1");
      expect(node.name).toBe("Node 1");
      expect(node.color).toBeUndefined();
    });

    it("should support hierarchical node structure", () => {
      const childNode: SunburstNode = {
        id: "child",
        name: "Child Node",
        depth: 1,
        value: 30,
      };

      const parentNode: SunburstNode = {
        id: "parent",
        name: "Parent Node",
        depth: 0,
        value: 100,
        children: [childNode],
      };

      childNode.parent = parentNode;

      expect(parentNode.children).toHaveLength(1);
      expect(parentNode.children?.[0].id).toBe("child");
      expect(childNode.parent?.id).toBe("parent");
    });
  });

  describe("SunburstFields", () => {
    it("should define valid sunburst fields", () => {
      const fields: SunburstFields = {
        hierarchy: [
          { componentId: "region", type: "nominal" },
          { componentId: "country", type: "nominal" },
          { componentId: "city", type: "nominal" },
        ],
        size: {
          componentId: "population",
          type: "quantitative",
        },
        color: {
          componentId: "region",
        },
      };

      expect(fields.hierarchy).toHaveLength(3);
      expect(fields.size.type).toBe("quantitative");
      expect(fields.color.componentId).toBe("region");
    });
  });

  describe("SunburstVisualOptions", () => {
    it("should define valid visual options", () => {
      const visualOptions: SunburstVisualOptions = {
        enableZoomOnClick: true,
        showBreadcrumb: true,
        enableArcHighlight: true,
        enableAnimations: true,
        innerRadiusRatio: 0.4,
        cornerRadius: 3,
        padAngle: 0.02,
      };

      expect(visualOptions.enableZoomOnClick).toBe(true);
      expect(visualOptions.showBreadcrumb).toBe(true);
      expect(visualOptions.enableArcHighlight).toBe(true);
      expect(visualOptions.enableAnimations).toBe(true);
      expect(visualOptions.innerRadiusRatio).toBe(0.4);
      expect(visualOptions.cornerRadius).toBe(3);
      expect(visualOptions.padAngle).toBe(0.02);
    });

    it("should allow partial visual options", () => {
      const visualOptions: SunburstVisualOptions = {
        enableZoomOnClick: true,
        showBreadcrumb: false,
      };

      expect(visualOptions.enableZoomOnClick).toBe(true);
      expect(visualOptions.showBreadcrumb).toBe(false);
      expect(visualOptions.enableArcHighlight).toBeUndefined();
    });
  });
});
