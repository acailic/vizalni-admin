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

This beta release provides:

- Locale utilities: `defaultLocale`, `locales`, `parseLocaleString`
- TypeScript types for chart/configuration models
- I18n support via `I18nProvider` re-export
- Demo-ready chart components (Line/Column/Pie) used on GitHub Pages
- Embed-ready endpoints (see below)

## Quick usage

### Render a chart

```tsx
import { LineChart } from '@acailic/vizualni-admin';

const data = [
  { label: '2019', value: 72 },
  { label: '2020', value: 54 },
  { label: '2021', value: 63 },
  { label: '2022', value: 81 },
];

export function Example() {
  return (
    <LineChart
      data={data}
      xKey="label"
      yKey="value"
      title="Employment recovery"
      width={720}
      height={360}
      showTooltip
      showCrosshair
    />
  );
}
```

Column and pie variations:

```tsx
import { ColumnChart, PieChart } from '@acailic/vizualni-admin';

// Column
<ColumnChart
  data={[
    { year: '2019', jobs: 180 },
    { year: '2020', jobs: 140 },
  ]}
  xKey="year"
  yKey="jobs"
  title="Jobs created per year"
  color="#0ea5e9"
  showTooltip
  showCrosshair
/>

// Pie
<PieChart
  data={[
    { label: 'Solar', value: 18 },
    { label: 'Wind', value: 22 },
  ]}
  labelKey="label"
  valueKey="value"
  title="Electricity mix"
  showLegend
/>
```

### Embed a chart (iframe)

Use the hosted demo endpoint on GitHub Pages and pass theme/lang:

```html
<iframe
  src="https://acailic.github.io/vizualni-admin/embed/demo?theme=light&lang=en"
  style="width: 100%; height: 520px; border: 0;"
  loading="lazy"
  referrerpolicy="no-referrer"
></iframe>
```

Generate a custom snippet at `/embed` (GitHub Pages build) to tweak width/height/theme/lang.

### Build embed URLs in code

```ts
import { buildEmbedUrl } from '@acailic/vizualni-admin/lib/embed-url';

const url = buildEmbedUrl('https://acailic.github.io/vizualni-admin/embed/demo', {
  theme: 'dark',
  lang: 'sr',
});
// -> https://acailic.github.io/vizualni-admin/embed/demo?theme=dark&lang=sr
```

### Locale utilities

```ts
import { defaultLocale, locales, parseLocaleString } from '@acailic/vizualni-admin';

console.log(defaultLocale); // 'sr-Latn'
console.log(locales);       // ['sr-Latn', 'sr-Cyrl', 'en']
console.log(parseLocaleString('sr-Cyrl')); // 'sr-Cyrl'
console.log(parseLocaleString('de'));      // falls back to default
```

### With React and Lingui

```tsx
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

This is a **beta**. Future releases will continue to harden:

- Configurator UI
- Full Next.js application components
- CLI tools
- Additional utilities

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
