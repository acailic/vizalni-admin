'use client'

import { memo } from 'react'
import { Laptop, Monitor, Smartphone, Tablet } from 'lucide-react'

import { cn } from '@/lib/utils/cn'

export type PreviewBreakpoint = 'xl' | 'lg' | 'md' | 'sm' | null

export const BREAKPOINT_WIDTHS: Record<Exclude<PreviewBreakpoint, null>, number> = {
  xl: 1200,
  lg: 992,
  md: 768,
  sm: 576,
}

interface PreviewBreakpointToggleProps {
  value: PreviewBreakpoint
  onChange: (value: PreviewBreakpoint) => void
  labels: {
    desktop: string
    laptop: string
    tablet: string
    mobile: string
    tooltip?: string
  }
}

function PreviewBreakpointToggleComponent({
  value,
  onChange,
  labels,
}: PreviewBreakpointToggleProps) {
  const breakpoints: {
    key: PreviewBreakpoint
    icon: typeof Monitor
    title: string
  }[] = [
    { key: 'xl', icon: Monitor, title: labels.desktop },
    { key: 'lg', icon: Laptop, title: labels.laptop },
    { key: 'md', icon: Tablet, title: labels.tablet },
    { key: 'sm', icon: Smartphone, title: labels.mobile },
  ]

  return (
    <div
      className="flex items-center gap-1 rounded-lg bg-slate-100 p-1"
      role="group"
      aria-label={labels.tooltip ?? 'Preview breakpoint selector'}
    >
      {breakpoints.map(({ key, icon: Icon, title }) => (
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
          aria-pressed={value === key}
        >
          <Icon className="h-4 w-4" aria-hidden="true" />
          <span className="hidden sm:inline">{title}</span>
        </button>
      ))}
    </div>
  )
}

export const PreviewBreakpointToggle = memo(PreviewBreakpointToggleComponent)
