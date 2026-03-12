# Feature Request

## Title
Interactive Annotation System - Clickable annotations on charts

## Problem
Charts cannot highlight specific data points or regions with additional context. Users cannot add explanatory notes, events, or callouts to draw attention to significant data points. The Swiss visualization tool supports interactive annotations that appear as clickable circles with expandable tooltips.

## Proposed behavior

### Annotation Features
- Clickable circle markers positioned on data points
- Expandable tooltips with title and description
- Toggle annotations on/off by clicking
- Configurable in chart configurator
- Optional "always open" state for important annotations

### Configuration UI
- Annotations section in configurator
- Add/edit/remove annotations
- Select target data point
- Set title and description (localized)
- Choose color and style (filled/outline)

---

## Detailed Implementation

### File 1: `src/types/annotation.ts` (new)

```typescript
export interface Annotation {
  key: string
  title: Record<string, string> // locale -> title
  description?: Record<string, string> // locale -> description
  targets: Array<{
    componentId: string
    value: string | number
  }>
  color?: string
  style: 'filled' | 'outline'
  defaultOpen: boolean
}

export interface ChartAnnotation extends Annotation {
  x: number
  y: number
  visible: boolean
}
```

### File 2: `src/components/charts/shared/AnnotationCircle.tsx` (new)

```typescript
'use client'

import { memo } from 'react'
import { cn } from '@/lib/utils/cn'

interface AnnotationCircleProps {
  x: number
  y: number
  color?: string
  focused: boolean
  onClick: () => void
}

function AnnotationCircleComponent({ x, y, color, focused, onClick }: AnnotationCircleProps) {
  return (
    <g
      onClick={onClick}
      style={{ cursor: 'pointer' }}
      className="annotation-circle"
    >
      {/* Outer ring for visibility */}
      <circle
        cx={x}
        cy={y}
        r={focused ? 14 : 12}
        fill={color || '#c0504d'}
        fillOpacity={focused ? 0.2 : 0.1}
        className="transition-all duration-200"
      />
      {/* Main circle */}
      <circle
        cx={x}
        cy={y}
        r={8}
        fill={focused ? (color || '#c0504d') : 'white'}
        stroke={color || '#c0504d'}
        strokeWidth={2}
        className="transition-all duration-200"
      />
      {/* Inner dot */}
      <circle
        cx={x}
        cy={y}
        r={3}
        fill={focused ? 'white' : (color || '#c0504d')}
      />
    </g>
  )
}

export const AnnotationCircle = memo(AnnotationCircleComponent)
```

### File 3: `src/components/charts/shared/AnnotationTooltip.tsx` (new)

```typescript
'use client'

import { memo, useState, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils/cn'
import type { ChartAnnotation } from '@/types/annotation'

interface AnnotationTooltipProps {
  annotation: ChartAnnotation
  locale: 'sr-Cyrl' | 'sr-Latn' | 'en'
  closable: boolean
  onClose?: () => void
}

function AnnotationTooltipComponent({ annotation, locale, closable, onClose }: AnnotationTooltipProps) {
  const [expanded, setExpanded] = useState(annotation.defaultOpen)
  const tooltipRef = useRef<HTMLDivElement>(null)

  const title = annotation.title[locale] || annotation.title.en || ''
  const description = annotation.description?.[locale] || annotation.description?.en || ''

  if (!expanded) return null

  return (
    <div
      ref={tooltipRef}
      className={cn(
        'absolute z-50 max-w-xs rounded-lg bg-white p-3 shadow-lg ring-1 ring-slate-200',
        'animate-in fade-in slide-in-from-bottom-2 duration-200'
      )}
      style={{
        left: annotation.x + 16,
        top: annotation.y - 16,
      }}
    >
      {closable && (
        <button
          onClick={() => {
            setExpanded(false)
            onClose?.()
          }}
          className="absolute right-2 top-2 text-slate-400 hover:text-slate-600"
          aria-label="Close annotation"
        >
          ✕
        </button>
      )}
      <h4 className="mb-1 text-sm font-semibold text-slate-900">{title}</h4>
      {description && (
        <p className="text-xs text-slate-600">{description}</p>
      )}
    </div>
  )
}

export const AnnotationTooltip = memo(AnnotationTooltipComponent)
```

### File 4: `src/components/charts/shared/AnnotationsLayer.tsx` (new)

```typescript
'use client'

import { memo, useState, useCallback } from 'react'
import { AnnotationCircle } from './AnnotationCircle'
import { AnnotationTooltip } from './AnnotationTooltip'
import type { Annotation, ChartAnnotation } from '@/types/annotation'

interface AnnotationsLayerProps {
  annotations: Annotation[]
  chartData: any[]
  getAnnotationPosition: (target: Annotation['targets'][0]) => { x: number; y: number } | null
  locale: 'sr-Cyrl' | 'sr-Latn' | 'en'
  activeField?: string | null
}

function AnnotationsLayerComponent({
  annotations,
  chartData,
  getAnnotationPosition,
  locale,
  activeField,
}: AnnotationsLayerProps) {
  const [openAnnotations, setOpenAnnotations] = useState<Set<string>>(
    new Set(annotations.filter(a => a.defaultOpen).map(a => a.key))
  )

  const toggleAnnotation = useCallback((key: string) => {
    setOpenAnnotations(prev => {
      const next = new Set(prev)
      if (next.has(key)) {
        next.delete(key)
      } else {
        next.add(key)
      }
      return next
    })
  }, [])

  // Compute positions for annotations
  const renderedAnnotations: ChartAnnotation[] = annotations.map(annotation => {
    // Find matching data point and get position
    const position = annotation.targets.reduce<{ x: number; y: number } | null>(
      (acc, target) => acc || getAnnotationPosition(target),
      null
    )

    return {
      ...annotation,
      x: position?.x ?? 0,
      y: position?.y ?? 0,
      visible: !!position,
    }
  }).filter(a => a.visible)

  return (
    <g className="annotations-layer">
      {renderedAnnotations.map(annotation => (
        <g key={annotation.key}>
          <foreignObject
            x={annotation.x - 50}
            y={annotation.y - 50}
            width={100}
            height={100}
            style={{ overflow: 'visible' }}
          >
            <AnnotationCircle
              x={50}
              y={50}
              color={annotation.color}
              focused={openAnnotations.has(annotation.key) || activeField === annotation.key}
              onClick={() => toggleAnnotation(annotation.key)}
            />
          </foreignObject>
        </g>
      ))}

      {renderedAnnotations.map(annotation => (
        openAnnotations.has(annotation.key) && (
          <foreignObject
            key={`tooltip-${annotation.key}`}
            x={annotation.x}
            y={annotation.y - 100}
            width={200}
            height={100}
            style={{ overflow: 'visible' }}
          >
            <AnnotationTooltip
              annotation={annotation}
              locale={locale}
              closable={true}
              onClose={() => toggleAnnotation(annotation.key)}
            />
          </foreignObject>
        )
      ))}
    </g>
  )
}

export const AnnotationsLayer = memo(AnnotationsLayerComponent)
```

### File 5: `src/components/configurator/AnnotationEditor.tsx` (new)

```typescript
'use client'

import { memo, useState } from 'react'
import { cn } from '@/lib/utils/cn'
import type { Annotation } from '@/types/annotation'

interface AnnotationEditorProps {
  annotations: Annotation[]
  onChange: (annotations: Annotation[]) => void
  locale: 'sr-Cyrl' | 'sr-Latn' | 'en'
  labels?: {
    addAnnotation?: string
    title?: string
    description?: string
    target?: string
    color?: string
    style?: string
    filled?: string
    outline?: string
    defaultOpen?: string
  }
}

function AnnotationEditorComponent({ annotations, onChange, locale, labels }: AnnotationEditorProps) {
  const l = {
    addAnnotation: 'Add annotation',
    title: 'Title',
    description: 'Description',
    target: 'Target data point',
    color: 'Color',
    style: 'Style',
    filled: 'Filled',
    outline: 'Outline',
    defaultOpen: 'Open by default',
    ...labels,
  }

  const [editingKey, setEditingKey] = useState<string | null>(null)

  const addAnnotation = () => {
    const newAnnotation: Annotation = {
      key: `annotation-${Date.now()}`,
      title: { en: '', 'sr-Cyrl': '', 'sr-Latn': '' },
      description: { en: '', 'sr-Cyrl': '', 'sr-Latn': '' },
      targets: [],
      style: 'filled',
      defaultOpen: false,
    }
    onChange([...annotations, newAnnotation])
    setEditingKey(newAnnotation.key)
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-700">Annotations ({annotations.length})</span>
        <button
          type="button"
          onClick={addAnnotation}
          className="text-sm text-gov-primary hover:underline"
        >
          + {l.addAnnotation}
        </button>
      </div>

      {annotations.map(annotation => (
        <div
          key={annotation.key}
          className={cn(
            'rounded-lg border p-3',
            editingKey === annotation.key ? 'border-gov-primary bg-gov-primary/5' : 'border-slate-200'
          )}
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">{annotation.title[locale] || annotation.title.en || 'Untitled'}</span>
            <button
              type="button"
              onClick={() => setEditingKey(editingKey === annotation.key ? null : annotation.key)}
              className="text-xs text-slate-500 hover:text-slate-700"
            >
              {editingKey === annotation.key ? 'Done' : 'Edit'}
            </button>
          </div>

          {editingKey === annotation.key && (
            <div className="mt-3 space-y-2">
              {/* Title input */}
              <input
                type="text"
                placeholder={l.title}
                value={annotation.title[locale] || ''}
                onChange={(e) => {
                  const updated = { ...annotation.title, [locale]: e.target.value }
                  onChange(annotations.map(a => a.key === annotation.key ? { ...a, title: updated } : a))
                }}
                className="w-full rounded border border-slate-200 px-2 py-1 text-sm"
              />
              {/* Description input */}
              <textarea
                placeholder={l.description}
                value={annotation.description?.[locale] || ''}
                onChange={(e) => {
                  const updated = { ...annotation.description, [locale]: e.target.value }
                  onChange(annotations.map(a => a.key === annotation.key ? { ...a, description: updated } : a))
                }}
                className="w-full rounded border border-slate-200 px-2 py-1 text-sm"
                rows={2}
              />
              {/* Style toggle */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => onChange(annotations.map(a => a.key === annotation.key ? { ...a, style: 'filled' } : a))}
                  className={cn(
                    'rounded px-2 py-1 text-xs',
                    annotation.style === 'filled' ? 'bg-gov-primary text-white' : 'bg-slate-100'
                  )}
                >
                  {l.filled}
                </button>
                <button
                  type="button"
                  onClick={() => onChange(annotations.map(a => a.key === annotation.key ? { ...a, style: 'outline' } : a))}
                  className={cn(
                    'rounded px-2 py-1 text-xs',
                    annotation.style === 'outline' ? 'bg-gov-primary text-white' : 'bg-slate-100'
                  )}
                >
                  {l.outline}
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export const AnnotationEditor = memo(AnnotationEditorComponent)
```

---

## Affected areas
- `src/types/annotation.ts` (new)
- `src/components/charts/shared/AnnotationCircle.tsx` (new)
- `src/components/charts/shared/AnnotationTooltip.tsx` (new)
- `src/components/charts/shared/AnnotationsLayer.tsx` (new)
- `src/components/configurator/AnnotationEditor.tsx` (new)
- `src/components/charts/*.tsx` - Integrate annotations layer
- `src/locales/*.json` - Translations

## Constraints
- Must position annotations relative to data points
- Support all three locales for title/description
- Accessible keyboard navigation
- Not block chart interactions (hover, click)
- Support dynamic data updates

## Out of scope
- Annotations on map charts (separate feature)
- Image annotations
- Drawing tools (arrows, boxes)

## Acceptance criteria
- [ ] Annotation circles render on specified data points
- [ ] Clicking annotation circle opens tooltip
- [ ] Tooltip shows title and description in correct locale
- [ ] Clicking outside or X closes tooltip
- [ ] Can add annotations in configurator
- [ ] Can edit annotation title/description
- [ ] Can set annotation color
- [ ] Can set filled vs outline style
- [ ] Can set "open by default" option
- [ ] All text translated in all three locales
