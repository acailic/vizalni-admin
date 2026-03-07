// app/pages/demos/playground/__tests__/ConfigPanel.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { ConfigPanel } from "@/demos/playground/_components/ConfigPanel";
import { SAMPLE_DATASETS } from "@/demos/playground/_constants";

describe("ConfigPanel", () => {
  it("should render all config sections", () => {
    render(
      <ConfigPanel
        chartType="line"
        data={SAMPLE_DATASETS.sales.data}
        config={{ xAxis: "label", yAxis: "value", color: "#6366f1" }}
        themeId="indigo"
        onChartTypeChange={() => {}}
        onDataChange={() => {}}
        onConfigChange={() => {}}
        onThemeChange={() => {}}
      />
    );
    expect(screen.getByText(/chart type|tip grafikona/i)).toBeInTheDocument();
    expect(screen.getByText(/data source|izvor podataka/i)).toBeInTheDocument();
    expect(screen.getByText(/theme|tema/i)).toBeInTheDocument();
  });
});
