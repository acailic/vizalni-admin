# Project Next Steps

This plan focuses on making the library safe to publish, aligning documentation
with reality, and expanding coverage around the exported chart components.

## Guiding Objectives

- Make the published package reliable for external consumers (correct
  dependencies, exports, docs).
- Reduce contributor confusion by aligning architecture documentation to actual
  code.
- Expand test coverage around exported charts and hooks to protect public API
  behavior.
- Decide how to package map functionality and its heavier dependencies.

## 0-30 Days: Stabilize And Align

- Fix package dependencies for exported charts so `app/package.json` declares
  all D3 modules used by `app/exports/charts/*`.
- Decide whether map-related dependencies belong in `dependencies` or
  `peerDependencies`, then document the installation steps.
- Update `docs/ARCHITECTURE.md` and `docs/PROJECT_OVERVIEW.md` to reflect
  current state (actual cache, data fetching, and stack).
- Add unit tests for `BarChart`, `ColumnChart`, `PieChart`, and `AreaChart` in
  `app/tests/exports/charts/`.
- Add a `useLocale` hook test in `app/tests/exports/hooks/` to cover locale
  switching behavior.
- Add a packaging/export test that validates built `dist` artifacts, not just
  source imports.

## 30-60 Days: Product And Experience

- Decide the long-term approach for MapChart: export it, split into a separate
  package, or keep it internal.
- Add a `/demos/getting-started` page or replace the docs-only approach with an
  interactive demo.
- Harden the data.gov.rs client with retry/backoff and abortable timeouts for
  slow networks.
- Ensure the multi-level cache behavior is documented and tested for eviction
  and TTL.
- Audit localization: confirm every UI surface has sr/en coverage and document
  remaining gaps.

## 60-90 Days: Scale And Operational Readiness

- Establish a release checklist (build, test, docs, changelog) and automate it
  in CI.
- Add a minimal performance baseline (chart render times, data fetch latency)
  and track regressions.
- Define a lightweight plugin strategy for new chart types to avoid growing the
  core bundle.
- Document operational requirements (data proxy, caching, and expected hosting
  constraints).

## Decision Log Needed

- MapChart packaging: single package vs separate package vs optional peer
  dependency.
- Documentation source of truth: which doc set is authoritative (app vs root).
- Export policy: which APIs are stable vs experimental (to guide future breaking
  changes).
