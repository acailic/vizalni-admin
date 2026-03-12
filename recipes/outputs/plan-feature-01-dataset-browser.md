## Feature: Dataset browser with search, filtering, and preview

### Goal
Provide users with a way to discover and explore datasets from data.gov.rs through a browse page with full-text search, faceted filtering, pagination, and dataset detail pages with metadata and CSV/JSON preview.

### Affected files
| File | Change type | Description |
|------|-------------|-------------|
| `src/app/[locale]/browse/page.tsx` | modify | Already exists. Minor enhancements: add result count display, improve mobile responsiveness |
| `src/app/[locale]/browse/[id]/page.tsx` | modify | Already exists. Verify metadata display complete; ensure mobile layout |
| `src/app/[locale]/browse/loading.tsx` | modify | Already exists. Verify skeleton matches final layout |
| `src/app/[locale]/browse/error.tsx` | modify | Already exists. Add translation support, improve error display |
| `src/app/[locale]/browse/layout.tsx` | modify | Already exists. Consider adding breadcrumb navigation |
| `src/components/browse/SearchBar.tsx` | modify | Already exists. Ensure aria-label is translated properly |
| `src/components/browse/FilterSidebar.tsx` | modify | Already exists. Consider mobile drawer/accordion for responsive design |
| `src/components/browse/DatasetList.tsx` | modify | Already exists. Verify loading skeleton integration |
| `src/components/browse/DatasetPreview.tsx` | modify | Already exists. Verify all metadata fields displayed |
| `src/components/browse/PreviewTable.tsx` | modify | Already exists. Add error boundary, loading state |
| `src/components/browse/Pagination.tsx` | modify | Already exists. Verify keyboard accessibility |
| `src/components/browse/EmptyState.tsx` | modify | Already exists. Consider adding illustration/icon |
| `src/components/browse/BrowseSkeleton.tsx` | new | Loading skeleton component for mobile and desktop layouts |
| `src/components/browse/MobileFilterDrawer.tsx` | new | Mobile-friendly filter drawer using Radix UI dialog |
| `src/components/ui/DatasetCard.tsx` | modify | Already exists. Verify all required fields shown, improve accessibility |
| `src/lib/api/browse.ts` | modify | Already exists. Verify error handling, add result count field if missing |
| `src/lib/i18n/locales/sr/common.json` | modify | Already exists. Verify browse translations complete |
| `src/lib/i18n/locales/lat/common.json` | modify | Already exists. Verify browse translations complete |
| `src/lib/i18n/locales/en/common.json` | modify | Already exists. Verify browse translations complete |
| `src/types/browse.ts` | modify | Already exists. Verify types match API response |
| `src/app/api/browse/route.ts` | modify | Already exists. Verify error handling and pagination |
| `src/app/api/browse/preview/route.ts` | modify | Already exists. Verify security validation |
| `tests/e2e/browse.spec.ts` | new | E2E tests for browse functionality |
| `tests/unit/lib/api/browse.test.ts` | modify | Already exists. Add tests for edge cases |
| `tests/unit/components/browse/` | new | Component tests for browse components |

### Implementation steps

1. **Audit existing browse implementation** — Review all existing browse files for completeness against acceptance criteria. Document any gaps in functionality, translations, or accessibility. Validate that the feature is actually mostly complete.

2. **Enhance mobile responsiveness** — Add `MobileFilterDrawer.tsx` component using Radix UI dialog to display filters in a slide-out drawer on mobile. Add filter toggle button to `SearchBar.tsx` for mobile. Ensure `DatasetList.tsx` and `DatasetCard.tsx` render well on small screens.

3. **Improve loading states** — Create `BrowseSkeleton.tsx` component with proper mobile/desktop variants. Integrate with `loading.tsx`. Ensure skeleton matches actual layout to reduce layout shift.

4. **Enhance error handling** — Update `error.tsx` to use translated messages. Add error boundary around `PreviewTable.tsx` for graceful degradation when preview fails. Verify API routes return proper error codes.

5. **Add accessibility improvements** — Verify all interactive elements have proper ARIA labels. Ensure keyboard navigation works for filters, pagination, and search. Add skip links for main content. Test with screen reader.

6. **Verify SEO optimization** — Ensure page titles and meta descriptions are localized. Verify server-side rendering works correctly. Check structured data for dataset pages.

7. **Add E2E tests** — Create `tests/e2e/browse.spec.ts` with Playwright tests for: browsing datasets, searching, filtering, pagination, dataset detail view, preview table rendering, mobile layout.

8. **Add component tests** — Create `tests/unit/components/browse/` directory with tests for: `DatasetList.test.tsx`, `FilterSidebar.test.tsx`, `SearchBar.test.tsx`, `Pagination.test.tsx`, `PreviewTable.test.tsx`.

9. **Verify translations completeness** — Ensure all three locale files have matching keys for browse section. Add any missing translations. Test with each locale.

10. **Final validation** — Run full test suite. Verify all acceptance criteria met. Test on mobile devices. Check performance with SWR caching.

### New translation keys

The browse translations already exist in all three locales. The following keys are present and verified:

| Key | sr-Cyrl | sr-Latn | en |
|-----|---------|---------|-----|
| `browse.eyebrow` | Проналажење скупова | Pronalaženje skupova | Dataset discovery |
| `browse.title` | Прегледај скупове података | Pregledaj skupove podataka | Browse Datasets |
| `browse.description` | Претражите званични каталог... | Pretražite zvanični katalog... | Search the official data.gov.rs catalog... |
| `browse.search_placeholder` | Претражите скупове... | Pretražite skupove... | Search datasets... |
| `browse.clear_search` | Обриши претрагу | Obriši pretragu | Clear search |
| `browse.filters` | Филтери | Filteri | Filters |
| `browse.filter_organization` | Организација | Organizacija | Organization |
| `browse.filter_topic` | Тема | Tema | Topic |
| `browse.filter_format` | Формат | Format | Format |
| `browse.filter_frequency` | Учесталост ажурирања | Učestalost ažuriranja | Update frequency |
| `browse.clear_filters` | Обриши филтере | Obriši filtere | Clear filters |
| `browse.all_options` | Све опције | Sve opcije | All options |
| `browse.results_count` | {{count}} скупова података | {{count}} skupova podataka | {{count}} datasets found |
| `browse.no_results` | Нема резултата | Nema rezultata | No datasets matched this search |
| `browse.no_results_hint` | Покушајте са широм претрагом... | Pokušajte sa širom pretragom... | Try a broader search term... |
| `browse.last_updated` | Последња измена | Poslednja izmena | Last updated |
| `browse.resources` | Ресурси | Resursi | Resources |
| `browse.preview` | Преглед | Pregled | Preview |
| `browse.preview_limit` | Приказује се првих 100 редова... | Prikazuje se prvih 100 redova... | Showing the first 100 rows... |
| `browse.preview_error` | Преглед није могао да се учита... | Pregled nije mogao da se učita... | Preview could not be loaded... |
| `browse.preview_empty` | Нема прегледивог CSV или JSON ресурса... | Nema pregledivog CSV ili JSON resursa... | No previewable CSV or JSON resource... |
| `browse.visualize` | Визуелизуј овај скуп | Vizuelizuj ovaj skup | Visualize this dataset |
| `browse.metadata` | Метаподаци | Metapodaci | Metadata |
| `browse.page` | Страница | Stranica | Page |
| `browse.of` | од | od | of |
| `browse.mobile_filters` (NEW) | Прикажи филтере | Prikaži filtere | Show filters |
| `browse.hide_filters` (NEW) | Сакриј филтере | Sakrij filtere | Hide filters |

### Test plan

- **Unit:**
  - `normalizeBrowseSearchParams` handles edge cases (empty strings, arrays, invalid page numbers)
  - `parsePreviewData` handles malformed CSV/JSON gracefully
  - `isAllowedPreviewHost` blocks disallowed hosts
  - `findPreviewableResource` prioritizes CSV over JSON
  - URL param sync in `useSearch` hook

- **Component:**
  - `DatasetList` renders empty state when no datasets
  - `FilterSidebar` updates URL params on selection
  - `SearchBar` debounces input correctly
  - `Pagination` disables prev/next appropriately
  - `PreviewTable` shows loading/error states
  - `DatasetCard` displays all required metadata

- **E2E:**
  - Browse page loads with search and filters visible
  - Search queries return filtered results
  - Filters narrow results and update URL
  - Pagination navigates between pages
  - Dataset detail page shows metadata and resources
  - Preview table loads for CSV resources
  - "Visualize this dataset" links to create page with dataset ID
  - All three locales work correctly
  - Mobile layout renders filter drawer

### Risks and edge cases

- **data.gov.rs API rate limiting** — The API has rate limits. Mitigation: SWR caching with 5-minute revalidation, React `cache()` for server-side deduplication. Already implemented in `browse.ts`.

- **Malformed CSV/JSON in preview** — Some datasets may have malformed data. Mitigation: `papaparse` handles malformed CSV gracefully; preview shows error message instead of crashing. Add error boundary around `PreviewTable`.

- **Large resource files** — Some CSV files may be very large. Mitigation: Preview limited to 100 rows, fetched via API route with timeout. Resource URL validated before fetch.

- **CORS issues with external resources** — Some resource URLs may block cross-origin requests. Mitigation: Preview API route fetches server-side, avoiding CORS. Host allowlist restricts to data.gov.rs.

- **Hydration mismatch with locale detection** — Server and client locale detection must match. Mitigation: Use `resolveLocale` consistently, derive locale from URL params not headers on detail pages.

- **Mobile filter UX** — Sidebar doesn't fit on mobile. Mitigation: Create `MobileFilterDrawer` component using Radix UI dialog for slide-out filter panel.

- **Missing facet counts** — API may not return counts for all filter options. Mitigation: Handle missing counts gracefully, show options without counts.

- **Dataset titles in Serbian only** — API returns titles in Serbian, not translated. Mitigation: Show as-is, per spec. No translation needed.

### Open questions

1. **Search sort options** — The feature request mentions sort functionality but doesn't specify which sort options to expose. Currently uses `-last_update` (most recent first). Should we add sort dropdown? **Recommendation:** Defer to future iteration unless explicitly required.

2. **Saved searches** — Out of scope per spec, but should we add URL-based bookmarking for searches? **Already implemented** via URL params.

3. **Dataset count per page** — Currently defaults to 12. Is this appropriate for mobile? **Recommendation:** Keep 12, test on mobile, adjust if needed.

4. **Filter facet loading** — Facets are fetched in parallel with datasets. If facets fail, should filters be hidden or show empty state? **Recommendation:** Show filters with empty options, log error, don't block browsing.

### Estimated complexity
**Small** — The browse feature is already substantially implemented. The existing code includes:
- Browse page with search, filters, pagination
- Dataset detail page with metadata and preview
- API routes for datasets and preview
- Translation keys in all three locales
- Unit tests for browse utilities
- SWR caching and error handling

The remaining work is primarily:
- Mobile responsive improvements (filter drawer)
- Loading skeleton refinement
- Error handling polish
- E2E tests
- Accessibility verification

This is refinement and polish work, not new feature development.
