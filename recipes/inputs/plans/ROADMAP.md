# Feature Roadmap: vizuelni-admin-srbije

Adaptation of the Swiss visualization-tool feature set for Serbian open data (data.gov.rs).

## Reference

The Swiss visualization-tool (`/home/nistrator/Documents/github/visualization-tool`) is the reference implementation. Features are adapted to:
- Serbian data sources (data.gov.rs REST API, not RDF/SPARQL)
- Three locales (sr-Cyrl, sr-Latn, en) instead of four (de, en, fr, it)
- Tailwind CSS instead of Material-UI/Emotion
- Existing stack: Recharts, Chart.js, D3, Plotly, Mapbox/Leaflet

## Phases

### Phase 1 — Core Data & Chart Foundation
Build the data pipeline and expand chart types to production quality.

| # | Feature | File | Depends on |
|---|---------|------|------------|
| 01 | Dataset browser & search | `feature-01-dataset-browser.md` | — |
| 02 | Data transformation pipeline | `feature-02-data-pipeline.md` | 01 |
| 03 | Expanded chart type system | `feature-03-chart-types.md` | 02 |
| 04 | Chart configurator UI | `feature-04-chart-configurator.md` | 03 |

### Phase 2 — Interactivity & Filtering
Make charts interactive and support multi-chart views.

| # | Feature | File | Depends on |
|---|---------|------|------------|
| 05 | Interactive filters | `feature-05-interactive-filters.md` | 03, 04 |
| 06 | Multi-dataset support | `feature-06-multi-dataset.md` | 02, 05 |
| 07 | Dashboard layouts | `feature-07-dashboard-layouts.md` | 05, 06 |

### Phase 3 — Export & Sharing
Let users save, share, and embed their work.

| # | Feature | File | Depends on |
|---|---------|------|------------|
| 08 | Chart export (PNG, CSV, Excel) | `feature-08-chart-export.md` | 03 |
| 09 | Shareable URLs & state encoding | `feature-09-shareable-urls.md` | 04, 05 |
| 10 | Embeddable charts | `feature-10-embeddable-charts.md` | 09 |

### Phase 4 — Maps & Geography
Serbian geographic visualizations.

| # | Feature | File | Depends on |
|---|---------|------|------------|
| 11 | Serbian geographic maps | `feature-11-serbian-maps.md` | 02, 03 |
| 12 | Choropleth & symbol maps | `feature-12-choropleth-maps.md` | 11 |

### Phase 5 — Persistence & Auth
Save charts to a database, support user accounts.

| # | Feature | File | Depends on |
|---|---------|------|------------|
| 13 | Chart config persistence | `feature-13-chart-persistence.md` | 04 |
| 14 | User auth & chart ownership | `feature-14-user-auth.md` | 13 |

### Phase 6 — Advanced Features
Polish and advanced visualization capabilities.

| # | Feature | File | Depends on |
|---|---------|------|------------|
| 15 | Color palette system | `feature-15-color-palettes.md` | 03 |
| 16 | Annotations & reference lines | `feature-16-annotations.md` | 03, 05 |
| 17 | Time-based animation | `feature-17-animation.md` | 05 |
| 18 | Accessibility audit & fixes | `feature-18-accessibility.md` | 03, 04, 05 |

## Execution model

Each feature file is a filled-in `feature-request-template.md` designed to be consumed by `recipes/plan-feature.yaml`:

```bash
goose run --recipe recipes/plan-feature.yaml
# Agent reads the most recent feature-*.md from recipes/inputs/plans/
```

Or target a specific feature:
```bash
cp recipes/inputs/plans/feature-03-chart-types.md recipes/inputs/feature-chart-types.md
goose run --recipe recipes/plan-feature.yaml
```

## Key adaptation decisions

| Swiss tool | Serbian adaptation | Rationale |
|-----------|-------------------|-----------|
| RDF/SPARQL + GraphQL | data.gov.rs REST API + tRPC or API routes | data.gov.rs is a CKAN-based REST API, not a SPARQL endpoint |
| Material-UI + Emotion | Tailwind + Radix UI | Already committed to Tailwind stack |
| io-ts runtime validation | Zod schemas | Zod already in the project, simpler API |
| Lingui (4 locales) | next-intl + i18next (3 locales) | Already configured |
| Prisma + PostgreSQL | Prisma + PostgreSQL (or SQLite for dev) | Same approach works |
| Apollo Client + URQL | SWR + React Query | Already in project, simpler for REST |
| deck.gl + Maplibre | Mapbox GL + Leaflet (existing) + D3-geo | Already configured, sufficient for Serbian geography |
| Swiss Federal CI theme | Serbian government colors + NotoSans Cyrillic | Already in tailwind.config |
