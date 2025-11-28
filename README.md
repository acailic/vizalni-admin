# @acailic/vizualni-admin

> Alat za vizualizaciju otvorenih podataka Srbije – Beta izdanje

[![npm version](https://img.shields.io/npm/v/@acailic/vizualni-admin.svg)](https://www.npmjs.com/package/@acailic/vizualni-admin)
[![License](https://img.shields.io/badge/license-BSD--3--Clause-blue.svg)](https://github.com/acailic/vizualni-admin/blob/main/LICENSE)

## O paketu (srpski)

`@acailic/vizualni-admin` je **beta** paket zasnovan na projektu [visualize-admin/visualization-tool](https://github.com/visualize-admin/visualization-tool). Namenjen je brzim vizualizacijama zvaničnih otvorenih podataka Republike Srbije, uz podršku za latinično i ćirilično pismo.

## Instalacija

```bash
npm install @acailic/vizualni-admin
# ili
yarn add @acailic/vizualni-admin
```

## Šta je uključeno

- Lokalizacija: `defaultLocale`, `locales`, `parseLocaleString`
- TypeScript tipovi za grafikon/konfiguracije
- I18n podrška (`I18nProvider`)
- Komponente za grafikone spremne za demo (Line/Column/Pie) koje koristimo na GitHub Pages
- Spremno za ugradnju (embed) – vidi primere ispod

## Brzi primeri

### Linijski grafikon

```tsx
import { LineChart } from '@acailic/vizualni-admin';

const data = [
  { label: '2019', value: 72 },
  { label: '2020', value: 54 },
  { label: '2021', value: 63 },
  { label: '2022', value: 81 },
];

export function Primer() {
  return (
    <LineChart
      data={data}
      xKey="label"
      yKey="value"
      title="Oporavak zaposlenosti"
      width={720}
      height={360}
      showTooltip
      showCrosshair
    />
  );
}
```

### Stubičasti i pie grafikon

```tsx
import { ColumnChart, PieChart } from '@acailic/vizualni-admin';

// Stubičasti
<ColumnChart
  data={[
    { year: '2019', jobs: 180 },
    { year: '2020', jobs: 140 },
  ]}
  xKey="year"
  yKey="jobs"
  title="Nove pozicije po godinama"
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
  title="Mix proizvodnje"
  showLegend
/>
```

### Ugradnja (iframe)

Koristi javni demo na GitHub Pages i prosledi temu/jezik:

```html
<iframe
  src="https://acailic.github.io/vizualni-admin/embed/demo?theme=light&lang=sr"
  style="width: 100%; height: 520px; border: 0;"
  loading="lazy"
  referrerpolicy="no-referrer"
></iframe>
```

Generator koda za ugradnju nalazi se na `/embed` (u okviru GitHub Pages build-a) – izaberi širinu/visinu/temu/jezik i kopiraj snippet.

### Generisanje URL-a za embed u kodu

```ts
import { buildEmbedUrl } from '@acailic/vizualni-admin/lib/embed-url';

const url = buildEmbedUrl('https://acailic.github.io/vizualni-admin/embed/demo', {
  theme: 'dark',
  lang: 'sr',
});
// https://acailic.github.io/vizualni-admin/embed/demo?theme=dark&lang=sr
```

### Lokalizacija

```ts
import { defaultLocale, locales, parseLocaleString } from '@acailic/vizualni-admin';

console.log(defaultLocale); // 'sr-Latn'
console.log(locales);       // ['sr-Latn', 'sr-Cyrl', 'en']
console.log(parseLocaleString('sr-Cyrl')); // 'sr-Cyrl'
console.log(parseLocaleString('de'));      // vraća podrazumevani
```

### React + Lingui

```tsx
import { I18nProvider } from '@acailic/vizualni-admin';
import { i18n } from '@lingui/core';

function App() {
  return (
    <I18nProvider i18n={i18n}>
      {/* Vaš sadržaj */}
    </I18nProvider>
  );
}
```

## Šta još nije uključeno

Ovo je beta. Planiramo da ojačamo:

- Konfigurator UI
- Komponente za celu Next.js aplikaciju
- CLI alate
- Dodatne util funkcije

---

## English summary

This is a **beta** of `@acailic/vizualni-admin` for Serbian open data visualizations (Latin/Cyrillic). Includes locale utilities, types, Lingui I18n provider, demo chart components (Line/Column/Pie), and embed-ready endpoints.

Install: `npm install @acailic/vizualni-admin` or `yarn add @acailic/vizualni-admin`.

Quick starts mirror the Serbian examples above. Use the hosted embed demo (`/embed/demo?theme=light&lang=en`) and the `/embed` generator to craft iframe snippets. `buildEmbedUrl` helps construct embed URLs in code. Locale helpers: `defaultLocale`, `locales`, `parseLocaleString`. React usage: wrap with `I18nProvider`.

Planned next: configurator UI, full Next.js components, CLI, and more utilities.

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
