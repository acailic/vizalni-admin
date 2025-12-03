// Babel config for compatibility with certain packages
// SWC is preferred for Next.js builds but this config is kept for packages that require Babel
module.exports = {
  presets: ["next/babel"],
  plugins: [
    // babel-plugin-macros is required for Lingui v4 macro processing
    // This plugin handles @lingui/macro transforms like Trans and t
    "macros",
    // Optimize MUI icon imports to prevent loading the entire 500KB+ barrel file
    [
      "import",
      {
        libraryName: "@mui/icons-material",
        libraryDirectory: "esm",
        camel2DashComponentName: false,
      },
      "@mui/icons-material",
    ],
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
