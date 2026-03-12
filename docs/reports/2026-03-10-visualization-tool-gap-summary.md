# Visualization Tool Gap Summary

**Date:** 2026-03-10 **Baseline:** `visualize-admin/visualization-tool`
**Purpose:** Record what the upstream repo treats as core visualization flow,
what already exists in this repo, and what is still missing or degraded enough
to queue as follow-up work.

## Upstream core flow

The upstream repo is built around one persisted-chart lifecycle:

1. `/browse` selects a dataset.
2. `/create/[chartId]` initializes configurator state.
3. `ChartPreview` renders the editable preview.
4. Publish persists config through `/api/config-*`.
5. `/v/[chartId]` rehydrates persisted config for the public chart page.
6. `/embed/[chartId]` rehydrates the same persisted config for iframe use.

The stable upstream core parts are:

- Route entrypoints: `app/pages/browse/index.tsx`,
  `app/pages/create/[chartId].tsx`, `app/pages/preview.tsx`,
  `app/pages/v/[chartId].tsx`, `app/pages/embed/[chartId].tsx`
- State model: `app/configurator/configurator-state/*`
- Editable rendering: `app/components/chart-preview.tsx`
- Published rendering: `app/components/chart-published.tsx`
- Persistence: `app/pages/api/config-create.ts`,
  `app/pages/api/config-update.ts`, `app/pages/api/config/[key].ts`,
  `app/pages/api/config/view.ts`, `app/server/config-controller.ts`
- Shared cross-route state: `app/stores/data-source.ts`,
  `app/stores/interactive-filters.tsx`

## Upstream architecture map

This is the more specific page-to-core wiring that matters when implementing
parity work here.

### Page wiring

- Global page shell:
  [app/pages/\_app.tsx](/tmp/visualization-tool/app/pages/_app.tsx) wraps routes
  with session, locale, GraphQL, theme, snackbar, and shared providers.
- Editor route:
  [app/pages/create/[chartId].tsx](/tmp/visualization-tool/app/pages/create/[chartId].tsx)
  mounts `ConfiguratorStateProvider(chartId)` and renders the configurator.
- Published chart route:
  [app/pages/v/[chartId].tsx](/tmp/visualization-tool/app/pages/v/[chartId].tsx)
  SSR-loads persisted config, increments view count, mounts
  `ConfiguratorStateProvider(initialState=published)`, then renders
  `ChartPublished`.
- Persisted embed route:
  [app/pages/embed/[chartId].tsx](/tmp/visualization-tool/app/pages/embed/[chartId].tsx)
  follows the same persisted-state rehydration path as `/v/[chartId]`, but
  inside the iframe/embed shell.
- Dataset browser:
  [app/pages/browse/index.tsx](/tmp/visualization-tool/app/pages/browse/index.tsx)
  renders `SelectDatasetStep` inside configurator state; deeper browse routes
  just re-export the same browser page and vary route state.
- Preview routes:
  [app/pages/preview.tsx](/tmp/visualization-tool/app/pages/preview.tsx) and
  [app/pages/preview_post.tsx](/tmp/visualization-tool/app/pages/preview_post.tsx)
  accept raw chart state and reuse the same published renderer without going
  through persisted DB-backed routes.

### Configurator and state engine

- Main state engine:
  [app/configurator/configurator-state/context.tsx](/tmp/visualization-tool/app/configurator/configurator-state/context.tsx),
  [app/configurator/configurator-state/init.tsx](/tmp/visualization-tool/app/configurator/configurator-state/init.tsx),
  [app/configurator/configurator-state/reducer.tsx](/tmp/visualization-tool/app/configurator/configurator-state/reducer.tsx)
- Responsibilities: dataset initialization, copy/edit/create flows, reducer
  transitions, publish payload preparation, and route handoff from editor to
  published pages.

### Data resolution chain

- Persisted configs are loaded and normalized by
  [app/db/config.ts](/tmp/visualization-tool/app/db/config.ts). This layer reads
  DB state, validates data sources, upgrades versioned config, and returns
  normalized published state for `/v` and `/embed`.
- Runtime chart data is served through
  [app/pages/api/graphql.ts](/tmp/visualization-tool/app/pages/api/graphql.ts).
- GraphQL routing and source dispatch live in
  [app/graphql/resolvers/index.ts](/tmp/visualization-tool/app/graphql/resolvers/index.ts).
- The real data path is the RDF resolver in
  [app/graphql/resolvers/rdf.ts](/tmp/visualization-tool/app/graphql/resolvers/rdf.ts).
- Low-level cube/dimension/observation querying lives in
  [app/rdf/queries.ts](/tmp/visualization-tool/app/rdf/queries.ts) plus query
  helpers such as `query-cube-preview`, `query-possible-filters`,
  `query-latest-cube-iri`, and `query-hierarchies`.
- Shared data-source selection and URL/local-storage syncing live in
  [app/stores/data-source.ts](/tmp/visualization-tool/app/stores/data-source.ts)
  and
  [app/domain/data-source/index.ts](/tmp/visualization-tool/app/domain/data-source/index.ts).

### Rendering composition chain

- Top-level renderers:
  [app/components/chart-preview.tsx](/tmp/visualization-tool/app/components/chart-preview.tsx)
  and
  [app/components/chart-published.tsx](/tmp/visualization-tool/app/components/chart-published.tsx)
- Layout composition:
  [app/components/chart-panel.tsx](/tmp/visualization-tool/app/components/chart-panel.tsx)
  chooses vertical/tall/canvas dashboard layout wrappers.
- Chart-type switchboard:
  [app/components/chart-with-filters.tsx](/tmp/visualization-tool/app/components/chart-with-filters.tsx)
  computes query filters, syncs interactive filters, and selects the concrete
  chart module by `chartType`.
- Common data/loading boundary:
  [app/charts/chart-data-wrapper.tsx](/tmp/visualization-tool/app/charts/chart-data-wrapper.tsx)
  loads metadata/components/observations and centralizes loading, error,
  no-data, and accessibility-table behavior.
- Concrete chart modules: chart families under
  [app/charts](/tmp/visualization-tool/app/charts) such as column, line, map,
  pie, and table then compose shared axes, legends, tooltips, annotations, and
  interaction helpers.

### Reusable core modules

- Config schema and variants:
  [app/config-types.ts](/tmp/visualization-tool/app/config-types.ts)
- Shared config derivation helpers:
  [app/config-utils.ts](/tmp/visualization-tool/app/config-utils.ts)
- Shared chart toolkit:
  [app/charts/shared](/tmp/visualization-tool/app/charts/shared)
- Cross-chart interactive state:
  [app/stores/interactive-filters.tsx](/tmp/visualization-tool/app/stores/interactive-filters.tsx)

## This repo: where to change what

This section maps the upstream architecture to the actual files in this repo so
future work can land in the right place quickly.

### Route entrypoints

- Create/editor route:
  [app/pages/create/[chartId].tsx](/home/nistrator/Documents/github/vizualni-admin/app/pages/create/[chartId].tsx)
  dynamically mounts the configurator and `ConfiguratorStateProvider`.
- Browse route:
  [app/pages/browse/index.tsx](/home/nistrator/Documents/github/vizualni-admin/app/pages/browse/index.tsx)
  currently uses a client-only wrapper around `SelectDatasetStep`.
- Preview route:
  [app/pages/preview.tsx](/home/nistrator/Documents/github/vizualni-admin/app/pages/preview.tsx)
  accepts transient chart state and reuses `ChartPublished`.
- Persisted view route:
  [app/pages/v/[chartId].tsx](/home/nistrator/Documents/github/vizualni-admin/app/pages/v/[chartId].tsx)
- Persisted embed route:
  [app/pages/embed/[chartId].tsx](/home/nistrator/Documents/github/vizualni-admin/app/pages/embed/[chartId].tsx)
- Static/demo embed surfaces:
  [app/pages/embed/index.tsx](/home/nistrator/Documents/github/vizualni-admin/app/pages/embed/index.tsx)
  and
  [app/pages/embed/demo.tsx](/home/nistrator/Documents/github/vizualni-admin/app/pages/embed/demo.tsx)

If a task changes route availability or mode-specific behavior, start with:

- [app/utils/public-paths.ts](/home/nistrator/Documents/github/vizualni-admin/app/utils/public-paths.ts)
- [app/utils/persisted-chart-page.ts](/home/nistrator/Documents/github/vizualni-admin/app/utils/persisted-chart-page.ts)

### State and configurator lifecycle

- Main state engine:
  [app/configurator/configurator-state/context.tsx](/home/nistrator/Documents/github/vizualni-admin/app/configurator/configurator-state/context.tsx),
  [app/configurator/configurator-state/init.tsx](/home/nistrator/Documents/github/vizualni-admin/app/configurator/configurator-state/init.tsx),
  [app/configurator/configurator-state/reducer.tsx](/home/nistrator/Documents/github/vizualni-admin/app/configurator/configurator-state/reducer.tsx)
- Main editor UI:
  [app/configurator/components/configurator.tsx](/home/nistrator/Documents/github/vizualni-admin/app/configurator/components/configurator.tsx)
  and
  [app/configurator/components/chart-configurator.tsx](/home/nistrator/Documents/github/vizualni-admin/app/configurator/components/chart-configurator.tsx)

If a task changes create/edit/copy/publish flows, this is the main ownership
area.

### Published and preview rendering

- Published renderer:
  [app/components/chart-published.tsx](/home/nistrator/Documents/github/vizualni-admin/app/components/chart-published.tsx)
- Editor/live preview renderer:
  [app/components/chart-preview.tsx](/home/nistrator/Documents/github/vizualni-admin/app/components/chart-preview.tsx)
- Layout composition:
  [app/components/chart-panel.tsx](/home/nistrator/Documents/github/vizualni-admin/app/components/chart-panel.tsx)
- Chart-type dispatch and filter wiring:
  [app/components/chart-with-filters.tsx](/home/nistrator/Documents/github/vizualni-admin/app/components/chart-with-filters.tsx)

If a task changes how blocks, dashboards, embeds, or preview/published parity
behave, start here before touching individual chart modules.

### Data resolution and APIs

- GraphQL query dispatch:
  [app/graphql/resolvers/index.ts](/home/nistrator/Documents/github/vizualni-admin/app/graphql/resolvers/index.ts)
- GraphQL server endpoint:
  [app/pages/api/graphql.ts](/home/nistrator/Documents/github/vizualni-admin/app/pages/api/graphql.ts)
- Domain/data-source policy:
  [app/domain/data-source/index.ts](/home/nistrator/Documents/github/vizualni-admin/app/domain/data-source/index.ts)
  and
  [app/domain/data-source/constants.ts](/home/nistrator/Documents/github/vizualni-admin/app/domain/data-source/constants.ts)
- Persisted config controller:
  [app/server/config-controller.ts](/home/nistrator/Documents/github/vizualni-admin/app/server/config-controller.ts)
- Config CRUD endpoints:
  [app/pages/api/config-create.ts](/home/nistrator/Documents/github/vizualni-admin/app/pages/api/config-create.ts),
  [app/pages/api/config-update.ts](/home/nistrator/Documents/github/vizualni-admin/app/pages/api/config-update.ts),
  [app/pages/api/config/[key].ts](/home/nistrator/Documents/github/vizualni-admin/app/pages/api/config/[key].ts),
  [app/pages/api/config/view.ts](/home/nistrator/Documents/github/vizualni-admin/app/pages/api/config/view.ts)

If a task changes what data a chart can read, how a source is validated, or how
persisted charts are loaded and saved, this is the ownership area.

### Shared route-level state

- Data source URL/localStorage sync:
  [app/stores/data-source.ts](/home/nistrator/Documents/github/vizualni-admin/app/stores/data-source.ts)
- Interactive filters:
  [app/stores/interactive-filters.tsx](/home/nistrator/Documents/github/vizualni-admin/app/stores/interactive-filters.tsx)

If a bug feels random across browse/create/view/embed, these two stores are
likely part of the cause.

## Practical rules for future work

Use these shortcuts when deciding where a change belongs:

- Change route availability or static/server behavior: start with
  [app/utils/public-paths.ts](/home/nistrator/Documents/github/vizualni-admin/app/utils/public-paths.ts)
  and the route file.
- Change persisted view/embed behavior: start with
  [app/pages/v/[chartId].tsx](/home/nistrator/Documents/github/vizualni-admin/app/pages/v/[chartId].tsx),
  [app/pages/embed/[chartId].tsx](/home/nistrator/Documents/github/vizualni-admin/app/pages/embed/[chartId].tsx),
  and
  [app/utils/persisted-chart-page.ts](/home/nistrator/Documents/github/vizualni-admin/app/utils/persisted-chart-page.ts).
- Change publish/save/update behavior: start with
  [app/configurator/configurator-state/context.tsx](/home/nistrator/Documents/github/vizualni-admin/app/configurator/configurator-state/context.tsx),
  [app/utils/chart-config/api.ts](/home/nistrator/Documents/github/vizualni-admin/app/utils/chart-config/api.ts),
  and
  [app/server/config-controller.ts](/home/nistrator/Documents/github/vizualni-admin/app/server/config-controller.ts).
- Change chart rendering parity: start with
  [app/components/chart-preview.tsx](/home/nistrator/Documents/github/vizualni-admin/app/components/chart-preview.tsx),
  [app/components/chart-published.tsx](/home/nistrator/Documents/github/vizualni-admin/app/components/chart-published.tsx),
  and
  [app/components/chart-with-filters.tsx](/home/nistrator/Documents/github/vizualni-admin/app/components/chart-with-filters.tsx).
- Change data-source behavior: start with
  [app/stores/data-source.ts](/home/nistrator/Documents/github/vizualni-admin/app/stores/data-source.ts)
  and
  [app/domain/data-source/index.ts](/home/nistrator/Documents/github/vizualni-admin/app/domain/data-source/index.ts).
- Change preview-only rehydration: start with
  [app/pages/preview.tsx](/home/nistrator/Documents/github/vizualni-admin/app/pages/preview.tsx).

## What this repo already has

This repo already keeps the same architectural spine:

- Configurator state and reducer are present under
  [app/configurator/configurator-state](/home/nistrator/Documents/github/vizualni-admin/app/configurator/configurator-state).
- Live and published renderers exist in
  [app/components/chart-preview.tsx](/home/nistrator/Documents/github/vizualni-admin/app/components/chart-preview.tsx)
  and
  [app/components/chart-published.tsx](/home/nistrator/Documents/github/vizualni-admin/app/components/chart-published.tsx).
- Config CRUD endpoints and server validation exist in
  [app/server/config-controller.ts](/home/nistrator/Documents/github/vizualni-admin/app/server/config-controller.ts)
  and
  [app/pages/api/config-create.ts](/home/nistrator/Documents/github/vizualni-admin/app/pages/api/config-create.ts).
- Shared source state exists in
  [app/stores/data-source.ts](/home/nistrator/Documents/github/vizualni-admin/app/stores/data-source.ts).
- Preview and embed-generator pages already exist in
  [app/pages/preview.tsx](/home/nistrator/Documents/github/vizualni-admin/app/pages/preview.tsx),
  [app/pages/embed/index.tsx](/home/nistrator/Documents/github/vizualni-admin/app/pages/embed/index.tsx),
  and
  [app/pages/embed/demo.tsx](/home/nistrator/Documents/github/vizualni-admin/app/pages/embed/demo.tsx).

## Concrete parity gaps

These are the missing or degraded parts confirmed by comparing current repo code
with upstream behavior.

### 1. Persisted public chart page is stubbed in static mode

- Upstream
  [app/pages/v/[chartId].tsx](/tmp/visualization-tool/app/pages/v/[chartId].tsx)
  uses `getServerSideProps`, fetches config from DB, increments views, and
  renders `ChartPublished`.
- Current
  [app/pages/v/[chartId].tsx](/home/nistrator/Documents/github/vizualni-admin/app/pages/v/[chartId].tsx)
  uses `getStaticPaths` and `getStaticProps` that always return `notfound`.

Impact: the canonical persisted-chart route exists structurally but not
functionally in server-backed parity.

### 2. Persisted embed page is stubbed in static mode

- Upstream
  [app/pages/embed/[chartId].tsx](/tmp/visualization-tool/app/pages/embed/[chartId].tsx)
  fetches persisted config and renders published state inside the iframe shell.
- Current
  [app/pages/embed/[chartId].tsx](/home/nistrator/Documents/github/vizualni-admin/app/pages/embed/[chartId].tsx)
  also always returns `notfound` from static props.

Impact: persisted embeds are not equivalent to upstream; only the
demo/embed-generator path is reliable.

### 3. Browse route is weaker than upstream route behavior

- Upstream
  [app/pages/browse/index.tsx](/tmp/visualization-tool/app/pages/browse/index.tsx)
  is a normal route with server props and direct provider/render flow.
- Current
  [app/pages/browse/index.tsx](/home/nistrator/Documents/github/vizualni-admin/app/pages/browse/index.tsx)
  falls back to a browser-only wrapper and shows a server-side placeholder while
  waiting for `window`.

Impact: route behavior is less predictable, especially across SSR/static/runtime
transitions.

### 4. Runtime capability gating is only partially centralized

- [app/utils/public-paths.ts](/home/nistrator/Documents/github/vizualni-admin/app/utils/public-paths.ts)
  already defines `isStaticExportMode`, `supportsPersistedChartPages`, and
  `getDatasetBrowserPath()`.
- That policy is not consistently enforced across `/browse`, `/create`,
  `/v/[chartId]`, `/embed/[chartId]`, and public CTAs.

Impact: users can still land on route shells that exist but are intentionally
degraded.

### 5. Test coverage is strong around demos, but weak around the persisted lifecycle

- There is broad Playwright coverage under
  [e2e](/home/nistrator/Documents/github/vizualni-admin/e2e), especially for
  demo embeds and public pages.
- The missing high-value test is one canonical persisted flow: create -> preview
  -> publish -> `/v/[chartId]` -> `/embed/[chartId]`.

Impact: regressions in persistence-backed chart pages can slip through even when
demo/embed-generator tests stay green.

### 6. Data-source and interactive-filter behavior need route-level contract coverage

- [app/stores/data-source.ts](/home/nistrator/Documents/github/vizualni-admin/app/stores/data-source.ts)
  persists to URL and local storage.
- [app/stores/interactive-filters.tsx](/home/nistrator/Documents/github/vizualni-admin/app/stores/interactive-filters.tsx)
  powers preview and published interactivity.
- These pieces exist, but they still need explicit tests for cross-route sync,
  published-state override behavior, and preview/published parity.

Impact: subtle state drift can appear between builder, published chart, and
embed routes.

## Recommended Kevin tasks

These are the highest-value tasks to queue:

1. Restore server-backed parity for `/v/[chartId]`.
2. Restore server-backed parity for `/embed/[chartId]`.
3. Centralize runtime capability gating for static vs server mode.
4. Add one canonical persisted-chart lifecycle E2E test.
5. Add API contract tests for config CRUD, auth, CSRF, key validation, and
   data-source validation.
6. Add regression coverage for preview vs published rendering across core chart
   types.
7. Harden `dataSource` URL/localStorage sync tests across route transitions.
8. Add focused interactive-filter sync tests across preview and published
   shells.

Queued task IDs:

- `/v/[chartId]` parity: `9e81e1b7e41e44b5b37136441d509281`
- `/embed/[chartId]` parity: `1707a8662bd246eb8197c316b885f14c`
- Capability gating: `25ab585e318a40bda545a16aa4fa8601`
- Persisted lifecycle E2E: `c99d8fd0995945b0ae4ff4256c9af242`
- Config API contract tests: `bd9616afac0d43ef8e07f4b804097c5b`
- Preview/published parity coverage: `92b5a419ba754e6b94900fd95ac6103d`
- `dataSource` sync hardening: `8bf11aec0464408eba7b0806caccd7c3`
- Interactive-filter sync coverage: `f6bf3f5ae1184a6eb65d3b5b33d61195`

## Related repo docs

For longer-form background, use:

- [docs/VISUALIZATION_TOOL_CHEATSHEET.md](/home/nistrator/Documents/github/vizualni-admin/docs/VISUALIZATION_TOOL_CHEATSHEET.md)
- [docs/VISUALIZATION_TOOL_CORE_FLOW.md](/home/nistrator/Documents/github/vizualni-admin/docs/VISUALIZATION_TOOL_CORE_FLOW.md)
- [docs/plans/2026-03-10-visualization-tool-quality-catchup-plan.md](/home/nistrator/Documents/github/vizualni-admin/docs/plans/2026-03-10-visualization-tool-quality-catchup-plan.md)
- [docs/ARCHITECTURE.md](/home/nistrator/Documents/github/vizualni-admin/docs/ARCHITECTURE.md)
