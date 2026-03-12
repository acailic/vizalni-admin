# Feature 07: Multi-Chart Dashboard Layouts with Shared Filters and Grid Positioning

## Current State

| Component | Status | Location |
|-----------|--------|----------|
| Dashboard types | ✅ Complete | `src/types/dashboard.ts` |
| Dashboard Zustand store | ✅ Complete | `src/stores/dashboard.ts` |
| Dashboard UI components | ✅ Partial | `src/components/dashboard/` |
| Routes (new, [id]) | ✅ Exist | `src/app/[locale]/dashboard/` |
| CSS grid layout | ⚠️ Basic | `src/components/dashboard/DashboardGrid.tsx` |
| react-grid-layout | ❌ Missing | Not in `package.json` |
| Shared filter bar | ❌ Missing | Toggle exists, bar doesn't |
| DashboardFilterBar component | ❌ Missing | Needs creation |
| /dashboard/[id]/view route | ❌ Missing | View-only route needed |
| Template selection flow | ⚠️ Partial | `DashboardTemplates.tsx` exists |
| Mobile responsive stacking | ⚠️ Implicit | Needs explicit handling |
| Per-chart loading states | ❌ Missing | Store/UI gap |

---

## Remaining Workstreams

### 1. Install and Configure react-grid-layout
**Files:** `package.json`

1. Add `react-grid-layout` and `@types/react-grid-layout` as dependencies
2. Create wrapper component at `src/components/dashboard/DashboardGridLayout.tsx` that:
   - Accepts `LayoutItem[]` from store
   - Emits layout changes via `updateLayout` action
   - Configures 12-column grid with responsive breakpoints
   - Sets min/max dimensions per card

### 2. Shared Filter Bar Implementation
**Files:** 
- `src/components/dashboard/DashboardFilterBar.tsx` (new)
- `src/stores/dashboard.ts` (extend)
- `src/lib/data/transforms.ts` (extend)

1. Create `DashboardFilterBar.tsx`:
   - Render dropdowns for each `SharedFilterConfig` in store
   - Options derived from chart data sources (unique values)
   - On change, dispatch `setSharedFilterValue(id, value)`
2. Extend store with `setSharedFilterValue`, `addSharedFilter`, `removeSharedFilter`
3. Extend `applyInteractiveFilters()` to accept shared filter map and merge with per-chart filters
4. Wire `DashboardFilterBar` into `DashboardShell.tsx` (visible when `sharedFiltersEnabled`)

### 3. Add/Remove Chart Flow
**Files:**
- `src/components/dashboard/DashboardChartCard.tsx`
- `src/components/dashboard/AddChartModal.tsx` (new)
- `src/stores/dashboard.ts`

1. In edit mode, show "+" placeholder card when `charts.length < MAX_CHARTS`
2. Create `AddChartModal.tsx`:
   - Select data source
   - Select chart type
   - Initial filter config (optional)
   - On confirm, call `addChart()` with generated `LayoutItem`
3. Add delete button to `DashboardChartCard` header in edit mode → calls `removeChart(id)`
4. Auto-recalculate layout positions on add/remove to avoid collisions

### 4. View-Only Route
**Files:**
- `src/app/[locale]/dashboard/[id]/view/page.tsx` (new)
- `src/app/[locale]/dashboard/[id]/view/client.tsx` (new)

1. Create `/dashboard/[id]/view` route
2. Reuse `DashboardShell` with `editMode` forced to `false`
3. Hide edit controls (add/remove, resize handles)
4. Show shared filter bar if enabled

### 5. Templates (Minimum 2)
**Files:**
- `src/types/dashboard.ts`

1. Ensure `DASHBOARD_TEMPLATES` includes at least:
   - "blank" (empty grid)
   - "analytics-overview" (4 pre-configured charts)
2. Verify `createFromTemplate()` correctly initializes layout positions

### 6. Mobile Responsive Stacking
**Files:**
- `src/components/dashboard/DashboardGridLayout.tsx`

1. Configure `react-grid-layout` breakpoints: `{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }`
2. On mobile (sm/xs/xxs), force single-column stacking
3. Persist desktop layout separately; mobile uses row-based ordering

### 7. Per-Chart Loading States
**Files:**
- `src/components/dashboard/DashboardChartCard.tsx`
- `src/stores/dashboard.ts`

1. Extend chart state to include `isLoading: boolean`
2. In `DashboardChartCard`, show skeleton/spinner when `isLoading === true`
3. Set loading state before data fetch, clear on completion

### 8. Serializable State Export/Import
**Files:**
- `src/stores/dashboard.ts`

1. Verify `exportToJson()` returns complete, parseable JSON (layout + filters + metadata)
2. Verify `importFromJson(json)` validates schema and hydrates store
3. Add error handling for malformed imports

---

## Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| react-grid-layout SSR issues | Hydration mismatch | Use `dynamic` import with `ssr: false` |
| Shared filter options expensive | Slow dashboard load | Derive options lazily, memoize |
| Layout collisions on add | Broken grid | Implement auto-packing algorithm |
| Mobile drag UX | Poor usability | Disable drag on mobile, allow reordering via list |
| State serialization drift | Broken imports | Version the export schema |

---

## Verification

1. **Grid positioning:** Drag/reside chart → refresh → position persists
2. **Shared filters:** Set filter in bar → all relevant charts update
3. **Add/remove:** Add chart via modal → appears in grid; remove → disappears
4. **Templates:** Create from "analytics-overview" → 4 charts render with correct layout
5. **View mode:** Navigate to `/dashboard/[id]/view` → no edit controls visible
6. **Mobile:** Resize to <768px → single column, no drag handles
7. **Loading:** Add new chart → skeleton shown until data loads
8. **Export/Import:** Export → copy JSON → import → state restored

---

## Complexity

| Workstream | Effort | Files | Dependencies |
|------------|--------|-------|--------------|
| react-grid-layout | M | 2 | External lib |
| Shared filter bar | M | 3 | Existing filter system |
| Add/remove chart | M | 3 | Store, modal |
| View route | S | 2 | None |
| Templates | S | 1 | None |
| Mobile stacking | S | 1 | react-grid-layout |
| Per-chart loading | S | 2 | None |
| Serialization | S | 1 | None |

**Total: Medium complexity** — most infrastructure exists; work is integration and gap-filling.
