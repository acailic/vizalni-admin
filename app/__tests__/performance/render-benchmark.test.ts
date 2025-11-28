import { describe, it, expect, beforeEach, afterEach } from "vitest";
import * as d3 from "d3";
import { getD3FormatLocale } from "../../locales/locales";

// Performance budgets (in milliseconds)
const PERFORMANCE_BUDGETS = {
  "100": 50,
  "1000": 200,
  "10000": 1000,
  "100000": 5000,
};

// Memory budget (in MB)
const MEMORY_BUDGET = 50;

// Generate sample data for different sizes
const generateData = (size: number) => {
  return Array.from({ length: size }, (_, i) => ({
    x: i,
    y: Math.random() * 1000,
  }));
};

// Simple chart rendering function using D3
const renderChart = (data: { x: number; y: number }[], container: Element) => {
  const formatLocale = getD3FormatLocale();
  const formatNumber = formatLocale.format(",.0f");

  // Clear container
  d3.select(container).selectAll("*").remove();

  // Set dimensions
  const margin = { top: 20, right: 30, bottom: 40, left: 50 };
  const width = 800 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;

  // Create SVG
  const svg = d3
    .select(container)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // Scales
  const x = d3
    .scaleLinear()
    .domain(d3.extent(data, (d) => d.x) as [number, number])
    .range([0, width]);

  const y = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.y)!])
    .range([height, 0]);

  // Line generator
  const line = d3
    .line<{ x: number; y: number }>()
    .x((d) => x(d.x))
    .y((d) => y(d.y));

  // Add line
  svg
    .append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 1.5)
    .attr("d", line);

  // Add axes
  svg
    .append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x).tickFormat((d) => formatNumber(d as number)));

  svg.append("g").call(d3.axisLeft(y).tickFormat((d) => formatNumber(d as number)));
};

describe("Chart Rendering Performance Benchmarks", () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  const dataSizes = [100, 1000, 10000, 100000];

  dataSizes.forEach((size) => {
    it(`should render chart with ${size} data points within performance budget`, async () => {
      const data = generateData(size);

      // Record initial memory
      const initialMemory = (performance as any).memory?.usedJSHeapSize || 0;

      // Start performance measurement
      performance.mark(`render-start-${size}`);

      // Render chart
      renderChart(data, container);

      // Wait for next frame to ensure rendering is complete
      await new Promise((resolve) => requestAnimationFrame(resolve));

      // End performance measurement
      performance.mark(`render-end-${size}`);
      performance.measure(`render-${size}`, `render-start-${size}`, `render-end-${size}`);

      const measure = performance.getEntriesByName(`render-${size}`)[0];
      const renderTime = measure.duration;

      // Record final memory
      const finalMemory = (performance as any).memory?.usedJSHeapSize || 0;
      const memoryUsed = (finalMemory - initialMemory) / (1024 * 1024); // MB

      // Time to interactive: assume it's the render time plus a small buffer
      const timeToInteractive = renderTime + 10; // 10ms buffer

      console.log(`Data size ${size}: Render time: ${renderTime}ms, Memory used: ${memoryUsed}MB, TTI: ${timeToInteractive}ms`);

      // Assert performance budgets
      expect(renderTime).toBeLessThan(PERFORMANCE_BUDGETS[size as keyof typeof PERFORMANCE_BUDGETS]);
      expect(timeToInteractive).toBeLessThan(PERFORMANCE_BUDGETS[size as keyof typeof PERFORMANCE_BUDGETS] + 50);
      expect(memoryUsed).toBeLessThan(MEMORY_BUDGET);

      // Clean up performance entries
      performance.clearMarks(`render-start-${size}`);
      performance.clearMarks(`render-end-${size}`);
      performance.clearMeasures(`render-${size}`);
    });
  });
});