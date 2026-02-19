import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PieChart } from "../../src/charts/PieChart";
import type { Datum } from "@vizualni/core";

describe("PieChart", () => {
  const data: Datum[] = [
    { category: "A", value: 30 },
    { category: "B", value: 50 },
    { category: "C", value: 20 },
  ];

  it("should render an SVG element", () => {
    render(
      <PieChart
        data={data}
        config={{
          type: "pie",
          value: { field: "value", type: "number" },
          category: { field: "category", type: "string" },
        }}
        width={400}
        height={400}
      />
    );

    const svg = screen.getByRole("img", { hidden: true });
    expect(svg.tagName.toLowerCase()).toBe("svg");
  });

  it("should render pie slices", () => {
    render(
      <PieChart
        data={data}
        config={{
          type: "pie",
          value: { field: "value", type: "number" },
          category: { field: "category", type: "string" },
        }}
        width={400}
        height={400}
      />
    );

    const paths = document.querySelectorAll("path");
    expect(paths.length).toBe(3); // One path per slice
  });
});
