// Babel config for compatibility with certain packages
// SWC is preferred for Next.js builds but this config is kept for packages that require Babel
module.exports = {
  presets: ["next/babel"],
  plugins: [
    // babel-plugin-macros is required for Lingui v4 macro processing
    // This plugin handles @lingui/macro transforms like Trans and t
    "macros",
  ],
  env: {
    // Keep NPM_PACKAGE environment configuration if needed
    NPM_PACKAGE: {
      presets: [
        [
          "next/babel",
          {
            "transform-runtime": {
              useESModules: false,
            },
          },
        ],
      ],
    },
  },
};
