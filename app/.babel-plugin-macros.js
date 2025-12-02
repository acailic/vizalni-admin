module.exports = {
  // Configuration for babel-plugin-macros
  // This ensures proper handling of Lingui macros in Next.js environment
  lingui: {
    // Disable extract since we're using Lingui v4
    extractBabelOptions: {
      plugins: ['@lingui/macro'],
      presets: ['next/babel']
    }
  },
  // Enable proper handling of ES modules with macros
  resolve: {
    // Allow both ESM and CJS imports
    fullySpecified: false
  }
}