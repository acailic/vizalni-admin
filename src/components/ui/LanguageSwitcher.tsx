'use client'

import { useTransition } from 'react'

interface LanguageSwitcherProps {
  currentLang: 'sr' | 'lat' | 'en'
  onLanguageChange: (lang: 'sr' | 'lat' | 'en') => void
}

const languages = [
  { code: 'sr' as const, label: 'Ћир', flag: '🇷🇸' },
  { code: 'lat' as const, label: 'Lat', flag: '🇷🇸' },
  { code: 'en' as const, label: 'EN', flag: '🇬🇧' },
]

export function LanguageSwitcher({ currentLang, onLanguageChange }: LanguageSwitcherProps) {
  const [isPending] = useTransition()

  return (
    <div className="lang-switcher">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => onLanguageChange(lang.code)}
          disabled={isPending}
          className={currentLang === lang.code ? 'active' : ''}
          aria-label={`Switch to ${lang.label}`}
        >
          <span className="mr-1">{lang.flag}</span>
          {lang.label}
        </button>
      ))}
    </div>
  )
}
