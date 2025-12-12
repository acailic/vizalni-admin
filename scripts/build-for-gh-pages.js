#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🏗️  Building for GitHub Pages...\n');

// Check if we're in production mode
const isProduction = process.env.NODE_ENV === 'production';
const basePath = '/vizualni-admin';

try {
  // Build with base path
  console.log(`1. Building with base path: ${basePath}`);
  execSync(`cd app && NEXT_PUBLIC_BASE_PATH=${basePath} NODE_ENV=production yarn build`, { stdio: 'inherit' });

  // Create a temporary directory for local testing
  const outDir = path.join(__dirname, '..', 'app', 'out');
  const tempDir = path.join(outDir, 'temp-for-local');

  // Only create the temp structure for local development
  if (!isProduction) {
    console.log('\n2. Creating temporary structure for local testing...');

    // Clean up any existing temp directory
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }

    // Create temp directory structure
    fs.mkdirSync(tempDir, { recursive: true });

    // Copy all files to temp subdirectory
    const files = fs.readdirSync(outDir, { withFileTypes: true });

    for (const file of files) {
      if (file.name === 'temp-for-local') continue;

      const sourcePath = path.join(outDir, file.name);
      const destPath = path.join(tempDir, file.name);

      if (file.isDirectory()) {
        fs.cpSync(sourcePath, destPath, { recursive: true });
      } else {
        fs.copyFileSync(sourcePath, destPath);
      }
    }

    console.log('\n✅ Build complete!');
    console.log('\n📁 Files ready for:');
    console.log('   - GitHub Pages deployment: ./app/out/');
    console.log('   - Local testing: ./app/out/temp-for-local/');
    console.log('\n🚀 To test locally, run:');
    console.log('   yarn serve:gh-pages');
    console.log('   Then visit: http://localhost:3000/vizualni-admin/');
  } else {
    console.log('\n✅ Production build complete for GitHub Pages!');
    console.log('📁 Files ready at: ./app/out/');
  }

} catch (error) {
  console.error('\n❌ Build failed:', error.message);
  process.exit(1);
}