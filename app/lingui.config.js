module.exports = {
  locales: ["en", "sr-Latn", "sr-Cyrl"],
  sourceLocale: "en",
  catalogPath: "locales/{locale}/messages",
  catalogs: [
    {
      path: "locales/{locale}/messages",
      include: [
        "src/**/*.{js,jsx,ts,tsx}",
        "login/**/*.{js,jsx,ts,tsx}",
        "browse/**/*.{js,jsx,ts,tsx}",
        "components/**/*.{js,jsx,ts,tsx}",
        "configurator/**/*.{js,jsx,ts,tsx}",
        "charts/**/*.{js,jsx,ts,tsx}"
      ],
      exclude: [
        "**/*.d.ts",
        "**/*.test.{js,jsx,ts,tsx}",
        "**/*.spec.{js,jsx,ts,tsx}",
        "node_modules/**"
      ]
    }
  ],
  format: "po",
  orderBy: "messageId",
  pseudoLocale: "pseudo",
  // Disable extractor warnings to avoid noise
  extractBabelOptions: {
    plugins: [
      "@lingui/macro"
    ]
  }
}