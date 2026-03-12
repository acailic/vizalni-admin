'use client'

export default function BrowseError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="container-custom py-12">
      <div className="rounded-3xl border border-red-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-gray-900">Browse Error</h1>
        <p className="mt-3 text-sm text-gray-600">{error.message}</p>
        <button className="btn-primary mt-6" onClick={() => reset()} type="button">
          Try again
        </button>
      </div>
    </div>
  )
}
