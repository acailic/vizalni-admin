I've created the implementation plan. Here's a summary:

## Feature: Time-based chart animation with playback controls

### Key Findings

**Good news:** The codebase already has significant animation infrastructure:
- `src/stores/animation.ts` — Full Zustand store with play/pause, stepping, seeking, speed control
- `src/components/charts/shared/AnimationControls.tsx` — Complete UI with `requestAnimationFrame` loop and keyboard controls
- `src/lib/data/transforms.ts` — Helper functions `extractTimeValues()`, `getTimeSlice()`, `getTimeSliceUpTo()`
- `src/types/chart-config.ts` — Animation config fields already defined (`animationEnabled`, `animationField`, `animationSpeed`)

**What's missing:**
1. No `AnimationProvider` to connect the store to chart rendering
2. Charts don't use AnimationControls or implement frame transitions
3. No configurator UI to enable/configure animation
4. Translations are hardcoded, not in locale files

### Implementation Approach

13 atomic steps that build on each other:
1. Add translations to all 3 locale files
2. Extend animation store with `animationField` and trail options
3. Create `AnimationProvider` component (data filtering + controls)
4. Integrate AnimationControls into the provider
5. Update ChartRenderer to conditionally wrap charts
6. Add D3 transitions to ScatterplotChart (dot movement + optional trail)
7. Add Recharts transitions to BarChart/ColumnChart
8. Add progressive reveal to LineChart
9. Add temporal choropleth to MapChart
10. Add animation UI to CustomizeStep configurator
11-13. Unit and E2E tests

### Estimated Complexity: Medium

The infrastructure exists; this is primarily integration work (~150-250 new lines of component code). The main risks are D3/React coordination for transitions and performance on large datasets, both manageable with careful implementation.
