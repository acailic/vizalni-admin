'use client'

import type { Locale } from '@/lib/i18n/config'
import type { getMessages } from '@/lib/i18n/messages'

type Messages = ReturnType<typeof getMessages>
type AccessibilityMessages = Messages & {
  accessibility?: Record<string, string>
}

interface AccessibilityContentProps {
  locale: Locale
  messages: Messages
}

export function AccessibilityContent({ locale, messages }: AccessibilityContentProps) {
  // Get localized content
  const t = (messages as AccessibilityMessages).accessibility || {}

  return (
    <main className="container-custom py-12" id="main-content">
      <article className="mx-auto max-w-3xl space-y-8">
        <header>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">
            {t.title || 'Accessibility Statement'}
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            {t.subtitle || 'Our commitment to digital accessibility'}
          </p>
        </header>

        <section aria-labelledby="compliance-level">
          <h2 id="compliance-level" className="text-2xl font-semibold text-slate-900">
            {t.complianceTitle || 'Compliance Level'}
          </h2>
          <p className="mt-3 text-slate-700 leading-relaxed">
            {t.complianceDescription ||
              'This platform aims to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standard. We continuously work to ensure our visualizations and data are accessible to all citizens of Serbia.'}
          </p>
          <ul className="mt-4 space-y-2 text-slate-700">
            <li className="flex items-start gap-2">
              <span className="text-gov-primary font-bold">✓</span>
              {t.feature1 || 'Keyboard navigation for all interactive elements'}
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gov-primary font-bold">✓</span>
              {t.feature2 || 'Screen reader compatible data tables for all charts'}
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gov-primary font-bold">✓</span>
              {t.feature3 || 'Color contrast ratios meeting WCAG AA standards'}
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gov-primary font-bold">✓</span>
              {t.feature4 || 'Respect for user motion preferences'}
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gov-primary font-bold">✓</span>
              {t.feature5 || 'Multiple color palette options for colorblind users'}
            </li>
          </ul>
        </section>

        <section aria-labelledby="keyboard-nav">
          <h2 id="keyboard-nav" className="text-2xl font-semibold text-slate-900">
            {t.keyboardTitle || 'Keyboard Navigation'}
          </h2>
          <p className="mt-3 text-slate-700 leading-relaxed">
            {t.keyboardDescription ||
              'All interactive elements can be accessed using a keyboard. Use Tab to navigate between elements, Enter or Space to activate buttons, and Escape to close dialogs.'}
          </p>
          <table className="mt-4 w-full border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th scope="col" className="px-4 py-2 text-left font-semibold text-slate-700">
                  {t.keyHeader || 'Key'}
                </th>
                <th scope="col" className="px-4 py-2 text-left font-semibold text-slate-700">
                  {t.actionHeader || 'Action'}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              <tr>
                <td className="px-4 py-2">
                  <kbd className="rounded bg-slate-100 px-2 py-1 font-mono text-sm">Tab</kbd>
                </td>
                <td className="px-4 py-2 text-slate-700">{t.actionTab || 'Move to next interactive element'}</td>
              </tr>
              <tr>
                <td className="px-4 py-2">
                  <kbd className="rounded bg-slate-100 px-2 py-1 font-mono text-sm">Shift + Tab</kbd>
                </td>
                <td className="px-4 py-2 text-slate-700">{t.actionShiftTab || 'Move to previous element'}</td>
              </tr>
              <tr>
                <td className="px-4 py-2">
                  <kbd className="rounded bg-slate-100 px-2 py-1 font-mono text-sm">Enter / Space</kbd>
                </td>
                <td className="px-4 py-2 text-slate-700">{t.actionEnter || 'Activate buttons and links'}</td>
              </tr>
              <tr>
                <td className="px-4 py-2">
                  <kbd className="rounded bg-slate-100 px-2 py-1 font-mono text-sm">Arrow keys</kbd>
                </td>
                <td className="px-4 py-2 text-slate-700">{t.actionArrows || 'Navigate between chart data points'}</td>
              </tr>
              <tr>
                <td className="px-4 py-2">
                  <kbd className="rounded bg-slate-100 px-2 py-1 font-mono text-sm">Escape</kbd>
                </td>
                <td className="px-4 py-2 text-slate-700">{t.actionEscape || 'Close dialogs and tooltips'}</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section aria-labelledby="accessible-charts">
          <h2 id="accessible-charts" className="text-2xl font-semibold text-slate-900">
            {t.chartsTitle || 'Accessible Charts'}
          </h2>
          <p className="mt-3 text-slate-700 leading-relaxed">
            {t.chartsDescription ||
              'Every chart on this platform includes an accessible data table alternative. Click the "Show as table" button to view the underlying data in a format optimized for screen readers.'}
          </p>
          <ul className="mt-4 space-y-2 text-slate-700">
            <li className="flex items-start gap-2">
              <span className="text-gov-primary font-bold">•</span>
              {t.chartFeature1 || 'ARIA labels describe chart type and content'}
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gov-primary font-bold">•</span>
              {t.chartFeature2 || 'Data summaries include highest, lowest, and average values'}
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gov-primary font-bold">•</span>
              {t.chartFeature3 || 'Trend information provided where applicable'}
            </li>
          </ul>
        </section>

        <section aria-labelledby="color-palettes">
          <h2 id="color-palettes" className="text-2xl font-semibold text-slate-900">
            {t.paletteTitle || 'Color Accessibility'}
          </h2>
          <p className="mt-3 text-slate-700 leading-relaxed">
            {t.paletteDescription ||
              'We provide multiple color palette options designed for different types of color vision deficiency. Switch palettes in the chart configuration to find one that works best for you.'}
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-slate-200 p-4">
              <h3 className="font-semibold text-slate-900">{t.paletteSafe || 'Colorblind-Safe Palettes'}</h3>
              <p className="mt-2 text-sm text-slate-600">
                {t.paletteSafeDesc || 'Palettes marked with "colorblind-safe" are optimized for deuteranopia, protanopia, and tritanopia.'}
              </p>
            </div>
            <div className="rounded-lg border border-slate-200 p-4">
              <h3 className="font-semibold text-slate-900">{t.patternAlt || 'Pattern Alternatives'}</h3>
              <p className="mt-2 text-sm text-slate-600">
                {t.patternAltDesc || 'Charts can use patterns in addition to colors for categories and regions.'}
              </p>
            </div>
          </div>
        </section>

        <section aria-labelledby="motion-preferences">
          <h2 id="motion-preferences" className="text-2xl font-semibold text-slate-900">
            {t.motionTitle || 'Reduced Motion'}
          </h2>
          <p className="mt-3 text-slate-700 leading-relaxed">
            {t.motionDescription ||
              'If you prefer reduced motion, this platform respects your system preferences. Enable "Reduce motion" in your operating system settings, and all chart animations will be disabled.'}
          </p>
        </section>

        <section aria-labelledby="known-limitations">
          <h2 id="known-limitations" className="text-2xl font-semibold text-slate-900">
            {t.limitationsTitle || 'Known Limitations'}
          </h2>
          <ul className="mt-3 space-y-2 text-slate-700">
            <li className="flex items-start gap-2">
              <span className="text-amber-500">⚠</span>
              {t.limitation1 || 'Some third-party map tiles may have color contrast issues'}
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-500">⚠</span>
              {t.limitation2 || 'Complex multi-series charts may be difficult to navigate without a screen reader'}
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-500">⚠</span>
              {t.limitation3 || 'Historical data tables may contain abbreviations without expansions'}
            </li>
          </ul>
        </section>

        <section aria-labelledby="feedback">
          <h2 id="feedback" className="text-2xl font-semibold text-slate-900">
            {t.feedbackTitle || 'Report an Accessibility Issue'}
          </h2>
          <p className="mt-3 text-slate-700 leading-relaxed">
            {t.feedbackDescription ||
              'We are committed to providing an accessible experience for all users. If you encounter any barriers or have suggestions for improvement, please contact us.'}
          </p>
          <div className="mt-4 rounded-lg bg-slate-50 p-4">
            <p className="font-semibold text-slate-900">{t.contactMethod || 'Contact Methods:'}</p>
            <ul className="mt-2 space-y-1 text-slate-700">
              <li>
                {t.email || 'Email'}: <a href="mailto:accessibility@gov.rs" className="text-gov-primary hover:underline">accessibility@gov.rs</a>
              </li>
              <li>
                {t.phone || 'Phone'}: +381 11 XXX XXXX
              </li>
            </ul>
          </div>
        </section>

        <footer className="mt-8 border-t border-slate-200 pt-6 text-sm text-slate-500">
          <p>
            {t.lastUpdated || 'Last updated'}: {new Date().toLocaleDateString(locale)}
          </p>
        </footer>
      </article>
    </main>
  )
}
