# Feature Request

## Title
Badge Indicators - Count badges on collapsed configurator sections

## Problem
When configurator sections are collapsed, users cannot see how many filters are active or how many datasets are selected without expanding. The Swiss visualization tool uses badge indicators to show counts on collapsed sections, providing quick visual feedback.

## Proposed behavior

### Badge Features
- Small circular badge with count number
- Appears on collapsed section headers
- Hidden when section is expanded (content visible)
- Color coding: primary for active, muted for informational

### Section Types
- **Filters badge**: Shows number of active filters
- **Datasets badge**: Shows number of selected datasets
- **Fields badge**: Shows number of configured fields
- **Annotations badge**: Shows number of annotations

---

## Detailed Implementation

### File 1: `src/components/ui/SectionBadge.tsx` (new)

```typescript
'use client'

import { memo } from 'react'
import { cn } from '@/lib/utils/cn'

interface SectionBadgeProps {
  count: number
  variant?: 'primary' | 'secondary' | 'warning'
  invisible?: boolean
  className?: string
}

function SectionBadgeComponent({ count, variant = 'primary', invisible, className }: SectionBadgeProps) {
  if (count === 0 || invisible) {
    return null
  }

  return (
    <span
      className={cn(
        'ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-semibold',
        {
          'bg-gov-primary text-white': variant === 'primary',
          'bg-slate-200 text-slate-700': variant === 'secondary',
          'bg-amber-100 text-amber-700': variant === 'warning',
        },
        className
      )}
    >
      {count}
    </span>
  )
}

export const SectionBadge = memo(SectionBadgeComponent)
```

### File 2: `src/components/configurator/ConfigSection.tsx` (new)

```typescript
'use client'

import { memo, useState, ReactNode } from 'react'
import { cn } from '@/lib/utils/cn'
import { SectionBadge } from '@/components/ui/SectionBadge'

interface ConfigSectionProps {
  title: string
  badgeCount?: number
  badgeVariant?: 'primary' | 'secondary' | 'warning'
  children: ReactNode
  defaultOpen?: boolean
  collapsible?: boolean
  className?: string
  labels?: {
    expand?: string
    collapse?: string
  }
}

function ConfigSectionComponent({
  title,
  badgeCount = 0,
  badgeVariant = 'primary',
  children,
  defaultOpen = true,
  collapsible = true,
  className,
  labels,
}: ConfigSectionProps) {
  const l = {
    expand: 'Expand section',
    collapse: 'Collapse section',
    ...labels,
  }

  const [isOpen, setIsOpen] = useState(defaultOpen)

  if (!collapsible) {
    return (
      <div className={cn('space-y-3', className)}>
        <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
        {children}
      </div>
    )
  }

  return (
    <div className={cn('rounded-lg border border-slate-200', className)}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between px-4 py-3 hover:bg-slate-50"
        aria-expanded={isOpen}
        aria-label={isOpen ? l.collapse : l.expand}
      >
        <span className="flex items-center">
          <span className="text-sm font-semibold text-slate-900">{title}</span>
          <SectionBadge
            count={badgeCount}
            variant={badgeVariant}
            invisible={isOpen}
          />
        </span>
        <span
          className={cn(
            'text-slate-400 transition-transform',
            isOpen && 'rotate-180'
          )}
        >
          ▼
        </span>
      </button>

      {isOpen && (
        <div className="border-t border-slate-200 p-4">
          {children}
        </div>
      )}
    </div>
  )
}

export const ConfigSection = memo(ConfigSectionComponent)
```

### File 3: `src/components/configurator/hooks/useActiveFilterCount.ts` (new)

```typescript
import { useMemo } from 'react'
import { useConfiguratorStore } from '@/stores/configurator'

/**
 * Returns the count of active filters in the chart configuration
 */
export function useActiveFilterCount(): number {
  const config = useConfiguratorStore(state => state.config)

  return useMemo(() => {
    if (!config) return 0

    let count = 0

    // Count time range filter if active
    if (config.timeRange?.from || config.timeRange?.to) {
      count++
    }

    // Count data filters
    if (config.filters) {
      count += Object.values(config.filters).filter(
        (filter) => filter !== null && filter !== undefined
      ).length
    }

    // Count interactive filters if configured
    if (config.interactiveFiltersConfig?.dataFilters?.active) {
      count += config.interactiveFiltersConfig.dataFilters.componentIds.length
    }

    return count
  }, [config])
}

/**
 * Returns the count of configured datasets
 */
export function useDatasetCount(): number {
  const datasetId = useConfiguratorStore(state => state.datasetId)
  const resourceId = useConfiguratorStore(state => state.resourceId)

  return useMemo(() => {
    let count = 0
    if (datasetId) count++
    if (resourceId && resourceId !== datasetId) count++
    return count
  }, [datasetId, resourceId])
}

/**
 * Returns the count of configured chart fields
 */
export function useConfiguredFieldCount(): number {
  const config = useConfiguratorStore(state => state.config)

  return useMemo(() => {
    if (!config) return 0

    let count = 0
    if (config.x_axis?.field) count++
    if (config.y_axis?.field) count++
    if (config.options?.series) count += Object.keys(config.options.series).length

    return count
  }, [config])
}
```

### File 4: Update `src/components/configurator/ConfiguratorPanel.tsx`

Use ConfigSection with badges:

```typescript
import { ConfigSection } from './ConfigSection'
import { useActiveFilterCount, useDatasetCount, useConfiguredFieldCount } from './hooks/useActiveFilterCount'

// In component:
const filterCount = useActiveFilterCount()
const datasetCount = useDatasetCount()
const fieldCount = useConfiguredFieldCount()

// In JSX:
<ConfigSection title={l.dataset} badgeCount={datasetCount} defaultOpen>
  <DatasetSelector {...datasetProps} />
</ConfigSection>

<ConfigSection title={l.filters} badgeCount={filterCount} defaultOpen={false}>
  <FiltersConfig {...filtersProps} />
</ConfigSection>

<ConfigSection title={l.fields} badgeCount={fieldCount} defaultOpen>
  <FieldConfiguration {...fieldProps} />
</ConfigSection>
```

### File 5: Add translations

**`src/locales/en.json`**:
```json
{
  "configurator": {
    "sections": {
      "dataset": "Dataset",
      "filters": "Filters",
      "fields": "Fields",
      "annotations": "Annotations",
      "preview": "Preview"
    },
    "badges": {
      "activeFilters": "active filter",
      "activeFilters_plural": "active filters"
    }
  }
}
```

---

## Affected areas
- `src/components/ui/SectionBadge.tsx` (new)
- `src/components/configurator/ConfigSection.tsx` (new)
- `src/components/configurator/hooks/useActiveFilterCount.ts` (new)
- `src/components/configurator/ConfiguratorPanel.tsx` - Use new section components
- `src/locales/*.json` - Translations

## Constraints
- Badge must be positioned to not overlap with title text
- Must work with long titles (truncate if needed)
- Badge should be focusable for accessibility
- Count of 0 should hide badge (or show nothing)

## Out of scope
- Badge animations (simple appear/disappear is fine)
- Custom badge colors
- Badge icons (just numbers)

## Acceptance criteria
- [ ] Badge shows count of active filters
- [ ] Badge shows count of selected datasets
- [ ] Badge shows count of configured fields
- [ ] Badge is hidden when section is expanded
- [ ] Badge is visible when section is collapsed
- [ ] Badge has correct color (primary for active items)
- [ ] Multiple badges work in same section
- [ ] Badge updates reactively when underlying data changes
- [ ] All text translated in all three locales
