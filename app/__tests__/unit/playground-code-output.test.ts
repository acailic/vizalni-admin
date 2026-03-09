import { describe, it, expect } from "vitest";

import { generateCode } from "@/demos/playground/_components/CodeOutput/index";

describe("generateCode", () => {
  const sampleData = Array.from({ length: 12 }, (_, i) => ({
    label: `Month ${i + 1}`,
    value: (i + 1) * 100,
  }));

  it("includes ALL data points without truncation", () => {
    const code = generateCode({
      chartType: "bar",
      data: sampleData,
      config: { xAxis: "label", yAxis: "value", color: "#2196f3" },
    });

    expect(code).not.toContain("// ...");
    expect(code).toContain("Month 12");
    expect(code).toContain("export default MyChart;");
  });

  it("produces valid JSX structure", () => {
    const code = generateCode({
      chartType: "line",
      data: [{ label: "A", value: 10 }],
      config: { xAxis: "label", yAxis: "value", color: "#ff0000" },
    });

    expect(code).toContain("import { LineChart }");
    expect(code).toContain("<LineChart");
    expect(code).toContain("export default MyChart;");
  });
});
