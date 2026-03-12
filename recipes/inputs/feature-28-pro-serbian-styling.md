# Feature Request

## Title
Pro-Serbian Government Styling - Professional header, footer, and branding

## Problem
The site looks generic and doesn't convey the professional appearance expected of a Serbian government data visualization platform. The header, footer, and overall branding need to match the visual identity standards of Serbian government institutions (like data.gov.rs, srbija.gov.rs).

## Proposed behavior

### Header Enhancements
- Government coat of arms (grb Srbije) in header
- Official institution name in both scripts (Република Србија / Republika Srbija)
- Professional navigation with government-style dropdowns
- Breadcrumb navigation matching government sites
- Language switcher with proper flags/scripts

### Footer Enhancements
- Official footer with government links
- Contact information section
- Privacy policy and terms links
- Social media links (if applicable)
- Copyright with year and institution
- Accessibility statement link
- Map of institutional structure

### Visual Identity
- Serbian government color palette (red, blue, white from flag)
- Typography matching official government sites
- Proper spacing and proportions
- Official icons and emblems
- Consistent with srbija.gov.rs style guide

### Trust Indicators
- SSL/Security badges
- Official government domain indicator
- Data source attribution
- Last updated timestamps
- Version/build info in footer

---

## Detailed Implementation

### File 1: Update `src/components/layout/Header.tsx`

```typescript
'use client'

import { memo, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils/cn'
import { LanguageSwitcher } from './LanguageSwitcher'

// Serbian coat of arms SVG (simplified)
const CoatOfArms = () => (
  <svg viewBox="0 0 100 120" className="h-12 w-10">
    {/* Simplified double-headed eagle */}
    <path
      d="M50 10 L30 35 L20 30 L25 45 L15 50 L25 55 L20 70 L30 65 L50 90 L70 65 L80 70 L75 55 L85 50 L75 45 L80 30 L70 35 Z"
      fill="#C6363C"
      stroke="#0C1E42"
      strokeWidth="2"
    />
    {/* Crown */}
    <path
      d="M35 5 L40 12 L50 8 L60 12 L65 5 L65 15 L35 15 Z"
      fill="#C6363C"
      stroke="#0C1E42"
      strokeWidth="1"
    />
    {/* Shield center */}
    <rect x="40" y="45" width="20" height="25" fill="#0C1E42" stroke="#C6363C" strokeWidth="2"/>
  </svg>
)

interface HeaderProps {
  locale: 'sr-Cyrl' | 'sr-Latn' | 'en'
  messages: {
    siteName: string
    government: string
    home: string
    datasets: string
    about: string
    contact: string
  }
}

function HeaderComponent({ locale, messages }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  const navItems = [
    { href: `/${locale}`, label: messages.home },
    { href: `/${locale}/datasets`, label: messages.datasets },
    { href: `/${locale}/about`, label: messages.about },
    { href: `/${locale}/contact`, label: messages.contact },
  ]

  return (
    <header className="border-b border-slate-200 bg-white shadow-sm">
      {/* Top bar with government branding */}
      <div className="bg-[#0C1E42] text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-1.5 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-medium">
              {locale === 'sr-Cyrl' ? 'Република Србија' : locale === 'sr-Latn' ? 'Republika Srbija' : 'Republic of Serbia'}
            </span>
            <span className="text-slate-400">|</span>
            <span className="text-slate-300">
              {locale === 'sr-Cyrl' ? 'Влада Републике Србије' : locale === 'sr-Latn' ? 'Vlada Republike Srbije' : 'Government of the Republic of Serbia'}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a href="https://www.srbija.gov.rs" target="_blank" rel="noopener" className="hover:text-slate-200">
              srbija.gov.rs
            </a>
            <a href="https://www.data.gov.rs" target="_blank" rel="noopener" className="hover:text-slate-200">
              data.gov.rs
            </a>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and site name */}
          <Link href={`/${locale}`} className="flex items-center gap-3">
            <CoatOfArms />
            <div className="flex flex-col">
              <span className="text-lg font-bold text-[#0C1E42]">
                {messages.siteName}
              </span>
              <span className="text-xs text-slate-500">
                {messages.government}
              </span>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'text-sm font-medium transition-colors',
                  pathname === item.href
                    ? 'text-[#C6363C]'
                    : 'text-slate-600 hover:text-[#0C1E42]'
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-4">
            <LanguageSwitcher locale={locale} />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600"
              aria-label="Toggle menu"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white">
          <nav className="flex flex-col px-4 py-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="py-2 text-sm font-medium text-slate-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}

export const Header = memo(HeaderComponent)
```

### File 2: Update `src/components/layout/Footer.tsx`

```typescript
'use client'

import { memo } from 'react'
import Link from 'next/link'

interface FooterProps {
  locale: 'sr-Cyrl' | 'sr-Latn' | 'en'
  messages: {
    siteName: string
    government: string
    aboutGov: string
    privacy: string
    terms: string
    accessibility: string
    contact: string
    dataSources: string
    lastUpdated: string
    version: string
    allRightsReserved: string
    officialSite: string
  }
}

function FooterComponent({ locale, messages }: FooterProps) {
  const currentYear = new Date().getFullYear()

  const footerLinks = [
    { href: `/${locale}/about`, label: messages.aboutGov },
    { href: `/${locale}/privacy`, label: messages.privacy },
    { href: `/${locale}/terms`, label: messages.terms },
    { href: `/${locale}/accessibility`, label: messages.accessibility },
    { href: `/${locale}/contact`, label: messages.contact },
  ]

  const externalLinks = [
    { href: 'https://www.srbija.gov.rs', label: 'srbija.gov.rs' },
    { href: 'https://www.data.gov.rs', label: 'data.gov.rs' },
    { href: 'https://www.parlament.gov.rs', label: locale === 'sr-Cyrl' ? 'Народна скупштина' : 'Narodna skupština' },
  ]

  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      {/* Main footer content */}
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid gap-8 md:grid-cols-4">
          {/* About section */}
          <div className="md:col-span-2">
            <h3 className="mb-3 text-sm font-semibold text-[#0C1E42]">
              {messages.siteName}
            </h3>
            <p className="mb-4 text-sm text-slate-600">
              {messages.government}
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span>{messages.officialSite}</span>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-[#0C1E42]">
              {locale === 'sr-Cyrl' ? 'Корисни линкови' : locale === 'sr-Latn' ? 'Korisni linkovi' : 'Useful Links'}
            </h3>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-slate-600 hover:text-[#C6363C]">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* External links */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-[#0C1E42]">
              {locale === 'sr-Cyrl' ? 'Институције' : locale === 'sr-Latn' ? 'Institucije' : 'Institutions'}
            </h3>
            <ul className="space-y-2">
              {externalLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-slate-600 hover:text-[#C6363C]"
                  >
                    {link.label}
                    <svg className="ml-1 inline h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
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
              © {currentYear} {messages.government}. {messages.allRightsReserved}.
            </div>
            <div className="flex items-center gap-4 text-xs text-slate-400">
              <span>{messages.dataSources}: data.gov.rs</span>
              <span>|</span>
              <span>{messages.version}: {process.env.npm_package_version || '1.0.0'}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export const Footer = memo(FooterComponent)
```

### File 3: Add translations

**`src/locales/en.json`** additions:
```json
{
  "header": {
    "siteName": "Visual Admin Serbia",
    "government": "Government of the Republic of Serbia",
    "home": "Home",
    "datasets": "Datasets",
    "about": "About",
    "contact": "Contact"
  },
  "footer": {
    "aboutGov": "About This Portal",
    "privacy": "Privacy Policy",
    "terms": "Terms of Use",
    "accessibility": "Accessibility",
    "contact": "Contact",
    "dataSources": "Data sources",
    "lastUpdated": "Last updated",
    "version": "Version",
    "allRightsReserved": "All rights reserved",
    "officialSite": "Official government website"
  }
}
```

**`src/locales/sr-cyr.json`** additions:
```json
{
  "header": {
    "siteName": "Визуелни администратор Србије",
    "government": "Влада Републике Србије",
    "home": "Почетна",
    "datasets": "Скупови података",
    "about": "О порталу",
    "contact": "Контакт"
  },
  "footer": {
    "aboutGov": "О порталу",
    "privacy": "Политика приватности",
    "terms": "Услови коришћења",
    "accessibility": "Приступачност",
    "contact": "Контакт",
    "dataSources": "Извори података",
    "lastUpdated": "Ажурирано",
    "version": "Верзија",
    "allRightsReserved": "Сва права задржана",
    "officialSite": "Званични сајт Владе"
  }
}
```

---

## Affected areas
- `src/components/layout/Header.tsx` - Complete redesign with government branding
- `src/components/layout/Footer.tsx` - Professional government footer
- `src/locales/*.json` - All translations for new content
- `src/app/globals.css` - Any additional CSS variables for government colors

## Constraints
- Must use official Serbian government colors (#C6363C red, #0C1E42 blue)
- Coat of arms must be respectful and properly positioned
- All text must be available in all three locales
- Must work on mobile devices
- Must be accessible (WCAG 2.1 AA)

## Out of scope
- Actual coat of arms image file (use SVG for simplicity)
- Backend changes
- Authentication changes

## Acceptance criteria
- [ ] Header shows government top bar with "Republika Srbija"
- [ ] Coat of arms appears in header
- [ ] Navigation works in all locales
- [ ] Language switcher functional
- [ ] Mobile menu works
- [ ] Footer has all required links
- [ ] Footer shows copyright with current year
- [ ] Footer shows version info
- [ ] Official government color scheme applied
- [ ] All translations present in all three locales
