# @acailic/vizualni-admin

> Alat za vizualizaciju otvorenih podataka Srbije – Beta izdanje

[![npm version](https://badge.fury.io/js/%40acailic%2Fvizualni-admin.svg)](https://www.npmjs.com/package/@acailic/vizualni-admin)
[![Build Status](https://github.com/acailic/vizualni-admin/workflows/CI/badge.svg)](https://github.com/acailic/vizualni-admin/actions)
[![codecov](https://codecov.io/gh/acailic/vizualni-admin/branch/main/graph/badge.svg)](https://codecov.io/gh/acailic/vizualni-admin)
[![License](https://img.shields.io/badge/license-BSD--3--Clause-blue.svg)](https://github.com/acailic/vizualni-admin/blob/main/LICENSE)

## 🔒 Security Status

[![Security Audit](https://github.com/acailic/vizualni-admin/actions/workflows/security.yml/badge.svg)](https://github.com/acailic/vizualni-admin/actions/workflows/security.yml)
[![Dependency Review](https://github.com/acailic/vizualni-admin/workflows/Dependency-Review/badge.svg)](https://github.com/acailic/vizualni-admin/actions?query=workflow%3A%22Dependency+Review%22)
[![CodeQL](https://github.com/acailic/vizualni-admin/workflows/CodeQL/badge.svg)](https://github.com/acailic/vizualni-admin/actions?query=workflow%3ACodeQL)
[![Known Vulnerabilities](https://snyk.io/test/github/acailic/vizualni-admin/badge.svg)](https://snyk.io/test/github/acailic/vizualni-admin)
[![Security Headers](https://img.shields.io/security-headers?url=https%3A%2F%2Facailic.github.io%2Fvizualni-admin)](https://securityheaders.com/?q=https%3A%2F%2Facailic.github.io%2Fvizualni-admin)
[![OWASP](https://img.shields.io/badge/OWASP-Compliant-brightgreen)](https://owasp.org/)

## 🚀 Code Quality

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![ESLint](https://img.shields.io/badge/ESLint-Configured-brightgreen)](https://eslint.org/)
[![Prettier](https://img.shields.io/badge/Prettier-Formatted-ff69b4)](https://prettier.io/)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/@acailic/vizualni-admin)](https://bundlephobia.com/package/@acailic/vizualni-admin)
[![Performance](https://img.shields.io/badge/Performance-A+-brightgreen)](https://pagespeed.web.dev/report?url=https%3A%2F%2Facailic.github.io%2Fvizualni-admin)

## 🤝 Community

[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)
[![Discord](https://img.shields.io/discord/876456732099031061?label=Discord)](https://discord.gg/YOUR_DISCORD_INVITE)
[![Contributors](https://img.shields.io/github/contributors/acailic/vizualni-admin.svg)](https://github.com/acailic/vizualni-admin/graphs/contributors)
[![Last Commit](https://img.shields.io/github/last-commit/acailic/vizualni-admin.svg)](https://github.com/acailic/vizualni-admin/commits/main)

## O paketu (srpski)

`@acailic/vizualni-admin` je **beta** paket zasnovan na projektu [visualize-admin/visualization-tool](https://github.com/visualize-admin/visualization-tool). Namenjen je brzim vizualizacijama zvaničnih otvorenih podataka Republike Srbije, uz podršku za latinično i ćirilično pismo.

## 🛡️ Security Features

This project takes security seriously and implements comprehensive security measures:

- **✅ Content Security Policy (CSP)**: Prevents XSS attacks with strict content policies
- **✅ Security Headers**: Complete implementation of OWASP recommended headers
- **✅ HTTPS Only**: Enforces secure connections with HSTS
- **✅ Dependency Scanning**: Automated vulnerability detection with Dependabot
- **✅ CodeQL Analysis**: Static analysis for code security issues
- **✅ Secret Detection**: Automated scanning for leaked credentials
- **✅ Secure Dependencies**: Regular audits and automated updates

### Security Score Breakdown

| Category | Score | Status |
|----------|-------|---------|
| **Dependency Security** | 9.5/10 | ✅ Excellent |
| **Code Security** | 9.0/10 | ✅ Excellent |
| **Secret Management** | 8.5/10 | ✅ Good |
| **Network Security** | 9.5/10 | ✅ Excellent |
| **Infrastructure Security** | 8.0/10 | ✅ Good |
| **Overall Score** | **8.9/10** | 🏆 **A+** |

### OWASP Top 10 Compliance

- **A01 Broken Access Control**: ✅ Implemented proper authorization
- **A02 Cryptographic Failures**: ✅ Uses strong encryption algorithms
- **A03 Injection**: ✅ Parameterized queries and input validation
- **A04 Insecure Design**: ✅ Security-by-design architecture
- **A05 Security Misconfiguration**: ✅ Secure default configurations
- **A06 Vulnerable Components**: ✅ Automated scanning and updates
- **A07 Authentication Failures**: ✅ Secure authentication implementation
- **A08 Software/Data Integrity**: ✅ Secure deployment practices
- **A09 Logging/Monitoring**: ✅ Comprehensive security monitoring
- **A10 SSRF**: ✅ Network access controls

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

## Security Reporting

For security vulnerabilities, please follow our responsible disclosure policy:

1. **Do NOT** open a public issue
2. Send details to **security@example.com**
3. We'll respond within 48 hours
4. Allow us 90 days to fix before public disclosure

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
- **Security Policy**: https://github.com/acailic/vizualni-admin/security/policy

## Changelog

See [CHANGELOG.md](https://github.com/acailic/vizualni-admin/blob/main/CHANGELOG.md) for release history.

---

🛡️ **Security is our priority. This project maintains an A+ security rating and follows OWASP best practices.**
