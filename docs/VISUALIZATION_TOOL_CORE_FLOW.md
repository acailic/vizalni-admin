# Visualization Tool Core Flow

This note maps how the original
`https://github.com/visualize-admin/visualization-tool` handles data,
visualization state, and page wiring, then anchors that flow to the files in
this repo.

Use this document when you need to change the visualization workflow here
without losing the upstream mental model.

## Why this matters

The original `visualization-tool` is organized around one core loop:

1. Select a dataset or open an existing chart.
2. Initialize configurator state.
3. Edit chart mappings, filters, and layout.
4. Render preview and published chart views from the same state model.
5. Persist the published state through config APIs.
6. Rehydrate that state on `/v/[chartId]` and `/embed/[chartId]`.

This repo still follows that loop. The biggest differences are around static
export support, Serbian open data UX, extra demo/tutorial pages, and newer
package exports.

## Core directories

These directories are the stable center of the visualization system in both the
upstream repo and this fork.

| Area                      | Purpose                                                               | Main files in this repo                                                                                                                                                                                |
| ------------------------- | --------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Page entrypoints          | Route-level shells for create, browse, preview, view, embed           | `app/pages/create/[chartId].tsx`, `app/pages/browse/index.tsx`, `app/pages/preview.tsx`, `app/pages/v/[chartId].tsx`, `app/pages/embed/[chartId].tsx`                                                  |
| Configurator state        | Owns chart lifecycle, reducer actions, init logic, publishing         | `app/configurator/configurator-state/context.tsx`, `app/configurator/configurator-state/reducer.tsx`, `app/configurator/configurator-state/init.tsx`, `app/configurator/configurator-state/index.tsx`  |
| Configurator UI           | Dataset selection, field mapping, chart options, layouting            | `app/configurator/components/configurator.tsx`, `app/configurator/components/chart-configurator.tsx`, `app/configurator/components/add-new-dataset-panel.tsx`, `app/browse/ui/select-dataset-step.tsx` |
| Rendering                 | Preview and published rendering shells                                | `app/components/chart-preview.tsx`, `app/components/chart-published.tsx`, `app/components/chart-with-filters.tsx`                                                                                      |
| Chart registry / defaults | Initial chart configs, supported chart types, chart-specific adapters | `app/charts/index.ts`, `app/charts/chart-config-ui-options.ts`, `app/charts/shared/*`                                                                                                                  |
| Shared stores             | Cross-page data source and interactive filter state                   | `app/stores/data-source.ts`, `app/stores/interactive-filters.tsx`, `app/stores/transition.ts`                                                                                                          |
| Persistence APIs          | Create, update, fetch, list, and count chart configs                  | `app/pages/api/config-create.ts`, `app/pages/api/config-update.ts`, `app/pages/api/config/[key].ts`, `app/pages/api/config/list.ts`, `app/pages/api/config/view.ts`, `app/server/config-controller.ts` |
| Data access               | GraphQL and dataset metadata/components loading                       | `app/pages/api/graphql.ts`, `app/graphql/*`, `app/domain/*`                                                                                                                                            |

## Page-to-core map

These are the routes that define the upstream visualization workflow and their
current equivalents here.

| Route                               | What it does                                                                                 | Main local dependencies                                                                                                             | Fork-specific note                                                                                      |
| ----------------------------------- | -------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `/create/[chartId]`                 | Opens the chart builder and wraps it in configurator state                                   | `app/pages/create/[chartId].tsx`, `app/configurator/components/configurator.tsx`, `app/configurator/configurator-state/context.tsx` | Same role as upstream, but this repo loads the configurator dynamically with `ssr: false`.              |
| `/browse`                           | Starts with dataset selection before chart configuration                                     | `app/pages/browse/index.tsx`, `app/browse/ui/select-dataset-step.tsx`, `app/configurator/configurator-state/context.tsx`            | In static export mode it redirects to demo/showcase instead of using live browsing.                     |
| `/preview`                          | Client-only preview iframe that accepts serialized config state by `postMessage` or URL hash | `app/pages/preview.tsx`, `app/components/chart-published.tsx`                                                                       | Preserved from upstream and still used as a light rehydration path for published-state preview.         |
| `/v/[chartId]`                      | Public visualization page for a stored config                                                | `app/pages/v/[chartId].tsx`, `app/components/chart-published.tsx`, `app/stores/data-source.ts`                                      | In static export builds it returns `notfound`; full behavior only exists in server mode with DB access. |
| `/embed/[chartId]`                  | Minimal iframe/embed route for a stored config                                               | `app/pages/embed/[chartId].tsx`, `app/components/chart-published.tsx`, `app/components/embed-params.ts`                             | Same published-state renderer, but wrapped for iframe resize and stricter embed constraints.            |
| `/api/config-*` and `/api/config/*` | Save/fetch/update chart configs                                                              | `app/server/config-controller.ts`, `app/utils/chart-config/api.ts`, `app/db/config`                                                 | Still the persistence spine; auth and CSRF checks live in the server controller.                        |
| `/api/graphql`                      | Feeds cube metadata/components used by configurator and published charts                     | `app/pages/api/graphql.ts`, `app/graphql/hooks.ts`, `app/graphql/*`                                                                 | Still part of the core when running with the full server.                                               |

## End-to-end runtime flow

### 1. Dataset selection or chart re-entry

The core state starts in `ConfiguratorStateProvider`.

In this repo, `app/configurator/configurator-state/context.tsx` decides how the
state is initialized:

- `query.copy` loads an existing published chart into a new draft.
- `query.edit` loads a persisted chart for editing.
- `query.cube` builds a new chart from a chosen cube.
- Any non-`published` custom `chartId` falls back to local storage recovery.

This matches the upstream model. The important thing is that page routes do not
own chart state directly; they only decide which initialization path is used.

### 2. Data source selection

`app/stores/data-source.ts` is a zustand store shared across the configurator,
published view, and route transitions.

It keeps the selected source in:

- URL query param `dataSource`
- `localStorage`
- in-memory store state

That makes data source changes visible across page reloads and route changes. If
you change source semantics, this store and `app/domain/data-source` must move
together.

### 3. Configurator state and reducer

The real center of the app is not a page component; it is the configurator state
machine.

Important files:

- `app/configurator/configurator-state/context.tsx`
- `app/configurator/configurator-state/reducer.tsx`
- `app/configurator/configurator-state/init.tsx`
- `app/configurator/configurator-state/index.tsx`

That layer is responsible for:

- state transitions like `SELECTING_DATASET`, `CONFIGURING_CHART`, `LAYOUTING`,
  `PUBLISHING`, `PUBLISHED`
- chart config updates
- filter ordering and filter derivation
- publishing payload preparation
- redirecting to `/v/[chartId]` after publish

If a change affects both preview and published rendering, it usually belongs
here instead of inside a page.

### 4. Chart defaults and chart-type behavior

`app/charts/index.ts` defines the supported chart types and the logic that
creates initial chart configs. It is the first place to inspect when a new chart
type is added or chart defaults change.

This is coupled with:

- `app/charts/chart-config-ui-options.ts`
- chart-type folders under `app/charts/`
- shared chart helpers under `app/charts/shared/`

Upstream and local behavior both depend on the same idea: one normalized chart
config drives both configurator controls and final rendering.

### 5. Preview rendering during editing

`app/components/chart-preview.tsx` renders the live preview while a chart is
being edited.

It handles:

- active chart preview
- dashboard preview
- multi-block layout preview
- drag-and-drop layout interactions
- metadata panel and table preview providers
- interactive filters in non-configuring layouts

This component is separate from published rendering, but it depends on the same
chart config shape and many of the same downstream data hooks.

### 6. Published rendering

`app/components/chart-published.tsx` is the published counterpart to preview. It
reads state from `useConfiguratorState(isPublished)` and then:

- chooses the active chart or dashboard layout
- wraps rendering in `InteractiveFiltersProvider`
- loads metadata and cube components through GraphQL hooks
- renders text blocks and chart blocks through one layout pipeline
- emits iframe resize messages for embeds

This is the main rendering target for:

- `/preview`
- `/v/[chartId]`
- `/embed/[chartId]`

That means these three routes are different shells around the same published
renderer.

### 7. Config persistence and publish flow

Publishing crosses three layers:

1. `app/configurator/configurator-state/context.tsx` `publishState(...)`
   prepares the publishable state.
2. `app/utils/chart-config/api.ts` creates or updates configs through HTTP APIs.
3. `app/server/config-controller.ts` validates auth, CSRF, config keys, and data
   source allow-list before writing to storage.

The persistence routes are:

- `POST /api/config-create`
- `POST /api/config-update`
- `POST /api/config-remove`
- `GET /api/config/[key]`
- `GET /api/config/list`
- `GET/POST /api/config/view`

If you change chart persistence, do not only update the client API wrapper.
Server validation and view/embed rehydration must still accept the same stored
shape.

### 8. View and embed rehydration

The rehydration path is intentionally simple:

- `/v/[chartId]` fetches config data, reconstructs a `PUBLISHED` state, syncs
  the data source store, and renders `ChartPublished`.
- `/embed/[chartId]` reconstructs the same state and renders the same
  `ChartPublished` component inside an iframe-oriented shell.
- `/preview` does not fetch by chart id. It receives serialized state from the
  parent and then also renders `ChartPublished`.

This is one of the most important architectural decisions from upstream:
published rendering is state-driven, not page-driven.

## What this fork adds or changes

This repo keeps the upstream visualization core, but adds a broader public app
surface around it.

### Preserved upstream core

These parts are still directly recognizable from
`visualize-admin/visualization-tool`:

- `app/pages/create/[chartId].tsx`
- `app/pages/browse/index.tsx`
- `app/pages/preview.tsx`
- `app/pages/v/[chartId].tsx`
- `app/pages/embed/[chartId].tsx`
- `app/configurator/*`
- `app/charts/*`
- `app/stores/data-source.ts`
- `app/stores/interactive-filters.tsx`
- `app/components/chart-preview.tsx`
- `app/components/chart-published.tsx`

### Local fork additions around the core

This repo adds several routes that are not part of the original core loop but
feed users toward it or demonstrate it:

- `app/pages/index.tsx`
- `app/pages/gallery.tsx`
- `app/pages/demos/*`
- `app/pages/tutorials/*`
- `app/pages/topics/*`
- `app/pages/serbian-data.tsx`
- `app/pages/onboarding/index.tsx`

These pages are wrappers, marketing surfaces, tutorials, or dataset discovery
experiences. They are not the center of chart persistence/rendering logic.

### Static export behavior

This fork supports GitHub Pages and static builds, which changes how some core
pages behave:

- `app/pages/browse/index.tsx` redirects to demos in static mode.
- `app/pages/v/[chartId].tsx` and `app/pages/embed/[chartId].tsx` stub out
  persisted chart fetching in static mode.
- Full config persistence and DB-backed rehydration only work in server mode.

This difference is critical. When debugging a chart that works locally but not
on GitHub Pages, first check whether the route depends on API routes, DB state,
or auth.

### Package split

This repo also introduces reusable packages:

- `packages/core`
- `packages/react`
- `packages/connectors`

Those packages are related to the long-term product direction, but the Next.js
app under `app/` still contains the original visualization-tool page flow.

## Practical change guide

When you work on this repo, use these ownership rules.

### If you change dataset discovery

Start with:

- `app/pages/browse/index.tsx`
- `app/browse/ui/*`
- `app/domain/*`
- `app/stores/data-source.ts`

### If you change chart state, filters, layout, or publishing

Start with:

- `app/configurator/configurator-state/context.tsx`
- `app/configurator/configurator-state/reducer.tsx`
- `app/configurator/configurator-state/init.tsx`
- `app/configurator/configurator-state/index.tsx`

### If you change chart rendering or chart behavior

Start with:

- `app/charts/index.ts`
- `app/charts/<chart-type>/*`
- `app/charts/shared/*`
- `app/components/chart-preview.tsx`
- `app/components/chart-published.tsx`

### If you change stored config format or publish APIs

Start with:

- `app/utils/chart-config/api.ts`
- `app/server/config-controller.ts`
- `app/pages/api/config-create.ts`
- `app/pages/api/config-update.ts`
- `app/pages/api/config/[key].ts`
- `app/pages/v/[chartId].tsx`
- `app/pages/embed/[chartId].tsx`

## Short version

If you only remember one thing, remember this:

- `create` and `browse` are entry shells
- the configurator state machine is the real core
- `chart-preview` and `chart-published` are the two render surfaces
- `v` and `embed` are only rehydration shells around published state
- config APIs are the persistence spine

That is the upstream `visualization-tool` architecture, and this repo still uses
it as its core.
