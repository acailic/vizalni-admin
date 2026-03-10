# Visualization Tool Cheat Sheet

Short reference for the core visualization flow in this repo, based on the
upstream `visualization-tool` architecture.

For the full write-up, see:

- [docs/reports/2026-03-10-visualization-tool-gap-summary.md](/home/nistrator/Documents/github/vizualni-admin/docs/reports/2026-03-10-visualization-tool-gap-summary.md)
- [docs/VISUALIZATION_TOOL_CORE_FLOW.md](/home/nistrator/Documents/github/vizualni-admin/docs/VISUALIZATION_TOOL_CORE_FLOW.md)

## Core flow

1. User picks a dataset in `/browse`
2. Configurator state initializes in `/create/[chartId]`
3. Live editing renders through `ChartPreview`
4. Publish persists config through `/api/config-*`
5. Public chart rehydrates through `/v/[chartId]`
6. Iframe chart rehydrates through `/embed/[chartId]`

## Route owners

- Browse:
  [app/pages/browse/index.tsx](/home/nistrator/Documents/github/vizualni-admin/app/pages/browse/index.tsx)
- Create/editor:
  [app/pages/create/[chartId].tsx](/home/nistrator/Documents/github/vizualni-admin/app/pages/create/[chartId].tsx)
- Preview:
  [app/pages/preview.tsx](/home/nistrator/Documents/github/vizualni-admin/app/pages/preview.tsx)
- Public chart:
  [app/pages/v/[chartId].tsx](/home/nistrator/Documents/github/vizualni-admin/app/pages/v/[chartId].tsx)
- Persisted embed:
  [app/pages/embed/[chartId].tsx](/home/nistrator/Documents/github/vizualni-admin/app/pages/embed/[chartId].tsx)
- Demo/embed generator:
  [app/pages/embed/index.tsx](/home/nistrator/Documents/github/vizualni-admin/app/pages/embed/index.tsx),
  [app/pages/embed/demo.tsx](/home/nistrator/Documents/github/vizualni-admin/app/pages/embed/demo.tsx)

## State owners

- Configurator lifecycle:
  [app/configurator/configurator-state/context.tsx](/home/nistrator/Documents/github/vizualni-admin/app/configurator/configurator-state/context.tsx)
- State initialization:
  [app/configurator/configurator-state/init.tsx](/home/nistrator/Documents/github/vizualni-admin/app/configurator/configurator-state/init.tsx)
- State reducer:
  [app/configurator/configurator-state/reducer.tsx](/home/nistrator/Documents/github/vizualni-admin/app/configurator/configurator-state/reducer.tsx)

## Rendering owners

- Live preview:
  [app/components/chart-preview.tsx](/home/nistrator/Documents/github/vizualni-admin/app/components/chart-preview.tsx)
- Published chart:
  [app/components/chart-published.tsx](/home/nistrator/Documents/github/vizualni-admin/app/components/chart-published.tsx)
- Layout composition:
  [app/components/chart-panel.tsx](/home/nistrator/Documents/github/vizualni-admin/app/components/chart-panel.tsx)
- Chart dispatch and filter wiring:
  [app/components/chart-with-filters.tsx](/home/nistrator/Documents/github/vizualni-admin/app/components/chart-with-filters.tsx)

## Data and persistence owners

- GraphQL API resolver dispatch:
  [app/graphql/resolvers/index.ts](/home/nistrator/Documents/github/vizualni-admin/app/graphql/resolvers/index.ts)
- GraphQL endpoint:
  [app/pages/api/graphql.ts](/home/nistrator/Documents/github/vizualni-admin/app/pages/api/graphql.ts)
- Persisted config controller:
  [app/server/config-controller.ts](/home/nistrator/Documents/github/vizualni-admin/app/server/config-controller.ts)
- Config CRUD routes:
  [app/pages/api/config-create.ts](/home/nistrator/Documents/github/vizualni-admin/app/pages/api/config-create.ts),
  [app/pages/api/config-update.ts](/home/nistrator/Documents/github/vizualni-admin/app/pages/api/config-update.ts),
  [app/pages/api/config/[key].ts](/home/nistrator/Documents/github/vizualni-admin/app/pages/api/config/[key].ts),
  [app/pages/api/config/view.ts](/home/nistrator/Documents/github/vizualni-admin/app/pages/api/config/view.ts)

## Shared route-level state

- Data source sync:
  [app/stores/data-source.ts](/home/nistrator/Documents/github/vizualni-admin/app/stores/data-source.ts)
- Interactive filters:
  [app/stores/interactive-filters.tsx](/home/nistrator/Documents/github/vizualni-admin/app/stores/interactive-filters.tsx)
- Static vs server capability policy:
  [app/utils/public-paths.ts](/home/nistrator/Documents/github/vizualni-admin/app/utils/public-paths.ts)
- Persisted page loader helper:
  [app/utils/persisted-chart-page.ts](/home/nistrator/Documents/github/vizualni-admin/app/utils/persisted-chart-page.ts)

## Where to start by task

- Route broken or unavailable: start with the route file plus
  [app/utils/public-paths.ts](/home/nistrator/Documents/github/vizualni-admin/app/utils/public-paths.ts)
- Publish/save/update bug: start with
  [app/configurator/configurator-state/context.tsx](/home/nistrator/Documents/github/vizualni-admin/app/configurator/configurator-state/context.tsx),
  [app/utils/chart-config/api.ts](/home/nistrator/Documents/github/vizualni-admin/app/utils/chart-config/api.ts),
  [app/server/config-controller.ts](/home/nistrator/Documents/github/vizualni-admin/app/server/config-controller.ts)
- Preview vs published mismatch: start with
  [app/components/chart-preview.tsx](/home/nistrator/Documents/github/vizualni-admin/app/components/chart-preview.tsx),
  [app/components/chart-published.tsx](/home/nistrator/Documents/github/vizualni-admin/app/components/chart-published.tsx),
  [app/components/chart-with-filters.tsx](/home/nistrator/Documents/github/vizualni-admin/app/components/chart-with-filters.tsx)
- Wrong data source across pages: start with
  [app/stores/data-source.ts](/home/nistrator/Documents/github/vizualni-admin/app/stores/data-source.ts)
- Persisted chart not loading: start with
  [app/pages/v/[chartId].tsx](/home/nistrator/Documents/github/vizualni-admin/app/pages/v/[chartId].tsx),
  [app/pages/embed/[chartId].tsx](/home/nistrator/Documents/github/vizualni-admin/app/pages/embed/[chartId].tsx),
  [app/utils/persisted-chart-page.ts](/home/nistrator/Documents/github/vizualni-admin/app/utils/persisted-chart-page.ts)
- Preview-only state bug: start with
  [app/pages/preview.tsx](/home/nistrator/Documents/github/vizualni-admin/app/pages/preview.tsx)

## Current known parity gaps

- `/v/[chartId]` is structurally present but still degraded versus upstream
  persisted SSR flow.
- `/embed/[chartId]` is structurally present but still degraded versus upstream
  persisted embed flow.
- Static-vs-server route behavior needs stronger central gating.
- The highest-value missing test is one canonical persisted lifecycle: create ->
  preview -> publish -> `/v/[chartId]` -> `/embed/[chartId]`
