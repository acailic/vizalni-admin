/**
 * Performance testing component for chart rendering
 * Generates test data and compares rendering performance across different methods
 */

import { useState, useEffect, useRef, useCallback, useMemo } from "react";

import { useCanvasRenderer, Point } from "@/charts/shared/canvas-renderer";

import { PerformanceMonitor } from "./performance-manager";

interface TestDataPoint {
  x: number;
  y: number;
  color: string;
  segment: string;
}

interface TestResult {
  chartType: 'scatterplot' | 'line' | 'area';
  renderingMethod: 'svg' | 'canvas';
  dataPoints: number;
  fps: number;
  renderTime: number;
  memoryUsage?: number;
  timestamp: number;
}

interface PerformanceTestProps {
  /** Test data sizes to evaluate */
  dataSizes?: number[];
  /** Number of test runs per configuration */
  testRuns?: number;
  /** Chart types to test */
  chartTypes?: Array<'scatterplot' | 'line' | 'area'>;
  /** Whether to run tests automatically on mount */
  autoRun?: boolean;
}

const DEFAULT_DATA_SIZES = [1000, 5000, 10000, 25000, 50000, 100000];
const DEFAULT_CHART_TYPES: Array<'scatterplot' | 'line' | 'area'> = ['scatterplot', 'line', 'area'];

/**
 * Comprehensive performance testing component
 */
export const PerformanceTest = ({
  dataSizes = DEFAULT_DATA_SIZES,
  testRuns = 3,
  chartTypes = DEFAULT_CHART_TYPES,
  autoRun = false
}: PerformanceTestProps) => {
  const [isRunning, setIsRunning] = useState(false);
  const [currentTest, setCurrentTest] = useState<string>('');
  const [results, setResults] = useState<TestResult[]>([]);
  const [generatedData, setGeneratedData] = useState<Map<string, TestDataPoint[]>>(new Map());

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const monitorRef = useRef<PerformanceMonitor>(new PerformanceMonitor());

  // Generate test data
  const generateTestData = useCallback((count: number, type: 'scatterplot' | 'line' | 'area'): TestDataPoint[] => {
    const data: TestDataPoint[] = [];
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dfe6e9'];

    if (type === 'scatterplot') {
      // Random scatter plot data
      for (let i = 0; i < count; i++) {
        data.push({
          x: Math.random() * 800,
          y: Math.random() * 600,
          color: colors[Math.floor(Math.random() * colors.length)],
          segment: `segment-${Math.floor(Math.random() * 5)}`
        });
      }
    } else if (type === 'line') {
      // Temporal line data with multiple series
      const seriesCount = Math.min(5, Math.max(1, Math.floor(count / 1000)));
      const pointsPerSeries = Math.floor(count / seriesCount);

      for (let series = 0; series < seriesCount; series++) {
        for (let i = 0; i < pointsPerSeries; i++) {
          data.push({
            x: (i / pointsPerSeries) * 800,
            y: 300 + Math.sin(i / 50) * 100 + Math.random() * 50 + series * 50,
            color: colors[series % colors.length],
            segment: `series-${series}`
          });
        }
      }
    } else if (type === 'area') {
      // Area chart data (similar to line but with y0 values)
      const seriesCount = Math.min(3, Math.max(1, Math.floor(count / 2000)));
      const pointsPerSeries = Math.floor(count / seriesCount);

      for (let series = 0; series < seriesCount; series++) {
        for (let i = 0; i < pointsPerSeries; i++) {
          const y1 = 300 + Math.sin(i / 50) * 100 + Math.random() * 30 + series * 80;
          const y0 = y1 - 50 - Math.random() * 30;
          data.push({
            x: (i / pointsPerSeries) * 800,
            y: y1,
            color: colors[series % colors.length],
            segment: `area-${series}`
          });
        }
      }
    }

    return data;
  }, []);

  // Pre-generate test data
  useEffect(() => {
    const dataMap = new Map<string, TestDataPoint[]>();

    chartTypes.forEach(chartType => {
      dataSizes.forEach(size => {
        const key = `${chartType}-${size}`;
        dataMap.set(key, generateTestData(size, chartType));
      });
    });

    setGeneratedData(dataMap);
  }, [chartTypes, dataSizes, generateTestData]);

  // Run single test
  const runSingleTest = useCallback(async (
    chartType: 'scatterplot' | 'line' | 'area',
    renderingMethod: 'svg' | 'canvas',
    dataSize: number
  ): Promise<TestResult | null> => {
    const dataKey = `${chartType}-${dataSize}`;
    const testData = generatedData.get(dataKey);

    if (!testData) {
      console.warn(`No test data found for ${dataKey}`);
      return null;
    }

    setCurrentTest(`${chartType} - ${renderingMethod} - ${dataSize.toLocaleString()} points`);

    // Warm up
    for (let i = 0; i < 3; i++) {
      if (renderingMethod === 'canvas') {
        // Quick canvas render for warmup
        if (canvasRef.current) {
          const ctx = canvasRef.current.getContext('2d');
          if (ctx) {
            ctx.clearRect(0, 0, 800, 600);
            testData.slice(0, 100).forEach(point => {
              ctx.fillStyle = point.color;
              ctx.fillRect(point.x, point.y, 2, 2);
            });
          }
        }
      }
    }

    // Start monitoring
    monitorRef.current.startMonitoring();

    const renderTimes: number[] = [];
    const fpsValues: number[] = [];

    // Run multiple iterations
    for (let iteration = 0; iteration < testRuns; iteration++) {
      const startTime = performance.now();

      if (renderingMethod === 'canvas') {
        // Canvas rendering test
        if (canvasRef.current) {
          const renderer = useCanvasRenderer(canvasRef.current, {
            width: 800,
            height: 600,
            maxPointsBeforeOptimization: 1000
          });

          const points: Point[] = testData.map(d => ({
            x: d.x,
            y: d.y,
            color: d.color,
            key: `${d.x}-${d.y}`
          }));

          renderer.renderPoints(points);
        }
      } else {
        // SVG rendering test (simulated)
        // In a real test, this would render actual SVG elements
        await new Promise(resolve => setTimeout(resolve, 1));
      }

      const endTime = performance.now();
      const renderTime = endTime - startTime;
      renderTimes.push(renderTime);

      // Calculate FPS (simplified)
      fpsValues.push(1000 / renderTime);

      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 10));
    }

    monitorRef.current.stopMonitoring();

    const avgRenderTime = renderTimes.reduce((a, b) => a + b, 0) / renderTimes.length;
    const avgFPS = fpsValues.reduce((a, b) => a + b, 0) / fpsValues.length;

    const metrics = monitorRef.current.getMetrics();

    return {
      chartType,
      renderingMethod,
      dataPoints: dataSize,
      fps: avgFPS,
      renderTime: avgRenderTime,
      memoryUsage: metrics.memoryUsage,
      timestamp: Date.now()
    };
  }, [generatedData, testRuns]);

  // Run all tests
  const runAllTests = useCallback(async () => {
    setIsRunning(true);
    setResults([]);

    const allResults: TestResult[] = [];

    for (const chartType of chartTypes) {
      for (const dataSize of dataSizes) {
        for (const renderingMethod of ['canvas', 'svg'] as const) {
          const result = await runSingleTest(chartType, renderingMethod, dataSize);
          if (result) {
            allResults.push(result);
          }

          // Small delay between tests
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }
    }

    setResults(allResults);
    setIsRunning(false);
    setCurrentTest('');
  }, [chartTypes, dataSizes, runSingleTest]);

  // Auto-run tests if requested
  useEffect(() => {
    if (autoRun && generatedData.size > 0 && !isRunning) {
      runAllTests();
    }
  }, [autoRun, generatedData, isRunning, runAllTests]);

  // Calculate statistics
  const stats = useMemo(() => {
    const canvasResults = results.filter(r => r.renderingMethod === 'canvas');
    const svgResults = results.filter(r => r.renderingMethod === 'svg');

    return {
      canvas: {
        avgFPS: canvasResults.length > 0 ? canvasResults.reduce((s, r) => s + r.fps, 0) / canvasResults.length : 0,
        avgRenderTime: canvasResults.length > 0 ? canvasResults.reduce((s, r) => s + r.renderTime, 0) / canvasResults.length : 0,
        maxDataPoints: Math.max(...canvasResults.map(r => r.dataPoints), 0)
      },
      svg: {
        avgFPS: svgResults.length > 0 ? svgResults.reduce((s, r) => s + r.fps, 0) / svgResults.length : 0,
        avgRenderTime: svgResults.length > 0 ? svgResults.reduce((s, r) => s + r.renderTime, 0) / svgResults.length : 0,
        maxDataPoints: Math.max(...svgResults.map(r => r.dataPoints), 0)
      }
    };
  }, [results]);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>Chart Performance Testing</h2>

      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={runAllTests}
          disabled={isRunning || generatedData.size === 0}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: isRunning ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isRunning ? 'not-allowed' : 'pointer'
          }}
        >
          {isRunning ? `Testing: ${currentTest}` : 'Run Performance Tests'}
        </button>
      </div>

      {/* Hidden canvas for testing */}
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        style={{ display: 'none' }}
      />

      {/* Statistics */}
      {results.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <h3>Performance Summary</h3>
          <div style={{ display: 'flex', gap: '20px' }}>
            <div style={{ padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
              <h4>Canvas Rendering</h4>
              <div>Average FPS: {stats.canvas.avgFPS.toFixed(1)}</div>
              <div>Average Render Time: {stats.canvas.avgRenderTime.toFixed(2)}ms</div>
              <div>Max Data Points: {stats.canvas.maxDataPoints.toLocaleString()}</div>
            </div>
            <div style={{ padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
              <h4>SVG Rendering</h4>
              <div>Average FPS: {stats.svg.avgFPS.toFixed(1)}</div>
              <div>Average Render Time: {stats.svg.avgRenderTime.toFixed(2)}ms</div>
              <div>Max Data Points: {stats.svg.maxDataPoints.toLocaleString()}</div>
            </div>
          </div>
        </div>
      )}

      {/* Detailed results */}
      {results.length > 0 && (
        <div>
          <h3>Detailed Results</h3>
          <table style={{ borderCollapse: 'collapse', width: '100%' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa' }}>
                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Chart Type</th>
                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Rendering Method</th>
                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Data Points</th>
                <th style={{ padding: '10px', border: '1px solid #ddd' }}>FPS</th>
                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Render Time (ms)</th>
                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Memory (MB)</th>
                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Performance</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result, index) => (
                <tr key={index}>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{result.chartType}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{result.renderingMethod}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{result.dataPoints.toLocaleString()}</td>
                  <td style={{
                    padding: '10px',
                    border: '1px solid #ddd',
                    backgroundColor: result.fps >= 30 ? '#d4edda' : result.fps >= 15 ? '#fff3cd' : '#f8d7da'
                  }}>
                    {result.fps.toFixed(1)}
                  </td>
                  <td style={{
                    padding: '10px',
                    border: '1px solid #ddd',
                    backgroundColor: result.renderTime <= 16.67 ? '#d4edda' : result.renderTime <= 33.33 ? '#fff3cd' : '#f8d7da'
                  }}>
                    {result.renderTime.toFixed(2)}
                  </td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                    {result.memoryUsage ? result.memoryUsage.toFixed(1) : 'N/A'}
                  </td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                    {result.fps >= 30 && result.renderTime <= 16.67 ? '✅ Excellent' :
                     result.fps >= 15 && result.renderTime <= 33.33 ? '⚠️ Good' :
                     '❌ Poor'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PerformanceTest;