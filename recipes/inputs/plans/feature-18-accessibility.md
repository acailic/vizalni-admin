# Feature Request

## Title
Comprehensive accessibility audit and improvements for WCAG 2.1 AA compliance

## Problem
Government data platforms must be accessible to all citizens, including those with visual, motor, and cognitive disabilities. The current codebase has Radix UI (good a11y defaults) and jest-axe for testing, but no systematic accessibility effort across charts, forms, maps, or interactive components. The Swiss tool has ARIA labels, keyboard navigation, and accessible chart alternatives throughout.

## Proposed behavior

### Chart accessibility

**Data tables as chart alternatives**:
- Every chart must have a hidden (visually, not from screen readers) data table representation
- Togglable via "Show as table" button (visible, keyboard-accessible)
- Table shows the same data the chart displays, with proper `<th>` headers and `scope` attributes
- `aria-label` on the chart container: "Bar chart showing {title}. Accessible data table available."

**Chart ARIA attributes**:
- `role="img"` on SVG chart containers
- `aria-label` describing chart type, title, and data summary
- `aria-describedby` linking to a visually hidden description with key findings (highest/lowest values, trend direction)

**Keyboard navigation for interactive charts**:
- Tab into chart area → focus first data point
- Arrow keys navigate between data points (left/right for X axis, up/down for series)
- Enter/space on a data point → show tooltip
- Escape → close tooltip, return focus to chart container
- Skip link: "Skip to data table" for screen reader users

### Form accessibility (configurator)

- All form inputs have visible `<label>` elements (not just placeholder text)
- Required fields marked with `aria-required` and visible indicator
- Error messages linked via `aria-describedby`
- Form validation errors announced via `aria-live="polite"` region
- Dropdown menus (Radix) already have good a11y — verify and document

### Map accessibility

- Map has `role="application"` with `aria-label` describing the content
- "Show as table" button for map data (municipality → value table)
- Map controls (zoom, reset) are keyboard-accessible buttons
- Color-only information supplemented with patterns (hatching) for colorblind users
- Tooltip content accessible via keyboard (Tab through regions)

### Color and contrast

- All text meets WCAG AA contrast ratio (4.5:1 for normal text, 3:1 for large text)
- Interactive elements have visible focus indicators (not just browser default)
- Focus indicators use a distinct color (not just outline — use 3px solid ring)
- Dark mode (if implemented) also meets contrast requirements
- Color palettes (Feature 15) include colorblind-safe options with clear labeling

### Motion and animation

- `prefers-reduced-motion` media query respected:
  - Chart animations disabled
  - Page transitions simplified
  - Time-based animation (Feature 17) defaults to paused with manual stepping
- Animation controls always visible (no auto-play without consent)

### Language and content

- `lang` attribute on `<html>` matches active locale
- When switching between Cyrillic and Latin scripts, `lang` updates accordingly
- Screen reader-friendly number formatting (not just visual formatting)
- Dates announced in full (not abbreviated) for screen readers
- Proper heading hierarchy (h1 → h2 → h3, no skipped levels)

### Testing infrastructure

- Add `jest-axe` assertions to every component test (already a devDependency):
  ```typescript
  expect(await axe(container)).toHaveNoViolations()
  ```
- Add Playwright a11y testing using `@axe-core/playwright`:
  ```typescript
  const results = await new AxeBuilder({ page }).analyze()
  expect(results.violations).toEqual([])
  ```
- Create an a11y testing checklist component that renders all UI states for manual testing

### Accessibility statement page
- `/accessibility` or `/pristupačnost` page
- Describes: compliance level (WCAG 2.1 AA target), known limitations, how to report issues
- Available in all three locales

## Affected areas
- `src/components/charts/shared/AccessibleTable.tsx` (new: hidden data table for charts)
- `src/components/charts/shared/ChartContainer.tsx` (new: wrapper with ARIA attributes)
- `src/components/charts/` (all chart types: add keyboard navigation, ARIA labels)
- `src/components/charts/map/` (add table alternative, keyboard region navigation)
- `src/components/configurator/` (audit all form fields for labels and error handling)
- `src/components/ui/` (audit focus indicators, add skip links)
- `src/app/layout.tsx` (add skip navigation link, lang attribute)
- `src/app/accessibility/page.tsx` (new: accessibility statement)
- `src/styles/` or `globals.css` (focus indicator styles, reduced-motion queries)
- `tests/` (add jest-axe to component tests, add Playwright a11y tests)
- `package.json` (add @axe-core/playwright if not present)
- `public/locales/*/common.json` (a11y labels: "Show as table", "Skip to content", chart descriptions)

## Constraints
- Do not break existing functionality — a11y improvements are additive
- Chart keyboard navigation must not conflict with page-level keyboard shortcuts
- Hidden data tables must not affect visual layout (use `sr-only` Tailwind class)
- `prefers-reduced-motion` must be checked client-side (not SSR — server doesn't know user preference)
- a11y testing should not slow down CI significantly (axe checks are fast)
- Government a11y requirements may exceed WCAG 2.1 AA — design for easy extension

## Out of scope
- Screen reader testing with specific software (NVDA, JAWS, VoiceOver) — manual testing
- Cognitive accessibility (plain language, reading level)
- Physical device accessibility (switch access, eye tracking)

## Acceptance criteria
- [ ] Every chart has a togglable accessible data table
- [ ] Chart containers have `role="img"` and descriptive `aria-label`
- [ ] Keyboard navigation works in interactive charts (arrow keys, enter, escape)
- [ ] All form inputs in configurator have visible labels and error descriptions
- [ ] Focus indicators are visible and meet 3:1 contrast
- [ ] `prefers-reduced-motion` disables chart animations
- [ ] `lang` attribute on `<html>` matches active locale
- [ ] Skip navigation link available and functional
- [ ] jest-axe assertions added to at least 10 component tests
- [ ] Playwright a11y test runs in CI with zero violations
- [ ] Accessibility statement page exists in all three locales
- [ ] All color palettes include at least 3 colorblind-safe options

## Prior art / references
- Swiss tool: uses ARIA labels throughout, keyboard-navigable charts
- Swiss tool: `app/charts/table/` — accessible table implementation
- WAI-ARIA Authoring Practices: SVG chart patterns
- Highcharts accessibility module: good reference for keyboard-navigable charts
- Serbian government accessibility guidelines (if available)
- WCAG 2.1 AA specification
