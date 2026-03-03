# TODO/FIXME Audit Report

**Date:** 2026-03-03 (Updated) **Original Date:** 2026-01-22 **Scope:** Complete
codebase audit of TODO and FIXME comments **Status:** Triage Complete - Ready
for GitHub Issue Creation

## Triage Summary (2026-03-03)

### Actions Taken

1. **Fixed/Removed (Stale Comments):**
   - `app/browse/lib/filters.tsx:3` - Removed stale commented-out TODO about
     TypeScript exports (issue resolved with local enum definition)
   - `app/pages/_error.js:20` - Removed @TODO about upgrading Next.js (now on
     v15.5.9, well above 12.2.1)

2. **Clarified:**
   - `app/browse/lib/create-use-state.ts:18` - Reformatted TODO to use issue
     link format
   - `app/domain/data.ts:325` - Added issue link format to standalone TODO

3. **Categorized for GitHub Issues:**
   - 15 items marked for GitHub issue creation (see "Needs Issue" section below)

### Items Excluded from Triage

- **.disabled files**: Not active code, skipped
- **Storybook runtime files**: Third-party code, skipped
- **Documentation files**: Reports/plans that reference TODOs, not actual TODOs
- **Compiled .js files**: Duplicate of .ts source files

---

## Original Summary

- **Total TODO/FIXME comments found (original):** 62
- **After triage (active source code):** ~45 (excluding docs, storybook,
  disabled files)
- **In app/exports/**: 0 (clean!)
- **In app/charts/**: 26
- **In app/configurator/**: 10
- **In app/rdf/**: 4
- **In app/utils/**: 2
- **In app/graphql/**: 5
- **In app/typings/**: 20
- **In other locations**: 5

---

## GitHub Issues to Create

The following items need GitHub issues created. Use the suggested titles and
descriptions:

### High Priority Issues

1. **TemporalEntityDimension Multi-Filter Inconsistency**
   - File: `app/domain/data.ts:159`
   - Description: TemporalEntityDimension has `enableMultiFilter: true` but
     TemporalDimension has `false`. The FIXME suggests they should behave the
     same. Investigate which is correct.

2. **Optional Dimension Handling in RDF Queries**
   - File: `app/rdf/queries.ts:562`
   - Description: Adding dimensions makes queries return nothing for dimensions
     that don't have them. No way to make optional.

3. **Color Field Type Migration**
   - File: `app/config-types.ts:961,970`
   - Description: MapAreaLayer and MapSymbolLayer color fields need conversion
     to new color field type.

4. **Missing Observations in Combo Charts**
   - File: `app/charts/combo/combo-line-column.tsx:109`
   - Description: Add missing observations based on time interval to properly
     indicate missing data.

### Medium Priority Issues

5. **Locale-Aware Decimal Separator**
   - File: `app/formatters.ts:50`
   - Description: Decimal separator should be based on locale for proper
     internationalization.

6. **Time Format Coverage**
   - File: `app/configurator/components/ui-helpers.ts:34`
   - Description: timeUnitToParser should cover more time formats.

7. **SPARQL Filtering Timezone Issue**
   - File: `app/utils/time-filter-options.tsx:52`
   - Description: Formatting dates might lead to issues with SPARQL filtering
     due to timezone handling.

8. **SQL Multi & Range Filters**
   - File: `app/graphql/resolvers/sql.ts:176`
   - Description: Implement multi and range filters in SQL resolver (currently
     only single filters work).

9. **SQL Date Handling**
   - File: `app/graphql/resolvers/sql.ts:192`
   - Description: Date handling only works for years, needs proper
     implementation for other time units.

10. **SQL Backend Migration**
    - File: `app/graphql/resolvers/sql.ts:170`
    - Description: Filter observations logic should be moved to backend for
      better performance.

### Low Priority / Investigation Needed

11. **Hierarchy Node Labels Missing**
    - File: `app/rdf/query-hierarchies.ts:45`
    - Description: Some hierarchy nodes have no label. Currently filtered out.
      See Zulip link in code.

12. **Dimension Parsing Refactor**
    - File: `app/rdf/query-possible-filters.ts:183`
    - Description: Refactor dimension parsing to avoid "mocking" cubeDimensions.

13. **Zustand Store Consideration**
    - File: `app/browse/lib/create-use-state.ts:18`
    - Description: Consider using zustand store for browse state with
      syncWithUrl control.

14. **Chart Segments Logic Verification**
    - File: `app/charts/scatterplot/scatterplot-state.tsx:110`
    - Description: Verify segments creation logic is correct (not consistent
      with other charts).

15. **Interactive Filters Date Parsing**
    - File: `app/charts/shared/brush/index.tsx:112`
    - Description: Fix in useSyncInteractiveFilters where we try to parse dates
      that can be strings.

## Categorization

### Category 1: Type System Workarounds ($FixMe = any)

**Priority:** Low-Medium | **Count:** 20

These are uses of the `$FixMe` type (defined in `app/typings/ambient.d.ts` as
`type $FixMe = any`). These are intentional type escapes for complex D3 types,
GraphQL types, or RDF library types where proper typing would require
significant effort.

**Recommendation:** Document as known technical debt, create gradual improvement
plan.

| File                                     | Line                                | Issue                     | Recommendation                                        |
| ---------------------------------------- | ----------------------------------- | ------------------------- | ----------------------------------------------------- |
| app/typings/ambient.d.ts                 | 5                                   | `$FixMe = any` definition | Keep as documented technical debt                     |
| app/typings/rdf.d.ts                     | 31-36, 78-93, 114-115, 128, 154-156 | RDF library types         | These are from Comunica/SPARQL libraries - keep as-is |
| app/charts/area/areas.tsx                | 24                                  | D3 area<$FixMe>()         | Document as D3 type limitation                        |
| app/charts/pie/pie-state.tsx             | 232                                 | D3 arc<$FixMe>()          | Document as D3 type limitation                        |
| app/charts/shared/axis-height-linear.tsx | 173                                 | D3 scale type assertion   | Document as D3 type limitation                        |
| app/configurator/config-form.tsx         | 52-53, 59                           | Form type definitions     | Could be improved with proper generics                |
| app/utils/time-filter-options.tsx        | 30                                  | Component prop type       | Could be typed properly                               |

**Action Item:** Add code comment explaining `$FixMe` usage in ambient.d.ts

---

### Category 2: Functional Improvements (TODO)

**Priority:** Medium | **Count:** 12

These represent actual feature improvements or refactoring opportunities.

| File                                            | Line | TODO                                            | Action                         | Status                     |
| ----------------------------------------------- | ---- | ----------------------------------------------- | ------------------------------ | -------------------------- |
| app/rdf/query-possible-filters.ts               | 182  | Refactor dimension parsing to avoid "mocking"   | Refactor to use real dimension | **Fixable**                |
| app/rdf/query-hierarchies.ts                    | 45   | Find out why some hierarchy nodes have no label | Investigate and fix            | **Needs Investigation**    |
| app/charts/map/map-state-props.ts               | 44   | Add abbreviations                               | Implement abbreviations        | **Fixable**                |
| app/charts/chart-config-ui-options.ts           | 176  | Handle chart-specific options differently       | Refactor architecture          | **Design Decision Needed** |
| app/charts/shared/chart-state.ts                | 1090 | Base on UI encodings?                           | Research and implement         | **Needs Discussion**       |
| app/utils/bfs.ts                                | 6    | Deduplicate with visitHierarchy                 | Consolidate duplicate logic    | **Fixable**                |
| app/graphql/resolvers/sql.ts                    | 170  | Move to backend                                 | Backend migration task         | **Infrastructure**         |
| app/graphql/resolvers/sql.ts                    | 176  | Implement multi & range filters                 | Feature implementation         | **Feature**                |
| app/graphql/resolvers/rdf.ts                    | 182  | Refactor to not fetch whole cube shape          | Performance optimization       | **Fixable**                |
| app/charts/scatterplot/scatterplot-state.tsx    | 110  | Verify segments creation logic                  | Add tests, fix if needed       | **Fixable**                |
| app/browse/lib/create-use-state.ts              | 25   | Use zustand store                               | Architecture change            | **Design Decision**        |
| app/configurator/configurator-state/reducer.tsx | 206  | Handle join by dimensions                       | Bug fix needed                 | **Fixable**                |

---

### Category 3: Design/System Issues (FIXME)

**Priority:** Low-Medium | **Count:** 15

These represent comments about adapting to design or handling edge cases.

| File                                                                  | Line     | FIXME                                                   | Action                          | Status              |
| --------------------------------------------------------------------- | -------- | ------------------------------------------------------- | ------------------------------- | ------------------- |
| app/rdf/queries.ts                                                    | 555      | Dimension query returns nothing for optional dimensions | Add optional dimension handling | **Fixable**         |
| app/rdf/queries.ts                                                    | 694      | $FixMe type in projection                               | Replace with proper type        | **Type Fix**        |
| app/config-types.ts                                                   | 941, 950 | Convert to new color field type                         | Type migration                  | **Fixable**         |
| app/charts/map/map-state-props.ts                                     | 82       | Consolidate aspect ratio logic                          | Refactor                        | **Fixable**         |
| app/charts/map/map-state-props.ts                                     | 132      | Don't store observation in object                       | Refactor state structure        | **Design Decision** |
| app/charts/map/style-helpers.ts                                       | 9        | Make guards generic                                     | Refactor to generics            | **Fixable**         |
| app/charts/column/bars-stacked-state.tsx                              | 255      | Labels can differ from dimension values                 | Fix label handling              | **Fixable**         |
| app/charts/bar/bars-stacked-state.tsx                                 | 255      | Labels can differ from dimension values                 | Fix label handling              | **Fixable**         |
| app/charts/combo/combo-line-column.tsx                                | 109      | Add missing observations basing on time interval        | Feature implementation          | **Feature**         |
| app/charts/shared/brush/index.tsx                                     | 112      | Fix in useSyncInteractiveFilters                        | Fix filter parsing              | **Fixable**         |
| app/domain/data.ts                                                    | 159      | Should behave like TemporalDimension                    | Fix type behavior               | **Fixable**         |
| app/formatters.ts                                                     | 50       | Decimal separator should be based on locale             | Use locale-aware formatting     | **Fixable**         |
| app/graphql/resolvers/sql.ts                                          | 192      | Handle properly (currently only works for years)        | Fix date handling               | **Fixable**         |
| app/configurator/table/table-chart-options.tsx                        | 170      | Remove type assertion when fields match                 | Fix type definition             | **Fixable**         |
| app/configurator/components/add-dataset-drawer/add-dataset-drawer.tsx | 348      | Verify correctness                                      | Add test                        | **Testing**         |

---

### Category 4: Obsolete/Low Priority

**Priority:** Low | **Count:** 15

These are either obsolete, already handled, or very low priority.

| File                                                                 | Line   | Comment                            | Action                       | Status          |
| -------------------------------------------------------------------- | ------ | ---------------------------------- | ---------------------------- | --------------- |
| app/login/utils.ts                                                   | 22     | backgroundColor FIXME              | Obsolete (theming changed)   | **Remove**      |
| app/domain/data.ts                                                   | 93     | Could use branded type             | Nice-to-have                 | **Defer**       |
| app/domain/data.ts                                                   | 325    | Standalone TODO                    | Unclear intent               | **Clarify**     |
| app/graphql/resolvers/sql.ts                                         | 115    | Access to parent cube              | Would require redesign       | **Defer**       |
| app/graphql/join.ts                                                  | 150    | Adapt to design                    | Design already implemented   | **Remove**      |
| app/charts/chart-data-wrapper.tsx                                    | 173    | Adapt to design                    | Design stable                | **Remove**      |
| app/charts/chart-config-ui-options.ts                                | 284    | @todo tag                          | Needs context                | **Clarify**     |
| app/charts/chart-config-ui-options.ts                                | 1379   | Add abbreviations                  | Duplicate of map-state-props | **Consolidate** |
| app/charts/chart-config-ui-options.ts                                | 1391   | Create components here?            | Architectural question       | **Defer**       |
| app/utils/time-filter-options.tsx                                    | 52     | Might lead to SPARQL issues        | Needs investigation          | **Investigate** |
| app/browse/lib/filters.tsx                                           | 3      | TypeScript export issue            | Likely resolved              | **Verify**      |
| app/configurator/interactive-filters/editor-brush.tsx                | 108    | Fix dependency array               | Known React hooks issue      | **Defer**       |
| app/configurator/configurator-state/context.tsx                      | 154    | Check for more than opener         | Edge case                    | **Defer**       |
| app/configurator/configurator-state/index.tsx                        | 78     | Color is subfield not actual field | Architectural note           | **Document**    |
| app/configurator/configurator-state/reducer.spec.tsx                 | 130    | Cubes join reset                   | Test limitation              | **Defer**       |
| app/pages/[slug].tsx                                                 | 10, 92 | Page combination, fallback check   | Next.js routing              | **Defer**       |
| app/components/chart-filters-list.tsx                                | 53     | Refactor to avoid refetch          | Performance optimization     | **Defer**       |
| app/components/chart-preview.tsx                                     | 492    | Adapt to design                    | Design stable                | **Remove**      |
| app/configurator/components/chart-options-selector/sorting-field.tsx | 81     | Remove once encoded properly       | Tech debt note               | **Defer**       |

---

## Priority Action Items

### Immediate (Fixable Now)

1. **Remove obsolete FIXMEs** (5 comments)
   - app/login/utils.ts:22
   - app/graphql/join.ts:150
   - app/charts/chart-data-wrapper.tsx:174
   - app/charts/chart-config-ui-options.ts:284 (add context or remove)
   - app/components/chart-preview.tsx:492

2. **Fix simple type issues** (3 items)
   - app/config-types.ts:941, 950 - Convert to new color field type
   - app/formatters.ts:50 - Use locale-aware decimal separator
   - app/charts/map/map-state-props.ts:82 - Consolidate aspect ratio logic

3. **Fix label handling in stacked charts** (2 items)
   - app/charts/column/columns-stacked-state.tsx:255
   - app/charts/bar/bars-stacked-state.tsx:255

### Short Term (This Week)

1. **Refactor duplicate code** (2 items)
   - app/utils/bfs.ts:6 - Deduplicate with visitHierarchy
   - app/rdf/query-possible-filters.ts:182 - Refactor dimension parsing

2. **Add missing test coverage** (2 items)
   - app/charts/scatterplot/scatterplot-state.tsx:110 - Verify segments logic
   - app/configurator/components/add-dataset-drawer/add-dataset-drawer.tsx:348

3. **Fix edge cases** (3 items)
   - app/rdf/queries.ts:555 - Optional dimension handling
   - app/charts/map/map-state-props.ts:44 - Add abbreviations
   - app/graphql/resolvers/sql.ts:192 - Fix date handling

### Medium Term (Next Sprint)

1. **Performance optimizations** (2 items)
   - app/graphql/resolvers/rdf.ts:182 - Don't fetch whole cube shape
   - app/components/chart-filters-list.tsx:53 - Avoid refetching filter labels

2. **Architecture improvements** (3 items)
   - app/charts/map/style-helpers.ts:9 - Make guards generic
   - app/charts/chart-config-ui-options.ts:176 - Chart-specific options
   - app/browse/lib/create-use-state.ts:25 - Zustand store consideration

### Long Term (Backlog)

1. **Feature implementations** (2 items)
   - app/graphql/resolvers/sql.ts:176 - Multi & range filters
   - app/charts/combo/combo-line-column.tsx:109 - Time interval observations

2. **Infrastructure changes** (2 items)
   - app/graphql/resolvers/sql.ts:170 - Move to backend
   - app/configurator/interactive-filters/editor-brush.tsx:108 - Fix dependency
     array

3. **Investigation needed** (3 items)
   - app/rdf/query-hierarchies.ts:45 - Hierarchy node labels
   - app/utils/time-filter-options.tsx:52 - SPARQL filtering issues
   - app/domain/data.ts:325 - Unclear TODO intent

---

## Notes

- **app/exports/ is clean** - No TODO/FIXME comments found in the exported
  library code
- **$FixMe type** is a documented technical debt for RDF/D3 library types
- Many FIXME comments are about design adaptation which is now stable
- Several comments are obsolete and can be removed

## Recommended Approach

1. **Quick wins first:** Remove 5-10 obsolete comments immediately
2. **Triage by file:** Fix all issues in a file when working on it
3. **Create GitHub issues:** For items needing discussion or investigation
4. **Update this doc:** Mark items as completed with PR numbers
