/**
 * Test Page for Visual Regression Testing
 *
 * This page renders chart components for visual regression testing.
 * It receives chart configuration via window.testChartConfig and renders
 * the appropriate chart with the specified data and options.
 */

import { GetServerSideProps } from "next";
import { useEffect, useState } from "react";

import { AreaChart } from "../../../exports/charts/AreaChart";
import { BarChart } from "../../../exports/charts/BarChart";
import { ColumnChart } from "../../../exports/charts/ColumnChart";
import { LineChart } from "../../../exports/charts/LineChart";
import { PieChart } from "../../../exports/charts/PieChart";

import type { ChartData } from "../../../exports/charts/types";

interface TestChartConfig {
  type: "line" | "bar" | "column" | "area" | "pie";
  data: ChartData[];
  config: any;
  options: {
    animated?: boolean;
    showTooltip?: boolean;
    height?: number;
    width?: number | "100%";
    locale?: string;
    title?: string;
  };
}

export default function ChartTestPage({ type }: { type: string }) {
  const [chartConfig, setChartConfig] = useState<TestChartConfig | null>(null);

  useEffect(() => {
    // Load config from window object (set by tests)
    const config = (window as any).testChartConfig as TestChartConfig;
    if (config) {
      setChartConfig(config);
    }
  }, []);

  if (!chartConfig) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          fontSize: "18px",
          color: "#666",
        }}
      >
        Loading chart...
      </div>
    );
  }

  const { data, config, options } = chartConfig;
  const chartProps = {
    data,
    config: {
      ...config,
      title: options.title || config.title,
    },
    height: options.height || 400,
    width: options.width || "100%",
    locale: (options.locale as any) || "en",
    animated: options.animated ?? false,
    showTooltip: options.showTooltip ?? false,
  };

  // Render appropriate chart
  const renderChart = () => {
    switch (chartConfig.type) {
      case "line":
        return <LineChart {...chartProps} id={`chart-${type}`} />;
      case "bar":
        return <BarChart {...chartProps} id={`chart-${type}`} />;
      case "column":
        return <ColumnChart {...chartProps} id={`chart-${type}`} />;
      case "area":
        return <AreaChart {...chartProps} id={`chart-${type}`} />;
      case "pie":
        return <PieChart {...chartProps} id={`chart-${type}`} />;
      default:
        return <div>Unknown chart type: {chartConfig.type}</div>;
    }
  };

  return (
    <div
      style={{
        padding: "40px",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "var(--background-color, #ffffff)",
      }}
    >
      <div
        style={{
          width: options.width || "100%",
          maxWidth: "1200px",
        }}
        data-testid={`chart-${type}`}
      >
        {renderChart()}
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { type } = context.params || {};

  return {
    props: {
      type: type || "unknown",
    },
  };
};
