'use client'

import { memo } from 'react'
import Link from 'next/link'
import { ExternalLink } from 'lucide-react'

import type { Locale } from '@/lib/i18n/config'

interface FooterProps {
  locale: Locale
  messages: {
    siteName: string
    about: string
    privacy: string
    terms: string
    accessibility: string
    dataSources: string
    version: string
    allRightsReserved: string
    usefulLinks: string
    resources: string
  }
}

function FooterComponent({ locale, messages }: FooterProps) {
  const currentYear = new Date().getFullYear()
  const version = process.env.npm_package_version || '1.0.0'

  const footerLinks = [
    { href: `/${locale}/about`, label: messages.about },
    { href: `/${locale}/privacy`, label: messages.privacy },
    { href: `/${locale}/terms`, label: messages.terms },
    { href: `/${locale}/accessibility`, label: messages.accessibility },
  ]

  const externalLinks = [
    { href: 'https://www.data.gov.rs', label: 'data.gov.rs' },
  ]

  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid gap-8 md:grid-cols-3">
          {/* About section */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-[#0C1E42]">{messages.siteName}</h3>
            <p className="text-sm text-slate-600">
              {locale === 'sr-Cyrl'
                ? 'Отворена платформа за визуелизацију података'
                : locale === 'sr-Latn'
                  ? 'Otvorena platforma za vizualizaciju podataka'
                  : 'Open platform for data visualization'}
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-[#0C1E42]">{messages.usefulLinks}</h3>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-slate-600 transition-colors hover:text-[#C6363C]">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-[#0C1E42]">{messages.resources}</h3>
            <ul className="space-y-2">
              {externalLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-sm text-slate-600 transition-colors hover:text-[#C6363C]"
                  >
                    {link.label}
                    <ExternalLink className="ml-1 h-3 w-3" aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-200 bg-[#0C1E42] text-white">
        <div className="mx-auto max-w-7xl px-4 py-3">
          <div className="flex flex-col items-center justify-between gap-2 md:flex-row md:gap-4">
            <div className="text-xs text-slate-300">
              © {currentYear} {messages.siteName}. {messages.allRightsReserved}.
            </div>
            <div className="flex items-center gap-4 text-xs text-slate-400">
              <span>
                {messages.dataSources}: data.gov.rs
              </span>
              <span className="hidden sm:inline">|</span>
              <span className="hidden sm:inline">
                {messages.version}: {version}
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export const Footer = memo(FooterComponent)
