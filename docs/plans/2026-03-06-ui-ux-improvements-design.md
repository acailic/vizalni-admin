# UI/UX Improvements Design

**Date:** 2026-03-06 **Status:** Approved **Approach:** Three-Phase
Implementation

## Overview

Design document for 6 UI/UX improvements to the vizualni-admin application:

1. Chart placeholder empty state design
2. Demo cards grid visual polish
3. Dark/light mode toggle
4. Loading skeleton states
5. Header/navigation polish
6. Playground controls and layout

## Design Principles

- **Minimalist, MUI-native:** Use existing MUI components with enhanced styling,
  minimal custom CSS
- **Phased approach:** Foundation first, then visual improvements, then polish
- **Independent deployment:** Each phase is independently deployable

---

## Phase 1: Theme System & Dark Mode Toggle

### Architecture

- Create `ThemeContext` with `mode: 'light' | 'dark' | 'system'` state
- Persist preference to `localStorage` with key `vizualni-theme`
- Create `lightPalette` and `darkPalette` in `themes/palette.ts`
- Toggle component in `Header` using MUI `IconButton` with sun/moon icons

### Components

```
app/
├── themes/
│   ├── palette.ts          # Add lightPalette export
│   └── ThemeProvider.tsx   # New: ThemeContext + localStorage
├── components/
│   ├── header.tsx          # Add ThemeToggle button
│   └── ThemeToggle.tsx     # New: Toggle component
```

### Data Flow

1. On mount, read `localStorage` or system preference via
   `matchMedia('(prefers-color-scheme: dark)')`
2. Apply palette via MUI's `createTheme({ palette: activePalette })`
3. Toggle updates state → localStorage → re-renders

### Acceptance Criteria

- [ ] Toggle switches between light and dark modes
- [ ] Preference persists across sessions
- [ ] System preference is respected on first visit
- [ ] All existing components render correctly in both modes

---

## Phase 2: Chart Placeholders & Loading Skeletons

### Chart Placeholder Design

Create `ChartPlaceholder.tsx` component for empty chart states:

- Display centered icon + message with subtle background
- Use MUI `Box` with `alpha` overlay for gradient effect
- Icon varies by chart type (BarChart/ShowChart/PieChart)

```tsx
// ChartPlaceholder.tsx
interface Props {
  type: "bar" | "line" | "pie" | "column" | "area";
  message?: string;
  action?: React.ReactNode;
}
```

### Loading Skeletons Enhancement

Enhance existing `DemoSkeleton.tsx`:

- Add animated pulse via CSS keyframes
- Use MUI `Skeleton` with `animation="pulse"`
- Add shimmer effect for smoother feel

### Files

```
app/
├── charts/
│   └── shared/
│       └── ChartPlaceholder.tsx    # New
├── components/
│   └── demos/
│       └── DemoSkeleton.tsx        # Enhance animations
```

### Acceptance Criteria

- [ ] Empty chart states show placeholder with icon
- [ ] Skeletons have smooth pulse animation
- [ ] Both work in light and dark modes

---

## Phase 3: Demo Cards, Header & Playground Polish

### Demo Cards Grid

- Add category icons using MUI icons (TrendingUp, LocalShipping, Factory, etc.)
- Add hover elevation change via MUI `Card`
  `sx={{ '&:hover': { transform, boxShadow } }}`
- Add "Featured" badge using MUI `Chip` with color variants

### Header/Navigation

- Add `position: sticky` with subtle shadow via `boxShadow`
- Ensure mobile responsiveness with `useMediaQuery` hook
- Add backdrop blur for modern feel

### Playground Controls

- Group controls using MUI `Accordion` or `Card` sections
- Add tooltips to control labels using MUI `Tooltip`
- Add preset buttons for common configurations

### Files

```
app/
├── components/
│   ├── header.tsx                    # Sticky, mobile responsive
│   └── demos/
│       └── FeaturedChartCard.tsx     # Add icons, hover, badges
├── demos/
│   └── playground/
│       └── _components/
│           └── ConfigPanel.tsx       # Grouped controls, tooltips
```

### Acceptance Criteria

- [ ] Demo cards have category icons and hover effects
- [ ] Header is sticky with proper mobile layout
- [ ] Playground has grouped controls with tooltips

---

## Implementation Notes

- All components use MUI v6 with Emotion styling
- Follow existing project patterns for consistency
- Test both light and dark modes for all new components
