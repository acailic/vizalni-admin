/**
 * Collapsible Section Component
 *
 * Expandable/collapsible sections for the configurator sidebar
 * with badge indicators for counts, warnings, and completion states.
 */

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
  className,
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  const handleToggle = useCallback(() => {
    if (!forceOpen) {
      setIsOpen((prev) => !prev)
    }
  }, [forceOpen])

  const isExpanded = forceOpen || isOpen

  const getBadge = () => {
    if (hasError) {
      return <SectionBadge variant="error" label={badgeLabel ?? 'Error'} pulse />
    }
    if (required && !completed && !isExpanded) {
      return <SectionBadge variant="warning" label={badgeLabel ?? 'Required'} pulse />
    }
    if (required && completed && !isExpanded) {
      return <SectionBadge variant="success" />
    }
    if (badgeCount !== undefined && badgeCount > 0) {
      return (
        <SectionBadge
          count={badgeCount}
          label={badgeLabel}
          variant={badgeVariant ?? 'count'}
        />
      )
    }
    return null
  }

  return (
    <div className={cn('border border-slate-200 rounded-xl overflow-hidden', className)}>
      <button
        type="button"
        onClick={handleToggle}
        disabled={forceOpen}
        className={cn(
          'w-full flex items-center justify-between px-4 py-3 bg-slate-50 hover:bg-slate-100 transition-colors',
          forceOpen && 'cursor-default'
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
          {required && <span className="text-red-500" aria-label="Required">*</span>}
        </div>
        {getBadge()}
      </button>

      {isExpanded && (
        <div className="p-4 bg-white border-t border-slate-200">{children}</div>
      )}
    </div>
  )
}

export const CollapsibleSection = memo(CollapsibleSectionComponent)
