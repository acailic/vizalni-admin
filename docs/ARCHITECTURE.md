# Architecture

This document describes the current runtime architecture for the vizualni-admin
app and the exported library. It is written for execution: each subsystem
includes concrete entry points and file paths.

## Runtime modes

- Static export (GitHub Pages): Next.js pages are pre-rendered and client-side
  data fetching is used. Next API routes and database-backed features are not
  available.
- Full app (Next.js server): API routes, GraphQL, and database-backed features
  are available. This mode is used for local dev and server deployments.

## System overview

```mermaid
graph TD
  User --> UI[Next.js pages (app/pages)]
  UI -->|REST| DataGov[data.gov.rs API]
  UI -->|GraphQL| GQL[/api/graphql (Apollo Server)]
  GQL --> RDF[SPARQL endpoints via app/rdf]
  GQL --> DB[(PostgreSQL via Prisma)]
  UI --> Charts[D3 charts in app/exports/charts]
  UI --> MapApp[Map features in app/charts/map]
```

Notes:

- Map features in `app/charts/map` use MapLibre/Deck; they are app-only.
- The exported `MapChart` in `app/exports/charts/MapChart.tsx` is D3-based and
  does not depend on MapLibre/Deck.

## Project structure (execution map)

- `app/pages/`: Pages Router entry points, including `pages/api/*` routes.
- `app/components/`: shared UI components and chart controls.
- `app/exports/`: exported library entry points and chart components.
- `app/domain/`: data.gov.rs client and domain logic.
- `app/graphql/`: GraphQL schema, resolvers, and urql client wiring.
- `app/rdf/`: SPARQL query helpers and caching.
- `app/db/`: Prisma-backed persistence with static-build mocks.
- `app/charts/`: app-only charts and map tooling.
- `app/stores/`: zustand stores for cross-component UI state.

## Data.gov.rs integration (REST)

Primary entry points:

- `app/domain/data-gov-rs/client.ts`: REST client for data.gov.rs endpoints.
- `app/domain/data-gov-rs/index.ts`: public API surface for the client.
- `app/hooks/use-data-gov-rs.ts`: app hook for dataset search and resource
  fetch.
- `app/exports/hooks/useDataGovRs.ts`: exported hook for consumers.

Typical flow:

1. UI triggers search or dataset fetch from `useDataGovRs`.
2. `dataGovRsClient` performs REST calls to data.gov.rs endpoints.
3. Results are normalized and passed to chart components or demos.

## GraphQL API (Apollo Server)

Primary entry points:

- `app/pages/api/graphql.ts`: Apollo Server handler for `/api/graphql`.
- `app/graphql/schema.graphql`: schema definition.
- `app/graphql/resolvers/*`: RDF and SQL resolvers.
- `app/graphql/client.tsx`: urql client (cacheExchange + fetchExchange).

GraphQL is used for:

- RDF cube exploration via SPARQL (`app/rdf/*`).
- SQL-backed metadata and config queries.

## Charts and exported library

Library entry points:

- `app/index.ts`: public exports for the npm package.
- `app/exports/`: charts, hooks, utils, and core exports.
- `app/package.json`: `exports` map and entrypoints.
- `app/tsup.config.ts`: library bundling and externalized deps.

Chart implementation:

- D3-based charts in `app/exports/charts/*`.
- `MapChart` is D3-based and safe to export without maplibre dependencies.
- MapChart packaging decision:
  `ai_working/decisions/2026-01-09-mapchart-packaging.md`.
- App-only map features live in `app/charts/map/`.

## State management and caching

State and cache primitives:

- React local state for component state.
- zustand stores in `app/stores/` for cross-component UI state.
- `useFetchData` in `app/utils/use-fetch-data.ts` for query-keyed in-memory
  caching and request deduplication (no TTL).
- `useDataCache` in `app/hooks/use-data-cache.ts` for optional L1 memory and L2
  IndexedDB caching with TTL (available, not widely used yet).
- Multi-level cache utilities in `app/lib/cache/` with defaults in
  `app/lib/cache/cache-config.ts`.
- SPARQL LRU caching in `app/rdf/query-cache.ts`.

## Persistence

- Prisma client in `app/db/client.ts` with a mock fallback for static export.
- Schema in `app/prisma/schema.prisma`.
- Database-backed features are disabled in static export builds.

## Build and release surfaces

- App build: Next.js build from `app/` (see root `package.json` scripts).
- Library build: `cd app && npm run build:lib` uses `tsup`.
- Packaging tests: `app/tests/packaging/` validate `dist` outputs and exports.

## Execution notes

- If you add or remove exports, update `app/package.json`, `app/index.ts`, and
  packaging tests in `app/tests/packaging/`.
- If you change data.gov.rs client behavior, update tests in
  `app/__tests__/unit/data-gov-rs-client.test.ts` and the README in
  `app/domain/data-gov-rs/`.
- If you modify GraphQL schema/resolvers, update `app/graphql/schema.graphql`
  and resolver tests in `app/graphql/*`.
- If you alter cache defaults, update `app/lib/cache/cache-config.ts` and this
  document.
