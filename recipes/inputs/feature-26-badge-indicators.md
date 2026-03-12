# Feature Request

## Title
Badge Indicators on Collapsed Configurator Sections

## Problem
When configurator sections are collapsed, users cannot see at a glance how many items are configured. For example, a collapsed "Filters" section doesn't show that 3 filters are active. The Swiss tool shows count badges on collapsed sections, giving immediate visual feedback.

## Proposed behavior

### Badge Types
1. **Filter Count** - "3 filters" on collapsed Filters section
2. **Column Count** - "5 columns" on collapsed Columns section
3. **Selection Count** - "2 selected" on collapsed Dataset section
4. **Warning Badge** - "!" for missing required fields
5. **Success Badge** - "✓" for completed required sections

### UI Requirements
- Small circular or pill-shaped badge next to section title
- Numeric count or icon indicator
- Color coding: blue for counts, yellow for warnings, green for success
- Animated pulse when value changes
- Accessible: aria-label with full text

---

## Detailed Implementation

### File 1: `src/components/ui/SectionBadge.tsx` (new)

```typescript
'use client'

import { memo } from 'react'
import { AlertCircle, Check } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

export type BadgeVariant = 'count' | 'warning' | 'success' | 'error'

export interface SectionBadgeProps {
  count?: number
  variant?: BadgeVariant
  label?: string
  pulse?: boolean
  className?: string
}

function SectionBadgeComponent({
  count,
  variant = 'count',
  label,
  pulse = false,
  className
}: SectionBadgeProps) {
  // Don't render if count is 0 or undefined and not warning/success
  if ((count === undefined || count === 0) && variant === 'count') {
    return null
  }

  const badgeStyles = {
    count: 'bg-blue-100 text-blue-700 border-blue-200',
    warning: 'bg-amber-100 text-amber-700 border-amber-200',
    success: 'bg-green-100 text-green-700 border-green-200',
    error: 'bg-red-100 text-red-700 border-red-200',
  }

  const ariaLabels: Record<BadgeVariant, string> = {
    count: label ? `${count} ${label}` : `${count} items`,
    warning: label ?? 'Warning: attention needed',
    success: label ?? 'Completed',
    error: label ?? 'Error',
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border",
        badgeStyles[variant],
        pulse && "animate-pulse",
        className
      )}
      role="status"
      aria-label={ariaLabels[variant]}
    >
      {variant === 'warning' && <AlertCircle className="w-3 h-3" />}
      {variant === 'success' && <Check className="w-3 h-3" />}
      {variant === 'count' && count}
      {variant === 'error' && <AlertCircle className="w-3 h-3" />}
    </span>
  )
}

export const SectionBadge = memo(SectionBadgeComponent)
```

### File 2: `src/components/configurator/CollapsibleSection.tsx` (enhanced)

```typescript
'use client'

import { memo, useState, useCallback } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { SectionBadge, type BadgeVariant } from '@/components/ui/SectionBadge'

export interface CollapsibleSectionProps {
  title: string
  badgeCount?: number
  badgeVariant?: BadgeVariant
  badgeLabel?: string
  defaultOpen?: boolean
  forceOpen?: boolean
  required?: boolean
  completed?: boolean
  hasError?: boolean
  children: React.ReactNode
  className?: string
}

function CollapsibleSectionComponent({
  title,
  badgeCount,
  badgeVariant,
  badgeLabel,
  defaultOpen = true,
  forceOpen = false,
  required = false,
  completed = false,
  hasError = false,
  children,
  className
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  const handleToggle = useCallback(() => {
    if (!forceOpen) {
      setIsOpen(prev => !prev)
    }
  }, [forceOpen])

  const isExpanded = forceOpen || isOpen

  // Determine badge to show
  const getBadge = () => {
    if (hasError) {
      return (
        <SectionBadge
          variant="error"
          label={badgeLabel ?? 'Error'}
          pulse
        />
      )
    }
    if (required && !completed && !isExpanded) {
      return (
        <SectionBadge
          variant="warning"
          label={badgeLabel ?? 'Required'}
          pulse
        />
      )
    }
    if (required && completed && !isExpanded) {
      return (
        <SectionBadge
          variant="success"
        />
      )
    }
    if (badgeCount !== undefined && badgeCount > 0) {
      return (
        <SectionBadge
          count={badgeCount}
          label={badgeLabel}
          variant={badgeVariant ?? 'count'}
          pulse={false}
        />
      )
    }
    return null
  }

  return (
    <div className={cn("border border-slate-200 rounded-xl overflow-hidden", className)}>
      <button
        type="button"
        onClick={handleToggle}
        disabled={forceOpen}
        className={cn(
          "w-full flex items-center justify-between px-4 py-3 bg-slate-50 hover:bg-slate-100 transition-colors",
          forceOpen && "cursor-default"
        )}
        aria-expanded={isExpanded}
      >
        <div className="flex items-center gap-3">
          {!forceOpen && (
            isExpanded ? (
              <ChevronDown className="w-4 h-4 text-slate-500" />
            ) : (
              <ChevronRight className="w-4 h-4 text-slate-500" />
            )
          )}
          <span className="font-medium text-slate-700">{title}</span>
          {required && (
            <span className="text-red-500" aria-label="Required">*</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {getBadge()}
        </div>
      </button>

      {isExpanded && (
        <div className="p-4 bg-white border-t border-slate-200">
          {children}
        </div>
      )}
    </div>
  )
}

export const CollapsibleSection = memo(CollapsibleSectionComponent)
```

### File 3: Update `src/components/configurator/ConfiguratorSidebar.tsx`

Use badges on step indicators:

```typescript
import { CollapsibleSection } from './CollapsibleSection'
import { useConfiguratorStore } from '@/stores/configurator'
import { useInteractiveFiltersStore } from '@/stores/interactive-filters'

function ConfiguratorSidebar() {
  const { config, parsedDataset } = useConfiguratorStore()
  const interactiveFilters = useInteractiveFiltersStore(
    state => state.charts['configurator-preview']
  )

  // Calculate badge counts
  const filterCount = useMemo(() => {
    if (!interactiveFilters) return 0
    let count = 0
    if (interactiveFilters.timeRange) count++
    if (interactiveFilters.calculation) count++
    count += Object.keys(interactiveFilters.dimensionFilters).length
    return count
  }, [interactiveFilters])

  const columnCount = config.type === 'table'
    ? (config.fields as any)?.columns?.length ?? 0
    : 0

  const seriesCount = useMemo(() => {
    if (!config.fields.series?.field) return 0
    const uniqueValues = new Set(
      parsedDataset?.observations?.map(
        (row: any) => row[config.fields.series!.field]
      )
    )
    return uniqueValues.size
  }, [config.fields.series, parsedDataset])

  return (
    <div className="space-y-4">
      <CollapsibleSection
        title="Filters"
        badgeCount={filterCount}
        badgeLabel="filters active"
        defaultOpen={false}
      >
        {/* Filter content */}
      </CollapsibleSection>

      <CollapsibleSection
        title="Columns"
        badgeCount={columnCount}
        badgeLabel="columns"
        defaultOpen={false}
      >
        {/* Column configuration */}
      </CollapsibleSection>

      <CollapsibleSection
        title="Series"
        badgeCount={seriesCount}
        badgeLabel="series"
        defaultOpen={false}
      >
        {/* Series configuration */}
      </CollapsibleSection>
    </div>
  )
}
```

### File 4: Update `src/components/configurator/DatasetBadges.tsx`

Enhance existing badges component:

```typescript
import { SectionBadge } from '@/components/ui/SectionBadge'

// Add format badge, size badge, quality badge
<SectionBadge count={dataset.resources.length} label="resources" />
```

---

## Affected areas
- `src/components/ui/SectionBadge.tsx` (new) - Reusable badge component
- `src/components/configurator/CollapsibleSection.tsx` - Enhanced with badges
- `src/components/configurator/ConfiguratorSidebar.tsx` - Use badges on sections
- `src/components/configurator/DatasetBadges.tsx` - Use new badge component
- `src/components/configurator/MappingStep.tsx` - Add badges to field sections
- `src/stores/configurator.ts` - Track completion state for required fields

## Constraints
- Badge must not increase section height
- Must be keyboard accessible
- Color contrast must meet WCAG AA
- Pulse animation should respect prefers-reduced-motion

## Out of scope
- Custom badge colors
- Badge animations beyond pulse
- Badge tooltips (use aria-label instead)

## Acceptance criteria
- [ ] Count badge shows on collapsed sections with items
- [ ] Count updates when items are added/removed
- [ ] Warning badge shows for incomplete required sections
- [ ] Success badge shows for completed required sections
- [ ] Error badge shows for validation errors
- [ ] Badge has proper aria-label
- [ ] Badge respects reduced motion preference
- [ ] Multiple badges can appear in sequence
