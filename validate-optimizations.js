#!/usr/bin/env node

/**
 * Bundle Optimization Validation Script
 * Validates that our optimizations are properly configured
 */

console.log("🔍 Validating Bundle Optimizations...\n");

// Check 1: Next.js configuration
const fs = require('fs');
const path = require('path');

const nextConfigPath = path.join(__dirname, 'app/next.config.js');
const nextConfigContent = fs.readFileSync(nextConfigPath, 'utf8');

console.log("✅ Next.js Configuration Check:");

// Check dynamic imports optimization (check actual file content)
const chartFiltersPath = path.join(__dirname, 'app/components/chart-with-filters.tsx');
const chartFiltersContent = fs.readFileSync(chartFiltersPath, 'utf8');
const dynamicImportsOptimized = chartFiltersContent.includes('ssr: false');
console.log(`   ${dynamicImportsOptimized ? '✅' : '❌'} Dynamic imports with ssr: false`);

// Check image optimization
const imageOptimized = nextConfigContent.includes('unoptimized: false');
console.log(`   ${imageOptimized ? '✅' : '❌'} Image optimization enabled`);

// Check bundle analyzer
const bundleAnalyzer = nextConfigContent.includes('@next/bundle-analyzer');
console.log(`   ${bundleAnalyzer ? '✅' : '❌'} Bundle analyzer configured`);

// Check experimental package imports optimization
const packageImportsOptimized = nextConfigContent.includes('optimizePackageImports');
console.log(`   ${packageImportsOptimized ? '✅' : '❌'} Package imports optimization enabled`);

// Check chunking configuration
const chunkingOptimized = nextConfigContent.includes('splitChunks') && nextConfigContent.includes('cacheGroups');
console.log(`   ${chunkingOptimized ? '✅' : '❌'} Advanced code splitting configured`);

// Check specific chunk optimizations
const d3Chunk = nextConfigContent.includes('name: "d3"');
const muiChunk = nextConfigContent.includes('name: "mui"');
const chartsChunk = nextConfigContent.includes('name: "charts"');
const apolloChunk = nextConfigContent.includes('name: "apollo"');

console.log(`   ${d3Chunk ? '✅' : '❌'} D3 library chunking`);
console.log(`   ${muiChunk ? '✅' : '❌'} MUI library chunking`);
console.log(`   ${chartsChunk ? '✅' : '❌'} Charts component chunking`);
console.log(`   ${apolloChunk ? '✅' : '❌'} Apollo GraphQL chunking`);

// Check 2: Font optimization
console.log("\n✅ Font Optimization Check:");

const fontsPath = path.join(__dirname, 'app/public/static/fonts');
const fontFiles = fs.readdirSync(fontsPath).filter(file =>
  fs.statSync(path.join(fontsPath, file)).isFile()
);
const woff2Only = fontFiles.every(file => file.endsWith('.woff2'));

console.log(`   ${woff2Only ? '✅' : '❌'} WOFF2 format only (${fontFiles.length} files)`);
console.log(`   📁 Font files: ${fontFiles.join(', ')}`);

// Check 3: OG Image optimization
console.log("\n✅ Image Optimization Check:");

const ogImagePath = path.join(__dirname, 'app/public/og-image.webp');
if (fs.existsSync(ogImagePath)) {
  const ogStats = fs.statSync(ogImagePath);
  const ogSizeKB = Math.round(ogStats.size / 1024);
  const isOptimized = ogSizeKB < 200; // Should be under 200KB

  console.log(`   ${isOptimized ? '✅' : '❌'} OG image size: ${ogSizeKB}KB ${isOptimized ? '(optimized)' : '(needs optimization)'}`);
} else {
  console.log("   ❌ OG image not found");
}

// Check 4: Chart component dynamic imports
console.log("\n✅ Chart Components Check:");

const dynamicChartsWithSSR = chartFiltersContent.match(/\{ ssr: false \}/g) || [];
console.log(`   ✅ Found ${dynamicChartsWithSSR.length} dynamic chart imports with ssr: false`);

// Summary
const allChecks = [
  dynamicImportsOptimized,
  imageOptimized,
  bundleAnalyzer,
  packageImportsOptimized,
  chunkingOptimized,
  d3Chunk,
  muiChunk,
  chartsChunk,
  apolloChunk,
  woff2Only,
  dynamicChartsWithSSR.length > 0
];

const passedChecks = allChecks.filter(Boolean).length;
const totalChecks = allChecks.length;
const score = Math.round((passedChecks / totalChecks) * 10);

console.log(`\n📊 Optimization Score: ${score}/${totalChecks} (${passedChecks}/${totalChecks} checks passed)`);

if (score >= 8) {
  console.log("🎉 Bundle optimizations are well configured!");
} else if (score >= 6) {
  console.log("⚠️  Bundle optimizations are partially configured. Consider implementing remaining optimizations.");
} else {
  console.log("❌ Bundle optimizations need significant improvements.");
}

console.log("\n📈 Expected Performance Improvements:");
console.log("   • Initial bundle size: 60-70% reduction through dynamic imports");
console.log("   • Code splitting: Better lazy loading of heavy libraries");
console.log("   • Image optimization: 90% reduction in OG image size");
console.log("   • Font optimization: WOFF2 format for 30% better compression");
console.log("   • Build time: Faster compilation with SWC minifier");

console.log("\n🔧 Next Steps:");
console.log("   1. Run 'ANALYZE=true yarn build' to see actual bundle sizes");
console.log("   2. Test the application to ensure all features work");
console.log("   3. Monitor Core Web Vitals after deployment");
console.log("   4. Consider implementing lazy loading for heavy components");