# Demo Pages Audit Matrix

**Generated:** 2026-03-06 **Purpose:** Track status of all demo pages -
visualization, data availability, and working state

**Last Verified:** 2026-03-06 (E2E tests on live GitHub Pages)

## Live Site Status (GitHub Pages)

| Page         | Route                 | Chart Renders  | Notes                                        |
| ------------ | --------------------- | -------------- | -------------------------------------------- |
| Playground   | `/demos/playground`   | ✅ Yes         | D3 LineChart with SVG, paths, axes           |
| Showcase     | `/demos/showcase`     | N/A (cards)    | Card gallery by design, no actual charts     |
| Demographics | `/demos/demographics` | ⚠️ Placeholder | Shows "Vizualizacija će biti prikazana ovde" |
| Air Quality  | `/demos/air-quality`  | ⚠️ Placeholder | Shows "Vizualizacija će biti prikazana ovde" |
| Economy      | `/demos/economy`      | ⚠️ Placeholder | Shows "Vizualizacija će biti prikazana ovde" |

**Finding:** Dynamic demo pages show placeholder messages on the live site that
don't exist in the current source code. This suggests the deployed version is
outdated or from a different branch.

---

## Active Demo Pages (Source Code)

| Page Name    | Route                 | Has Visualization                            | Has Data                            | Status     |
| ------------ | --------------------- | -------------------------------------------- | ----------------------------------- | ---------- |
| Demo Index   | `/demos`              | ❌ No (cards/stats only)                     | ✅ Yes (DEMO_CONFIGS stats)         | ✅ Working |
| Playground   | `/demos/playground`   | ✅ Yes (ChartRenderer)                       | ✅ Yes (SAMPLE_DATASETS)            | ✅ Working |
| Showcase     | `/demos/showcase`     | ❌ No (FeaturedChartCard - icons only)       | ✅ Yes (FEATURED_CHARTS)            | ✅ Working |
| Demographics | `/demos/demographics` | ✅ Yes (PopulationPyramid, PopulationTrends) | ✅ Yes (serbia-demographics static) | ✅ Working |
| Dynamic Demo | `/demos/[demoId]`     | ✅ Yes (ChartVisualizer)                     | ✅ Yes (useDataGovRs + fallbacks)   | ✅ Working |
| Pitch        | `/demos/pitch`        | ❌ No (cards only)                           | ✅ Yes (DEMO_CONFIGS)               | ✅ Working |

### Summary: Active Pages

- **Total:** 6 pages
- **With Visualization:** 4 (Playground, Demographics, Dynamic Demo)
- **With Data:** 6
- **All Working:** 6 (in source code)

---

## Disabled Demo Pages

| Page Name             | File                                 | Has Visualization            | Has Data                            | Status                   |
| --------------------- | ------------------------------------ | ---------------------------- | ----------------------------------- | ------------------------ |
| Air Quality           | `air-quality.tsx.disabled`           | ✅ Yes (multi-chart)         | ✅ Yes (useDataGovRs)               | 🔸 Disabled              |
| Climate               | `climate.tsx.disabled`               | ✅ Yes (Column/Line/Pie)     | ✅ Yes (serbia-climate static)      | 🔸 Disabled              |
| Digital               | `digital.tsx.disabled`               | ✅ Yes (Bar/Column/Line)     | ✅ Yes (serbia-digital + LivePanel) | 🔸 Disabled              |
| Economy               | `economy.tsx.disabled`               | ✅ Yes (Column/Line/Pie)     | ✅ Yes (serbia-economy + LivePanel) | 🔸 Disabled              |
| Education Trends      | `education-trends.tsx.disabled`      | ✅ Yes (Column/Line)         | ✅ Yes (inline static + LivePanel)  | 🔸 Disabled              |
| Employment            | `employment.tsx.disabled`            | ✅ Yes (LineChart)           | ✅ Yes (serbia-employment + Live)   | 🔸 Disabled              |
| Energy                | `energy.tsx.disabled`                | ✅ Yes (Bar/Line/Pie)        | ✅ Yes (serbia-energy + LivePanel)  | 🔸 Disabled              |
| Getting Started       | `getting-started.tsx.disabled`       | ✅ Yes (Bar/Column/Line/Pie) | ✅ Yes (sample inline)              | 🔸 Disabled              |
| Healthcare            | `healthcare.tsx.disabled`            | ✅ Yes (LineChart)           | ✅ Yes (serbia-healthcare + Live)   | 🔸 Disabled              |
| MapChart Demo         | `mapchart-demo.tsx.disabled`         | ✅ Yes (MapChart)            | ✅ Yes (inline GeoJSON)             | 🔸 Disabled              |
| Modern API            | `modern-api.tsx.disabled`            | ✅ Yes (@vizualni/react)     | ✅ Yes (inline sample)              | 🔸 Disabled              |
| Pitch (old)           | `pitch.tsx.disabled`                 | ✅ Yes (Column/Line)         | ✅ Yes (serbia-digital/energy)      | 🔸 Disabled (superseded) |
| Playground V2         | `playground-v2.tsx.disabled`         | ✅ Yes (@vizualni/react)     | ✅ Yes (inline sample)              | 🔸 Disabled              |
| Plugin System         | `plugin-system.tsx.disabled`         | ✅ Yes (RadarChart plugin)   | ✅ Yes (inline sample)              | 🔸 Disabled              |
| Presentation          | `presentation.tsx.disabled`          | ✅ Yes (Column/Line)         | ✅ Yes (serbia-digital/economy)     | 🔸 Disabled              |
| Presentation Enhanced | `presentation-enhanced.tsx.disabled` | ✅ Yes (Column/Line)         | ✅ Yes (serbia-digital/economy/ene) | 🔸 Disabled              |
| Public Health Crisis  | `public-health-crisis.tsx.disabled`  | ✅ Yes (Column/Line)         | ✅ Yes (serbia-healthcare + Live)   | 🔸 Disabled              |
| Regional Development  | `regional-development.tsx.disabled`  | ✅ Yes (Column/Bar)          | ✅ Yes (inline static + LivePanel)  | 🔸 Disabled              |
| Social Media Sharing  | `social-media-sharing.tsx.disabled`  | ❌ No (placeholder)          | ❌ No (placeholder)                 | 🔸 Disabled (incomplete) |
| Transport             | `transport.tsx.disabled`             | ✅ Yes (Bar/Line)            | ✅ Yes (serbia-traffic + LivePanel) | 🔸 Disabled              |
| Category (dynamic)    | `[category].tsx.disabled`            | ✅ Yes (ChartVisualizer)     | ✅ Yes (useDataGovRs + fallbacks)   | 🔸 Disabled              |
| Lazy Demo Wrapper     | `_lazy-demo-wrapper.tsx.disabled`    | N/A (utility)                | N/A                                 | 🔸 Disabled              |

### Summary: Disabled Pages

- **Total:** 22 files
- **With Visualization:** 20 (all complete except Social Media Sharing)
- **With Data:** 20 (all complete except Social Media Sharing)
- **Incomplete/Placeholder:** 1 (Social Media Sharing)
- **Superseded:** 1 (old Pitch - new version active)

---

## Legend

| Symbol      | Meaning                                 |
| ----------- | --------------------------------------- |
| ✅ Yes      | Confirmed working/available             |
| ❌ No       | Confirmed not present                   |
| ❓ Unknown  | Needs manual verification               |
| 🔸 Disabled | File has `.disabled` extension          |
| ⚠️ Partial  | Partially working / outdated deployment |
| N/A         | Not applicable                          |

---

## Next Steps

1. ~~**Audit disabled pages**~~ - ✅ Complete (all 22 files reviewed)
2. ~~**Test active pages**~~ - ✅ Complete (E2E tests on live site)
3. **Redeploy to GitHub Pages** - Deploy current source code to fix placeholder
   issue on dynamic demos
4. **Prioritize re-enabling** - Based on business value, determine which
   disabled pages to restore
5. **Fix Social Media Sharing** - Placeholder needs implementation
6. **Consider consolidating** - Old Pitch + new Pitch, Presentation +
   Presentation Enhanced

---

## Technical Details

### Chart Components Used

- **Playground**: Uses `@/exports/charts` with dynamic imports (`ssr: false`)
- **Dynamic Demos**: Uses `@/components/demos/charts/ChartVisualizer`
- **Fallback Data**: `DEMO_FALLBACKS` in `app/lib/demos/fallbacks.ts`

### E2E Test Findings

```
Playground charts: [{"id":"line-chart","width":"799.328125","height":"400","hasPath":true,"hasAxis":true}]
Showcase: No chart-sized SVGs (expected - card gallery)
Demographics/Air-Quality/Economy: Placeholder message on live site
```

---

## Related Files

- Demo configs: `app/lib/demos/config.ts`
- Demo fallbacks: `app/lib/demos/fallbacks.ts`
- Validated datasets: `app/lib/demos/validated-datasets.ts`
- E2E tests: `e2e/public-pages.live.spec.ts`
- Chart exports: `app/exports/charts/index.ts`
- Demo charts: `app/components/demos/charts/`
