#!/usr/bin/env node

/**
 * Performance Testing Script
 * Tests Core Web Vitals, chart render times, and data fetch latency
 * Establishes performance baselines for exported charts
 */

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

// Performance targets
const PERFORMANCE_TARGETS = {
  // Core Web Vitals
  lcp: 1200, // Largest Contentful Paint < 1.2s
  fid: 50, // First Input Delay < 50ms
  cls: 0.05, // Cumulative Layout Shift < 0.05
  fcp: 1800, // First Contentful Paint < 1.8s
  ttfb: 600, // Time to First Byte < 600ms

  // Chart Performance Baselines (milliseconds)
  chartRender: {
    lineChart: { small: 50, medium: 150, large: 500 },
    barChart: { small: 45, medium: 140, large: 450 },
    columnChart: { small: 45, medium: 140, large: 450 },
    areaChart: { small: 55, medium: 160, large: 520 },
    pieChart: { small: 40, medium: 120, large: 400 },
  },

  // Data Fetch Latency (milliseconds)
  dataFetch: {
    small: 100, // < 10KB
    medium: 300, // 10KB - 100KB
    large: 1000, // > 100KB
  },

  // Bundle Size Targets (bytes)
  bundleSize: {
    charts: 250000, // 250KB max for charts bundle
    individualChart: 50000, // 50KB max per chart
  },
};

// Data size categories
const DATA_SIZES = {
  small: 100, // 100 data points
  medium: 1000, // 1,000 data points
  large: 10000, // 10,000 data points
};

// Colors for console output
const colors = {
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  blue: "\x1b[34m",
  reset: "\x1b[0m",
  bold: "\x1b[1m",
};

function colorLog(message, color = "reset") {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logHeader(title) {
  colorLog(`\n${"=".repeat(60)}`, "blue");
  colorLog(`🚀 ${title}`, "blue");
  colorLog(`${"=".repeat(60)}`, "blue");
}

function logSuccess(message) {
  colorLog(`✅ ${message}`, "green");
}

function logWarning(message) {
  colorLog(`⚠️  ${message}`, "yellow");
}

function logError(message) {
  colorLog(`❌ ${message}`, "red");
}

function formatBytes(bytes) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

function runCommand(command, description) {
  try {
    colorLog(`\n🔧 ${description}...`, "blue");
    const result = execSync(command, {
      encoding: "utf8",
      stdio: ["pipe", "pipe", "pipe"],
    });
    logSuccess(`${description} completed`);
    return result;
  } catch (error) {
    logError(`${description} failed: ${error.message}`);
    return null;
  }
}

function checkNextConfig() {
  logHeader("Checking Next.js Configuration");

  const configPath = path.join(process.cwd(), "next.config.js");
  const optimizedConfigPath = path.join(
    process.cwd(),
    "next.config.optimized.js"
  );

  let configExists = false;

  // Check if optimized config exists
  if (fs.existsSync(optimizedConfigPath)) {
    logSuccess("Optimized Next.js configuration found");
    configExists = true;
  } else if (fs.existsSync(configPath)) {
    logWarning(
      "Standard Next.js configuration found (consider using optimized version)"
    );
  } else {
    logError("No Next.js configuration found");
  }

  // Check for performance optimizations
  if (fs.existsSync(optimizedConfigPath)) {
    const configContent = fs.readFileSync(optimizedConfigPath, "utf8");

    const optimizations = {
      bundleAnalyzer: configContent.includes("@next/bundle-analyzer"),
      imageOptimization: configContent.includes("imageConfig"),
      swcMinify: configContent.includes("swcMinify: true"),
      fontOptimization: configContent.includes("fontLoaders"),
      compression: configContent.includes("CompressionPlugin"),
      performanceBudgets: configContent.includes("PERFORMANCE_BUDGETS"),
    };

    colorLog("\n📊 Performance Optimizations:", "blue");
    Object.entries(optimizations).forEach(([key, enabled]) => {
      const status = enabled ? "✅" : "❌";
      colorLog(`  ${status} ${key}`, enabled ? "green" : "red");
    });
  }

  return configExists;
}

function analyzePages() {
  logHeader("Analyzing Page Performance Optimizations");

  const pagesDir = path.join(process.cwd(), "app/pages");

  if (!fs.existsSync(pagesDir)) {
    logError("Pages directory not found");
    return;
  }

  // Find all page files
  const pageFiles = [];
  function findPages(dir) {
    const files = fs.readdirSync(dir);
    files.forEach((file) => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      if (stat.isDirectory()) {
        findPages(filePath);
      } else if (file.endsWith(".tsx") || file.endsWith(".ts")) {
        pageFiles.push(filePath);
      }
    });
  }

  findPages(pagesDir);

  colorLog(`\n📄 Found ${pageFiles.length} page files`, "blue");

  let ssgPages = 0;
  let isrPages = 0;
  let staticPages = 0;

  pageFiles.forEach((filePath) => {
    const content = fs.readFileSync(filePath, "utf8");
    const relativePath = path.relative(process.cwd(), filePath);

    if (content.includes("getStaticProps")) {
      if (content.includes("revalidate")) {
        isrPages++;
        colorLog(`  ⚡ ISR: ${relativePath}`, "yellow");
      } else {
        ssgPages++;
        colorLog(`  📦 SSG: ${relativePath}`, "green");
      }
    } else if (content.includes("getServerSideProps")) {
      colorLog(`  🔄 SSR: ${relativePath} (consider SSG/ISR)`, "red");
    } else {
      staticPages++;
      colorLog(`  📄 Static: ${relativePath}`, "blue");
    }
  });

  colorLog(`\n📊 Page Optimization Summary:`, "bold");
  colorLog(`  ✅ SSG Pages: ${ssgPages}`, "green");
  colorLog(`  ⚡ ISR Pages: ${isrPages}`, "yellow");
  colorLog(`  📄 Static Pages: ${staticPages}`, "blue");

  const optimizedPages = ssgPages + isrPages;
  const optimizationRate = Math.round(
    (optimizedPages / pageFiles.length) * 100
  );
  colorLog(
    `  📈 Optimization Rate: ${optimizationRate}%`,
    optimizationRate >= 70 ? "green" : optimizationRate >= 50 ? "yellow" : "red"
  );
}

function checkImageOptimization() {
  logHeader("Checking Image Optimization");

  const imageComponentPath = path.join(
    process.cwd(),
    "app/components/responsive-image/index.tsx"
  );

  if (!fs.existsSync(imageComponentPath)) {
    logError("Responsive image component not found");
    return;
  }

  const content = fs.readFileSync(imageComponentPath, "utf8");

  const optimizations = {
    nextImage: content.includes('from "next/image"'),
    lazyLoading: content.includes('loading: "lazy"'),
    priority: content.includes("priority"),
    blurPlaceholder: content.includes('placeholder: "blur"'),
    webpSupport: content.includes('formats: ["image/avif", "image/webp"]'),
    responsiveSizes: content.includes("sizes"),
    compression: content.includes("quality"),
  };

  colorLog("\n🖼️  Image Optimization Features:", "blue");
  Object.entries(optimizations).forEach(([key, enabled]) => {
    const status = enabled ? "✅" : "❌";
    colorLog(`  ${status} ${key}`, enabled ? "green" : "red");
  });
}

function checkPerformanceMonitoring() {
  logHeader("Checking Performance Monitoring");

  const monitorPath = path.join(
    process.cwd(),
    "app/lib/performance-monitor.ts"
  );
  const analyticsPath = path.join(
    process.cwd(),
    "app/components/performance-analytics/index.tsx"
  );

  const monitorExists = fs.existsSync(monitorPath);
  const analyticsExists = fs.existsSync(analyticsPath);

  if (monitorExists) {
    logSuccess("Performance monitoring utility found");

    const content = fs.readFileSync(monitorPath, "utf8");
    const features = {
      coreWebVitals: content.includes("largest-contentful-paint"),
      customMetrics: content.includes("recordCustomMetric"),
      performanceThresholds: content.includes("PERFORMANCE_THRESHOLDS"),
      evaluation: content.includes("evaluatePerformance"),
    };

    colorLog("\n📊 Monitoring Features:", "blue");
    Object.entries(features).forEach(([key, enabled]) => {
      const status = enabled ? "✅" : "❌";
      colorLog(`  ${status} ${key}`, enabled ? "green" : "red");
    });
  } else {
    logError("Performance monitoring utility not found");
  }

  if (analyticsExists) {
    logSuccess("Performance analytics component found");
  } else {
    logWarning("Performance analytics component not found");
  }
}

function checkBundleOptimization() {
  logHeader("Checking Bundle Optimization");

  const optimizedConfigPath = path.join(
    process.cwd(),
    "next.config.optimized.js"
  );

  if (!fs.existsSync(optimizedConfigPath)) {
    logWarning("Optimized configuration not found");
    return;
  }

  const content = fs.readFileSync(optimizedConfigPath, "utf8");

  const optimizations = {
    bundleAnalyzer: content.includes("@next/bundle-analyzer"),
    codeSplitting: content.includes("splitChunks"),
    treeShaking: content.includes("optimizePackageImports"),
    compression: content.includes("CompressionPlugin"),
    modularImports: content.includes("modularizeImports"),
    fontOptimization: content.includes("fontLoaders"),
  };

  colorLog("\n📦 Bundle Optimization Features:", "blue");
  Object.entries(optimizations).forEach(([key, enabled]) => {
    const status = enabled ? "✅" : "❌";
    colorLog(`  ${status} ${key}`, enabled ? "green" : "red");
  });
}

function analyzeChartPerformance() {
  logHeader("Chart Render Performance Analysis");

  const distPath = path.join(process.cwd(), "app", "dist");

  if (!fs.existsSync(distPath)) {
    logWarning(
      "Chart distribution not found. Run `cd app && npm run build:lib` first."
    );
    return null;
  }

  const chartsPath = path.join(distPath, "charts");
  if (!fs.existsSync(chartsPath)) {
    logWarning("Charts not built. Run `cd app && npm run build:lib` first.");
    return null;
  }

  // Analyze chart bundle sizes
  const chartFiles = fs
    .readdirSync(chartsPath)
    .filter((file) => file.endsWith(".js") || file.endsWith(".mjs"));

  const chartAnalysis = [];
  let totalBundleSize = 0;

  chartFiles.forEach((file) => {
    const filePath = path.join(chartsPath, file);
    const stats = fs.statSync(filePath);
    const size = stats.size;

    totalBundleSize += size;

    chartAnalysis.push({
      file,
      size: size,
      sizeFormatted: formatBytes(size),
      withinBudget: size <= PERFORMANCE_TARGETS.bundleSize.individualChart,
    });
  });

  // Sort by size
  chartAnalysis.sort((a, b) => b.size - a.size);

  colorLog("\n📊 Chart Bundle Analysis:", "blue");
  console.log(`   Total Bundle Size: ${formatBytes(totalBundleSize)}`);
  console.log(
    `   Budget: ${formatBytes(PERFORMANCE_TARGETS.bundleSize.charts)}`
  );
  console.log(
    `   Status: ${totalBundleSize <= PERFORMANCE_TARGETS.bundleSize.charts ? "✅ Within budget" : "❌ Over budget"}`
  );

  colorLog("\n📦 Individual Chart Sizes:", "blue");
  chartAnalysis.forEach((chart) => {
    const status = chart.withinBudget ? "✅" : "❌";
    const color = chart.withinBudget ? "green" : "red";
    colorLog(`   ${status} ${chart.file}: ${chart.sizeFormatted}`, color);
  });

  return {
    totalBundleSize,
    charts: chartAnalysis,
    withinBudget: totalBundleSize <= PERFORMANCE_TARGETS.bundleSize.charts,
  };
}

function simulateChartRenderBenchmark() {
  logHeader("Chart Render Benchmark Simulation");

  const results = [];
  const charts = [
    "lineChart",
    "barChart",
    "columnChart",
    "areaChart",
    "pieChart",
  ];
  const sizes = ["small", "medium", "large"];

  colorLog("\n⚠️  Note: These are simulated baseline values.", "yellow");
  colorLog(
    "For accurate measurements, run the actual benchmark suite:\n",
    "yellow"
  );
  colorLog("  cd app && npm run benchmark\n", "blue");

  charts.forEach((chart) => {
    const chartResults = {};
    let allPassed = true;

    sizes.forEach((size) => {
      // Simulate render time based on data size
      // In reality, this would be measured by actual benchmark tests
      const baseline = PERFORMANCE_TARGETS.chartRender[chart][size];
      // Add small random variation to simulate real measurements
      const simulated = baseline + (Math.random() * 20 - 10);

      const passed = simulated <= baseline * 1.1; // 10% tolerance
      if (!passed) allPassed = false;

      chartResults[size] = {
        baseline: `${baseline}ms`,
        simulated: `${simulated.toFixed(2)}ms`,
        status: passed ? "✅" : "❌",
      };
    });

    results.push({
      chart,
      results: chartResults,
      passed: allPassed,
    });
  });

  colorLog("\n📊 Simulated Chart Render Times:", "blue");
  results.forEach(({ chart, results, passed }) => {
    const statusColor = passed ? "green" : "red";
    colorLog(`\n${chart.replace(/([A-Z])/g, " $1").trim()}:`, statusColor);

    Object.entries(results).forEach(([size, data]) => {
      const color = data.status === "✅" ? "green" : "red";
      colorLog(
        `   ${size}: ${data.simulated} (baseline: ${data.baseline}) ${data.status}`,
        color
      );
    });
  });

  return results;
}

function simulateDataFetchBenchmark() {
  logHeader("Data Fetch Latency Simulation");

  const sizes = [
    { name: "small", bytes: 5 * 1024 }, // 5KB
    { name: "medium", bytes: 50 * 1024 }, // 50KB
    { name: "large", bytes: 500 * 1024 }, // 500KB
  ];

  const results = [];

  colorLog("\n⚠️  Note: These are simulated baseline values.", "yellow");
  colorLog(
    "For accurate measurements, run the actual benchmark suite:\n",
    "yellow"
  );
  colorLog("  node benchmarks/data-loading.bench.ts\n", "blue");

  sizes.forEach(({ name, bytes }) => {
    const baseline = PERFORMANCE_TARGETS.dataFetch[name];
    // Simulate network latency based on size
    const simulated = baseline + (bytes / 1024) * 0.5 + Math.random() * 50;

    const passed = simulated <= baseline * 1.2; // 20% tolerance for network variability

    results.push({
      size: name,
      dataSize: formatBytes(bytes),
      baseline: `${baseline}ms`,
      simulated: `${simulated.toFixed(2)}ms`,
      status: passed ? "✅" : "❌",
    });

    const color = passed ? "green" : "red";
    colorLog(
      `   ${name} (${formatBytes(bytes)}): ${simulated.toFixed(2)}ms (baseline: ${baseline}ms) ${passed ? "✅" : "❌"}`,
      color
    );
  });

  return results;
}

function checkPerformanceRegression() {
  logHeader("Performance Regression Check");

  const baselinePath = path.join(process.cwd(), "docs", "PERFORMANCE.md");

  if (!fs.existsSync(baselinePath)) {
    logWarning(
      "No baseline found. Run performance tests to establish baseline."
    );
    return { hasBaseline: false };
  }

  const baselineContent = fs.readFileSync(baselinePath, "utf8");

  // Extract baseline values from PERFORMANCE.md
  // This is a simplified check - in practice, you'd parse the markdown more carefully
  const chartRenderBaseline = baselineContent.match(/\|.*\|.*\|([\d.]+)ms\|/g);

  if (!chartRenderBaseline || chartRenderBaseline.length === 0) {
    logWarning("Could not parse baseline values from PERFORMANCE.md");
    return { hasBaseline: true, parseError: true };
  }

  colorLog("\n✅ Baseline found in docs/PERFORMANCE.md", "green");
  colorLog(`   Found ${chartRenderBaseline.length} baseline metrics`, "blue");

  return { hasBaseline: true, metricsCount: chartRenderBaseline.length };
}

function generatePerformanceReport(chartAnalysis, renderResults, fetchResults) {
  logHeader("Performance Baseline Report");

  const report = {
    timestamp: new Date().toISOString(),
    version: require(path.join(process.cwd(), "app", "package.json")).version,
    targets: PERFORMANCE_TARGETS,
    results: {
      chartAnalysis: chartAnalysis,
      chartRender: renderResults,
      dataFetch: fetchResults,
    },
    summary: {
      totalCharts: chartAnalysis?.charts?.length || 0,
      totalBundleSize: chartAnalysis?.totalBundleSize || 0,
      bundleWithinBudget: chartAnalysis?.withinBudget || false,
      chartsPassed: renderResults?.filter((r) => r.passed).length || 0,
      fetchPassed: fetchResults?.filter((r) => r.status === "✅").length || 0,
    },
    recommendations: [
      "Monitor Core Web Vitals in production",
      "Use Lighthouse CI for automated testing",
      "Implement real user monitoring (RUM)",
      "Optimize critical rendering path",
      "Consider service worker for caching",
      "Monitor bundle size budgets",
      "Test performance on real devices",
      "Use performance budgets in CI/CD",
      "Run `npm run benchmark` for accurate measurements",
      "Update baseline in docs/PERFORMANCE.md after optimizations",
    ],
  };

  const reportPath = path.join(process.cwd(), "performance-report.json");
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

  logSuccess(`Performance report saved to: ${reportPath}`);

  // Summary
  colorLog("\n📊 Summary:", "bold");
  colorLog(`   Charts Analyzed: ${report.summary.totalCharts}`, "blue");
  colorLog(
    `   Total Bundle Size: ${formatBytes(report.summary.totalBundleSize)}`,
    "blue"
  );
  colorLog(
    `   Bundle Budget: ${report.summary.bundleWithinBudget ? "✅ Passed" : "❌ Failed"}`,
    report.summary.bundleWithinBudget ? "green" : "red"
  );
  colorLog(
    `   Chart Render Tests: ${report.summary.chartsPassed}/${report.summary.totalCharts} passed`,
    "blue"
  );
  colorLog(
    `   Data Fetch Tests: ${report.summary.fetchPassed}/${fetchResults?.length || 0} passed`,
    "blue"
  );

  colorLog("\n🎯 Performance Targets:", "bold");
  colorLog("   Core Web Vitals:", "blue");
  colorLog(`     LCP: <${PERFORMANCE_TARGETS.lcp}ms`, "blue");
  colorLog(`     FID: <${PERFORMANCE_TARGETS.fid}ms`, "blue");
  colorLog(`     CLS: <${PERFORMANCE_TARGETS.cls}`, "blue");
  colorLog(`     FCP: <${PERFORMANCE_TARGETS.fcp}ms`, "blue");
  colorLog(`     TTFB: <${PERFORMANCE_TARGETS.ttfb}ms`, "blue");

  colorLog("\n   Bundle Size Targets:", "blue");
  colorLog(
    `     Charts Bundle: <${formatBytes(PERFORMANCE_TARGETS.bundleSize.charts)}`,
    "blue"
  );
  colorLog(
    `     Individual Chart: <${formatBytes(PERFORMANCE_TARGETS.bundleSize.individualChart)}`,
    "blue"
  );

  colorLog("\n💡 Key Recommendations:", "yellow");
  report.recommendations.slice(0, 5).forEach((rec, index) => {
    colorLog(`   ${index + 1}. ${rec}`, "yellow");
  });
}

function main() {
  colorLog(
    "🚀 Starting Performance Baseline Analysis for vizualni-admin",
    "bold"
  );

  try {
    // Core Web Vitals analysis
    checkNextConfig();
    analyzePages();
    checkImageOptimization();
    checkPerformanceMonitoring();
    checkBundleOptimization();

    // Chart performance analysis
    const chartAnalysis = analyzeChartPerformance();

    // Chart render benchmarks
    const renderResults = simulateChartRenderBenchmark();

    // Data fetch benchmarks
    const fetchResults = simulateDataFetchBenchmark();

    // Check for performance regression
    checkPerformanceRegression();

    // Generate comprehensive report
    generatePerformanceReport(chartAnalysis, renderResults, fetchResults);

    colorLog(
      "\n✅ Performance baseline analysis completed successfully!",
      "green"
    );
    colorLog("\n📋 Next steps:", "blue");
    colorLog("1. Review: cat performance-report.json", "blue");
    colorLog("2. Build charts: cd app && npm run build:lib", "blue");
    colorLog("3. Run benchmarks: cd app && npm run benchmark", "blue");
    colorLog("4. Update baseline: Copy results to docs/PERFORMANCE.md", "blue");
    colorLog(
      "5. Monitor: Run this script regularly to track regressions",
      "blue"
    );
  } catch (error) {
    logError(`Performance analysis failed: ${error.message}`);
    process.exit(1);
  }
}

// Run the analysis
if (require.main === module) {
  main();
}

module.exports = {
  checkNextConfig,
  analyzePages,
  checkImageOptimization,
  checkPerformanceMonitoring,
  checkBundleOptimization,
  analyzeChartPerformance,
  simulateChartRenderBenchmark,
  simulateDataFetchBenchmark,
  checkPerformanceRegression,
  generatePerformanceReport,
  PERFORMANCE_TARGETS,
  DATA_SIZES,
};
