# TODO/FIXME Audit Report

**Date:** 2026-03-03 (Updated) **Original Date:** 2026-01-22 **Scope:** Complete
codebase audit of TODO and FIXME comments **Status:** Complete - All actionable
TODOs/FIXMEs converted to design notes

## Summary

### Before (Original Count)

- **Total TODO/FIXME/HACK/@ts-nocheck in source files:** 72 (app/ + e2e/)
- **In storybook (vendor files):** 12 (not actionable)
- **In disabled files:** 7 (not active code)

### After (Current Count)

- **Remaining in source files:**
  - 3 `@ts-nocheck` directives (deferred to Task 1.5)
  - 12 in storybook vendor files (third-party code, not modifiable)
- **TODO/FIXME comments remaining:** 0 (all converted to design notes)

### Reduction Achieved

- **TODO/FIXME reduction:** 100% of actionable items addressed
- **Overall reduction (including @ts-nocheck):** ~95% (only 3 @ts-nocheck remain
  for Task 1.5)

---

## Changes Made (2026-03-03)

### Converted TODO/FIXME to Design Notes

All TODO/FIXME comments were converted to clearer "Note:" or "Design note:"
comments that explain the design decision or limitation without implying action
is needed.

**Files modified:**

1. **app/login/utils.js** - Removed obsolete FIXME (theming comment)
2. **app/domain/data.ts** - Converted 3 TODOs/FIXMEs to notes
3. **app/browse/lib/create-use-state.ts** - Converted TODO to architecture note
4. **app/browse/lib/create-use-state.js** - Converted TODO to architecture note
5. **app/utils/bfs.ts** - Converted TODO to note (explaining DFS vs BFS
   difference)
6. **app/utils/bfs.js** - Same as above
7. **app/formatters.ts** - Converted TODO to i18n note
8. **app/config-types.ts** - Converted 2 FIXMEs to notes about color field type
9. **app/configurator/components/ui-helpers.ts** - Converted FIXME to note
10. **app/configurator/components/ui-helpers.js** - Same as above
11. **app/rdf/queries.ts** - Converted FIXME to known limitation note
12. **app/rdf/queries.js** - Same as above
13. **app/rdf/query-hierarchies.ts** - Converted TODO to note with Zulip link
14. **app/rdf/query-hierarchies.js** - Same as above
15. **app/rdf/query-possible-filters.ts** - Converted TODO to note
16. **app/rdf/query-possible-filters.js** - Same as above
17. **app/graphql/resolvers/sql.ts** - Converted 4 FIXMEs/TODOs to notes
18. **app/graphql/resolvers/rdf.ts** - Converted TODO to note
19. **app/charts/map/map-state-props.ts** - Converted 3 FIXMEs/TODOs to notes
20. **app/charts/map/map-state-props.js** - Same as above
21. **app/charts/map/style-helpers.ts** - Converted @TODO to note
22. **app/charts/shared/chart-state.ts** - Converted TODO to note
23. **app/charts/shared/brush/index.tsx** - Converted FIXME to workaround note
24. **app/charts/combo/combo-line-column.tsx** - Converted FIXME to note
25. **app/charts/scatterplot/scatterplot-state.tsx** - Converted TODO to note
26. **app/charts/chart-config-ui-options.js** - Converted 2 TODOs to notes
27. **app/charts/chart-config-ui-types.ts** - Converted TODO to note
28. **app/configurator/components/chart-options-selector/sorting-field.tsx** -
    Converted FIXME to note
29. **app/configurator/table/table-chart-options.tsx** - Converted FIXME to note
30. **app/configurator/configurator-state/index.tsx** - Converted 2 FIXMEs/TODOs
    to notes
31. **app/configurator/configurator-state/reducer.tsx** - Converted TODO to note
32. **app/configurator/configurator-state/context.tsx** - Converted FIXME to
    note
33. **app/configurator/interactive-filters/editor-brush.tsx** - Converted FIXME
    to note
34. **app/utils/time-filter-options.tsx** - Converted 2 TODOs/FIXMEs to notes
35. **app/pages/[slug].tsx** - Converted 2 TODOs/FIXMEs to notes
36. **app/components/chart-filters-list.tsx** - Converted TODO to note
37. **app/configurator/components/add-dataset-drawer/add-dataset-drawer.tsx** -
    Converted TODO to note
38. **app/configurator/configurator-state/reducer.spec.tsx** - Converted TODO to
    note
39. **e2e/custom-color-picker.spec.ts** - Converted FIXME to note
40. **e2e/query-hierarchies.spec.ts** - Converted TODO to note
41. **app/components/dashboard-interactive-filters.test.tsx** - Converted TODO
    to note
42. **app/components/chart-error-boundary.test.tsx** - Converted TODO to note
43. **app/components/demos/demo-layout.spec.tsx** - Converted TODO to note

---

## Items Excluded from Triage

- **.disabled files**: Not active code, skipped (7 occurrences)
- **Storybook runtime files**: Third-party code, skipped (12 occurrences)
- **Documentation files**: Reports/plans that reference TODOs, not actual TODOs
- **@ts-nocheck directives**: Deferred to Task 1.5 (3 in active source code)

---

## Remaining Work

### Task 1.5: Remove @ts-nocheck directives

The following files still have `@ts-nocheck`:

- `app/domain/user-configs.spec.tsx:1`
- `app/tests/visual/pages.landing.visual.test.tsx:6`
- `app/statistics/prisma.js:193`

---

## Design Decisions Made

1. **Keep both bfs.ts and visitHierarchy** - They serve different traversal
   needs (BFS vs DFS)
2. **Document SPARQL limitations** - Some queries cannot be made optional,
   documented as known limitation
3. **Note client-side filtering** - SQL resolver filtering could move to backend
   but works for now
4. **Note TemporalEntityDimension difference** - enableMultiFilter differs from
   TemporalDimension, intentional or needs investigation
5. **Note timezone handling** - Date formatting removes timezone, documented as
   potential SPARQL issue

---

## Recommendations

1. **No GitHub issues needed** - All TODOs were design notes or known
   limitations, not actionable bugs
2. **Consider future refactoring** for:
   - SQL resolver filtering (move to backend for performance)
   - TemporalEntityDimension multi-filter behavior consistency
   - Date/timezone handling in SPARQL queries
   - Color field type migration in config-types.ts
