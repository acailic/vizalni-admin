#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function getDirectorySize(dirPath) {
  let totalSize = 0;

  function calculateSize(filePath) {
    const stats = fs.statSync(filePath);
    if (stats.isFile()) {
      return stats.size;
    } else if (stats.isDirectory()) {
      let dirSize = 0;
      const files = fs.readdirSync(filePath);
      files.forEach(file => {
        dirSize += calculateSize(path.join(filePath, file));
      });
      return dirSize;
    }
    return 0;
  }

  return calculateSize(dirPath);
}

function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

function analyzeNextBundle() {
  const appPath = path.join(__dirname, 'app');
  const nextPath = path.join(appPath, '.next');

  console.log('📊 Bundle Analysis for vizualni-admin\n');

  if (!fs.existsSync(nextPath)) {
    console.log('❌ Build directory not found. Please run `yarn build` first.');
    return;
  }

  try {
    // Static directory
    const staticPath = path.join(nextPath, 'static');
    if (fs.existsSync(staticPath)) {
      const staticSize = getDirectorySize(staticPath);
      console.log(`📁 Static files: ${formatBytes(staticSize)}`);
    }

    // Server chunks
    const serverPath = path.join(nextPath, 'server');
    if (fs.existsSync(serverPath)) {
      const serverSize = getDirectorySize(serverPath);
      console.log(`🖥️  Server chunks: ${formatBytes(serverSize)}`);
    }

    // Check for large chunks
    const staticJsPath = path.join(staticPath, 'chunks');
    if (fs.existsSync(staticJsPath)) {
      const files = fs.readdirSync(staticJsPath)
        .filter(f => f.endsWith('.js'))
        .map(f => {
          const filePath = path.join(staticJsPath, f);
          const size = fs.statSync(filePath).size;
          return { name: f, size };
        })
        .sort((a, b) => b.size - a.size);

      console.log('\n📈 Largest JavaScript chunks:');
      files.slice(0, 10).forEach((file, i) => {
        console.log(`${i + 1}. ${file.name}: ${formatBytes(file.size)}`);
      });
    }

    // Page bundles
    const pagesPath = path.join(nextPath, 'server', 'pages');
    if (fs.existsSync(pagesPath)) {
      console.log('\n📄 Page bundles:');
      const pageFiles = fs.readdirSync(pagesPath)
        .filter(f => f.endsWith('.js'))
        .map(f => {
          const filePath = path.join(pagesPath, f);
          const size = fs.statSync(filePath).size;
          return { name: f, size };
        })
        .sort((a, b) => b.size - a.size);

      pageFiles.slice(0, 5).forEach((file, i) => {
        console.log(`${i + 1}. ${file.name}: ${formatBytes(file.size)}`);
      });
    }

    // Total .next size
    const totalNextSize = getDirectorySize(nextPath);
    console.log(`\n🎯 Total .next directory: ${formatBytes(totalNextSize)}`);

    // Node modules size
    const nodeModulesPath = path.join(appPath, 'node_modules');
    if (fs.existsSync(nodeModulesPath)) {
      const nodeModulesSize = getDirectorySize(nodeModulesPath);
      console.log(`📦 Node modules: ${formatBytes(nodeModulesSize)}`);
    }

    console.log('\n✅ Bundle analysis complete!');

  } catch (error) {
    console.error('❌ Error analyzing bundle:', error.message);
  }
}

analyzeNextBundle();