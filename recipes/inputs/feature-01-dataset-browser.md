# Feature Request

## Title
Dataset browser with search, filtering, and preview

## Problem
Users have no way to discover and explore datasets from data.gov.rs within the application. They must know the exact dataset they want before they can visualize anything. The Swiss tool has a full browse/search interface (`app/browse/`) with faceted search, theme navigation, and dataset previews.

## Proposed behavior

### Browse page (`/browse` or `/pregledaj`)
- Full-text search bar that queries data.gov.rs search API
- Results displayed as cards (reuse/extend existing `DatasetCard` component)
- Each card shows: title, organization, resource count, formats available, last updated
- Pagination for results (data.gov.rs API supports `page` and `page_size`)

### Faceted filtering sidebar
- Filter by organization (ministry, agency, etc.)
- Filter by topic/tag
- Filter by resource format (CSV, JSON, XML, etc.)
- Filter by update frequency (daily, weekly, monthly, yearly)
- Filters update result count dynamically

### Dataset detail page (`/browse/[id]` or `/pregledaj/[id]`)
- Full metadata display: title, description, organization, license, temporal coverage, spatial coverage
- List of resources with format, size, last modified
- Preview table: load first 100 rows of the first CSV/JSON resource and render in a table
- "Visualize this dataset" button that passes the dataset to the chart configurator (Phase 1, Feature 04)

### Search behavior
- Debounced search input (300ms)
- Search query synced to URL params (`?q=...&org=...&tag=...`) for bookmarkable searches
- Empty state with suggested categories or popular datasets
- Loading skeletons during fetch

## Affected areas
- `src/app/browse/` (new route group — page, layout, loading, error)
- `src/components/ui/DatasetCard.tsx` (extend with more metadata)
- `src/components/browse/` (new: SearchBar, FilterSidebar, DatasetList, DatasetPreview, PreviewTable)
- `src/lib/api/datagov-client.ts` (add search, list organizations, list tags methods)
- `src/types/api.ts` (add Organization, Tag, SearchParams, SearchResponse types)
- `public/locales/*/common.json` (translations for browse UI)

## Constraints
- data.gov.rs API rate limits: use SWR with stale-while-revalidate and reasonable cache TTLs
- Preview table must handle malformed CSV gracefully (use papaparse, already a dependency)
- All text must be translated into sr-Cyrl, sr-Latn, and en
- Dataset titles and descriptions come from the API in Serbian; show as-is, don't translate
- Must be server-component-first for SEO (dataset pages should be indexable)

## Out of scope
- Chart creation (that's Feature 04)
- Dataset upload or editing
- User accounts or saved searches
- Real-time data streaming

## Acceptance criteria
- [ ] `/browse` page renders with search bar and filter sidebar
- [ ] Search queries data.gov.rs and displays results with <500ms perceived latency (SWR cache)
- [ ] Filters narrow results correctly (organization, tag, format)
- [ ] URL params reflect current search/filter state and are bookmarkable
- [ ] `/browse/[id]` shows full dataset metadata and resource list
- [ ] Preview table renders first 100 rows of a CSV resource
- [ ] All UI text is translated in three locales
- [ ] Page is server-rendered for SEO
- [ ] Empty and error states are handled gracefully
- [ ] Works on mobile (responsive layout)

## Prior art / references
- Swiss tool: `app/browse/` — full browse UI with search, facets, and dataset selection
- Swiss tool: `app/browse/ui/select-dataset-step.tsx`, `search-dataset-*.tsx`, `dataset-result*.tsx`
- data.gov.rs API docs: dataset search, organization list, tag list endpoints
