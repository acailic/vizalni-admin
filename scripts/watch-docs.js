#!/usr/bin/env node

/**
 * Development script to watch for TypeScript file changes and regenerate API documentation
 */

const { exec } = require('child_process');
const fs = require('fs').promises;
const path = require('path');

const WATCH_PATTERNS = [
  'app/**/*.ts',
  'app/**/*.tsx',
  'typedoc.json'
];

const DEBOUNCE_DELAY = 2000; // 2 seconds
let timeout;

console.log('👀 Watching for TypeScript file changes...');
console.log('📁 Watching patterns:', WATCH_PATTERNS.join(', '));
console.log('⚡ API documentation will be regenerated on changes\n');

async function runCommand(command, description) {
  return new Promise((resolve, reject) => {
    console.log(`\n🔄 ${description}...`);

    const child = exec(command, { stdio: 'inherit' }, (error, stdout, stderr) => {
      if (error) {
        console.error(`❌ Error in ${description}:`, error);
        reject(error);
      } else {
        console.log(`✅ ${description} completed`);
        resolve();
      }
    });

    child.on('exit', (code) => {
      if (code !== 0) {
        reject(new Error(`Command exited with code ${code}`));
      } else {
        resolve();
      }
    });
  });
}

async function regenerateDocs() {
  try {
    console.log('\n📚 Regenerating API documentation...');

    await runCommand('npm run docs:api', 'TypeDoc generation');
    await runCommand('npm run docs:api:integrate', 'VitePress integration');

    console.log('\n✨ API documentation regenerated successfully!');
    console.log('🌐 Check your local VitePress dev server to see changes');

  } catch (error) {
    console.error('\n❌ Failed to regenerate documentation:', error.message);
  }
}

function debounce(func, delay) {
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), delay);
  };
}

const debouncedRegenerate = debounce(regenerateDocs, DEBOUNCE_DELAY);

async function watchFiles() {
  try {
    // Initial generation
    await regenerateDocs();

    // Watch for changes
    const { exec } = require('child_process');

    // Using find and watch for simplicity - in production you might want to use chokidar
    const watchCommand = `find . -path "./node_modules" -prune -o -path "./docs" -prune -o -path "./.git" -prune -o \\( -name "*.ts" -o -name "*.tsx" -o -name "typedoc.json" \\) -print | entr -d npm run docs:api:build`;

    const child = exec(watchCommand, { stdio: 'inherit' });

    child.on('exit', (code) => {
      if (code !== 0) {
        console.error('Watch process exited with code:', code);
      }
    });

  } catch (error) {
    console.error('Error setting up file watcher:', error);
    process.exit(1);
  }
}

// Handle Ctrl+C gracefully
process.on('SIGINT', () => {
  console.log('\n\n👋 Stopping documentation watch...');
  process.exit(0);
});

if (require.main === module) {
  watchFiles();
}

module.exports = { regenerateDocs, watchFiles };