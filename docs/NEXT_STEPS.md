# Project Next Steps (Long-Term Plan)

This plan is the long-term execution backlog for vizualni-admin. It is written
so an agent can pick up a task with minimal additional context. Keep items
scoped, specific, and tied to files and tests.

## How to use this plan

- Update status tags: [todo], [doing], [done], [blocked].
- Each work item should include: goal, deliverables, definition of done, key
  files, tests, and dependencies.
- When a decision is required, create a decision record in
  `ai_working/decisions/` using `ai_working/decisions/README-template.md`.

## Guiding objectives

- Publish a reliable library with stable exports and correct dependencies.
- Keep documentation aligned with actual behavior and architecture.
- Protect public API behavior with unit and packaging tests.
- Make map functionality predictable in size and install experience.
- Maintain demos as proof of capability and onboarding.

## Workstreams and key files

- Packaging and exports: `app/package.json`, `app/exports/`,
  `app/tests/exports/`, `app/tests/packaging/`.
- Docs and onboarding: `docs/ARCHITECTURE.md`, `docs/PROJECT_OVERVIEW.md`,
  `docs/GETTING-STARTED.md`, `docs/release/RELEASE.md`.
- Data.gov.rs integration: `app/domain/data-gov-rs/`,
  `app/hooks/use-data-gov-rs.ts`,
  `app/__tests__/unit/data-gov-rs-client.test.ts`.
- Map and geo: `app/charts/map/`, `app/tests/exports/MapChart.test.tsx`,
  `app/tests/exports/MapChart.integration.test.tsx`.
- Demos: `app/pages/demos/`, `docs/DATASET_VISUALIZATION_PLAN.md`.
- Quality and performance: `scripts/quality-gates.js`,
  `scripts/test-performance.js`, `docs/PERFORMANCE.md`.

## 0-30 Days: Stabilize and align

- [done] Dependency audit for exported charts and hooks.
  - Goal: ensure `app/package.json` runtime deps cover `app/exports/*` usage.
  - Deliverables: dependency list, updated `app/package.json`, note in
    `docs/PROJECT_OVERVIEW.md`.
  - Definition of done: `yarn test` passes; packaging tests in
    `app/tests/packaging/` pass without missing deps.
  - Key files: `app/exports/charts/`, `app/exports/hooks/`, `app/package.json`.
  - Tests: `yarn test` (or `cd app && vitest run`).

- [todo] Align dist artifact tests with the exports map.
  - Goal: assert every `app/package.json` export path exists in `app/dist`.
  - Deliverables: update `app/tests/packaging/dist-artifacts.spec.ts` to read
    `app/package.json` and verify files.
  - Definition of done: tests fail if a dist file referenced in `exports` is
    missing.
  - Tests: `yarn test` (after `cd app && npm run build:lib`).

- [done] Documentation alignment with current architecture.
  - Goal: docs reflect actual cache layers, data fetching, and build pipeline.
  - Deliverables: updated `docs/ARCHITECTURE.md` and `docs/PROJECT_OVERVIEW.md`
    with current entry points and execution notes.
  - Definition of done: no stale references to removed modules or behaviors.

- [done] Map dependency inventory and decision memo draft.
  - Goal: capture dependency list and decision context for map packaging.
  - Deliverables: inventory of map deps (`maplibre-gl`, `react-map-gl`,
    `@deck.gl/*`, etc), decision record in `ai_working/decisions/`.
  - Definition of done: decision record includes options, criteria, and impact.

- [done] Expand exported chart tests beyond baseline.
  - Goal: cover edge cases not fully exercised (negative values, stacked series,
    label formatting, and empty data).
  - Deliverables: edge-case coverage in `app/tests/exports/charts/` for Bar,
    Column, Pie, Area, and Line charts (empty/null/single/negative/stack).
  - Definition of done: tests capture at least one edge case per chart.

- [done] Expand `useLocale` tests for SSR and hydration behavior.
  - Goal: confirm locale switching works across SSR and hydration boundaries.
  - Deliverables: additional cases in
    `app/tests/exports/hooks/useLocale.spec.ts`.
  - Definition of done: tests cover SSR/hydration alignment beyond current
    fallback coverage.

## 30-60 Days: Product and experience

- [done] Decide the long-term MapChart packaging strategy.
  - Goal: choose export strategy (core package, separate package, or optional).
  - Deliverables: decision record in `ai_working/decisions/`.
  - Definition of done: decision recorded with rationale and review triggers.

- [done] Add a `/demos/getting-started` page.
  - Goal: provide an interactive quick start with minimal sample data.
  - Deliverables: new page in `app/pages/demos/`, update
    `docs/GETTING-STARTED.md` to link it.
  - Definition of done: page loads in sr/en and uses existing chart components.
  - Completed: 2026-01-09. Page exists at `app/pages/demos/getting-started.tsx`
    with 4 chart types, 3 datasets, multi-language support.

- [done] Harden the data.gov.rs client (retry/backoff and timeouts).
  - Goal: improve reliability on slow networks.
  - Deliverables: retry/backoff + abortable timeout support in
    `app/domain/data-gov-rs/client.ts`, tests in
    `app/__tests__/unit/data-gov-rs-client-test-updated.test.ts`.
  - Definition of done: tests cover retry and timeout behavior.
  - Completed: 2026-01-09. Exponential backoff with jitter, AbortController
    timeout support, test coverage in updated client tests.

- [done] Document and test multi-level cache behavior.
  - Goal: make cache TTL/eviction predictable.
  - Deliverables: cache section updates in `docs/ARCHITECTURE.md`, tests for TTL
    or eviction behavior in relevant unit tests.
  - Definition of done: docs and tests describe the same behavior.
  - Completed: 2026-01-09. 46 tests passing in `multi-level-cache.test.ts` and
    `use-data-cache.test.ts`, cache section in ARCHITECTURE.md.

- [done] Localization audit (sr/en parity).
  - Goal: ensure every user-facing surface has sr/en coverage.
  - Deliverables: list of missing keys, updated locale files, brief note in docs
    if gaps remain.
  - Definition of done: all priority UI surfaces are translated.
  - Completed: 2026-01-09. All 636 translation keys present across en, sr-Latn,
    and sr-Cyrl. See `app/docs/LOCALIZATION_AUDIT.md` for full report.

## 60-90 Days: Scale and operational readiness

- [done] Expand release checklist and automate preflight checks in CI.
  - Goal: codify release steps with build, test, and docs gates.
  - Deliverables: update `docs/release/RELEASE.md`, add CI step to run
    `cd app && yarn build:lib` plus packaging tests.
  - Definition of done: CI prevents releases that fail preflight checks.
  - Completed: 2026-01-09. See:
    - `docs/release/RELEASE.md` - Comprehensive release guide with preflight
      checklist
    - `.github/workflows/release-preflight.yml` - CI workflow for preflight
      checks
    - `.github/workflows/release.yml` - Updated to use preflight checks
    - `scripts/test-release-preflight.sh` - Local preflight test script
    - `yarn release:preflight` - Run preflight checks locally

- [done] Establish a performance baseline for exports.
  - Goal: track chart render times and data fetch latency.
  - Deliverables: baseline numbers in `docs/PERFORMANCE.md`, updates to
    `scripts/test-performance.js`.
  - Definition of done: baseline exists and regressions are measurable.
  - Completed: 2026-01-09. See:
    - `docs/PERFORMANCE.md` - Comprehensive performance baseline documentation
    - `scripts/test-performance.js` - Updated with chart render and data fetch
      benchmarks
    - `performance-report.json` - Generated performance metrics report
    - Chart render baselines established for LineChart, BarChart, ColumnChart,
      AreaChart, PieChart
    - Data fetch latency baselines established for small/medium/large datasets
    - Bundle size baselines: 87.73 KB total (within 250 KB budget)

- [done] Define a plugin strategy for new chart types.
  - Goal: avoid growth of the core bundle.
  - Deliverables: design note and example plugin interface documented in
    `docs/ARCHITECTURE.md`.
  - Definition of done: contributors can add a chart without editing core.
  - Completed: 2026-01-09. Plugin system implemented with:
    - `app/exports/charts/plugin-types.ts`: Plugin interface definitions
    - `app/exports/charts/chart-registry.ts`: Registry implementation
    - `app/exports/charts/examples/RadarChartPlugin.tsx`: Example plugin
    - `docs/CHART_PLUGIN_GUIDE.md`: Comprehensive contributor guide
    - See `docs/ARCHITECTURE.md` "Chart plugin system" section for architecture.

- [done] Document operational requirements.
  - Goal: clarify hosting constraints, caching, and environment variables.
  - Deliverables: updates to `docs/DEPLOYMENT.md`.
  - Definition of done: deployment doc lists required env vars and constraints.
  - Completed: 2026-01-09. Added comprehensive sections on runtime modes (static
    export vs full app), complete environment variable reference with security
    best practices, detailed caching strategy (L1/L2/L3 architecture), hosting
    constraints for both modes, and extensive troubleshooting guide. Document
    expanded from 419 to 1,159 lines.

## 90-180 Days: Adoption and maintainability

- [done] Define API stability and deprecation policy.
  - Goal: clarify stable vs experimental exports.
  - Deliverables: updates in `docs/API.md` and export docs.
  - Definition of done: stable APIs are labeled and deprecation policy exists.
  - Completed: 2026-01-09. See `docs/API_STABILITY.md` for full policy. 49 APIs
    classified with stability levels, deprecation process documented.

- [done] Visual regression suite for core charts.
  - Goal: catch rendering regressions for Bar, Line, Column, Area, Pie.
  - Deliverables: Playwright visual tests and baselines in `e2e/` or
    `app/tests/`.
  - Definition of done: `yarn test:visual` covers core chart exports.
  - Completed: 2026-01-09. ~150 visual tests covering 5 core charts across
    multiple viewports, locales, themes, and data scenarios.

- [done] Expand demo catalog with data stories.
  - Goal: add 2-3 new demos using real datasets with narrative.
  - Deliverables: new pages in `app/pages/demos/`, updates in
    `docs/DATASET_VISUALIZATION_PLAN.md`.
  - Definition of done: demos load in sr/en and cite dataset sources.
  - Completed: 2026-01-09. 3 narrative demos created: education-trends,
    public-health-crisis, regional-development. All use real data.gov.rs
    datasets.

- [done] Publish API reference for exports.
  - Goal: keep docs in sync with actual exports.
  - Deliverables: integrate `yarn docs:api:build` output into docs site and link
    it from `docs/README.md` or `docs/index.md`.
  - Definition of done: API reference is accessible in published docs.
  - Completed: 2026-01-09. TypeDoc + VitePress integration, category-specific
    API guides, `npm run docs:api:build` script available.

## 180-365 Days: Ecosystem and sustainability

- [done] Map module extraction (if chosen).
  - Goal: optional map package with separate release cycle.
  - Deliverables: new package in workspace, migration guide, build pipeline
    updates.
  - Definition of done: core package works without map deps; map package is
    documented and versioned.
  - Completed: 2026-01-09. Decision made to keep MapChart in core package. See
    `ai_working/decisions/2026-01-09-mapchart-packaging.md`.

- [done] Data connector roadmap.
  - Goal: support non-data.gov.rs sources.
  - Deliverables: connector interface definition and one additional adapter (CSV
    URL or CKAN).
  - Definition of done: documented interface and working example integration.
  - Completed: 2026-01-09. See `docs/DATA_CONNECTORS.md`. Generic connector
    interface implemented, CSV URL connector added, connector registry created.

- [done] Governance and contribution path.
  - Goal: make external contributions predictable.
  - Deliverables: updates to `CONTRIBUTING.md`, issue templates, triage labels.
  - Definition of done: contributor onboarding is documented end-to-end.
  - Completed: 2026-01-09. See `docs/GOVERNANCE.md` and `docs/TRIAGE.md`.
    Updated CONTRIBUTING.md, added documentation issue template, enhanced PR
    template, created CODE_OF_CONDUCT.md.

## Decisions required (create records in `ai_working/decisions/`)

- MapChart packaging: decided in
  `ai_working/decisions/2026-01-09-mapchart-packaging.md`.
- Documentation source of truth: root docs vs app docs.
  - Evidence needed: contributor workflow and build/publish pipeline impact.
- Export policy: stable vs experimental API.
  - Evidence needed: usage in demos, tests, and external consumers.

## Open questions and assumptions

- Primary audience: internal demos vs external library consumers.
- Whether advanced map functionality (maplibre or Deck.gl) ships by default or
  stays optional.
- Node runtime target remains >= 18.
