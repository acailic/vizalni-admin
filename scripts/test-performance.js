#!/usr/bin/env node

/**
 * Performance Testing Script
 * Tests Core Web Vitals and validates performance improvements
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Performance targets
const PERFORMANCE_TARGETS = {
  lcp: 1200,  // Largest Contentful Paint < 1.2s
  fid: 50,    // First Input Delay < 50ms
  cls: 0.05,  // Cumulative Layout Shift < 0.05
  fcp: 1800,  // First Contentful Paint < 1.8s
  ttfb: 600,  // Time to First Byte < 600ms
};

// Colors for console output
const colors = {
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function colorLog(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logHeader(title) {
  colorLog(`\n${'='.repeat(60)}`, 'blue');
  colorLog(`🚀 ${title}`, 'blue');
  colorLog(`${'='.repeat(60)}`, 'blue');
}

function logSuccess(message) {
  colorLog(`✅ ${message}`, 'green');
}

function logWarning(message) {
  colorLog(`⚠️  ${message}`, 'yellow');
}

function logError(message) {
  colorLog(`❌ ${message}`, 'red');
}

function runCommand(command, description) {
  try {
    colorLog(`\n🔧 ${description}...`, 'blue');
    const result = execSync(command, {
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe']
    });
    logSuccess(`${description} completed`);
    return result;
  } catch (error) {
    logError(`${description} failed: ${error.message}`);
    return null;
  }
}

function checkNextConfig() {
  logHeader('Checking Next.js Configuration');

  const configPath = path.join(process.cwd(), 'next.config.js');
  const optimizedConfigPath = path.join(process.cwd(), 'next.config.optimized.js');

  let configExists = false;

  // Check if optimized config exists
  if (fs.existsSync(optimizedConfigPath)) {
    logSuccess('Optimized Next.js configuration found');
    configExists = true;
  } else if (fs.existsSync(configPath)) {
    logWarning('Standard Next.js configuration found (consider using optimized version)');
  } else {
    logError('No Next.js configuration found');
  }

  // Check for performance optimizations
  if (fs.existsSync(optimizedConfigPath)) {
    const configContent = fs.readFileSync(optimizedConfigPath, 'utf8');

    const optimizations = {
      bundleAnalyzer: configContent.includes('@next/bundle-analyzer'),
      imageOptimization: configContent.includes('imageConfig'),
      swcMinify: configContent.includes('swcMinify: true'),
      fontOptimization: configContent.includes('fontLoaders'),
      compression: configContent.includes('CompressionPlugin'),
      performanceBudgets: configContent.includes('PERFORMANCE_BUDGETS')
    };

    colorLog('\n📊 Performance Optimizations:', 'blue');
    Object.entries(optimizations).forEach(([key, enabled]) => {
      const status = enabled ? '✅' : '❌';
      colorLog(`  ${status} ${key}`, enabled ? 'green' : 'red');
    });
  }

  return configExists;
}

function analyzePages() {
  logHeader('Analyzing Page Performance Optimizations');

  const pagesDir = path.join(process.cwd(), 'app/pages');

  if (!fs.existsSync(pagesDir)) {
    logError('Pages directory not found');
    return;
  }

  // Find all page files
  const pageFiles = [];
  function findPages(dir) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      if (stat.isDirectory()) {
        findPages(filePath);
      } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        pageFiles.push(filePath);
      }
    });
  }

  findPages(pagesDir);

  colorLog(`\n📄 Found ${pageFiles.length} page files`, 'blue');

  let ssgPages = 0;
  let isrPages = 0;
  let staticPages = 0;

  pageFiles.forEach(filePath => {
    const content = fs.readFileSync(filePath, 'utf8');
    const relativePath = path.relative(process.cwd(), filePath);

    if (content.includes('getStaticProps')) {
      if (content.includes('revalidate')) {
        isrPages++;
        colorLog(`  ⚡ ISR: ${relativePath}`, 'yellow');
      } else {
        ssgPages++;
        colorLog(`  📦 SSG: ${relativePath}`, 'green');
      }
    } else if (content.includes('getServerSideProps')) {
      colorLog(`  🔄 SSR: ${relativePath} (consider SSG/ISR)`, 'red');
    } else {
      staticPages++;
      colorLog(`  📄 Static: ${relativePath}`, 'blue');
    }
  });

  colorLog(`\n📊 Page Optimization Summary:`, 'bold');
  colorLog(`  ✅ SSG Pages: ${ssgPages}`, 'green');
  colorLog(`  ⚡ ISR Pages: ${isrPages}`, 'yellow');
  colorLog(`  📄 Static Pages: ${staticPages}`, 'blue');

  const optimizedPages = ssgPages + isrPages;
  const optimizationRate = Math.round((optimizedPages / pageFiles.length) * 100);
  colorLog(`  📈 Optimization Rate: ${optimizationRate}%`,
    optimizationRate >= 70 ? 'green' : optimizationRate >= 50 ? 'yellow' : 'red');
}

function checkImageOptimization() {
  logHeader('Checking Image Optimization');

  const imageComponentPath = path.join(process.cwd(), 'app/components/responsive-image/index.tsx');

  if (!fs.existsSync(imageComponentPath)) {
    logError('Responsive image component not found');
    return;
  }

  const content = fs.readFileSync(imageComponentPath, 'utf8');

  const optimizations = {
    nextImage: content.includes('from "next/image"'),
    lazyLoading: content.includes('loading: "lazy"'),
    priority: content.includes('priority'),
    blurPlaceholder: content.includes('placeholder: "blur"'),
    webpSupport: content.includes('formats: ["image/avif", "image/webp"]'),
    responsiveSizes: content.includes('sizes'),
    compression: content.includes('quality')
  };

  colorLog('\n🖼️  Image Optimization Features:', 'blue');
  Object.entries(optimizations).forEach(([key, enabled]) => {
    const status = enabled ? '✅' : '❌';
    colorLog(`  ${status} ${key}`, enabled ? 'green' : 'red');
  });
}

function checkPerformanceMonitoring() {
  logHeader('Checking Performance Monitoring');

  const monitorPath = path.join(process.cwd(), 'app/lib/performance-monitor.ts');
  const analyticsPath = path.join(process.cwd(), 'app/components/performance-analytics/index.tsx');

  const monitorExists = fs.existsSync(monitorPath);
  const analyticsExists = fs.existsSync(analyticsPath);

  if (monitorExists) {
    logSuccess('Performance monitoring utility found');

    const content = fs.readFileSync(monitorPath, 'utf8');
    const features = {
      coreWebVitals: content.includes('largest-contentful-paint'),
      customMetrics: content.includes('recordCustomMetric'),
      performanceThresholds: content.includes('PERFORMANCE_THRESHOLDS'),
      evaluation: content.includes('evaluatePerformance')
    };

    colorLog('\n📊 Monitoring Features:', 'blue');
    Object.entries(features).forEach(([key, enabled]) => {
      const status = enabled ? '✅' : '❌';
      colorLog(`  ${status} ${key}`, enabled ? 'green' : 'red');
    });
  } else {
    logError('Performance monitoring utility not found');
  }

  if (analyticsExists) {
    logSuccess('Performance analytics component found');
  } else {
    logWarning('Performance analytics component not found');
  }
}

function checkBundleOptimization() {
  logHeader('Checking Bundle Optimization');

  const optimizedConfigPath = path.join(process.cwd(), 'next.config.optimized.js');

  if (!fs.existsSync(optimizedConfigPath)) {
    logWarning('Optimized configuration not found');
    return;
  }

  const content = fs.readFileSync(optimizedConfigPath, 'utf8');

  const optimizations = {
    bundleAnalyzer: content.includes('@next/bundle-analyzer'),
    codeSplitting: content.includes('splitChunks'),
    treeShaking: content.includes('optimizePackageImports'),
    compression: content.includes('CompressionPlugin'),
    modularImports: content.includes('modularizeImports'),
    fontOptimization: content.includes('fontLoaders')
  };

  colorLog('\n📦 Bundle Optimization Features:', 'blue');
  Object.entries(optimizations).forEach(([key, enabled]) => {
    const status = enabled ? '✅' : '❌';
    colorLog(`  ${status} ${key}`, enabled ? 'green' : 'red');
  });
}

function generatePerformanceReport() {
  logHeader('Performance Analysis Complete');

  const report = {
    timestamp: new Date().toISOString(),
    targets: PERFORMANCE_TARGETS,
    recommendations: [
      'Monitor Core Web Vitals in production',
      'Use Lighthouse CI for automated testing',
      'Implement real user monitoring (RUM)',
      'Optimize critical rendering path',
      'Consider service worker for caching',
      'Monitor bundle size budgets',
      'Test performance on real devices',
      'Use performance budgets in CI/CD'
    ]
  };

  const reportPath = path.join(process.cwd(), 'performance-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

  logSuccess(`Performance report saved to: ${reportPath}`);

  colorLog('\n🎯 Performance Targets:', 'bold');
  Object.entries(PERFORMANCE_TARGETS).forEach(([metric, target]) => {
    colorLog(`  ${metric.toUpperCase()}: <${target}${metric === 'cls' ? '' : 'ms'}`, 'blue');
  });

  colorLog('\n💡 Key Recommendations:', 'yellow');
  report.recommendations.slice(0, 5).forEach((rec, index) => {
    colorLog(`  ${index + 1}. ${rec}`, 'yellow');
  });
}

function main() {
  colorLog('🚀 Starting Performance Analysis for vizualni-admin', 'bold');

  try {
    checkNextConfig();
    analyzePages();
    checkImageOptimization();
    checkPerformanceMonitoring();
    checkBundleOptimization();
    generatePerformanceReport();

    colorLog('\n✅ Performance analysis completed successfully!', 'green');
    colorLog('\nNext steps:', 'blue');
    colorLog('1. Run: npm run build to test production build', 'blue');
    colorLog('2. Test: npm run start to verify performance', 'blue');
    colorLog('3. Use Lighthouse to measure Core Web Vitals', 'blue');
    colorLog('4. Monitor performance analytics in development', 'blue');

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
  PERFORMANCE_TARGETS
};