// Test file to verify Lingui macro processing works
const { execSync } = require('child_process');

try {
  console.log('Testing babel processing of Lingui macros...');

  // Test babel transform directly
  const result = execSync(
    'npx babel --config-file ./babel.config.js test-lingui-component.jsx',
    { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }
  );

  console.log('✅ Babel processing successful:');
  console.log(result);
} catch (error) {
  console.log('❌ Babel processing failed:');
  console.log(error.stdout);
  console.log(error.stderr);
  console.log('Exit code:', error.status);
}