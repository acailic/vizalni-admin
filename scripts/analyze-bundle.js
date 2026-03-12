#!/usr/bin/env node

/**
 * Bundle Size Analyzer Script
 * Analyzes bundle sizes and ensures they meet performance budgets
 */

const fs = require('fs');
const path = require('path');
const gzipSize = require('gzip-size');
const brotliSize = require('brotli-size');
const kleur = require('kleur');

const PERFORMANCE_BUDGETS = {
  CHUNK_SIZE_LIMIT: 250000, // 250KB per chunk
  BUNDLE_SIZE_LIMIT: 10000000, // 10MB total
  MAX_ASYNC_REQUESTS: 25,
};

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function analyzeBuildOutput(buildPath = 'app/out') {
  if (!fs.existsSync(buildPath)) {
    console.error(kleur.red(`❌ Build output not found at ${buildPath}`));
    console.log(kleur.yellow('💡 Run `yarn build:static` first'));
    process.exit(1);
  }

  const staticPath = path.join(buildPath, '_next', 'static');
  const chunks = {
    js: [],
    css: [],
    totalSize: 0,
    totalGzip: 0,
    totalBrotli: 0,
  };

  // Analyze JavaScript chunks
  const jsPath = path.join(staticPath, 'chunks');
  if (fs.existsSync(jsPath)) {
    const jsFiles = fs.readdirSync(jsPath).filter(f => f.endsWith('.js'));

    jsFiles.forEach(file => {
      const filePath = path.join(jsPath, file);
      const stat = fs.statSync(filePath);
      const content = fs.readFileSync(filePath);

      const gzip = gzipSize.sync(content);
      const brotli = brotliSize.sync(content);

      chunks.js.push({
        name: file,
        size: stat.size,
        gzip: gzip,
        brotli: brotli,
      });

      chunks.totalSize += stat.size;
      chunks.totalGzip += gzip;
      chunks.totalBrotli += brotli;
    });
  }

  // Analyze CSS chunks
  const cssPath = path.join(staticPath, 'css');
  if (fs.existsSync(cssPath)) {
    const cssFiles = fs.readdirSync(cssPath).filter(f => f.endsWith('.css'));

    cssFiles.forEach(file => {
      const filePath = path.join(cssPath, file);
      const stat = fs.statSync(filePath);
      const content = fs.readFileSync(filePath);

      const gzip = gzipSize.sync(content);
      const brotli = brotliSize.sync(content);

      chunks.css.push({
        name: file,
        size: stat.size,
        gzip: gzip,
        brotli: brotli,
      });

      chunks.totalSize += stat.size;
      chunks.totalGzip += gzip;
      chunks.totalBrotli += brotli;
    });
  }

  return chunks;
}

function checkPerformanceBudgets(chunks) {
  console.log(kleur.bold().blue('\n📊 Bundle Analysis Report\n'));

  // Check total bundle size
  console.log(kleur.bold('Total Bundle Size:'));
  console.log(`  Raw: ${kleur.cyan(formatBytes(chunks.totalSize))}`);
  console.log(`  Gzip: ${kleur.cyan(formatBytes(chunks.totalGzip))}`);
  console.log(`  Brotli: ${kleur.cyan(formatBytes(chunks.totalBrotli))}`);

  if (chunks.totalSize > PERFORMANCE_BUDGETS.BUNDLE_SIZE_LIMIT) {
    console.log(kleur.red(`  ❌ Exceeds budget of ${formatBytes(PERFORMANCE_BUDGETS.BUNDLE_SIZE_LIMIT)}`));
  } else {
    console.log(kleur.green(`  ✅ Within budget of ${formatBytes(PERFORMANCE_BUDGETS.BUNDLE_SIZE_LIMIT)}`));
  }

  // Check JavaScript chunks
  console.log(kleur.bold('\n📦 JavaScript Chunks:'));
  const sortedJs = [...chunks.js].sort((a, b) => b.size - a.size);

  sortedJs.forEach(chunk => {
    const isOverBudget = chunk.size > PERFORMANCE_BUDGETS.CHUNK_SIZE_LIMIT;
    const sizeText = isOverBudget ? kleur.red(formatBytes(chunk.size)) : kleur.green(formatBytes(chunk.size));
    const nameText = isOverBudget ? kleur.red(chunk.name) : kleur.white(chunk.name);

    console.log(`  ${nameText}: ${sizeText} (${kleur.gray(formatBytes(chunk.gzip))} gzip)`);

    if (isOverBudget) {
      console.log(kleur.red(`    ⚠️  Exceeds ${formatBytes(PERFORMANCE_BUDGETS.CHUNK_SIZE_LIMIT)} limit`));
    }
  });

  // Check CSS chunks
  if (chunks.css.length > 0) {
    console.log(kleur.bold('\n🎨 CSS Chunks:'));
    chunks.css.forEach(chunk => {
      console.log(`  ${kleur.white(chunk.name)}: ${kleur.cyan(formatBytes(chunk.size))} (${kleur.gray(formatBytes(chunk.gzip))} gzip)`);
    });
  }

  // Summary
  const largeChunks = chunks.js.filter(c => c.size > PERFORMANCE_BUDGETS.CHUNK_SIZE_LIMIT);
  console.log(kleur.bold('\n📋 Summary:'));
  console.log(`  Total chunks: ${kleur.cyan(chunks.js.length + chunks.css.length)}`);
  console.log(`  Large chunks (>${formatBytes(PERFORMANCE_BUDGETS.CHUNK_SIZE_LIMIT)}): ${kleur.red(largeChunks.length)}`);

  if (largeChunks.length > 0) {
    console.log(kleur.bold('\n💡 Recommendations:'));
    console.log('  1. Consider dynamic imports for large vendor chunks');
    console.log('  2. Implement code splitting at route level');
    console.log('  3. Use tree-shaking for unused exports');
    console.log('  4. Consider removing unused dependencies');

    return false;
  } else {
    console.log(kleur.green('\n✅ All chunks within performance budgets!'));
    return true;
  }
}

// Run analysis
const chunks = analyzeBuildOutput(process.argv[2]);
const withinBudget = checkPerformanceBudgets(chunks);

process.exit(withinBudget ? 0 : 1);