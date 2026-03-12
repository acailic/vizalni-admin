import { describe, expect, it } from '@jest/globals'

import { getLocalizedText, type LocalizedText } from '../types'
import type { Locale } from '@/lib/i18n/config'

describe('examples types', () => {
  describe('getLocalizedText', () => {
    const text: LocalizedText = {
      sr: 'Ћирилица',
      lat: 'Latinica',
      en: 'English',
    }

    it('returns Serbian Cyrillic for sr-Cyrl locale', () => {
      const locale: Locale = 'sr-Cyrl'
      expect(getLocalizedText(text, locale)).toBe('Ћирилица')
    })

    it('returns Serbian Latin for sr-Latn locale', () => {
      const locale: Locale = 'sr-Latn'
      expect(getLocalizedText(text, locale)).toBe('Latinica')
    })

    it('returns English for en locale', () => {
      const locale: Locale = 'en'
      expect(getLocalizedText(text, locale)).toBe('English')
    })

    it('falls back to English for missing locale key', () => {
      const partialText: LocalizedText = {
        sr: '',
        lat: '',
        en: 'English only',
      }
      const locale: Locale = 'sr-Cyrl'
      expect(getLocalizedText(partialText, locale)).toBe('English only')
    })

    it('handles empty string fallback', () => {
      const emptyText: LocalizedText = {
        sr: '',
        lat: '',
        en: '',
      }
      const locale: Locale = 'en'
      expect(getLocalizedText(emptyText, locale)).toBe('')
    })
  })
})
