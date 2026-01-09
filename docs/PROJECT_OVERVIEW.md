# Project Overview - Vizualni Admin

Vizualni Admin is a Serbian open data visualization app and a reusable chart
library. The repository ships both the Next.js application and the npm package
`@acailic/vizualni-admin` built from the `app` workspace.

## What this repo contains

- App: Next.js Pages Router under `app/` for browsing data.gov.rs and building
  visualizations.
- Library: exported charts, hooks, and utils under `app/exports/`.
- Docs: `docs/` plus app docs in `app/docs/`.
- Tooling: build scripts, tests, and CI helpers in `scripts/` and `e2e/`.

## Primary outputs

- Web app (static export and full server mode).
- npm library with D3-based charts and helpers.

## Key capabilities (current)

- Browse and search data.gov.rs datasets and resources.
- Create interactive charts (line, bar, column, area, pie, map).
- Map features in the app (MapLibre/Deck) and a D3-based `MapChart` export.
- Export charts to PNG/SVG via chart controls.
- Embed views and share links from the app UI.
- Demos and showcase pages for onboarding.

## Supported languages

- `sr-Latn`, `sr-Cyrl`, `en`.

## Runtime modes

- Static export (GitHub Pages): no API routes or database; client-side data
  fetching only.
- Full app (Next.js server): API routes, GraphQL, database, and auth available.

## Technology stack (current)

Frontend:

- Next.js (Pages Router), React, TypeScript
- Material UI for UI components
- D3 for chart rendering
- MapLibre/Deck for app-only map features
- Lingui for i18n
- urql for GraphQL queries

Backend:

- Next.js API routes
- Apollo Server for `/api/graphql`
- Prisma + PostgreSQL (mocked in static export)
- SPARQL utilities for RDF data sources

Testing and tooling:

- Vitest, Playwright
- ESLint, Prettier
- Docker (optional)

## Data sources and APIs

- data.gov.rs REST API via `app/domain/data-gov-rs/client.ts`.
- GraphQL API in `app/pages/api/graphql.ts` with resolvers in `app/graphql/`.
- SPARQL helpers in `app/rdf/`.
- DB access in `app/db/` with schema in `app/prisma/schema.prisma`.

## Quick execution commands

- App dev server: `yarn dev` (repo root).
- Static build: `yarn build:static`.
- Library build: `cd app && npm run build:lib`.
- Tests: `yarn test` (root) or `cd app && vitest run`.

## Where to change things

- data.gov.rs client: `app/domain/data-gov-rs/` and
  `app/hooks/use-data-gov-rs.ts`.
- Charts and exports: `app/exports/charts/` and `app/exports/index.ts`.
- App-only map features: `app/charts/map/`.
- GraphQL schema and resolvers: `app/graphql/` and `app/pages/api/graphql.ts`.
- Caching: `app/utils/use-fetch-data.ts` and `app/lib/cache/`.
- Library packaging: `app/package.json` and `app/tsup.config.ts`.

## Related docs (execution order)

1. `docs/ARCHITECTURE.md`
2. `docs/NEXT_STEPS.md`
3. `docs/GETTING-STARTED.md`
4. `docs/DEPLOYMENT.md`
5. `docs/TESTING_GUIDE.md`
6. `docs/release/RELEASE.md`

## Roadmap

See `docs/NEXT_STEPS.md` for the long-term plan and decision log pointers.

---

Last updated: 2026-01-09
