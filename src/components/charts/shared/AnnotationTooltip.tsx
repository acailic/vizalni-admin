'use client'

import { memo, useState, useRef } from 'react'
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
