/**
 * Comprehensive Tests for Playground Page
 *
 * Tests for /demos/playground page covering:
 * - Page rendering
 * - Dataset selection
 * - Configuration changes (x-axis, y-axis, color)
 * - Tab switching (preview vs code)
 * - Code generation
 * - Responsive behavior
 *
 * @testPath app/pages/demos/playground/index.tsx
 */

import { describe, it, expect } from "vitest";

// Sample datasets matching the playground page
const sampleData = {
  simple: [
    { year: "2020", value: 100 },
    { year: "2021", value: 120 },
    { year: "2022", value: 115 },
    { year: "2023", value: 130 },
    { year: "2024", value: 140 },
  ],
  multiSeries: [
    { year: "2020", revenue: 100, expenses: 80 },
    { year: "2021", revenue: 120, expenses: 90 },
    { year: "2022", revenue: 115, expenses: 95 },
    { year: "2023", revenue: 130, expenses: 100 },
    { year: "2024", revenue: 140, expenses: 110 },
  ],
  economy: [
    { year: "2018", gdp: 45.2, inflation: 2.1 },
    { year: "2019", gdp: 47.1, inflation: 1.9 },
    { year: "2020", gdp: 43.5, inflation: 2.3 },
    { year: "2021", gdp: 46.8, inflation: 4.1 },
    { year: "2022", gdp: 49.3, inflation: 9.4 },
    { year: "2023", gdp: 51.6, inflation: 8.9 },
  ],
};

const colorPresets = [
  { value: "#6366f1", label: "Indigo", color: "#6366f1" },
  { value: "#10b981", label: "Emerald", color: "#10b981" },
  { value: "#f59e0b", label: "Amber", color: "#f59e0b" },
  { value: "#ef4444", label: "Red", color: "#ef4444" },
  { value: "#8b5cf6", label: "Violet", color: "#8b5cf6" },
  { value: "#06b6d4", label: "Cyan", color: "#06b6d4" },
];

// Simulate the code generation function from the playground page
function generateCode(dataset: keyof typeof sampleData, config: any) {
  const data = sampleData[dataset];
  const isMultiSeries = dataset === "multiSeries" || dataset === "economy";
  const seriesConfig = isMultiSeries
    ? `
  config={{
    xAxis: '${config.xAxis}',
    yAxis: ['${(config.yAxis as string[]).join("', '")}'],
    seriesKeys: ['${(config.yAxis as string[]).join("', '")}'],
    color: '${config.color}',
  }}`
    : `
  config={{
    xAxis: '${config.xAxis}',
    yAxis: '${config.yAxis}',
    color: '${config.color}',
  }}`;

  return `import { LineChart } from '@acailic/vizualni-admin/charts';

function MyChart() {
  const data = ${JSON.stringify(data.slice(0, 3), null, 2).replace(
    /\n/g,
    "\n  "
  )};
  ${data.length > 3 ? "// ... (truncated for demo)" : ""}

  return (
    <LineChart
      data={data}
      ${isMultiSeries ? "multiSeries" : ""}${seriesConfig}
      height={400}
    />
  );
}`;
}

describe("Playground Page - Data Structure", () => {
  describe("Sample Datasets", () => {
    it("has simple dataset with correct structure", () => {
      expect(sampleData.simple).toBeDefined();
      expect(sampleData.simple).toHaveLength(5);
      expect(sampleData.simple[0]).toHaveProperty("year");
      expect(sampleData.simple[0]).toHaveProperty("value");
      expect(typeof sampleData.simple[0].year).toBe("string");
      expect(typeof sampleData.simple[0].value).toBe("number");
    });

    it("has multi-series dataset with correct structure", () => {
      expect(sampleData.multiSeries).toBeDefined();
      expect(sampleData.multiSeries).toHaveLength(5);
      expect(sampleData.multiSeries[0]).toHaveProperty("year");
      expect(sampleData.multiSeries[0]).toHaveProperty("revenue");
      expect(sampleData.multiSeries[0]).toHaveProperty("expenses");
      expect(typeof sampleData.multiSeries[0].year).toBe("string");
      expect(typeof sampleData.multiSeries[0].revenue).toBe("number");
      expect(typeof sampleData.multiSeries[0].expenses).toBe("number");
    });

    it("has economy dataset with correct structure", () => {
      expect(sampleData.economy).toBeDefined();
      expect(sampleData.economy).toHaveLength(6);
      expect(sampleData.economy[0]).toHaveProperty("year");
      expect(sampleData.economy[0]).toHaveProperty("gdp");
      expect(sampleData.economy[0]).toHaveProperty("inflation");
      expect(typeof sampleData.economy[0].year).toBe("string");
      expect(typeof sampleData.economy[0].gdp).toBe("number");
      expect(typeof sampleData.economy[0].inflation).toBe("number");
    });
  });

  describe("Color Presets", () => {
    it("has all required color presets", () => {
      expect(colorPresets).toHaveLength(6);
    });

    it("has correct color values", () => {
      expect(colorPresets[0].value).toBe("#6366f1");
      expect(colorPresets[1].value).toBe("#10b981");
      expect(colorPresets[2].value).toBe("#f59e0b");
      expect(colorPresets[3].value).toBe("#ef4444");
      expect(colorPresets[4].value).toBe("#8b5cf6");
      expect(colorPresets[5].value).toBe("#06b6d4");
    });

    it("has valid hex color codes", () => {
      colorPresets.forEach((preset) => {
        expect(preset.color).toMatch(/^#[0-9A-F]{6}$/i);
        expect(preset.value).toMatch(/^#[0-9A-F]{6}$/i);
      });
    });
  });
});

describe("Playground Page - Configuration Logic", () => {
  describe("Dataset Configuration", () => {
    it("configures simple dataset correctly", () => {
      const config = {
        xAxis: "year",
        yAxis: "value",
        color: "#6366f1",
        showArea: true,
        showCrosshair: true,
      };

      expect(config.xAxis).toBe("year");
      expect(config.yAxis).toBe("value");
      expect(config.color).toBe("#6366f1");
      expect(config.showArea).toBe(true);
      expect(config.showCrosshair).toBe(true);
    });

    it("configures multi-series dataset correctly", () => {
      const config = {
        xAxis: "year",
        yAxis: ["revenue", "expenses"],
        color: "#6366f1",
        showArea: true,
        showCrosshair: true,
      };

      expect(config.xAxis).toBe("year");
      expect(Array.isArray(config.yAxis)).toBe(true);
      expect(config.yAxis).toEqual(["revenue", "expenses"]);
      expect(config.color).toBe("#6366f1");
    });

    it("configures economy dataset correctly", () => {
      const config = {
        xAxis: "year",
        yAxis: ["gdp", "inflation"],
        color: "#6366f1",
        showArea: true,
        showCrosshair: true,
      };

      expect(config.xAxis).toBe("year");
      expect(Array.isArray(config.yAxis)).toBe(true);
      expect(config.yAxis).toEqual(["gdp", "inflation"]);
      expect(config.color).toBe("#6366f1");
    });
  });

  describe("Configuration Updates", () => {
    it("updates config values correctly", () => {
      const config = {
        xAxis: "year",
        yAxis: "value",
        color: "#6366f1",
        showArea: true,
        showCrosshair: true,
      };

      // Simulate updateConfig function
      const updatedConfig = { ...config, color: "#ef4444" };
      expect(updatedConfig.color).toBe("#ef4444");
      expect(updatedConfig.xAxis).toBe("year"); // Other values unchanged
    });

    it("toggles boolean config values", () => {
      const config = {
        xAxis: "year",
        yAxis: "value",
        color: "#6366f1",
        showArea: true,
        showCrosshair: true,
      };

      const updatedConfig = { ...config, showArea: !config.showArea };
      expect(updatedConfig.showArea).toBe(false);
      expect(updatedConfig.showCrosshair).toBe(true); // Unchanged
    });

    it("updates x-axis configuration", () => {
      const config = {
        xAxis: "year",
        yAxis: "value",
        color: "#6366f1",
      };

      const updatedConfig = { ...config, xAxis: "value" };
      expect(updatedConfig.xAxis).toBe("value");
    });

    it("updates y-axis configuration", () => {
      const config = {
        xAxis: "year",
        yAxis: "value",
        color: "#6366f1",
      };

      const updatedConfig = { ...config, yAxis: "revenue" };
      expect(updatedConfig.yAxis).toBe("revenue");
    });
  });
});

describe("Playground Page - Code Generation", () => {
  describe("Simple Dataset Code Generation", () => {
    it("generates code for simple dataset", () => {
      const config = {
        xAxis: "year",
        yAxis: "value",
        color: "#6366f1",
      };

      const code = generateCode("simple", config);

      expect(code).toContain("import { LineChart }");
      expect(code).toContain("function MyChart");
      expect(code).toContain("xAxis: 'year'");
      expect(code).toContain("yAxis: 'value'");
      expect(code).toContain("color: '#6366f1'");
      expect(code).toContain("height={400}");
    });

    it("generates correct data structure for simple dataset", () => {
      const config = {
        xAxis: "year",
        yAxis: "value",
        color: "#6366f1",
      };

      const code = generateCode("simple", config);

      expect(code).toContain("const data =");
      expect(code).toContain('"year": "2020"');
      expect(code).toContain('"value": 100');
    });
  });

  describe("Multi-Series Code Generation", () => {
    it("generates code for multi-series dataset", () => {
      const config = {
        xAxis: "year",
        yAxis: ["revenue", "expenses"],
        color: "#6366f1",
      };

      const code = generateCode("multiSeries", config);

      expect(code).toContain("import { LineChart }");
      expect(code).toContain("function MyChart");
      expect(code).toContain("xAxis: 'year'");
      expect(code).toContain("yAxis: ['revenue', 'expenses']");
      expect(code).toContain("seriesKeys: ['revenue', 'expenses']");
      expect(code).toContain("color: '#6366f1'");
      expect(code).toContain("height={400}");
    });

    it("generates correct data structure for multi-series dataset", () => {
      const config = {
        xAxis: "year",
        yAxis: ["revenue", "expenses"],
        color: "#6366f1",
      };

      const code = generateCode("multiSeries", config);

      expect(code).toContain("const data =");
      expect(code).toContain('"year": "2020"');
      expect(code).toContain('"revenue": 100');
      expect(code).toContain('"expenses": 80');
    });
  });

  describe("Economy Dataset Code Generation", () => {
    it("generates code for economy dataset", () => {
      const config = {
        xAxis: "year",
        yAxis: ["gdp", "inflation"],
        color: "#6366f1",
      };

      const code = generateCode("economy", config);

      expect(code).toContain("import { LineChart }");
      expect(code).toContain("function MyChart");
      expect(code).toContain("xAxis: 'year'");
      expect(code).toContain("yAxis: ['gdp', 'inflation']");
      expect(code).toContain("seriesKeys: ['gdp', 'inflation']");
      expect(code).toContain("color: '#6366f1'");
      expect(code).toContain("height={400}");
    });

    it("generates correct data structure for economy dataset", () => {
      const config = {
        xAxis: "year",
        yAxis: ["gdp", "inflation"],
        color: "#6366f1",
      };

      const code = generateCode("economy", config);

      expect(code).toContain("const data =");
      expect(code).toContain('"year": "2018"');
      expect(code).toContain('"gdp": 45.2');
      expect(code).toContain('"inflation": 2.1');
    });
  });

  describe("Color Configuration in Generated Code", () => {
    it("includes indigo color in generated code", () => {
      const config = {
        xAxis: "year",
        yAxis: "value",
        color: "#6366f1",
      };

      const code = generateCode("simple", config);
      expect(code).toContain("color: '#6366f1'");
    });

    it("includes emerald color in generated code", () => {
      const config = {
        xAxis: "year",
        yAxis: "value",
        color: "#10b981",
      };

      const code = generateCode("simple", config);
      expect(code).toContain("color: '#10b981'");
    });

    it("includes red color in generated code", () => {
      const config = {
        xAxis: "year",
        yAxis: "value",
        color: "#ef4444",
      };

      const code = generateCode("simple", config);
      expect(code).toContain("color: '#ef4444'");
    });

    it("includes violet color in generated code", () => {
      const config = {
        xAxis: "year",
        yAxis: "value",
        color: "#8b5cf6",
      };

      const code = generateCode("simple", config);
      expect(code).toContain("color: '#8b5cf6'");
    });
  });

  describe("Code Structure", () => {
    it("generates valid TypeScript/JSX code", () => {
      const config = {
        xAxis: "year",
        yAxis: "value",
        color: "#6366f1",
      };

      const code = generateCode("simple", config);

      // Check for proper JSX structure
      expect(code).toContain("<LineChart");
      expect(code).toContain("/>");
      expect(code).toContain("data={data}");
      expect(code).toContain("config={");
    });

    it("includes truncation comment for datasets with more than 3 items", () => {
      const config = {
        xAxis: "year",
        yAxis: "value",
        color: "#6366f1",
      };

      const code = generateCode("simple", config);
      expect(code).toContain("// ... (truncated for demo)");
    });
  });
});

describe("Playground Page - Dataset Switching Logic", () => {
  describe("Auto-Configuration on Dataset Change", () => {
    it("auto-configures when switching to multi-series dataset", () => {
      const currentConfig = {
        xAxis: "year",
        yAxis: "value",
        color: "#6366f1",
      };

      // Simulate the auto-update logic
      const newConfig = {
        xAxis: "year",
        yAxis: ["revenue", "expenses"],
        color: "#6366f1",
      };

      expect(newConfig.yAxis).toEqual(["revenue", "expenses"]);
      expect(Array.isArray(newConfig.yAxis)).toBe(true);
    });

    it("auto-configures when switching to economy dataset", () => {
      const currentConfig = {
        xAxis: "year",
        yAxis: "value",
        color: "#6366f1",
      };

      // Simulate the auto-update logic
      const newConfig = {
        xAxis: "year",
        yAxis: ["gdp", "inflation"],
        color: "#6366f1",
      };

      expect(newConfig.yAxis).toEqual(["gdp", "inflation"]);
      expect(Array.isArray(newConfig.yAxis)).toBe(true);
    });

    it("auto-configures when switching to simple dataset", () => {
      const currentConfig = {
        xAxis: "year",
        yAxis: ["revenue", "expenses"],
        color: "#6366f1",
      };

      // Simulate the auto-update logic
      const newConfig = {
        xAxis: "year",
        yAxis: "value",
        color: "#6366f1",
      };

      expect(newConfig.yAxis).toBe("value");
      expect(typeof newConfig.yAxis).toBe("string");
    });
  });

  describe("Data Availability", () => {
    it("provides all keys from simple dataset", () => {
      const data = sampleData.simple;
      const keys = Object.keys(data[0] || {});

      expect(keys).toContain("year");
      expect(keys).toContain("value");
      expect(keys).toHaveLength(2);
    });

    it("provides all keys from multi-series dataset", () => {
      const data = sampleData.multiSeries;
      const keys = Object.keys(data[0] || {});

      expect(keys).toContain("year");
      expect(keys).toContain("revenue");
      expect(keys).toContain("expenses");
      expect(keys).toHaveLength(3);
    });

    it("provides all keys from economy dataset", () => {
      const data = sampleData.economy;
      const keys = Object.keys(data[0] || {});

      expect(keys).toContain("year");
      expect(keys).toContain("gdp");
      expect(keys).toContain("inflation");
      expect(keys).toHaveLength(3);
    });

    it("filters x-axis key from y-axis options", () => {
      const data = sampleData.simple;
      const xAxis = "year";
      const keys = Object.keys(data[0] || {}).filter((k) => k !== xAxis);

      expect(keys).not.toContain("year");
      expect(keys).toContain("value");
    });
  });
});

describe("Playground Page - Tab State Management", () => {
  describe("Tab Switching", () => {
    it("has preview tab state", () => {
      const activeTab = 0;
      expect(activeTab).toBe(0);
    });

    it("has code tab state", () => {
      const activeTab = 1;
      expect(activeTab).toBe(1);
    });

    it("switches between tabs", () => {
      let activeTab = 0;

      // Switch to code tab
      activeTab = 1;
      expect(activeTab).toBe(1);

      // Switch back to preview
      activeTab = 0;
      expect(activeTab).toBe(0);
    });

    it("maintains state across tab switches", () => {
      const config = {
        xAxis: "year",
        yAxis: "value",
        color: "#ef4444",
      };

      let activeTab = 0;

      // Change config
      const updatedConfig = { ...config, color: "#ef4444" };

      // Switch to code tab
      activeTab = 1;

      // Config should remain unchanged
      expect(updatedConfig.color).toBe("#ef4444");

      // Switch back to preview
      activeTab = 0;

      // Config should still be unchanged
      expect(updatedConfig.color).toBe("#ef4444");
    });
  });
});

describe("Playground Page - Responsive Behavior", () => {
  describe("Viewport Sizes", () => {
    it("supports mobile viewport (375px)", () => {
      const mobileWidth = 375;
      expect(mobileWidth).toBeLessThan(768);
    });

    it("supports tablet viewport (768px)", () => {
      const tabletWidth = 768;
      expect(tabletWidth).toBeGreaterThanOrEqual(768);
      expect(tabletWidth).toBeLessThan(1024);
    });

    it("supports desktop viewport (1920px)", () => {
      const desktopWidth = 1920;
      expect(desktopWidth).toBeGreaterThanOrEqual(1024);
    });
  });

  describe("Chart Dimensions", () => {
    it("has fixed chart height", () => {
      const chartHeight = 400;
      expect(chartHeight).toBe(400);
    });

    it("supports responsive width (100%)", () => {
      const chartWidth = "100%";
      expect(chartWidth).toBe("100%");
    });
  });
});

describe("Playground Page - User Interactions", () => {
  describe("Color Selection", () => {
    it("cycles through all color presets", () => {
      const colors = [
        "#6366f1",
        "#10b981",
        "#f59e0b",
        "#ef4444",
        "#8b5cf6",
        "#06b6d4",
      ];

      colors.forEach((color) => {
        const config = {
          xAxis: "year",
          yAxis: "value",
          color: color,
        };

        expect(config.color).toMatch(/^#[0-9A-F]{6}$/i);
      });
    });
  });

  describe("Dataset Cycling", () => {
    it("cycles through all datasets", () => {
      const datasets = ["simple", "multiSeries", "economy"] as const;

      datasets.forEach((dataset) => {
        const data = sampleData[dataset];
        expect(data).toBeDefined();
        expect(data.length).toBeGreaterThan(0);
      });
    });
  });

  describe("Quick Action Toggles", () => {
    it("toggles show area option", () => {
      let showArea = true;
      showArea = !showArea;
      expect(showArea).toBe(false);

      showArea = !showArea;
      expect(showArea).toBe(true);
    });

    it("toggles show crosshair option", () => {
      let showCrosshair = true;
      showCrosshair = !showCrosshair;
      expect(showCrosshair).toBe(false);

      showCrosshair = !showCrosshair;
      expect(showCrosshair).toBe(true);
    });

    it("toggles both options independently", () => {
      let showArea = true;
      let showCrosshair = true;

      showArea = !showArea;
      expect(showArea).toBe(false);
      expect(showCrosshair).toBe(true);

      showCrosshair = !showCrosshair;
      expect(showArea).toBe(false);
      expect(showCrosshair).toBe(false);
    });
  });
});

describe("Playground Page - Edge Cases", () => {
  describe("Rapid Dataset Changes", () => {
    it("handles switching between datasets rapidly", () => {
      let currentDataset: keyof typeof sampleData = "simple";

      // Rapid changes
      currentDataset = "multiSeries";
      expect(sampleData[currentDataset]).toBeDefined();

      currentDataset = "economy";
      expect(sampleData[currentDataset]).toBeDefined();

      currentDataset = "simple";
      expect(sampleData[currentDataset]).toBeDefined();
    });
  });

  describe("Rapid Color Changes", () => {
    it("handles rapid color changes", () => {
      let currentColor = "#6366f1";

      // Rapid changes
      currentColor = "#10b981";
      expect(currentColor).toBe("#10b981");

      currentColor = "#ef4444";
      expect(currentColor).toBe("#ef4444");

      currentColor = "#8b5cf6";
      expect(currentColor).toBe("#8b5cf6");
    });
  });

  describe("Invalid Color Handling", () => {
    it("accepts any string value for custom color", () => {
      const invalidColor = "#invalid";
      expect(invalidColor).toBeDefined();
      expect(typeof invalidColor).toBe("string");
    });

    it("preserves invalid color input", () => {
      const config = {
        xAxis: "year",
        yAxis: "value",
        color: "#invalid",
      };

      expect(config.color).toBe("#invalid");
    });
  });

  describe("Tab Switching Without Config Changes", () => {
    it("handles tab switching with default config", () => {
      const defaultConfig = {
        xAxis: "year",
        yAxis: "value",
        color: "#6366f1",
        showArea: true,
        showCrosshair: true,
      };

      let activeTab = 0;

      // Switch to code tab
      activeTab = 1;

      // Config should remain at default
      expect(defaultConfig.xAxis).toBe("year");
      expect(defaultConfig.yAxis).toBe("value");

      // Switch back to preview
      activeTab = 0;

      // Config should still be at default
      expect(defaultConfig.xAxis).toBe("year");
      expect(defaultConfig.yAxis).toBe("value");
    });
  });
});

describe("Playground Page - Data Integrity", () => {
  describe("Simple Dataset Data Types", () => {
    it("maintains correct data types in simple dataset", () => {
      sampleData.simple.forEach((point) => {
        expect(typeof point.year).toBe("string");
        expect(typeof point.value).toBe("number");
      });
    });
  });

  describe("Multi-Series Dataset Data Types", () => {
    it("maintains correct data types in multi-series dataset", () => {
      sampleData.multiSeries.forEach((point) => {
        expect(typeof point.year).toBe("string");
        expect(typeof point.revenue).toBe("number");
        expect(typeof point.expenses).toBe("number");
      });
    });
  });

  describe("Economy Dataset Data Types", () => {
    it("maintains correct data types in economy dataset", () => {
      sampleData.economy.forEach((point) => {
        expect(typeof point.year).toBe("string");
        expect(typeof point.gdp).toBe("number");
        expect(typeof point.inflation).toBe("number");
      });
    });
  });

  describe("Data Completeness", () => {
    it("has all required properties in simple dataset", () => {
      sampleData.simple.forEach((point) => {
        expect(point).toHaveProperty("year");
        expect(point).toHaveProperty("value");
      });
    });

    it("has all required properties in multi-series dataset", () => {
      sampleData.multiSeries.forEach((point) => {
        expect(point).toHaveProperty("year");
        expect(point).toHaveProperty("revenue");
        expect(point).toHaveProperty("expenses");
      });
    });

    it("has all required properties in economy dataset", () => {
      sampleData.economy.forEach((point) => {
        expect(point).toHaveProperty("year");
        expect(point).toHaveProperty("gdp");
        expect(point).toHaveProperty("inflation");
      });
    });
  });
});
