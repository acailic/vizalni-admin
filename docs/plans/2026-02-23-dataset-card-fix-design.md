# Dataset Card Button Fix Design

**Date:** 2026-02-23 **Status:** Approved **Goal:** Fix broken "Visualize"
button in DatasetCard component

## Problem

The DatasetCard component in the topics feature has a "Визуализуј" (Visualize)
button that links to `/create/new?dataset=${dataGovRsId}`, but:

1. The configurator expects `?cube=<cube_iri>` parameter, not `?dataset=`
2. Even with the correct parameter, topics data has data.gov.rs IDs, not cube
   IRIs
3. In static export mode (GitHub Pages), the configurator doesn't work at all
   (no GraphQL endpoint)

## Solution

Replace both buttons with a single "Open on data.gov.rs" button that links
directly to the dataset page on data.gov.rs.

## Design Decision

| Decision     | Choice                | Rationale                                       |
| ------------ | --------------------- | ----------------------------------------------- |
| Button count | Single button         | Cleaner UI, no redundant actions                |
| Link target  | data.gov.rs           | Works in all deployment modes                   |
| Button style | `variant="contained"` | Primary action, consistent with existing design |

## Changes

### File: `app/components/topics/DatasetCard.tsx`

**Before:**

- Two buttons: "Визуализуј" (Visualize) and "Погледај на data.gov.rs"
- "Visualize" links to broken `/create/new?dataset=...`
- "View on data.gov.rs" links to data.gov.rs

**After:**

- Single button: "Отвори на data.gov.rs" / "Open on data.gov.rs"
- Links directly to `dataset.dataGovRsUrl`
- Opens in new tab (`target="_blank"`)

### Localization

| Locale        | Label                 |
| ------------- | --------------------- |
| sr (Cyrillic) | Отвори на data.gov.rs |
| sr-Latn       | Otvori na data.gov.rs |
| en            | Open on data.gov.rs   |

## Success Criteria

- [ ] Single button in DatasetCard
- [ ] Button opens data.gov.rs dataset page in new tab
- [ ] Works in both development and static export modes
- [ ] No broken links
