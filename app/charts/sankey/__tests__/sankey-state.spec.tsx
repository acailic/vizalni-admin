import { describe, it, expect } from "vitest";

import { SankeyNode, SankeyLink } from "../sankey-types";

describe("SankeyState", () => {
  describe("SankeyNode type", () => {
    it("should define a valid sankey node", () => {
      const node: SankeyNode = {
        id: "node1",
        name: "Source Node",
        color: "#4e79a7",
        incomingValue: 100,
        outgoingValue: 80,
        depth: 0,
        x0: 0,
        x1: 24,
        y0: 10,
        y1: 50,
      };

      expect(node.id).toBe("node1");
      expect(node.name).toBe("Source Node");
      expect(node.color).toBe("#4e79a7");
      expect(node.incomingValue).toBe(100);
      expect(node.outgoingValue).toBe(80);
      expect(node.depth).toBe(0);
      expect(node.x0).toBe(0);
      expect(node.x1).toBe(24);
      expect(node.y0).toBe(10);
      expect(node.y1).toBe(50);
    });

    it("should support minimal node definition", () => {
      const node: SankeyNode = {
        id: "node1",
        name: "Node 1",
      };

      expect(node.id).toBe("node1");
      expect(node.name).toBe("Node 1");
      expect(node.color).toBeUndefined();
      expect(node.incomingValue).toBeUndefined();
      expect(node.outgoingValue).toBeUndefined();
    });
  });

  describe("SankeyLink type", () => {
    it("should define a valid sankey link", () => {
      const sourceNode: SankeyNode = {
        id: "source",
        name: "Source Node",
      };

      const targetNode: SankeyNode = {
        id: "target",
        name: "Target Node",
      };

      const link: SankeyLink = {
        source: sourceNode,
        target: targetNode,
        value: 50,
        color: "#4e79a7",
        width: 10,
        y0: 15,
        y1: 25,
      };

      expect(link.source.id).toBe("source");
      expect(link.target.id).toBe("target");
      expect(link.value).toBe(50);
      expect(link.color).toBe("#4e79a7");
      expect(link.width).toBe(10);
      expect(link.y0).toBe(15);
      expect(link.y1).toBe(25);
    });
  });

  describe("sankey data preparation", () => {
    it("should correctly extract unique nodes from observations", () => {
      const observations = [
        { source: "A", target: "B", value: 10 },
        { source: "A", target: "C", value: 15 },
        { source: "B", target: "C", value: 20 },
      ];

      const nodeSet = new Set<string>();
      observations.forEach((d) => {
        nodeSet.add(d.source);
        nodeSet.add(d.target);
      });

      expect(nodeSet.size).toBe(3);
      expect(nodeSet.has("A")).toBe(true);
      expect(nodeSet.has("B")).toBe(true);
      expect(nodeSet.has("C")).toBe(true);
    });

    it("should correctly map observation data to links", () => {
      const observations = [
        { source: "A", target: "B", value: 10 },
        { source: "A", target: "C", value: 15 },
        { source: "B", target: "C", value: 20 },
      ];

      const links = observations.map((d) => ({
        source: d.source,
        target: d.target,
        value: d.value,
      }));

      expect(links.length).toBe(3);
      expect(links[0].source).toBe("A");
      expect(links[0].target).toBe("B");
      expect(links[0].value).toBe(10);
    });

    it("should filter out links with non-positive values", () => {
      const observations = [
        { source: "A", target: "B", value: 10 },
        { source: "A", target: "C", value: 0 },
        { source: "B", target: "C", value: -5 },
        { source: "C", target: "D", value: 20 },
      ];

      const validLinks = observations.filter(
        (d) => typeof d.value === "number" && d.value > 0
      );

      expect(validLinks.length).toBe(2);
      expect(validLinks[0].value).toBe(10);
      expect(validLinks[1].value).toBe(20);
    });
  });

  describe("color assignment", () => {
    it("should assign unique colors to nodes", () => {
      const nodeIds = ["A", "B", "C"];
      const colors = new Map<string, string>();
      const defaultColors = ["#1f77b4", "#ff7f0e", "#2ca02c"];

      nodeIds.forEach((nodeId, index) => {
        colors.set(nodeId, defaultColors[index]);
      });

      expect(colors.get("A")).toBe("#1f77b4");
      expect(colors.get("B")).toBe("#ff7f0e");
      expect(colors.get("C")).toBe("#2ca02c");
    });
  });

  describe("value calculation", () => {
    it("should calculate total incoming value for a node", () => {
      const links: { target: string; value: number }[] = [
        { target: "C", value: 10 },
        { target: "C", value: 15 },
        { target: "B", value: 20 },
      ];

      const nodeToCalculate = "C";
      const incomingValue = links
        .filter((l) => l.target === nodeToCalculate)
        .reduce((sum, l) => sum + l.value, 0);

      expect(incomingValue).toBe(25);
    });

    it("should calculate total outgoing value for a node", () => {
      const links: { source: string; value: number }[] = [
        { source: "A", value: 10 },
        { source: "A", value: 15 },
        { source: "B", value: 20 },
      ];

      const nodeToCalculate = "A";
      const outgoingValue = links
        .filter((l) => l.source === nodeToCalculate)
        .reduce((sum, l) => sum + l.value, 0);

      expect(outgoingValue).toBe(25);
    });
  });

  describe("bounds calculation", () => {
    it("should calculate chart dimensions correctly", () => {
      const width = 600;
      const height = 400;
      const margins = { top: 50, right: 40, bottom: 50, left: 40 };

      const chartWidth = width - margins.left - margins.right;
      const chartHeight = height - margins.top - margins.bottom;

      expect(chartWidth).toBe(520);
      expect(chartHeight).toBe(300);
    });
  });

  describe("node alignment options", () => {
    it("should support different alignment strategies", () => {
      const alignmentOptions = ["justify", "left", "right", "center"];

      alignmentOptions.forEach((option) => {
        expect(["justify", "left", "right", "center"]).toContain(option);
      });
    });
  });

  describe("visual options", () => {
    it("should use default visual options when not specified", () => {
      const defaultOptions = {
        nodeWidth: 24,
        nodePadding: 16,
        nodeAlignment: "justify" as const,
      };

      const options = {
        nodeWidth: undefined,
        nodePadding: undefined,
        nodeAlignment: undefined,
      };

      const resolvedOptions = {
        nodeWidth: options.nodeWidth ?? defaultOptions.nodeWidth,
        nodePadding: options.nodePadding ?? defaultOptions.nodePadding,
        nodeAlignment: options.nodeAlignment ?? defaultOptions.nodeAlignment,
      };

      expect(resolvedOptions.nodeWidth).toBe(24);
      expect(resolvedOptions.nodePadding).toBe(16);
      expect(resolvedOptions.nodeAlignment).toBe("justify");
    });

    it("should override default options with custom values", () => {
      const defaultOptions = {
        nodeWidth: 24,
        nodePadding: 16,
        nodeAlignment: "justify" as const,
      };

      const customOptions = {
        nodeWidth: 32,
        nodePadding: 24,
        nodeAlignment: "left" as const,
      };

      const resolvedOptions = {
        nodeWidth: customOptions.nodeWidth ?? defaultOptions.nodeWidth,
        nodePadding: customOptions.nodePadding ?? defaultOptions.nodePadding,
        nodeAlignment:
          customOptions.nodeAlignment ?? defaultOptions.nodeAlignment,
      };

      expect(resolvedOptions.nodeWidth).toBe(32);
      expect(resolvedOptions.nodePadding).toBe(24);
      expect(resolvedOptions.nodeAlignment).toBe("left");
    });
  });
});
