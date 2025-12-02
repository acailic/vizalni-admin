#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const { transformSync } = require('@babel/core');

console.log('🔧 Testing Lingui macro processing...');

// Test transformation of a simple Lingui component
const testCode = `
import { Trans, t } from '@lingui/macro';
import React from 'react';

const TestComponent = () => {
  const message = t\`Hello World\`;

  return (
    <div>
      <Trans id="test.greeting">Hello, this is a test</Trans>
      <p>{message}</p>
    </div>
  );
};

export default TestComponent;
`;

try {
  console.log('📝 Original code:');
  console.log(testCode);

  console.log('\n🔄 Processing with Babel...');

  const result = transformSync(testCode, {
    filename: 'test.jsx',
    presets: ['next/babel'],
    plugins: ['macros'],
    configFile: false, // Don't load babel.config.js
    babelrc: false,
  });

  console.log('✅ Successfully transformed code:');
  console.log(result.code);

  console.log('\n✅ Lingui macro processing works correctly!');

} catch (error) {
  console.error('❌ Error processing Lingui macros:');
  console.error(error.message);
  console.error(error.stack);
  process.exit(1);
}
