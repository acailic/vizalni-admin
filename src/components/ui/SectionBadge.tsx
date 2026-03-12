/**
 * Section Badge Component
 *
 * Badge indicators for configurator sections showing counts,
 * warnings, success states, and errors.
 */

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
  className,
}: SectionBadgeProps) {
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
    warning: label ?? 'Warning',
    success: label ?? 'Completed',
    error: label ?? 'Error',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border',
        badgeStyles[variant],
        pulse && 'animate-pulse',
        className
      )}
      role="status"
      aria-label={ariaLabels[variant]}
    >
      {variant === 'warning' && <AlertCircle className="w-3 h-3" />}
      {variant === 'success' && <Check className="w-3 h-3" />}
      {variant === 'error' && <AlertCircle className="w-3 h-3" />}
      {variant === 'count' && count}
    </span>
  )
}

export const SectionBadge = memo(SectionBadgeComponent)
