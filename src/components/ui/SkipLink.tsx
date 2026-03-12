'use client'

import { type ReactNode } from 'react'

interface SkipLinkProps {
  /** Target element ID to skip to */
  targetId: string
  /** Label for the skip link */
  label?: string
  /** Additional className */
  className?: string
}

/**
 * Skip navigation link for keyboard and screen reader users.
 * Allows users to bypass repetitive navigation and jump directly to main content.
 */
export function SkipLink({
  targetId,
  label = 'Skip to main content',
  className = '',
}: SkipLinkProps) {
  return (
    <a
      href={`#${targetId}`}
      className={`skip-link ${className}`}
      // Ensure it's visible on focus
      style={{
        position: 'absolute',
        top: '-100%',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9999,
      }}
    >
      {label}
    </a>
  )
}

interface SkipLinksProps {
  /** Array of skip link targets */
  links?: Array<{
    targetId: string
    label: string
  }>
}

/**
 * Multiple skip links for complex pages.
 * Typically includes: Skip to main content, Skip to navigation, Skip to filters
 */
export function SkipLinks({
  links = [
    { targetId: 'main-content', label: 'Skip to main content' },
    { targetId: 'chart-content', label: 'Skip to chart' },
    { targetId: 'data-table', label: 'Skip to data table' },
  ],
}: SkipLinksProps) {
  return (
    <nav
      aria-label="Skip links"
      className="fixed left-1/2 -translate-x-1/2 z-[9999] flex gap-2"
      style={{ top: '-100%' }}
    >
      {links.map(link => (
        <a
          key={link.targetId}
          href={`#${link.targetId}`}
          className="skip-link bg-gov-primary text-white px-4 py-2 rounded-md font-semibold hover:bg-gov-accent focus:top-4 focus:outline-3 focus:outline-gov-secondary focus:outline-offset-2 transition-colors"
          style={{
            position: 'relative',
          }}
        >
          {link.label}
        </a>
      ))}
    </nav>
  )
}

/**
 * Main content wrapper with proper landmark and ID for skip links.
 */
interface MainContentProps {
  children: ReactNode
  /** ID for the main content (default: 'main-content') */
  id?: string
  /** Additional className */
  className?: string
}

export function MainContent({
  children,
  id = 'main-content',
  className = '',
}: MainContentProps) {
  return (
    <main id={id} role="main" className={className}>
      {children}
    </main>
  )
}

/**
 * Chart content wrapper with proper landmark for skip links.
 */
interface ChartContentProps {
  children: ReactNode
  /** ID for the chart content */
  id?: string
  /** Label for the region */
  label?: string
  /** Additional className */
  className?: string
}

export function ChartContent({
  children,
  id = 'chart-content',
  label = 'Chart content',
  className = '',
}: ChartContentProps) {
  return (
    <section id={id} aria-label={label} className={className}>
      {children}
    </section>
  )
}

export default SkipLink
