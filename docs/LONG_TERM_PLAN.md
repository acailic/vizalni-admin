# Long Term Plan And Product Direction

This plan focuses on making Vizualni Admin easy to adopt as a library, reliable
in production, and aligned with the strengths of the upstream visualize-admin
project while being optimized for Serbian open data.

## Vision

Deliver a best-in-class charting and data exploration toolkit for data.gov.rs
that:

- gets new users to their first chart in minutes,
- remains stable and predictable for long-lived dashboards,
- scales from single charts to full data portals.

## Product Principles

- Simple first, powerful later: a minimal path for basic charts, with advanced
  options available but not required.
- Open data native: dataset discovery, metadata normalization, and API
  compatibility are built in.
- Stable public API: published modules are versioned, documented, and tested as
  contracts.
- Accessible by default: WCAG-friendly charts and UI components.
- Composable: works in Next.js and non-Next.js React apps.

## Audience And Jobs To Be Done

- Journalists and analysts: create a publishable chart with data.gov.rs in under
  a day.
- Government agencies: maintain public dashboards with reliable data updates and
  accessibility.
- Developers: embed charts into existing sites with minimal bundler and
  deployment work.
- Researchers: export reproducible chart configs for reports and data stories.

## Adoption Path Targets

- 5 minutes: install, import a chart, render with static data.
- 30 minutes: query data.gov.rs and render a chart with localization.
- 1 day: deploy a small dashboard with multiple charts, filters, and sharing.

## Long Term Plan

### Phase 1 (0-3 months): Package Readiness

#### Packaging And Release

- Lock down the public API surface and mark stable vs experimental exports.
- Fix package dependencies for exported charts and hooks to avoid runtime
  failures in consumer apps.
- Publish a minimal starter package and sample repo for
  `@acailic/vizualni-admin`.
- Provide a "zero-config" example that only needs a dataset ID and chart type.

#### Docs And Onboarding

- Document CORS, API proxy, and recommended deployment models for data.gov.rs.
- Publish compatibility matrix: React, Next.js, Vite, Node versions.
- Add a "First 10 minutes" guide with copy-pasteable code.

#### Testing And Quality

- Add tests for all exported chart components and hooks.
- Add a packaging test that validates built `dist` exports, not just source
  imports.
- Establish API contract tests for `/core`, `/client`, `/charts`, `/hooks`,
  `/utils`.

#### Definition Of Done

- A consumer app can install and use charts without manual dependency fixes.
- All public exports are documented, tested, and versioned.
- Quickstart runs without local patches or special bundler config.

### Phase 2 (3-6 months): Developer Experience

#### Tooling And Templates

- Provide a CLI or `npm create` flow to bootstrap a project in < 2 minutes.
- Ship templates: single chart, dashboard, story page, embed-only page.
- Add build-time linting for chart config schema errors.

#### Docs And Examples

- Create chart recipes for time series, categorical, geographic, and mixed
  charts.
- Add a visual chart config builder in docs that generates code snippets.
- Publish a "dataset cookbook" with curated Serbian datasets and example charts.

#### Definition Of Done

- A new project can be scaffolded and deployed in under 1 hour.
- Documentation covers the most common user journeys end-to-end.

### Phase 3 (6-12 months): Feature Parity And Differentiation

#### Parity With Upstream

- Decide MapChart packaging (core vs optional package) and finalize the API.
- Add advanced chart types (scatterplot, combo, map) with consistent props and
  config.
- Preserve upstream "configurator" behavior with a simplified Serbian-first UX.

#### Data And Localization

- Extend the DataGovRs client with schema inference, field typing, and data
  sampling.
- Add translation coverage reports and runtime fallbacks for missing strings.
- Offer dataset templates curated for Serbian users (health, budget,
  environment).

#### Definition Of Done

- Core feature set is comparable to visualize-admin for chart creation and
  embed.
- Map experience is stable and documented for production use.

### Phase 4 (12-24 months): Platform And Ecosystem

#### Ecosystem And Extensions

- Provide a plugin system for new charts and data adapters.
- Offer a hosted catalog of chart templates (searchable by topic and dataset).
- Provide opinionated deployments for public portals (static export + API
  proxy).

#### Operational Maturity

- Add built-in performance and usage telemetry (opt-in) for chart rendering and
  API latency.
- Establish release automation and CI quality gates.

#### Definition Of Done

- A public data portal can be deployed from templates with minimal
  customization.
- External contributors can add chart types without modifying core code.

## Make It Easy For Users

### Quickstart Paths

- Basic: `import { LineChart } from '@acailic/vizualni-admin/charts'`.
- DataGovRs: `useDataGovRs({ params: { q: 'budget' } })` + chart.
- Full: `@acailic/vizualni-admin` with a "one-page dashboard" template.

### Package Ergonomics

- Export clear defaults (`createDataGovRsClient`, `dataGovRsClient`,
  `DEFAULT_CONFIG`).
- Provide a single "chart wrapper" that accepts dataset ID + chart type +
  minimal config.
- Publish a proxy template (Cloudflare Worker or Vercel function) for CORS-safe
  access.

### Templates And Starters

- "One dataset, one chart" starter.
- "Public dashboard" starter with filters and export controls.
- "Story page" starter with narrative blocks and chart embed.

### Documentation Improvements

- Add a "First 10 minutes" guide with copy-pasteable code.
- Provide a dataset-driven cookbook with chart examples by category.
- Include migration guide from upstream visualize-admin where relevant.

### Strong Defaults

- Reasonable defaults for colors, axes, and localization.
- Built-in tooltips, legends, and responsive behavior.
- Auto-detect numeric/date fields where possible.

## Make It Great (Inspired By Upstream)

- Preserve the upstream "configurator" UX, but simplify for non-technical users.
- Provide the same "embed" capabilities with a minimal, documented API.
- Offer a data-portal-like browsing experience out of the box.
- Ensure chart exports work without Next.js and do not require special bundler
  setup.

## Workstreams And Ownership Targets

- Packaging: exports, dependencies, bundling, tree-shaking, SSR compatibility.
- Data: DataGovRs client, caching, schema inference, normalization.
- UX: configurator, embed, chart defaults, accessibility.
- Docs: quickstart, cookbook, migration guidance, versioned API docs.
- DevRel: templates, examples, community support, upstream parity tracking.
- Ops: CI quality gates, release automation, performance baselines.

## Key Architectural Decisions To Make

- Dependency strategy: which modules are required vs optional for the published
  package.
- MapChart architecture: core export vs separate package vs optional peer
  dependency.
- Document source of truth: root docs vs app docs, with clear ownership.
- API stability policy: versioning and deprecation timelines.

## Success Metrics

- Time to first chart under 10 minutes for new users.
- 95%+ API stability across minor releases.
- 80%+ unit test coverage for exported packages.
- < 5% support issues caused by missing dependencies.
- Weekly active users on example deployments.
- NPM weekly downloads of the library and starter templates.

## Risks And Mitigations

- API changes from data.gov.rs: mitigate with caching, schema normalization, and
  retries.
- Large bundle size: mitigate with optional modules and tree-shakable exports.
- Docs drift: mitigate with automated checks and doc ownership.
- Map complexity: mitigate with optional dependencies and clear integration
  guides.
