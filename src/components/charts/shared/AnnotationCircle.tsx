'use client'

import { memo } from 'react'

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
      role="button"
      aria-label="Toggle annotation"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick()
        }
      }}
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
