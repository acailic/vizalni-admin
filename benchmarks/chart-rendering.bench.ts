import { bench, describe } from 'vitest';
import { createRenderer } from 'react-test-renderer/shallow';
import { LineChart, BarChart, AreaChart, PieChart } from '../index';

// Assuming chart components are exported and take props: data and config
// For simplicity, using mock configs and data

const generateData = (size: number) => {
  return Array.from({ length: size }, (_, i) => ({
    x: i,
    y: Math.random() * 100,
    category: `cat${i % 10}`,
  }));
};

const mockConfig = {
  chartType: 'line' as const,
  fields: {
    x: { componentId: 'x' },
    y: { componentId: 'y' },
    color: { type: 'single' as const, paletteId: 'blues', color: '#000' },
  },
  // Add other required fields from ChartConfig
  key: 'test',
  version: '1.0',
  meta: {
    title: { 'sr-Latn': 'Test', 'sr-Cyrl': 'Test', en: 'Test' },
    description: { 'sr-Latn': 'Test', 'sr-Cyrl': 'Test', en: 'Test' },
    label: { 'sr-Latn': 'Test', 'sr-Cyrl': 'Test', en: 'Test' },
  },
  cubes: [],
  interactiveFiltersConfig: {
    legend: { active: false, componentId: '' },
    timeRange: { active: false, componentId: '', presets: { type: 'range', from: '', to: '' } },
    dataFilters: { active: false, componentIds: [], defaultValueOverrides: {}, filterTypes: {} },
    calculation: { active: false, type: 'identity' as const },
  },
  annotations: [],
  limits: {},
  conversionUnitsByComponentId: {},
  activeField: undefined,
};

const renderer = createRenderer();

const dataSizes = [100, 1000, 10000, 100000];

describe('Chart Rendering Benchmarks', () => {
  describe('Line Chart', () => {
    dataSizes.forEach(size => {
      bench(`Line Chart with ${size} data points`, () => {
        const data = generateData(size);
        const config = { ...mockConfig, chartType: 'line' as const };
        renderer.render(<LineChart data={data} config={config} />);
      }, {
        setup() {
          // Measure memory before
          const memBefore = (performance as any).memory?.usedJSHeapSize || 0;
          return { memBefore };
        },
        teardown({ memBefore }) {
          // Measure memory after and log
          const memAfter = (performance as any).memory?.usedJSHeapSize || 0;
          const memUsed = memAfter - memBefore;
          console.log(JSON.stringify({
            chartType: 'line',
            dataSize: size,
            memUsed,
            // Frame rate not applicable for static render
          }));
        }
      });
    });
  });

  describe('Bar Chart', () => {
    dataSizes.forEach(size => {
      bench(`Bar Chart with ${size} data points`, () => {
        const data = generateData(size);
        const config = { ...mockConfig, chartType: 'bar' as const };
        renderer.render(<BarChart data={data} config={config} />);
      }, {
        setup() {
          const memBefore = (performance as any).memory?.usedJSHeapSize || 0;
          return { memBefore };
        },
        teardown({ memBefore }) {
          const memAfter = (performance as any).memory?.usedJSHeapSize || 0;
          const memUsed = memAfter - memBefore;
          console.log(JSON.stringify({
            chartType: 'bar',
            dataSize: size,
            memUsed,
          }));
        }
      });
    });
  });

  describe('Area Chart', () => {
    dataSizes.forEach(size => {
      bench(`Area Chart with ${size} data points`, () => {
        const data = generateData(size);
        const config = { ...mockConfig, chartType: 'area' as const };
        renderer.render(<AreaChart data={data} config={config} />);
      }, {
        setup() {
          const memBefore = (performance as any).memory?.usedJSHeapSize || 0;
          return { memBefore };
        },
        teardown({ memBefore }) {
          const memAfter = (performance as any).memory?.usedJSHeapSize || 0;
          const memUsed = memAfter - memBefore;
          console.log(JSON.stringify({
            chartType: 'area',
            dataSize: size,
            memUsed,
          }));
        }
      });
    });
  });

  describe('Pie Chart', () => {
    dataSizes.forEach(size => {
      bench(`Pie Chart with ${size} data points`, () => {
        const data = generateData(size);
        const config = { ...mockConfig, chartType: 'pie' as const };
        renderer.render(<PieChart data={data} config={config} />);
      }, {
        setup() {
          const memBefore = (performance as any).memory?.usedJSHeapSize || 0;
          return { memBefore };
        },
        teardown({ memBefore }) {
          const memAfter = (performance as any).memory?.usedJSHeapSize || 0;
          const memUsed = memAfter - memBefore;
          console.log(JSON.stringify({
            chartType: 'pie',
            dataSize: size,
            memUsed,
          }));
        }
      });
    });
  });
});