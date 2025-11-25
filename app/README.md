# @acailic/vizualni-admin

Serbian Open Data Visualization Tool - Beta Release

## About

This is a **beta release** of the `@acailic/vizualni-admin` package, based on the [visualize-admin/visualization-tool](https://github.com/visualize-admin/visualization-tool).

## What's Included

This beta release includes:

- **Locale utilities**: `defaultLocale`, `locales`, `parseLocaleString`
- **TypeScript types**: Configuration types for chart configs
- **I18n support**: Re-exported `I18nProvider` from `@lingui/react`

## What's NOT Included

This is a minimal beta release. The following are **not yet available**:

- Configurator components
- Chart components
- Full Next.js application components

These will be added in future releases as the library structure is refactored to support standalone usage outside of the Next.js application context.

## Installation

```bash
npm install @acailic/vizualni-admin
# or
yarn add @acailic/vizualni-admin
```

## Usage

```typescript
import { defaultLocale, locales, parseLocaleString } from '@acailic/vizualni-admin';

console.log(defaultLocale); // 'sr-Latn'
console.log(locales); // ['sr-Latn', 'sr-Cyrl', 'en']
```

## License

BSD-3-Clause

## Repository

https://github.com/acailic/vizualni-admin
