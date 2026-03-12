# Feature Request

## Title
Preview Breakpoint System - Responsive chart preview in configurator

## Problem
Chart creators cannot preview how their chart will look on different screen sizes. They must manually resize the browser or test on actual devices. The Swiss visualization tool provides breakpoint toggle buttons to preview charts at desktop, laptop, tablet, and mobile widths within the configurator.

## Proposed behavior

### Preview Toggle Buttons
- Toggle button group with device icons (desktop, laptop, tablet, mobile)
- Buttons change the preview container width
- Active breakpoint is highlighted
- Tooltip on hover explains each breakpoint

### Breakpoint Definitions
- **XL (Desktop)**: Full width (~1200px)
- **LG (Laptop)**: Large width (~992px)
- **MD (Tablet)**: Medium width (~768px)
- **SM (Mobile)**: Small width (~576px)

### UI Placement
- Located above the chart preview area
- Only visible when configuring charts
- Persists across configurator steps

---

## Detailed Implementation

### File 1: `src/components/configurator/PreviewBreakpointToggle.tsx` (new)

```typescript
'use client'

import { memo } from 'react'
import { cn } from '@/lib/utils/cn'

export type PreviewBreakpoint = 'xl' | 'lg' | 'md' | 'sm' | null

export const BREAKPOINT_WIDTHS: Record<Exclude<PreviewBreakpoint, null>, number> = {
  xl: 1200,
  lg: 992,
  md: 768,
  sm: 576,
}

export const BREAKPOINT_LABELS = {
  xl: { icon: '🖥️', label: 'Desktop' },
  lg: { icon: '💻', label: 'Laptop' },
  md: { icon: '📱', label: 'Tablet' },
  sm: { icon: '📱', label: 'Mobile' },
}

interface PreviewBreakpointToggleProps {
  value: PreviewBreakpoint
  onChange: (value: PreviewBreakpoint) => void
  labels?: {
    desktop?: string
    laptop?: string
    tablet?: string
    mobile?: string
  }
}

function PreviewBreakpointToggleComponent({
  value,
  onChange,
  labels,
}: PreviewBreakpointToggleProps) {
  const l = {
    desktop: 'Desktop',
    laptop: 'Laptop',
    tablet: 'Tablet',
    mobile: 'Mobile',
    ...labels,
  }

  const breakpoints: { key: PreviewBreakpoint; icon: string; title: string }[] = [
    { key: 'xl', icon: '🖥️', title: l.desktop },
    { key: 'lg', icon: '💻', title: l.laptop },
    { key: 'md', icon: '📱', title: l.tablet },
    { key: 'sm', icon: '📱', title: l.mobile },
  ]

  return (
    <div className="flex items-center gap-1 rounded-lg bg-slate-100 p-1" role="group" aria-label="Preview breakpoint selector">
      {breakpoints.map(({ key, icon, title }) => (
        <button
          key={key}
          type="button"
          onClick={() => onChange(value === key ? null : key)}
          className={cn(
            'flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition',
            value === key
              ? 'bg-white text-gov-primary shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          )}
          title={title}
        >
          <span>{icon}</span>
          <span className="hidden sm:inline">{title}</span>
        </button>
      ))}
    </div>
  )
}

export const PreviewBreakpointToggle = memo(PreviewBreakpointToggleComponent)
```

### File 2: `src/components/configurator/PreviewContainer.tsx` (new)

```typescript
'use client'

import { memo, ReactNode } from 'react'
import { cn } from '@/lib/utils/cn'
import type { PreviewBreakpoint } from './PreviewBreakpointToggle'
import { BREAKPOINT_WIDTHS } from './PreviewBreakpointToggle'

interface PreviewContainerProps {
  children: ReactNode
  breakpoint: PreviewBreakpoint
  className?: string
}

function PreviewContainerComponent({ children, breakpoint, className }: PreviewContainerProps) {
  const width = breakpoint ? BREAKPOINT_WIDTHS[breakpoint] : '100%'

  return (
    <div
      className={cn(
        'mx-auto transition-all duration-300',
        breakpoint && 'rounded-lg border border-slate-200 bg-white p-4 shadow-sm',
        className
      )}
      style={{ maxWidth: width }}
    >
      {children}
    </div>
  )
}

export const PreviewContainer = memo(PreviewContainerComponent)
```

### File 3: Update `src/stores/configurator.ts`

Add breakpoint state:

```typescript
interface ConfiguratorState {
  // ... existing state
  previewBreakpoint: PreviewBreakpoint
  setPreviewBreakpoint: (breakpoint: PreviewBreakpoint) => void
}

// In the store creation:
previewBreakpoint: null,
setPreviewBreakpoint: (breakpoint) => set({ previewBreakpoint: breakpoint }),
```

### File 4: Update `src/components/configurator/ConfiguratorLayout.tsx`

Add breakpoint toggle and container:

```typescript
import { PreviewBreakpointToggle, PreviewBreakpoint } from './PreviewBreakpointToggle'
import { PreviewContainer } from './PreviewContainer'

// In component:
const previewBreakpoint = useConfiguratorStore(state => state.previewBreakpoint)
const setPreviewBreakpoint = useConfiguratorStore(state => state.setPreviewBreakpoint)

// In JSX, before chart preview:
<div className="mb-4 flex justify-end">
  <PreviewBreakpointToggle
    value={previewBreakpoint}
    onChange={setPreviewBreakpoint}
    labels={{
      desktop: l.desktop,
      laptop: l.laptop,
      tablet: l.tablet,
      mobile: l.mobile,
    }}
  />
</div>

<PreviewContainer breakpoint={previewBreakpoint}>
  <ChartPreview {...previewProps} />
</PreviewContainer>
```

### File 5: Add translations

**`src/locales/en.json`**:
```json
{
  "configurator": {
    "previewBreakpoints": {
      "desktop": "Desktop",
      "laptop": "Laptop",
      "tablet": "Tablet",
      "mobile": "Mobile",
      "tooltip": "Preview at different screen sizes"
    }
  }
}
```

**`src/locales/sr-cyr.json`**:
```json
{
  "configurator": {
    "previewBreakpoints": {
      "desktop": "Десктоп",
      "laptop": "Лаптоп",
      "tablet": "Таблет",
      "mobile": "Мобилни",
      "tooltip": "Преглед на различним величинама екрана"
    }
  }
}
```

---

## Affected areas
- `src/components/configurator/PreviewBreakpointToggle.tsx` (new)
- `src/components/configurator/PreviewContainer.tsx` (new)
- `src/stores/configurator.ts` - Add breakpoint state
- `src/components/configurator/ConfiguratorLayout.tsx` - Integrate components
- `src/locales/*.json` - Translations

## Constraints
- Must work with existing chart preview components
- Smooth CSS transition between breakpoints
- Icons must be accessible (emoji fallback)
- Mobile-friendly toggle UI
- Persist breakpoint selection during session

## Out of scope
- Actual device emulation (just width preview)
- Responsive image loading
- Print preview mode

## Acceptance criteria
- [ ] Toggle buttons appear above chart preview
- [ ] Four breakpoint options (xl, lg, md, sm)
- [ ] Clicking breakpoint changes preview container width
- [ ] Active breakpoint is visually highlighted
- [ ] Clicking active breakpoint deselects it (returns to full width)
- [ ] Smooth animation on width change
- [ ] Tooltips explain each breakpoint
- [ ] Works in all three locales
- [ ] Responsive on small screens (icons only on mobile)
