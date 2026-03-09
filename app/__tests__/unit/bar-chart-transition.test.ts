import { describe, it, expect } from "vitest";

describe("BarChart d3-transition import", () => {
  it("imports d3-transition side-effect module", async () => {
    const source = await import("fs").then((fs) =>
      fs.readFileSync("components/demos/charts/BarChart.tsx", "utf-8")
    );
    expect(source).toContain('import "d3-transition"');
  });
});
