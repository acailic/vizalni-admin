# Architecture Notes

## Core architecture

This is a Next.js 14 App Router application. The rendering model is server-first: pages and layouts are React Server Components by default. Client components are opted-in with `'use client'` only when they need interactivity, browser APIs, or local state.

### Request flow

```
Browser → Next.js App Router → Server Component (reads data via datagov-client)
                              → or API Route (/api/datasets/*)
                              → renders with translations from i18n config
                              → hydrates client components (charts, maps, forms)
```

### Data flow

```
data.gov.rs API → datagov-client.ts (typed, cached, retry-enabled)
               → Server Components (direct calls with React cache())
               → or API routes → SWR/React Query in client components
               → Zustand for cross-component client state
```

## Architectural boundaries

### Layer separation

| Layer | Contains | Does NOT contain |
|-------|----------|------------------|
| `src/app/` | Route definitions, layouts, pages, API routes | Business logic, data transformation |
| `src/components/` | Presentation components, UI primitives | Data fetching (except via hooks), API calls |
| `src/lib/` | Utilities, API clients, i18n config, helpers | React components, JSX |
| `src/services/` | Service wrappers around external APIs | UI concerns, React-specific code |
| `src/types/` | Shared TypeScript interfaces and types | Runtime code, implementations |

### What talks to what

- Pages/layouts call `lib/api/` or `services/` for data.
- Components receive data via props or client-side hooks (SWR, React Query, Zustand).
- `services/` wraps `lib/api/datagov-client.ts`. Components should not import the client directly.
- `lib/i18n/` is consumed by pages (server-side) and by `react-i18next` hooks (client-side).
- `lib/utils/cn.ts` is the only styling utility. Do not add more.

## Visualization architecture

Four chart libraries coexist intentionally:

| Library | Use case |
|---------|----------|
| Recharts | Standard charts (bar, line, area, pie) in dashboard views |
| Chart.js | Lightweight embedded charts, small multiples |
| D3.js | Custom/complex visualizations, geographic data transforms |
| Plotly.js | Interactive scientific/statistical charts, 3D plots |

`ChartRenderer` (`src/components/charts/ChartRenderer.tsx`) is the dispatch layer. It takes a chart config and delegates to the right library. New chart types should be added through this renderer, not as standalone components.

`ChartBuilder` (`src/components/charts/ChartBuilder.tsx`) is the user-facing chart creation interface.

**Rule**: Do not add a fifth charting library. If a chart type isn't supported, extend one of the existing four through `ChartRenderer`.

## Map architecture

Mapbox GL JS for the primary map experience (styled tiles, 3D terrain, geocoding). Leaflet/React-Leaflet as a fallback for simpler use cases or when Mapbox token is unavailable. The map component should gracefully degrade if neither map provider is configured.

## i18n architecture

Three-locale setup with `next-intl` as the primary router-level integration and `i18next` + `react-i18next` for client-side string resolution.

The i18n config (`src/lib/i18n/config.ts`, 217 lines) defines:
- Locale metadata and detection from Accept-Language
- Localized pathnames (e.g., `/skupovi-podataka` for datasets in Serbian)
- Per-locale font config (Cyrillic-capable fonts for sr-Cyrl)
- Number, date, and relative time formatters

**Rule**: All three locales must stay in sync. A feature that adds translation keys to one locale must add them to all three.

## State management

- **Server state**: React `cache()` for deduplication in server components. SWR or React Query for client-side caching with revalidation.
- **Client state**: Zustand for UI state that spans multiple components (theme, sidebar, active filters). Keep Zustand stores small and focused.
- **Form state**: react-hook-form manages form state. Zod schemas validate on submit. Do not duplicate validation logic.

## Common pitfalls

1. **Hydration mismatches**: Server-rendered locale content must match client hydration. Ensure locale detection is consistent between server and client.
2. **Chart library conflicts**: D3 manipulates the DOM directly. Never let D3 and React fight over the same DOM nodes. Use refs and useEffect for D3, let React own the container.
3. **Map token exposure**: Mapbox tokens are in env vars. The `NEXT_PUBLIC_MAPBOX_TOKEN` is intentionally public (restricted by domain in Mapbox dashboard), but other tokens must stay server-side.
4. **Translation key drift**: Adding UI without translations silently falls back to the key name. This looks broken in production.
5. **Bundle size**: Plotly.js and D3 are large. Always lazy-load them. Check bundle analysis before adding new visualization dependencies.
6. **API rate limiting**: data.gov.rs has rate limits. The client has retry logic, but excessive parallel requests from server components can trigger limits. Use React cache() and appropriate revalidation intervals.

## Intended evolution

The project may eventually split into:
- `@vizualni/core` — data transformation, API client, schemas
- `@vizualni/react` — React components, hooks, chart renderers
- `@vizualni/connectors` — data source adapters (data.gov.rs, future sources)

This has not happened yet. The current code is a single Next.js app. Any refactoring toward this split should be incremental and not break the existing deployment.
