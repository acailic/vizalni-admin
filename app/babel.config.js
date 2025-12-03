// Simplified Babel config for static export compatibility
// Only essential plugins for Lingui i18n support
module.exports = {
  presets: ["next/babel"],
  plugins: [
    // babel-plugin-macros is required for Lingui v4 macro processing
    // This plugin handles @lingui/macro transforms like Trans and t
    "macros",
  ],
};
