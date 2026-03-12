import Link from 'next/link'
import { Home, Search, ArrowLeft } from 'lucide-react'

const locales = {
  'sr-Cyrl': {
    title: 'Страница није пронађена',
    description: 'Страница коју тражите не постоји или је премештена.',
    backHome: 'Назад на почетну',
    browseDatasets: 'Прегледај скупове података',
    goBack: 'Назад',
  },
  'sr-Latn': {
    title: 'Stranica nije pronađena',
    description: 'Stranica koju tražite ne postoji ili je premeštena.',
    backHome: 'Nazad na početnu',
    browseDatasets: 'Pregledaj skupove podataka',
    goBack: 'Nazad',
  },
  en: {
    title: 'Page not found',
    description: 'The page you are looking for does not exist or has been moved.',
    backHome: 'Back to home',
    browseDatasets: 'Browse datasets',
    goBack: 'Go back',
  },
}

export default function NotFound() {
  // Default to Serbian Latin since we can't easily get locale here
  const t = locales['sr-Latn']

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-16">
      <div className="text-center">
        {/* 404 Number */}
        <div className="mb-8">
          <span className="text-[120px] font-bold leading-none text-slate-200 md:text-[180px]">
            404
          </span>
        </div>

        {/* Error message */}
        <h1 className="mb-4 text-2xl font-bold text-[#0C1E42] md:text-3xl">
          {t.title}
        </h1>
        <p className="mb-8 max-w-md text-slate-600">
          {t.description}
        </p>

        {/* Action buttons */}
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
          <Link
            href="/sr-Latn"
            className="inline-flex items-center gap-2 rounded-lg bg-[#0C1E42] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[#1a2d52]"
          >
            <Home className="h-4 w-4" />
            {t.backHome}
          </Link>
          <Link
            href="/sr-Latn/browse"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
          >
            <Search className="h-4 w-4" />
            {t.browseDatasets}
          </Link>
        </div>

        {/* Go back button */}
        <button
          onClick={() => window.history.back()}
          className="mt-6 inline-flex items-center gap-2 text-sm text-slate-500 transition-colors hover:text-[#C6363C]"
        >
          <ArrowLeft className="h-4 w-4" />
          {t.goBack}
        </button>
      </div>
    </div>
  )
}
