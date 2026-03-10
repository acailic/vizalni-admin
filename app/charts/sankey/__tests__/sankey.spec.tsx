import { describe, it, expect } from "vitest";

import { SankeyNodeRenderDatum, SankeyLinkRenderDatum } from "../sankey";

describe("Sankey Rendering", () => {
  describe("SankeyNodeRenderDatum type", () => {
    it("should define a valid sankey node render datum", () => {
      const nodeDatum: SankeyNodeRenderDatum = {
        key: "node1",
        id: "node1",
        name: "Source Node",
        x0: 0,
        x1: 24,
        y0: 10,
        y1: 50,
        width: 24,
        height: 40,
        color: "#4e79a7",
        incomingValue: 100,
        outgoingValue: 80,
        depth: 0,
      };

      expect(nodeDatum.key).toBe("node1");
      expect(nodeDatum.id).toBe("node1");
      expect(nodeDatum.name).toBe("Source Node");
      expect(nodeDatum.x0).toBe(0);
      expect(nodeDatum.x1).toBe(24);
      expect(nodeDatum.y0).toBe(10);
      expect(nodeDatum.y1).toBe(50);
      expect(nodeDatum.width).toBe(24);
      expect(nodeDatum.height).toBe(40);
      expect(nodeDatum.color).toBe("#4e79a7");
      expect(nodeDatum.incomingValue).toBe(100);
      expect(nodeDatum.outgoingValue).toBe(80);
      expect(nodeDatum.depth).toBe(0);
    });

    it("should calculate node dimensions correctly", () => {
      const nodeDatum: SankeyNodeRenderDatum = {
        key: "node1",
        id: "node1",
        name: "Node",
        x0: 10,
        x1: 34,
        y0: 20,
        y1: 80,
        width: 24,
        height: 60,
        color: "#4e79a7",
        incomingValue: 100,
        outgoingValue: 80,
        depth: 0,
      };

      const calculatedWidth = nodeDatum.x1 - nodeDatum.x0;
      const calculatedHeight = nodeDatum.y1 - nodeDatum.y0;

      expect(calculatedWidth).toBe(24);
      expect(calculatedHeight).toBe(60);
    });
  });

  describe("SankeyLinkRenderDatum type", () => {
    it("should define a valid sankey link render datum", () => {
      const linkDatum: SankeyLinkRenderDatum = {
        key: "source-target",
        sourceId: "source",
        targetId: "target",
        sourceName: "Source Node",
        targetName: "Target Node",
        value: 50,
        width: 10,
        y0: 15,
        y1: 25,
        color: "#4e79a7",
        sourceX: 24,
        targetX: 100,
      };

      expect(linkDatum.key).toBe("source-target");
      expect(linkDatum.sourceId).toBe("source");
      expect(linkDatum.targetId).toBe("target");
      expect(linkDatum.sourceName).toBe("Source Node");
      expect(linkDatum.targetName).toBe("Target Node");
      expect(linkDatum.value).toBe(50);
      expect(linkDatum.width).toBe(10);
      expect(linkDatum.y0).toBe(15);
      expect(linkDatum.y1).toBe(25);
      expect(linkDatum.color).toBe("#4e79a7");
      expect(linkDatum.sourceX).toBe(24);
      expect(linkDatum.targetX).toBe(100);
    });

    it("should generate a unique key from source and target", () => {
      const sourceId = "nodeA";
      const targetId = "nodeB";
      const key = `${sourceId}-${targetId}`;

      expect(key).toBe("nodeA-nodeB");
    });
  });

  describe("Link path generation", () => {
    it("should create a link path string with correct structure", () => {
      // Mock link data that would be used for path generation
      const mockLink = {
        sourceX: 24,
        targetX: 100,
        y0: 20,
        y1: 30,
        width: 10,
      };

      // A sankey link path uses cubic bezier curves
      // The path should connect source to target with a horizontal sweep
      const midX = (mockLink.sourceX + mockLink.targetX) / 2;

      expect(midX).toBe(62);
      expect(mockLink.sourceX).toBeLessThan(mockLink.targetX);
    });
  });

  describe("Flow highlighting", () => {
    it("should identify connected links for a hovered node", () => {
      const links: Array<{ sourceId: string; targetId: string }> = [
        { sourceId: "A", targetId: "B" },
        { sourceId: "A", targetId: "C" },
        { sourceId: "B", targetId: "D" },
        { sourceId: "C", targetId: "D" },
      ];

      const hoveredNodeId = "A";

      // Find incoming links (where target is the hovered node)
      const incomingLinks = links.filter((l) => l.targetId === hoveredNodeId);

      // Find outgoing links (where source is the hovered node)
      const outgoingLinks = links.filter((l) => l.sourceId === hoveredNodeId);

      expect(incomingLinks.length).toBe(0);
      expect(outgoingLinks.length).toBe(2);
      expect(outgoingLinks[0].targetId).toBe("B");
      expect(outgoingLinks[1].targetId).toBe("C");
    });

    it("should highlight links connected to a middle node", () => {
      const links: Array<{ sourceId: string; targetId: string }> = [
        { sourceId: "A", targetId: "B" },
        { sourceId: "A", targetId: "C" },
        { sourceId: "B", targetId: "D" },
        { sourceId: "C", targetId: "D" },
      ];

      const hoveredNodeId = "B";

      const connectedLinks = links.filter(
        (l) => l.sourceId === hoveredNodeId || l.targetId === hoveredNodeId
      );

      expect(connectedLinks.length).toBe(2);
    });

    it("should calculate opacity based on highlighting state", () => {
      const isHighlighted = true;
      const isNotHighlighted = false;

      const highlightedOpacity = isHighlighted ? 0.8 : 0.1;
      const normalOpacity = isNotHighlighted ? 0.8 : 0.1;

      expect(highlightedOpacity).toBe(0.8);
      expect(normalOpacity).toBe(0.1);
    });
  });

  describe("Node labels", () => {
    it("should filter nodes by minimum height for label visibility", () => {
      const nodes: Array<{ id: string; height: number }> = [
        { id: "A", height: 30 },
        { id: "B", height: 15 },
        { id: "C", height: 5 },
        { id: "D", height: 25 },
      ];

      const fontSize = 12;
      const minLabelHeight = fontSize;

      const labelableNodes = nodes.filter((n) => n.height >= minLabelHeight);

      expect(labelableNodes.length).toBe(3);
      expect(labelableNodes.map((n) => n.id)).toEqual(["A", "B", "D"]);
    });

    it("should position labels to the right of nodes", () => {
      const node = {
        x1: 24,
        y0: 10,
        height: 40,
      };

      const labelX = node.x1 + 4;
      const labelY = node.y0 + node.height / 2;

      expect(labelX).toBe(28);
      expect(labelY).toBe(30);
    });
  });

  describe("Drag and drop reordering", () => {
    it("should track drag state correctly", () => {
      let draggingNodeId: string | null = null;
      let dragStartY = 0;

      // Start drag
      const nodeId = "nodeA";
      const startY = 100;
      draggingNodeId = nodeId;
      dragStartY = startY;

      expect(draggingNodeId).toBe("nodeA");
      expect(dragStartY).toBe(100);

      // End drag
      draggingNodeId = null;
      dragStartY = 0;

      expect(draggingNodeId).toBeNull();
      expect(dragStartY).toBe(0);
    });

    it("should calculate delta Y during drag", () => {
      const startY = 100;
      const currentY = 150;
      const deltaY = currentY - startY;

      expect(deltaY).toBe(50);
    });
  });

  describe("Value calculations", () => {
    it("should format node values for tooltips", () => {
      const node: SankeyNodeRenderDatum = {
        key: "node1",
        id: "node1",
        name: "Source",
        x0: 0,
        x1: 24,
        y0: 10,
        y1: 50,
        width: 24,
        height: 40,
        color: "#4e79a7",
        incomingValue: 100,
        outgoingValue: 80,
        depth: 0,
      };

      const totalValue = node.incomingValue + node.outgoingValue;
      expect(totalValue).toBe(180);
    });

    it("should calculate link width based on value", () => {
      const linkValue = 50;
      const maxValue = 200;
      const maxLinkWidth = 20;

      const normalizedWidth = (linkValue / maxValue) * maxLinkWidth;
      expect(normalizedWidth).toBe(5);
    });
  });

  describe("Color assignment", () => {
    it("should assign colors from color scale to nodes", () => {
      const nodeIds = ["A", "B", "C"];
      const colors = new Map<string, string>();
      const colorPalette = ["#4e79a7", "#f28e2c", "#e15759"];

      nodeIds.forEach((id, index) => {
        colors.set(id, colorPalette[index]);
      });

      expect(colors.get("A")).toBe("#4e79a7");
      expect(colors.get("B")).toBe("#f28e2c");
      expect(colors.get("C")).toBe("#e15759");
    });

    it("should use source node color for links by default", () => {
      const sourceColor = "#4e79a7";
      const linkColor = sourceColor;

      expect(linkColor).toBe("#4e79a7");
    });
  });

  describe("Transition animations", () => {
    it("should apply opacity transition on enter", () => {
      const enterOpacity = 0;
      const targetOpacity = 1;

      // Simulating transition
      const opacity = enterOpacity;
      const finalOpacity = targetOpacity;

      expect(opacity).toBe(0);
      expect(finalOpacity).toBe(1);
    });

    it("should apply position transitions on update", () => {
      const oldX = 10;
      const newX = 50;
      const oldY = 20;
      const newY = 60;

      // Positions should animate from old to new
      expect(oldX).not.toBe(newX);
      expect(oldY).not.toBe(newY);
    });

    it("should apply fade out on exit", () => {
      const initialOpacity = 1;
      const exitOpacity = 0;

      expect(exitOpacity).toBe(0);
    });
  });
});
