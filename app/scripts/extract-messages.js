#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

console.log('🔍 Extracting messages for Lingui...');

// Find all files that might contain Lingui macros
const patterns = [
  'src/**/*.{js,jsx,ts,tsx}',
  'login/**/*.{js,jsx,ts,tsx}',
  'browse/**/*.{js,jsx,ts,tsx}',
  'components/**/*.{js,jsx,ts,tsx}',
  'configurator/**/*.{js,jsx,ts,tsx}',
  'charts/**/*.{js,jsx,ts,tsx}'
];

let filesWithLingui = [];

try {
  for (const pattern of patterns) {
    const files = glob.sync(pattern, {
      ignore: ['**/*.d.ts', '**/*.test.*', '**/*.spec.*', '**/node_modules/**']
    });

    for (const file of files) {
      const content = fs.readFileSync(file, 'utf8');
      if (content.includes('@lingui/macro') ||
          content.includes('import { Trans') ||
          content.includes('import { t') ||
          content.includes('from "@lingui/macro"')) {
        filesWithLingui.push(file);
      }
    }
  }

  console.log(`✅ Found ${filesWithLingui.length} files using Lingui:`);
  filesWithLingui.forEach(file => console.log(`   - ${file}`));

  if (filesWithLingui.length === 0) {
    console.log('ℹ️  No files found with Lingui macros. This might be expected if using i18next instead.');
  }

} catch (error) {
  console.error('❌ Error scanning files:', error.message);
  process.exit(1);
}