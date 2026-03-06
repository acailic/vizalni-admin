# Demo Pages Audit Matrix

**Generated:** 2026-03-06 **Purpose:** Track status of all demo pages -
visualization, data availability, and working state

## Active Demo Pages

| Page Name    | Route                 | Has Visualization                            | Has Data                            | Status     |
| ------------ | --------------------- | -------------------------------------------- | ----------------------------------- | ---------- |
| Demo Index   | `/demos`              | ❌ No (cards/stats only)                     | ✅ Yes (DEMO_CONFIGS stats)         | ✅ Working |
| Playground   | `/demos/playground`   | ✅ Yes (ChartRenderer)                       | ✅ Yes (SAMPLE_DATASETS)            | ✅ Working |
| Showcase     | `/demos/showcase`     | ✅ Yes (FeaturedChartCard)                   | ✅ Yes (FEATURED_CHARTS)            | ✅ Working |
| Demographics | `/demos/demographics` | ✅ Yes (PopulationPyramid, PopulationTrends) | ✅ Yes (serbia-demographics static) | ✅ Working |
| Dynamic Demo | `/demos/[demoId]`     | ✅ Yes (ChartVisualizer)                     | ✅ Yes (useDataGovRs + fallbacks)   | ✅ Working |
| Pitch        | `/demos/pitch`        | ❌ No (cards only)                           | ✅ Yes (DEMO_CONFIGS)               | ✅ Working |

### Summary: Active Pages

- **Total:** 6 pages
- **With Visualization:** 4
- **With Data:** 6
- **All Working:** 6

---

## Disabled Demo Pages

| Page Name             | File                                 | Has Visualization    | Has Data              | Status                   |
| --------------------- | ------------------------------------ | -------------------- | --------------------- | ------------------------ |
| Air Quality           | `air-quality.tsx.disabled`           | ✅ Yes (multi-chart) | ✅ Yes (useDataGovRs) | 🔸 Disabled              |
| Climate               | `climate.tsx.disabled`               | ❓ Unknown           | ❓ Unknown            | 🔸 Disabled              |
| Digital               | `digital.tsx.disabled`               | ❓ Unknown           | ❓ Unknown            | 🔸 Disabled              |
| Economy               | `economy.tsx.disabled`               | ❓ Unknown           | ❓ Unknown            | 🔸 Disabled              |
| Education Trends      | `education-trends.tsx.disabled`      | ❓ Unknown           | ❓ Unknown            | 🔸 Disabled              |
| Employment            | `employment.tsx.disabled`            | ❓ Unknown           | ❓ Unknown            | 🔸 Disabled              |
| Energy                | `energy.tsx.disabled`                | ❓ Unknown           | ❓ Unknown            | 🔸 Disabled              |
| Getting Started       | `getting-started.tsx.disabled`       | ❓ Unknown           | ❓ Unknown            | 🔸 Disabled              |
| Healthcare            | `healthcare.tsx.disabled`            | ❓ Unknown           | ❓ Unknown            | 🔸 Disabled              |
| MapChart Demo         | `mapchart-demo.tsx.disabled`         | ❓ Unknown           | ❓ Unknown            | 🔸 Disabled              |
| Modern API            | `modern-api.tsx.disabled`            | ❓ Unknown           | ❓ Unknown            | 🔸 Disabled              |
| Pitch (old)           | `pitch.tsx.disabled`                 | ❓ Unknown           | ❓ Unknown            | 🔸 Disabled (superseded) |
| Playground V2         | `playground-v2.tsx.disabled`         | ❓ Unknown           | ❓ Unknown            | 🔸 Disabled              |
| Plugin System         | `plugin-system.tsx.disabled`         | ❓ Unknown           | ❓ Unknown            | 🔸 Disabled              |
| Presentation          | `presentation.tsx.disabled`          | ❓ Unknown           | ❓ Unknown            | 🔸 Disabled              |
| Presentation Enhanced | `presentation-enhanced.tsx.disabled` | ❓ Unknown           | ❓ Unknown            | 🔸 Disabled              |
| Public Health Crisis  | `public-health-crisis.tsx.disabled`  | ❓ Unknown           | ❓ Unknown            | 🔸 Disabled              |
| Regional Development  | `regional-development.tsx.disabled`  | ❓ Unknown           | ❓ Unknown            | 🔸 Disabled              |
| Social Media Sharing  | `social-media-sharing.tsx.disabled`  | ❓ Unknown           | ❓ Unknown            | 🔸 Disabled              |
| Transport             | `transport.tsx.disabled`             | ❓ Unknown           | ❓ Unknown            | 🔸 Disabled              |
| Category (dynamic)    | `[category].tsx.disabled`            | ❓ Unknown           | ❓ Unknown            | 🔸 Disabled              |
| Lazy Demo Wrapper     | `_lazy-demo-wrapper.tsx.disabled`    | N/A (utility)        | N/A                   | 🔸 Disabled              |

### Summary: Disabled Pages

- **Total:** 22 files
- **Verified with Visualization:** 1 (Air Quality)
- **Needs Audit:** 20 (marked with ❓)

---

## Legend

| Symbol      | Meaning                        |
| ----------- | ------------------------------ |
| ✅ Yes      | Confirmed working/available    |
| ❌ No       | Confirmed not present          |
| ❓ Unknown  | Needs manual verification      |
| 🔸 Disabled | File has `.disabled` extension |
| ⚠️ Partial  | Partially working              |
| N/A         | Not applicable                 |

---

## Next Steps

1. **Audit disabled pages** - Enable each `.disabled` file temporarily to verify
   visualization and data status
2. **Test active pages** - Run E2E tests to confirm all active pages render
   correctly
3. **Update matrix** - Fill in ❓ entries as pages are audited
4. **Prioritize re-enabling** - Based on business value, determine which
   disabled pages to restore

---

## Related Files

- Demo configs: `app/lib/demos/config.ts`
- Demo fallbacks: `app/lib/demos/fallbacks.ts`
- Validated datasets: `app/lib/demos/validated-datasets.ts`
- E2E tests: `e2e/public-pages.live.spec.ts`
