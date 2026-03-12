#!/usr/bin/env node

/**
 * Optimized Build Script
 * Builds the application with performance optimizations
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const kleur = require('kleur');

console.log(kleur.bold().blue('\n🚀 Starting Optimized Build\n'));

// Set environment variables for production build
process.env.NODE_ENV = 'production';
process.env.CHECK_PERFORMANCE_BUDGET = 'true';
process.env.NEXT_TELEMETRY_DISABLED = '1';

// Clean previous build
console.log(kleur.yellow('🧹 Cleaning previous build...'));
const outPath = path.join(__dirname, '../app/out');
if (fs.existsSync(outPath)) {
  fs.rmSync(outPath, { recursive: true, force: true });
}
const nextPath = path.join(__dirname, '../app/.next');
if (fs.existsSync(nextPath)) {
  fs.rmSync(nextPath, { recursive: true, force: true });
}

// Run the build
console.log(kleur.yellow('📦 Building application...'));
try {
  execSync('cd app && next build', {
    stdio: 'inherit',
    env: {
      ...process.env,
      NODE_ENV: 'production',
      NEXT_TELEMETRY_DISABLED: '1',
    }
  });
  console.log(kleur.green('\n✅ Build completed successfully!\n'));
} catch (error) {
  console.error(kleur.red('\n❌ Build failed!\n'));
  process.exit(1);
}

// Analyze bundle size
console.log(kleur.yellow('📊 Analyzing bundle size...'));
try {
  execSync(`node ${path.join(__dirname, 'analyze-bundle.js')}`, { stdio: 'inherit' });
} catch (error) {
  console.warn(kleur.yellow('\n⚠️  Bundle size exceeds recommended limits\n'));
}

console.log(kleur.bold().green('\n🎉 Optimized build complete!\n'));