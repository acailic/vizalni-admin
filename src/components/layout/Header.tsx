'use client'

import { memo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'

import { cn } from '@/lib/utils/cn'
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher'
import type { Locale } from '@/lib/i18n/config'

interface HeaderProps {
  locale: Locale
  messages: {
    siteName: string
    home: string
    datasets: string
    about: string
    toggleMenu: string
  }
}

function HeaderComponent({ locale, messages }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  const navItems = [
    { href: `/${locale}`, label: messages.home },
    { href: `/${locale}/browse`, label: messages.datasets },
    { href: `/${locale}/about`, label: messages.about },
  ]

  const handleLanguageChange = (lang: 'sr' | 'lat' | 'en') => {
    const localeMap: Record<string, Locale> = {
      sr: 'sr-Cyrl',
      lat: 'sr-Latn',
      en: 'en',
    }
    const newLocale = localeMap[lang]
    if (newLocale && newLocale !== locale) {
      const pathWithoutLocale = pathname.replace(/^\/(sr-Cyrl|sr-Latn|en)/, '')
      window.location.href = `/${newLocale}${pathWithoutLocale || ''}`
    }
  }

  const currentLang: 'sr' | 'lat' | 'en' = locale === 'sr-Cyrl' ? 'sr' : locale === 'sr-Latn' ? 'lat' : 'en'

  return (
    <header className="border-b border-slate-200 bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href={`/${locale}`} className="flex items-center gap-3">
            <Image
              src="/serbia-logo.png"
              alt="Serbia"
              width={40}
              height={48}
              className="h-10 w-auto"
              priority
            />
            <span className="text-lg font-bold text-[#0C1E42]">{messages.siteName}</span>
          </Link>

          <nav className="hidden items-center gap-6 md:flex" aria-label="Main navigation">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'text-sm font-medium transition-colors',
                  pathname === item.href || (item.href !== `/${locale}` && pathname.startsWith(item.href))
                    ? 'text-[#C6363C]'
                    : 'text-slate-600 hover:text-[#0C1E42]'
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <LanguageSwitcher currentLang={currentLang} onLanguageChange={handleLanguageChange} />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 md:hidden"
              aria-label={messages.toggleMenu}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-slate-200 bg-white md:hidden">
          <nav className="flex flex-col px-4 py-2" aria-label="Mobile navigation">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'py-2 text-sm font-medium',
                  pathname === item.href ? 'text-[#C6363C]' : 'text-slate-600'
                )}
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
