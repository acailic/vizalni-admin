# Visualization Tool Quality Catch-Up Plan

**Date:** 2026-03-10 **Owner:** Kevin **Baseline:**
`visualize-admin/visualization-tool` **Goal:** Close the highest-value quality
gaps between this repo and the upstream visualization workflow, especially
around create, browse, preview, publish, view, embed, and the supporting test
harness.

---

## Summary

The upstream repo is stronger in one specific area: its core visualization flow
is treated as a first-class product surface, not just a set of pages.

This repo already contains the same architectural spine:

- `app/pages/create/[chartId].tsx`
- `app/pages/browse/index.tsx`
- `app/pages/preview.tsx`
- `app/pages/v/[chartId].tsx`
- `app/pages/embed/[chartId].tsx`
- `app/configurator/*`
- `app/components/chart-preview.tsx`
- `app/components/chart-published.tsx`
- `app/server/config-controller.ts`

The main catch-up work is not inventing new architecture. It is tightening
runtime parity, route behavior, persistence, and test coverage around that
existing core.

## Priority Order

1. Restore full-route quality for persisted charts.
2. Remove runtime ambiguity between static mode and server mode.
3. Add regression coverage for the full chart lifecycle.
4. Harden the API, data-source, and interactive-filter contracts.
5. Clean up route drift and doc/build issues that reduce trust.

---

## Task 1: Restore server-mode parity for `/v/[chartId]`

**Priority:** P0 **Why it matters:** Upstream treats the public visualization
page as a real product route backed by stored config state. In this repo, the
route still has static-export stubs that reduce confidence and make parity with
upstream unclear.

**Files:**

- `app/pages/v/[chartId].tsx`
- `app/db/config/*`
- `app/utils/chart-config/api.ts`
- `app/configurator/configurator-state/context.tsx`

**Work:**

- Split full server behavior from static-export fallback explicitly.
- Keep DB-backed chart fetch and published-state rehydration as the canonical
  path in server mode.
- Make static mode fail clearly and intentionally instead of behaving like a
  broken version of the route.

**Acceptance criteria:**

- In server mode, a stored chart loads through `/v/[chartId]` and renders
  `ChartPublished`.
- The stored chart rehydrates into a valid `PUBLISHED` state.
- The route preserves publish/share UX and data-source synchronization.
- In static mode, the route shows an explicit unsupported or alternate-path
  experience.

---

## Task 2: Restore server-mode parity for `/embed/[chartId]`

**Priority:** P0 **Why it matters:** Upstream’s embed route is the most reusable
output of the tool. If embed is unreliable, the whole chart builder loses value.

**Files:**

- `app/pages/embed/[chartId].tsx`
- `app/components/chart-published.tsx`
- `app/components/embed-params.ts`
- `app/utils/public-paths.ts`

**Work:**

- Rebuild the embed route around the same persisted-state flow used by
  `/v/[chartId]`.
- Keep iframe resize behavior, embed query params, and CSP rules aligned with
  actual runtime needs.
- Make static fallback explicit instead of silently stubbing the route.

**Acceptance criteria:**

- In server mode, `/embed/[chartId]` renders a stored chart from DB-backed
  config.
- Embed params still affect the rendered output correctly.
- Height resize messages still fire for iframes.
- Static builds do not pretend the route is supported when it is not.

---

## Task 3: Centralize runtime capability gating

**Priority:** P0 **Why it matters:** The biggest quality regression in this fork
versus upstream is not one bug. It is that some core pages behave differently
depending on static export vs. full server mode, but that capability split is
not governed from one place.

**Files:**

- `app/utils/public-paths.ts`
- `app/pages/browse/index.tsx`
- `app/pages/v/[chartId].tsx`
- `app/pages/embed/[chartId].tsx`
- `app/pages/create/[chartId].tsx`
- `app/pages/index.tsx`

**Work:**

- Introduce one explicit runtime-capabilities policy for routes that require DB,
  auth, GraphQL, or live APIs.
- Stop scattering mode-specific behavior across individual pages.
- Ensure CTAs only link to routes that are actually usable in the current mode.

**Acceptance criteria:**

- Static and server mode behavior is documented and enforced consistently.
- No public CTA sends users to a known-degraded route without warning.
- Browse, view, and embed mode differences are predictable and testable.

---

## Task 4: Add one end-to-end test for the full chart lifecycle

**Priority:** P0 **Why it matters:** Upstream quality comes from treating the
chart lifecycle as one system. This repo has pieces of coverage, but it needs
one canonical test for create -> preview -> publish -> view -> embed.

**Files:**

- `e2e/*`
- `playwright*.config.ts`
- test fixtures under `app/` or `e2e/fixtures/`

**Work:**

- Add a Playwright flow that creates or loads a chart fixture, previews it,
  publishes it, opens `/v/[chartId]`, then opens `/embed/[chartId]`.
- Assert on user-visible render output, not only network calls.

**Acceptance criteria:**

- One E2E test covers the full persisted-chart lifecycle.
- The test runs in server mode in CI or a documented local workflow.
- A regression in publish/view/embed wiring breaks the test.

---

## Task 5: Add API contract tests for config CRUD and validation

**Priority:** P1 **Why it matters:** The config APIs are the persistence spine.
If they regress, the app can still look healthy while save/update/view behavior
is broken.

**Files:**

- `app/server/config-controller.ts`
- `app/pages/api/config-create.ts`
- `app/pages/api/config-update.ts`
- `app/pages/api/config/[key].ts`
- `app/pages/api/config/view.ts`
- `app/pages/api/config/list.ts`

**Work:**

- Add tests for auth, CSRF, invalid config keys, and invalid data-source URLs.
- Verify success and failure modes on create/update/view/list.

**Acceptance criteria:**

- Invalid keys and disallowed data sources are rejected.
- Unauthorized update/remove attempts fail.
- Valid persisted configs can be fetched and counted reliably.

---

## Task 6: Add regression coverage for chart-type rendering in preview and published mode

**Priority:** P1 **Why it matters:** Upstream invests heavily in chart
correctness across many chart types. This repo should verify that a chart type
works in both preview and published shells, not only in isolated component
tests.

**Files:**

- `app/components/chart-preview.tsx`
- `app/components/chart-published.tsx`
- `app/charts/*`
- `app/charts/shared/*`
- visual test files under `app/` or `e2e/`

**Work:**

- Build a small fixture matrix for core chart types: `bar`, `line`, `area`,
  `pie`, `table`, `map`.
- Render each in preview and published contexts.
- Use screenshot or DOM-level assertions depending on stability.

**Acceptance criteria:**

- Core chart types are covered by a reproducible regression matrix.
- A break in preview-only or published-only rendering is caught by tests.

---

## Task 7: Harden `dataSource` and URL sync behavior

**Priority:** P1 **Why it matters:** `app/stores/data-source.ts` affects browse,
create, view, and embed. Small mistakes here create confusing cross-page
behavior that feels random to users.

**Files:**

- `app/stores/data-source.ts`
- `app/configurator/configurator-state/context.tsx`
- `app/pages/v/[chartId].tsx`
- `app/components/data-source-menu.tsx`

**Work:**

- Add targeted tests for URL param sync, localStorage hydration, route change
  behavior, and published-view override behavior.
- Verify route changes do not leak the wrong data source into unrelated flows.

**Acceptance criteria:**

- `dataSource` is stable across refreshes and route transitions.
- Published charts correctly override stale in-memory source state.
- `__test` and preview routes still follow intended exceptions.

---

## Task 8: Add focused tests for interactive filter synchronization

**Priority:** P1 **Why it matters:** Interactive filters are one of the easiest
places for preview and published behavior to drift apart.

**Files:**

- `app/stores/interactive-filters.tsx`
- `app/charts/shared/use-sync-interactive-filters.tsx`
- `app/configurator/interactive-filters/*`
- `app/components/dashboard-interactive-filters.tsx`

**Work:**

- Test that interactive filters behave consistently in dashboard, preview, and
  published contexts.
- Verify URL or state synchronization does not desynchronize filters from chart
  blocks.

**Acceptance criteria:**

- Filter changes propagate predictably to chart render state.
- Dashboard layouts do not break filter initialization or reuse.

---

## Task 9: Audit route drift and remove fake or duplicate core surfaces

**Priority:** P2 **Why it matters:** This repo has accumulated disabled pages,
alternate entry points, and demo wrappers. That is acceptable, but the core
workflow should have one obvious route owner per concern.

**Files:**

- `app/pages/*.tsx`
- `app/pages/**/*.tsx`
- `app/pages/**/*.tsx.disabled`

**Work:**

- Audit which route is canonical for: dataset selection, chart creation,
  published chart view, embed, playground, and docs/demo entry.
- Remove dead or misleading route variants where possible.
- Document intentional non-canonical pages.

**Acceptance criteria:**

- Core workflow pages have a clearly documented canonical route.
- Disabled or legacy pages are either removed or explicitly justified.

---

## Task 10: Fix docs/build trust issues around architecture and workflow

**Priority:** P2 **Why it matters:** If contributors cannot trust the docs
build, they will stop updating the docs. That directly slows catch-up work.

**Files:**

- `docs/index.md`
- `docs/README.md`
- `docs/VISUALIZATION_TOOL_CORE_FLOW.md`
- docs build scripts in `package.json`

**Work:**

- Fix the existing VitePress frontmatter/build issue in `docs/index.md`.
- Keep the new architecture/core-flow notes accurate.
- Add a lightweight docs validation step to CI or the quality gate if feasible.

**Acceptance criteria:**

- `yarn docs:build` succeeds.
- Architecture notes match the actual route and state flow.

---

## Suggested execution order for Kevin

### Phase 1: Core parity

- Task 1
- Task 2
- Task 3

### Phase 2: Regression harness

- Task 4
- Task 5
- Task 6
- Task 7
- Task 8

### Phase 3: Cleanup and contributor trust

- Task 9
- Task 10

---

## Definition of done

This repo has caught up in quality to the upstream core when all of the
following are true:

- persisted chart view and embed routes are reliable in server mode
- static-mode limitations are explicit instead of accidental
- the create -> preview -> publish -> view -> embed flow is covered by tests
- config API validation is covered by tests
- chart rendering parity is checked in preview and published contexts
- docs and route ownership are trustworthy for future contributors
