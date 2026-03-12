'use client'

import { memo, useState, useCallback } from 'react'
import { AnnotationCircle } from './AnnotationCircle'
import { AnnotationTooltip } from './AnnotationTooltip'
import type { Annotation, ChartAnnotation } from '@/types/annotation'

interface AnnotationsLayerProps {
  annotations: Annotation[]
  chartData?: unknown[]
  getAnnotationPosition: (target: Annotation['targets'][0]) => { x: number; y: number } | null
  locale: 'sr-Cyrl' | 'sr-Latn' | 'en'
  activeField?: string | null
}

function AnnotationsLayerComponent({
  annotations,
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
