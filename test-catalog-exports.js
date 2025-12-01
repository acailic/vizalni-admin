// Test file to check catalog exports
console.log('Available catalog exports:');
try {
  const catalog = require('catalog');
  console.log(Object.keys(catalog));
} catch (e) {
  console.error('Error importing catalog:', e);
}

try {
  const { Markdown } = require('catalog');
  console.log('Markdown import successful:', typeof Markdown);
} catch (e) {
  console.error('Error importing Markdown:', e);
}

try {
  const { markdown } = require('catalog');
  console.log('markdown import successful:', typeof markdown);
} catch (e) {
  console.error('Error importing markdown:', e);
}