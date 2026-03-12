'use client'

import { memo, useState, ReactNode } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { SectionBadge } from '@/components/ui/SectionBadge'

interface ConfigSectionProps {
  title: string
  badgeCount?: number
  badgeVariant?: 'count' | 'warning' | 'success' | 'error'
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
  badgeVariant = 'count',
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
        className="flex w-full items-center justify-between px-4 py-3 hover:bg-slate-50 transition-colors"
        aria-expanded={isOpen}
        aria-label={isOpen ? l.collapse : l.expand}
      >
        <span className="flex items-center gap-2">
          <span className="text-sm font-semibold text-slate-900">{title}</span>
          {badgeCount > 0 && !isOpen && (
            <SectionBadge
              count={badgeCount}
              variant={badgeVariant}
            />
          )}
        </span>
        <ChevronDown
          className={cn(
            'h-4 w-4 text-slate-400 transition-transform',
            isOpen && 'rotate-180'
          )}
        />
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
