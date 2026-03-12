import { act, render } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { describe, expect, it } from "vitest";

import { PieChart } from "./PieChart";

const data = [
  { source: "A", share: 50 },
  { source: "B", share: 30 },
  { source: "C", share: 20 },
];

describe("PieChart", () => {
  it("renders arcs for slices", async () => {
    const { container } = render(
      <PieChart data={data} labelKey="source" valueKey="share" width={200} height={200} />
    );

    await act(async () => Promise.resolve());
    const slices = container.querySelectorAll("path");
    expect(slices.length).toBeGreaterThanOrEqual(3);
  });

  it("handles empty data", async () => {
    const { container } = render(
      <PieChart data={[]} labelKey="source" valueKey="share" width={200} height={200} />
    );

    await act(async () => Promise.resolve());
    expect(container.querySelectorAll("path").length).toBe(0);
  });
});
