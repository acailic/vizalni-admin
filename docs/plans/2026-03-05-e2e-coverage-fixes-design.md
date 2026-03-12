# E2E Test Coverage for Recent Fixes

**Date:** 2026-03-05  
**Scope:** Cover fixes from commits a53b8a7, 0d02f8d, 56eaf27 with E2E tests

## Problem Statement

Recent QA fixes added new datasets to embed preview and fixed locale/script
handling, but E2E coverage only tests `budget` dataset and doesn't verify locale
switching works correctly.

## Coverage Gaps

1. **New embed datasets** - `air`, `accidents`, `students`, `vaccination`,
   `debt` aren't tested
2. **Locale handling** - DatasetCard/TopicCard `sr` vs `sr-Latn` vs `sr-Cyrl`
   fixes aren't verified
3. **Chart type variety** - Only bar chart tested, line/pie/column not verified

## Design Decision

Use **Approach C**: Add tests to `public-pages.live.spec.ts` organized with
`test.describe()` groups.

### Rationale

- Single file to maintain
- Uses existing helpers (`withDataSource`, `expectInternalHomeTarget`)
- Can run specific groups with `--grep`
- No code duplication

## Tests to Add

### Group: Embed datasets

| Test                                                    | URL                                     | Assertions                                |
| ------------------------------------------------------- | --------------------------------------- | ----------------------------------------- |
| `embed preview with air dataset renders line chart`     | `/embed/demo?type=line&dataset=air`     | Dataset label visible, SVG/canvas renders |
| `embed preview with students dataset renders bar chart` | `/embed/demo?type=bar&dataset=students` | Dataset label visible, SVG/canvas renders |

### Group: Locale/i18n

| Test                                                    | URL                                  | Assertions                                          |
| ------------------------------------------------------- | ------------------------------------ | --------------------------------------------------- |
| `topics page respects locale param for Latin script`    | `/topics/environment?locale=sr`      | No Cyrillic chars in h1                             |
| `topics page respects locale param for Cyrillic script` | `/topics/environment?locale=sr-Cyrl` | Cyrillic chars present in h1                        |
| `dataset cards show correct locale labels`              | `/topics/environment?locale=sr`      | "Ažurirano:" label (not "Updated:" or "Ажурирано:") |

## Files to Modify

- `e2e/public-pages.live.spec.ts` - Add 5 new tests in 2 describe blocks

## Out of Scope

- Testing all 6 new datasets (2 representative ones sufficient)
- Testing pie/column chart types (line/bar cover the rendering path)
- Language picker click interaction (locale param is sufficient)
