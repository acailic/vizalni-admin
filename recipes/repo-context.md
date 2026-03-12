# Repository Context: vizuelni-admin-srbije

## What this project is

A bilingual (Serbian + English) open government data visualization platform built on Next.js 14. It connects to Serbia's data.gov.rs API and renders datasets as interactive charts, maps, and tables. The platform supports three locales: Serbian Cyrillic (sr-Cyrl, default), Serbian Latin (sr-Latn), and English (en).

This is a single Next.js application, not a monorepo. There are no internal packages yet — @vizualni/core, @vizualni/react, and @vizualni/connectors exist only as aspirational naming conventions in the codebase.

## Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript 5.3, strict mode |
| Styling | Tailwind CSS 3.4, custom Serbian government theme |
| UI primitives | Radix UI (dropdown, dialog, tabs, select, accordion, tooltip) |
| Charts | Recharts, Chart.js (react-chartjs-2), Plotly.js, D3.js 7 |
| Maps | Mapbox GL JS, Leaflet + React-Leaflet |
| State | Zustand 4.5 |
| Data fetching | SWR, Axios, @tanstack/react-query |
| Forms | react-hook-form + Zod validation |
| i18n | next-intl, i18next, react-i18next |
| Animation | Framer Motion |
| Icons | Lucide React |
| PWA | next-pwa |
| Testing | Jest 29 (unit), @testing-library/react, Playwright (E2E), MSW (mocks) |
| Code quality | ESLint, Prettier, Husky, lint-staged, @commitlint |
| CI/CD | GitHub Actions |

## Directory layout

```
src/
  app/              # Next.js App Router pages and layouts
    api/datasets/   # API routes (GET /api/datasets, /api/datasets/[id])
  components/
    ui/             # Reusable UI: LanguageSwitcher, DatasetCard
    charts/         # ChartRenderer, ChartBuilder
  lib/
    api/            # datagov.ts (route helpers), datagov-client.ts (full API client)
    i18n/           # config.ts (217-line i18n config), locales/ (sr-Cyrl, sr-Latn, en)
    utils/          # cn.ts (tailwind class merge utility)
  services/         # dataGovService.ts, dataGovApi.ts
  types/            # index.ts, api.ts (Dataset, Resource, Organization, etc.)
tests/
  e2e/              # Playwright tests
  integration/      # Integration tests
  unit/             # Jest unit tests
public/
  locales/          # Translation JSON files per locale
docs/               # api/, architecture/, deployment/ docs
```

## Key conventions

- Path aliases: `@/*` maps to `./src/*`, plus `@/components/*`, `@/lib/*`, `@/styles/*`, `@/types/*`, `@/public/*`
- Conventional commits enforced via @commitlint
- lint-staged runs eslint --fix and prettier --write on staged files
- Prettier: no semicolons, single quotes, tab width 2, trailing comma es5, print width 100
- ESLint: warns on `any`, ignores `_`-prefixed unused vars, console restricted to warn/error
- TypeScript strict mode, incremental builds

## Data model

Core types (in `src/types/`):
- `Dataset`: id, title, description, organization, resources, tags, topics, license, frequency, metadata
- `Resource`: id, title, description, format, url, filesize, mime
- `Organization`: id, name, description, logo, url, slug, datasets_count
- Pagination, filter, and API response wrapper types

## API integration

The `datagov-client.ts` provides a complete typed client for data.gov.rs:
- Methods for datasets, organizations, topics, reuses
- Search with filters and pagination
- React `cache()` integration for server components
- Retry logic, timeout config, error handling

## Environment

245-line `.env.example` covering: API config, i18n, feature flags, maps (Mapbox), analytics (GA/Sentry), database (PostgreSQL/Redis), auth (NextAuth/OAuth), search (Algolia/Elasticsearch), storage (S3), email (SMTP/SendGrid), security (CORS/rate-limiting), and deployment (Vercel/Netlify/Docker/K8s).

## Deployment

GitHub Actions CI/CD. Supports Vercel, Netlify, Docker, Kubernetes, GitHub Pages (static export). PWA-ready with offline support.

## What matters most

1. The platform must work correctly in all three locales
2. Chart/map rendering must be reliable and accessible
3. The data.gov.rs API client must handle errors gracefully
4. Government branding (Serbian flag colors, official palette) must be consistent
5. Performance matters — this is a public-facing government tool
