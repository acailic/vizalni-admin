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
- Map features in the app (MapLibre/Deck) and a D3-based `MapChart` export (see
  `ai_working/decisions/2026-01-09-mapchart-packaging.md`).
- Export charts to PNG/SVG via chart controls.
- Embed views and share links from the app UI.
- Demos and showcase pages for onboarding.

## Library dependencies

The `@acailic/vizualni-admin` npm package (located in `app/exports/`) includes
the following runtime dependencies:

### D3 visualization libraries

- **d3-array**: Array manipulation utilities for data processing
- **d3-axis**: Axis rendering for charts
- **d3-delaunay**: Delaunay triangulation and Voronoi diagrams
- **d3-ease**: Easing functions for animations
- **d3-format**: Number and date formatting
- **d3-geo**: Geographic projections and computations (for MapChart)
- **d3-interpolate-path**: Path interpolation utilities
- **d3-scale**: Scale functions for mapping data to visual dimensions
- **d3-selection**: DOM selection and manipulation
- **d3-shape**: Shape generators (lines, areas, arcs, pies)
- **d3-time-format**: Time/date formatting
- **d3-transition**: Smooth transitions and animations
- **d3-zoom**: Zoom and pan interactions (for MapChart)

### Data processing and utilities

- **date-fns**: Modern date utility library
- **flexsearch**: Fast full-text search
- **fp-ts**: Functional programming utilities (TypeScript)
- **io-ts**: Runtime type validation
- **make-plural**: Pluralization rules for i18n
- **simple-statistics**: Statistical computations
- **wellknown**: Well-known text format parsing

### UI and visualization components

- **@uiw/react-color**: Color picker component
- **@visx/group**: SVG group component
- **@visx/text**: SVG text component
- **react-i18next**: React integration for i18n
- **react-inspector**: JSON/object inspector
- **react-table**: Table component
- **react-virtualized-auto-sizer**: Auto-sizing wrapper
- **react-window**: Efficient list/window rendering
- **urql**: Lightweight GraphQL client
- **@urql/core**: Core urql functionality
- **web-vitals**: Web performance metrics

### Data and internationalization

- **i18next**: Internationalization framework
- **next-i18next**: Next.js integration for i18n
- **@zazuko/cube-hierarchy-query**: RDF cube hierarchy queries

### Development-only dependencies

The following packages are moved to `devDependencies` as they are only used in
the app, not in the exported library:

- **@apollo/server-plugin-landing-page-graphql-playground**: GraphQL playground
  UI
- **apollo-server-micro**: Apollo Server for Next.js API routes
- **graphql-constraint-directive**: GraphQL validation directives
- **graphql-depth-limit**: GraphQL query depth limiting
- **graphql-tag**: GraphQL template literal parser
- **compression**: HTTP compression middleware
- **cors**: Cross-origin resource sharing middleware
- **global-agent**: Global HTTP/HTTPS proxy
- **microee**: Event emitter utilities
- **nprogress**: Progress bar UI

### Removed dependencies

The following map-related packages were removed from dependencies as they are
only used in app-internal map features:

- **@deck.gl/\***: Deck.gl visualization layers
- **@mapbox/mapbox-gl-supported**: Mapbox browser support detection
- **@math.gl/web-mercator**: Web Mercator projection utilities
- **maplibre-gl**: MapLibre GL JS map rendering
- **react-map-gl**: React wrapper for Mapbox/GL
- **topojson-client**: TopoJSON to GeoJSON conversion
- **topojson-server**: GeoJSON to TopoJSON conversion

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

## Decision log

- `ai_working/decisions/2026-01-09-mapchart-packaging.md` - MapChart packaging.

---

Last updated: 2026-01-09
