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

function PreviewContainerComponent({
  children,
  breakpoint,
  className,
}: PreviewContainerProps) {
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
