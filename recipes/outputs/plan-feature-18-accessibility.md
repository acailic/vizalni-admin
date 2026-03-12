## Feature: Comprehensive Accessibility (WCAG 2.1 AA Compliance)

### Goal

Add systematic accessibility support across all charts, maps, forms, and navigation, ensuring blind/low-vision users can access government data visualizations through data tables, keyboard navigation, screen reader descriptions, and proper ARIA attributes.

### Affected files

| File | Change type | Description |
|------|-------------|-------------|
| `src/components/charts/shared/AccessibleTable.tsx` | new | Hidden data table component for chart accessibility alternative |
| `src/components/charts/shared/ChartContainer.tsx` | new | Wrapper with ARIA attributes, role="img", keyboard navigation, toggle table button |
| `src/components/charts/shared/ChartFrame.tsx` | modify | Add ARIA landmarks and heading hierarchy support |
| `src/components/charts/bar/BarChart.tsx` | modify | Wrap in ChartContainer, add keyboard navigation hooks |
| `src/components/charts/column/ColumnChart.tsx` | modify | Wrap in ChartContainer, add keyboard navigation hooks |
| `src/components/charts/line/LineChart.tsx` | modify | Wrap in ChartContainer, add keyboard navigation hooks |
| `src/components/charts/area/AreaChart.tsx` | modify | Wrap in ChartContainer, add keyboard navigation hooks |
| `src/components/charts/pie/PieChart.tsx` | modify | Wrap in ChartContainer, add keyboard navigation hooks |
| `src/components/charts/scatterplot/ScatterplotChart.tsx` | modify | Wrap in ChartContainer, add keyboard navigation hooks |
| `src/components/charts/combo/ComboChart.tsx` | modify | Wrap in ChartContainer, add keyboard navigation hooks |
| `src/components/charts/table/TableChart.tsx` | modify | Add proper `<th scope>` attributes |
| `src/components/charts/map/MapChart.tsx` | modify | Add role="application", keyboard region navigation, table alternative |
| `src/components/charts/map/MapControls.tsx` | modify | Ensure keyboard-accessible controls |
| `src/components/charts/ChartRenderer.tsx` | modify | Pass accessibility props to renderers, generate aria-labels |
| `src/components/configurator/CustomizeStep.tsx` | modify | Add visible labels, aria-required, aria-describedby for errors |
| `src/components/configurator/MappingStep.tsx` | modify | Add visible labels, aria-required, aria-describedby for errors |
| `src/components/configurator/DatasetStep.tsx` | modify | Add visible labels, aria-required, aria-describedby for errors |
| `src/components/ui/SkipLink.tsx` | new | Skip-to-content and skip-to-table link component |
| `src/components/ui/FocusIndicator.tsx` | new | CSS-in-JS focus ring styles (reusable) |
| `src/app/layout.tsx` | modify | Add lang attribute dynamically, add SkipLink |
| `src/app/[locale]/layout.tsx` | modify | Set lang attribute based on locale param |
| `src/app/[locale]/accessibility/page.tsx` | new | Accessibility statement page |
| `src/lib/hooks/useChartKeyboardNav.ts` | new | Keyboard navigation hook for chart data points |
| `src/lib/hooks/useReducedMotion.ts` | new | Hook to detect prefers-reduced-motion preference |
| `src/lib/charts/chart-aria.ts` | new | Utilities for generating ARIA labels and descriptions |
| `src/app/globals.css` | modify | Add reduced-motion media query, enhanced focus styles |
| `src/types/chart-config.ts` | modify | Add accessibility-related types |
| `package.json` | modify | Add jest-axe, @axe-core/playwright |
| `tests/unit/charts/AccessibleTable.test.tsx` | new | Unit tests for accessible table |
| `tests/unit/charts/ChartContainer.test.tsx` | new | Unit tests for chart container a11y |
| `tests/e2e/accessibility.spec.ts` | new | Playwright a11y tests with axe-core |
| `public/locales/sr-Cyrl/common.json` | modify | Add accessibility translation keys |
| `public/locales/sr-Latn/common.json` | modify | Add accessibility translation keys |
| `public/locales/en/common.json` | modify | Add accessibility translation keys |

### Implementation steps

**Phase 1: Foundation (CSS, hooks, utilities)**

1. **Add focus indicator styles** — Update `globals.css` with enhanced focus ring styles (3px solid ring with high contrast), add `@media (prefers-reduced-motion)` block to disable animations. Validate: keyboard navigation shows visible focus.

2. **Create `useReducedMotion` hook** — New hook in `src/lib/hooks/useReducedMotion.ts` that returns boolean based on `prefers-reduced-motion` media query. Client-side only (returns false during SSR). Validate: hook returns correct value on client.

3. **Create `chart-aria.ts` utilities** — New file in `src/lib/charts/chart-aria.ts` with functions: `generateChartAriaLabel(type, title, dataSummary)`, `generateChartDescription(highest, lowest, trend)`. Validate: unit tests pass.

4. **Create `useChartKeyboardNav` hook** — New hook in `src/lib/hooks/useChartKeyboardNav.ts` for arrow key navigation between data points. Handles Tab (enter/exit chart), ArrowLeft/Right (X axis), ArrowUp/Down (Y axis or series), Enter/Space (show tooltip), Escape (close tooltip). Validate: keyboard events trigger correct callbacks.

**Phase 2: Core accessibility components**

5. **Create `AccessibleTable` component** — New `src/components/charts/shared/AccessibleTable.tsx`. Takes chart data + config, renders `<table>` with proper `<th scope="col">` headers. Initially hidden with `sr-only` class, togglable via button. Validate: screen reader can navigate table structure.

6. **Create `ChartContainer` wrapper** — New `src/components/charts/shared/ChartContainer.tsx`. Wraps any chart with: `role="img"`, `aria-label`, `aria-describedby` (links to hidden description), "Show as table" button, keyboard event handlers, SkipLink to table. Validate: axe-core reports no violations.

7. **Create `SkipLink` component** — New `src/components/ui/SkipLink.tsx`. Visually hidden until focused, links to content/table IDs. Validate: Tab reveals link, Enter navigates to target.

8. **Create `FocusIndicator` component** — New `src/components/ui/FocusIndicator.tsx`. Exports CSS class for consistent focus styling across components. Validate: all interactive elements have matching focus style.

**Phase 3: Chart modifications**

9. **Update `ChartFrame`** — Add optional `aria-label` prop, ensure `<section>` has `aria-labelledby` pointing to heading. Validate: existing tests pass.

10. **Update `ChartRenderer`** — Import `ChartContainer`, wrap chart output, pass generated ARIA labels. Generate `aria-describedby` content with data summary (min/max/trend). Validate: rendered charts have correct ARIA attributes.

11. **Update bar chart** — Wrap in `ChartContainer`, add `AccessibleTable` toggle, integrate `useChartKeyboardNav` for data point navigation, respect `useReducedMotion`. Validate: keyboard navigation works, table toggle works.

12. **Update column chart** — Same as bar chart (step 11). Validate: keyboard navigation works.

13. **Update line chart** — Same as bar chart (step 11), plus handle multi-series keyboard navigation. Validate: multi-series keyboard navigation works.

14. **Update area chart** — Same as bar chart (step 11). Validate: keyboard navigation works.

15. **Update pie chart** — Same as bar chart (step 11), plus handle slice navigation (arrow keys cycle through slices). Validate: slice navigation works.

16. **Update scatterplot chart** — Same as bar chart (step 11), plus handle point navigation. Validate: point navigation works.

17. **Update combo chart** — Same as bar chart (step 11), plus handle multi-type navigation. Validate: navigation works across chart types.

18. **Update table chart** — Add `scope="col"` to `<th>` elements, add `scope="row"` to row headers if applicable. Validate: proper table semantics.

19. **Update `MapChart`** — Add `role="application"`, `aria-label` describing map content. Add keyboard region navigation (Tab through regions, Enter shows tooltip). Add "Show as table" button with municipality→value table. Respect `useReducedMotion`. Validate: map keyboard navigation works.

20. **Update `MapControls`** — Ensure zoom/reset buttons are `<button>` elements with visible labels, keyboard accessible. Validate: all controls reachable via Tab.

**Phase 4: Form accessibility**

21. **Audit and fix `CustomizeStep`** — Add visible `<label>` elements (not just placeholder), add `aria-required` to required fields, add `aria-describedby` linking to error messages, add `aria-live="polite"` region for validation errors. Validate: screen reader announces errors.

22. **Audit and fix `MappingStep`** — Same pattern as step 21. Validate: all inputs have labels.

23. **Audit and fix `DatasetStep`** — Same pattern as step 21. Validate: all inputs have labels.

**Phase 5: Layout and i18n**

24. **Update root layout** — Modify `src/app/layout.tsx` to add `SkipLink` at top of body. Validate: skip link visible on Tab.

25. **Update locale layout** — Modify `src/app/[locale]/layout.tsx` to set `lang` attribute on a wrapper element or communicate to root layout. Validate: `lang` matches locale in HTML.

26. **Create accessibility statement page** — New `src/app/[locale]/accessibility/page.tsx` with WCAG compliance statement, known limitations, contact info. All three locales. Validate: page renders in all locales.

27. **Add translation keys** — Add accessibility keys to all three locale files (see translation table below). Validate: all keys present, no missing translations.

**Phase 6: Testing infrastructure**

28. **Add jest-axe** — Add `jest-axe` to `package.json`, configure in Jest setup. Add axe assertions to existing component tests (at least 10). Validate: `npm test` includes axe checks.

29. **Add @axe-core/playwright** — Add to `package.json`, create `tests/e2e/accessibility.spec.ts` with axe scans of key pages. Validate: `npx playwright test accessibility` passes.

30. **Create a11y testing checklist** — Optional: create a component that renders all UI states for manual accessibility testing (not required for CI).

### New translation keys

| Key | sr-Cyrl | sr-Latn | en |
|-----|---------|---------|-----|
| `accessibility.title` | Приступачност | Pristupačnost | Accessibility |
| `accessibility.skipToContent` | Пређи на садржај | Pređi na sadržaj | Skip to content |
| `accessibility.skipToTable` | Пређи на табелу података | Pređi na tabelu podataka | Skip to data table |
| `accessibility.showAsTable` | Прикажи као табелу | Prikaži kao tabelu | Show as table |
| `accessibility.hideTable` | Сакриј табелу | Sakrij tabelu | Hide table |
| `accessibility.chartAriaLabel` | {type} приказује {title}. Табела података доступна. | {type} prikazuje {title}. Tabela podataka dostupna. | {type} showing {title}. Data table available. |
| `accessibility.chartDescription` | Опис графика | Opis grafika | Chart description |
| `accessibility.highestValue` | Највећа вредност: {value} | Najveća vrednost: {value} | Highest value: {value} |
| `accessibility.lowestValue` | Најмања вредност: {value} | Najmanja vrednost: {value} | Lowest value: {value} |
| `accessibility.dataPoint` | Тачка података {index} од {total}: {label} = {value} | Tačka podataka {index} od {total}: {label} = {value} | Data point {index} of {total}: {label} = {value} |
| `accessibility.mapAriaLabel` | Мапа приказује {title} по општинама. Користите стрелице за навигацију. | Mapa prikazuje {title} po opštinama. Koristite strelice za navigaciju. | Map showing {title} by municipality. Use arrows to navigate. |
| `accessibility.mapRegion` | Регион: {name}, вредност: {value} | Region: {name}, vrednost: {value} | Region: {name}, value: {value} |
| `accessibility.formRequired` | Обавезно поље | Obavezno polje | Required field |
| `accessibility.formError` | Грешка: {message} | Greška: {message} | Error: {message} |
| `accessibility.closeTooltip` | Затвори опис | Zatvori opis | Close tooltip |
| `accessibility.playAnimation` | Пусти анимацију | Pusti animaciju | Play animation |
| `accessibility.pauseAnimation` | Паузирај анимацију | Pauziraj animaciju | Pause animation |
| `accessibility.pageAccessibility.title` | Изјава о приступачности | Izjava o pristupačnosti | Accessibility Statement |
| `accessibility.pageAccessibility.intro` | Овај портал тежи усаглашености са WCAG 2.1 нивоом AA. | Ovaj portal teži usaglašenosti sa WCAG 2.1 nivoom AA. | This portal aims for WCAG 2.1 Level AA compliance. |
| `accessibility.pageAccessibility.contact` | Пријавите проблеме са приступачношћу | Prijavite probleme sa pristupačnošću | Report accessibility issues |
| `accessibility.pageAccessibility.knownLimitations` | Позната ограничења | Poznata ograničenja | Known limitations |

### Test plan

- **Unit tests (Jest + jest-axe):**
  - `AccessibleTable` renders proper table structure with `<th scope>`
  - `ChartContainer` has correct `role`, `aria-label`, `aria-describedby`
  - `useReducedMotion` hook returns correct preference
  - `useChartKeyboardNav` handles all keyboard events
  - `chart-aria.ts` utilities generate correct labels
  - `SkipLink` is visually hidden until focused
  - Add `expect(await axe(container)).toHaveNoViolations()` to 10+ existing component tests

- **Component tests (@testing-library/react):**
  - Chart keyboard navigation (Tab enters/exits, arrows move, Enter shows tooltip)
  - Table toggle shows/hides accessible table
  - Form fields announce errors via aria-live
  - Focus indicators are visible

- **E2E tests (Playwright + @axe-core/playwright):**
  - Home page axe scan (zero violations)
  - Dataset browse page axe scan
  - Chart configurator axe scan
  - Accessibility statement page exists in all locales
  - Skip link navigation works
  - Keyboard navigation through chart data points
  - Map keyboard navigation

### Risks and edge cases

- **Recharts SVG accessibility** — Recharts doesn't have built-in keyboard navigation for SVG elements. Mitigation: overlay invisible focusable elements over data points, sync with SVG visual state.

- **Leaflet map keyboard navigation** — Leaflet has limited keyboard support. Mitigation: custom event handlers on map container, maintain list of regions for sequential navigation.

- **SSR hydration mismatch with `useReducedMotion`** — Server can't know user's motion preference. Mitigation: hook returns `false` initially, updates on client mount. Ensure no visual jump.

- **Chart tooltip focus management** — Tooltip must receive focus when opened via keyboard. Mitigation: use `focus()` on tooltip container when Enter/Space pressed, return focus to chart on Escape.

- **Colorblind-safe palettes** — Feature request mentions color palettes. This is Feature 15 scope. Mitigation: ensure current implementation doesn't break, document that colorblind patterns are separate feature.

- **Performance with large datasets** — Accessible tables for large charts could be huge. Mitigation: cap table rows at ~100, add "Download full data" link for complete dataset.

- **Translation key drift** — Three locales must stay in sync. Mitigation: CI check for missing keys, code review requirement.

- **`lang` attribute timing** — Root layout is static, locale comes from `[locale]` segment. Mitigation: set `lang` in `[locale]/layout.tsx` via client effect or use `next-intl` middleware to set lang attribute.

### Open questions

- **Should keyboard navigation be on by default or require opt-in?** Recommendation: on by default for government compliance, but configurable via `options.accessibility.keyboardNav = false`.

- **Should accessible tables be rendered in DOM always or lazy-loaded?** Recommendation: render in DOM but hidden (`sr-only`) for simplicity. Large tables could use virtualization.

- **Animation control behavior** — Should `prefers-reduced-motion` pause animations or just disable transition effects? Recommendation: pause auto-play animations, keep manual step controls available.

- **Map table format** — What columns should map data table show? Recommendation: Region name (localized), Value, Rank (optional).

### Estimated complexity

**Medium-Large** — This is a cross-cutting feature affecting 25+ files across charts, forms, layout, and tests. The individual changes are straightforward (ARIA attributes, keyboard handlers), but the scope is broad. The chart keyboard navigation for Recharts is non-trivial and may require custom overlay elements. Estimated 3-5 days of focused work, best implemented incrementally by phase.
