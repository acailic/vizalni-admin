#!/usr/bin/env node

/**
 * Performance Budget Validation Script
 * Enforces bundle size and performance budgets
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const BUDGETS = {
  maxChunkSize: parseInt(process.env.CHUNK_SIZE_LIMIT) || 250000, // 250KB
  maxBundleSize: parseInt(process.env.BUNDLE_SIZE_LIMIT) || 5000000, // 5MB
  maxAssetSize: 1000000, // 1MB for individual assets
  maxChunks: 50, // Maximum number of chunks
};

const COLORS = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

function colorLog(color, message) {
  console.log(`${COLORS[color]}${message}${COLORS.reset}`);
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function analyzeWebpackStats() {
  const statsPath = path.join(process.cwd(), '.next', 'analyze');

  if (!fs.existsSync(statsPath)) {
    colorLog('yellow', '⚠️  Webpack stats not found. Skipping detailed analysis.');
    return null;
  }

  try {
    const statsFiles = fs.readdirSync(statsPath).filter(file => file.endsWith('.json'));
    if (statsFiles.length === 0) {
      return null;
    }

    const stats = JSON.parse(fs.readFileSync(path.join(statsPath, statsFiles[0]), 'utf8'));

    const chunks = [];
    let totalSize = 0;

    // Analyze chunks
    if (stats.chunks) {
      stats.chunks.forEach(chunk => {
        const size = chunk.size || 0;
        totalSize += size;
        chunks.push({
          name: chunk.names.join(', ') || chunk.id,
          size: size,
          modules: chunk.modules ? chunk.modules.length : 0,
        });
      });
    }

    // Analyze assets
    if (stats.assets) {
      stats.assets.forEach(asset => {
        if (asset.name.endsWith('.js') || asset.name.endsWith('.css')) {
          const exists = chunks.find(c => c.name === asset.name);
          if (!exists) {
            totalSize += asset.size;
            chunks.push({
              name: asset.name,
              size: asset.size,
              modules: 0,
            });
          }
        }
      });
    }

    return {
      totalSize,
      chunks: chunks.sort((a, b) => b.size - a.size),
    };
  } catch (error) {
    colorLog('red', `❌ Error analyzing webpack stats: ${error.message}`);
    return null;
  }
}

function analyzeNextJsBundles() {
  const buildPath = path.join(process.cwd(), '.next', 'static', 'chunks');

  if (!fs.existsSync(buildPath)) {
    colorLog('yellow', '⚠️  Next.js build output not found. Skipping analysis.');
    return null;
  }

  const chunks = [];
  let totalSize = 0;

  function analyzeDirectory(dirPath) {
    const items = fs.readdirSync(dirPath);

    items.forEach(item => {
      const itemPath = path.join(dirPath, item);
      const stats = fs.statSync(itemPath);

      if (stats.isDirectory()) {
        analyzeDirectory(itemPath);
      } else if (item.endsWith('.js') || item.endsWith('.css')) {
        const size = stats.size;
        totalSize += size;
        chunks.push({
          name: item,
          size: size,
          path: itemPath,
        });
      }
    });
  }

  try {
    analyzeDirectory(buildPath);
    return {
      totalSize,
      chunks: chunks.sort((a, b) => b.size - a.size),
    };
  } catch (error) {
    colorLog('red', `❌ Error analyzing Next.js bundles: ${error.message}`);
    return null;
  }
}

function checkBudgets(analysis) {
  let passed = true;
  const violations = [];

  if (!analysis) {
    colorLog('red', '❌ No bundle analysis available');
    return false;
  }

  // Check total bundle size
  if (analysis.totalSize > BUDGETS.maxBundleSize) {
    passed = false;
    violations.push({
      type: 'total-bundle-size',
      current: analysis.totalSize,
      budget: BUDGETS.maxBundleSize,
      percentage: ((analysis.totalSize / BUDGETS.maxBundleSize) * 100).toFixed(1),
    });
  }

  // Check individual chunk sizes
  analysis.chunks.forEach(chunk => {
    if (chunk.size > BUDGETS.maxChunkSize) {
      passed = false;
      violations.push({
        type: 'chunk-size',
        name: chunk.name,
        current: chunk.size,
        budget: BUDGETS.maxChunkSize,
        percentage: ((chunk.size / BUDGETS.maxChunkSize) * 100).toFixed(1),
      });
    }
  });

  // Check number of chunks
  if (analysis.chunks.length > BUDGETS.maxChunks) {
    passed = false;
    violations.push({
      type: 'chunk-count',
      current: analysis.chunks.length,
      budget: BUDGETS.maxChunks,
      percentage: ((analysis.chunks.length / BUDGETS.maxChunks) * 100).toFixed(1),
    });
  }

  return { passed, violations };
}

function generateReport(analysis, budgetCheck) {
  colorLog('cyan', '\n📊 Bundle Analysis Report\n');

  if (!analysis) {
    colorLog('red', '❌ No analysis data available');
    return;
  }

  // Summary
  colorLog('blue', '📦 Summary:');
  console.log(`   Total Bundle Size: ${formatBytes(analysis.totalSize)}`);
  console.log(`   Number of Chunks: ${analysis.chunks.length}`);
  console.log(`   Largest Chunk: ${formatBytes(analysis.chunks[0]?.size || 0)}`);

  // Budget status
  if (budgetCheck.passed) {
    colorLog('green', '\n✅ All budgets passed!');
  } else {
    colorLog('red', '\n❌ Budget violations detected:');
  }

  // Violations
  if (budgetCheck.violations.length > 0) {
    budgetCheck.violations.forEach(violation => {
      switch (violation.type) {
        case 'total-bundle-size':
          colorLog('red', `   Total bundle size: ${formatBytes(violation.current)} (${violation.percentage}% of budget)`);
          break;
        case 'chunk-size':
          colorLog('red', `   Chunk "${violation.name}": ${formatBytes(violation.current)} (${violation.percentage}% of budget)`);
          break;
        case 'chunk-count':
          colorLog('red', `   Too many chunks: ${violation.current} (${violation.percentage}% of budget)`);
          break;
      }
    });
  }

  // Top 10 largest chunks
  colorLog('blue', '\n🔍 Top 10 Largest Chunks:');
  analysis.chunks.slice(0, 10).forEach((chunk, index) => {
    const sizeColor = chunk.size > BUDGETS.maxChunkSize ? 'red' : 'green';
    colorLog(sizeColor, `   ${index + 1}. ${chunk.name}: ${formatBytes(chunk.size)}`);
  });

  // Recommendations
  if (!budgetCheck.passed) {
    colorLog('yellow', '\n💡 Optimization Recommendations:');

    const largeChunks = analysis.chunks.filter(chunk => chunk.size > BUDGETS.maxChunkSize);
    if (largeChunks.length > 0) {
      console.log('   • Consider code splitting for large chunks');
      console.log('   • Implement lazy loading for non-critical components');
      console.log('   • Review and optimize heavy dependencies');
    }

    if (analysis.totalSize > BUDGETS.maxBundleSize) {
      console.log('   • Remove unused dependencies');
      console.log('   • Implement tree-shaking optimizations');
      console.log('   • Use lighter alternatives for heavy libraries');
    }

    if (analysis.chunks.length > BUDGETS.maxChunks) {
      console.log('   • Optimize chunk splitting strategy');
      console.log('   • Combine related modules into fewer chunks');
    }
  }
}

function main() {
  colorLog('cyan', '🔍 Performance Budget Check\n');

  // Try webpack stats first, then Next.js analysis
  let analysis = analyzeWebpackStats();
  if (!analysis) {
    analysis = analyzeNextJsBundles();
  }

  if (!analysis) {
    colorLog('red', '❌ Could not analyze bundles. Make sure the build is completed first.');
    process.exit(1);
  }

  const budgetCheck = checkBudgets(analysis);
  generateReport(analysis, budgetCheck);

  // Exit with appropriate code
  process.exit(budgetCheck.passed ? 0 : 1);
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = {
  analyzeWebpackStats,
  analyzeNextJsBundles,
  checkBudgets,
  generateReport,
};