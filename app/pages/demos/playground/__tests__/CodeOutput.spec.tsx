import { describe, it, expect } from "vitest";

import { generateCode } from "../_components/CodeOutput";
import { SAMPLE_DATASETS } from "../_constants";

describe("CodeOutput", () => {
  it("should generate code with LineChart", () => {
    const code = generateCode({
      chartType: "line",
      data: SAMPLE_DATASETS.sales.data,
      config: { xAxis: "label", yAxis: "value", color: "#6366f1" },
    });
    expect(code).toContain("LineChart");
  });

  it("should generate valid React code", () => {
    const code = generateCode({
      chartType: "bar",
      data: [{ label: "A", value: 10 }],
      config: { xAxis: "label", yAxis: "value", color: "#6366f1" },
    });
    expect(code).toContain("BarChart");
    expect(code).toContain("@vizualni/react");
  });
});
