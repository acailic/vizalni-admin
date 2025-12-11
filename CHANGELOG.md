# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Open source project structure
- Contributing guidelines
- Code of conduct
- Comprehensive documentation

## [0.1.0-beta.1] - 2024-12-11

### Added
- Initial beta release of @acailic/vizualni-admin
- Serbian locale support (sr-Latn, sr-Cyrl, en)
- Core chart components:
  - LineChart for trend visualization
  - ColumnChart for categorical comparisons
  - PieChart for proportional data
  - BarChart, AreaChart, ScatterPlot, ComboChart
  - Map visualization with TopoJSON support
  - Table view for data
- data.gov.rs API client for Serbian open data integration
- Lingui i18n integration with Serbian translations
- I18nProvider component for React apps
- Locale utilities (defaultLocale, locales, parseLocaleString)
- GitHub Pages deployment support
- Embed functionality for iframe integration
- buildEmbedUrl utility for generating embed URLs
- Demo pages showcasing chart capabilities
- Storybook component development environment
- Comprehensive test suite (unit, integration, e2e, accessibility)
- TypeScript type definitions
- Multiple build formats (CommonJS, ES Modules)

### Documentation
- README with installation and usage instructions
- API documentation with TypeDoc
- Component examples and demos
- Testing documentation
- Deployment guides (GitHub Pages, static export)
- Serbian data integration guides

### Infrastructure
- Next.js 14 application framework
- TypeScript with strict mode
- Vitest for testing
- Playwright for e2e tests
- ESLint and Prettier for code quality
- Husky for git hooks
- GitHub Actions CI/CD pipeline

## [0.0.1] - 2024-11-01

### Added
- Initial project setup
- Fork from visualize-admin/visualization-tool
- Serbian localization foundation

[Unreleased]: https://github.com/acailic/vizualni-admin/compare/v0.1.0-beta.1...HEAD
[0.1.0-beta.1]: https://github.com/acailic/vizualni-admin/compare/v0.0.1...v0.1.0-beta.1
[0.0.1]: https://github.com/acailic/vizualni-admin/releases/tag/v0.0.1
