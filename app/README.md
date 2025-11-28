# @acailic/vizualni-admin

> Serbian Open Data Visualization Tool - Beta Release

[![npm version](https://img.shields.io/npm/v/@acailic/vizualni-admin.svg)](https://www.npmjs.com/package/@acailic/vizualni-admin)
[![License](https://img.shields.io/badge/license-BSD--3--Clause-blue.svg)](https://github.com/acailic/vizualni-admin/blob/main/LICENSE)

## About

This is a **beta release** of the `@acailic/vizualni-admin` package, based on the [visualize-admin/visualization-tool](https://github.com/visualize-admin/visualization-tool). The package provides utilities and types for working with Serbian open data visualizations, with support for both Cyrillic and Latin scripts.

## Installation

```bash
npm install @acailic/vizualni-admin
```

Or using yarn:

```bash
yarn add @acailic/vizualni-admin
```

## What's Included

This beta release provides the following standalone utilities:

### Locale Utilities
- `defaultLocale` - Default application locale
- `locales` - Array of supported locales
- `parseLocaleString()` - Parse locale strings

### TypeScript Types
- Complete configuration types for chart configs
- Type-safe interfaces for data visualization

### I18n Support
- Re-exported `I18nProvider` from `@lingui/react`

## Usage

### Basic Example

```typescript
import { defaultLocale, locales, parseLocaleString } from '@acailic/vizualni-admin';

// Get default locale
console.log(defaultLocale); // 'sr-Latn'

// Get all supported locales
console.log(locales); // ['sr-Latn', 'sr-Cyrl', 'en']

// Parse a locale string
const userLocale = parseLocaleString('sr-Cyrl');
console.log(userLocale); // 'sr-Cyrl'

// Parse with fallback to default
const unknownLocale = parseLocaleString('de');
console.log(unknownLocale); // 'sr-Latn' (falls back to default)
```

### TypeScript Support

The package includes full TypeScript declarations:

```typescript
import type { Locale } from '@acailic/vizualni-admin';

// Locale is a union type: "sr-Latn" | "sr-Cyrl" | "en"
const myLocale: Locale = 'sr-Latn';
```

### With React

```typescript
import { I18nProvider } from '@acailic/vizualni-admin';
import { i18n } from '@lingui/core';

function App() {
  return (
    <I18nProvider i18n={i18n}>
      {/* Your app content */}
    </I18nProvider>
  );
}
```

## What's NOT Included (Yet)

This is a **minimal beta release** focusing on core utilities. The following features are planned for future releases:

- Configurator components
- Chart components
- Full Next.js application components
- CLI tools
- Additional utilities

These components will be refactored for standalone usage in upcoming releases.

## Supported Locales

The package supports three locales:

- **sr-Latn** (Serbian Latin) - Default
- **sr-Cyrl** (Serbian Cyrillic)
- **en** (English)

## Requirements

### Node Version

- Node.js 18 or newer

### Peer Dependencies

```json
{
  "@lingui/core": "^4.0.0",
  "@lingui/react": "^4.0.0",
  "react": "^18.2.0",
  "react-dom": "^18.2.0"
}
```

### Runtime Dependencies (bundled)

Installed automatically:

- `d3-format`
- `d3-time-format`
- `make-plural`
- `fp-ts`
- `io-ts`

## Module Formats

The package is published in multiple formats for maximum compatibility:

- **CommonJS** (`dist/index.js`) - For Node.js
- **ES Modules** (`dist/index.mjs`) - For modern bundlers
- **TypeScript** (`dist/index.d.ts`) - Type declarations

## Contributing

Contributions are welcome! Please see the main repository for contribution guidelines.

## Related Projects

- [visualize-admin/visualization-tool](https://github.com/visualize-admin/visualization-tool) - Original upstream project
- [data.gov.rs](https://data.gov.rs) - Serbian Open Data Portal

## License

BSD-3-Clause - See [LICENSE](https://github.com/acailic/vizualni-admin/blob/main/LICENSE) for details.

## Links

- **npm Package**: https://www.npmjs.com/package/@acailic/vizualni-admin
- **GitHub Repository**: https://github.com/acailic/vizualni-admin
- **Issues**: https://github.com/acailic/vizualni-admin/issues
- **Live Demo**: https://acailic.github.io/vizualni-admin/

## Changelog

See [CHANGELOG.md](https://github.com/acailic/vizualni-admin/blob/main/CHANGELOG.md) for release history.
