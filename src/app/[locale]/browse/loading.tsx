export default function BrowseLoading() {
  return (
    <div className="container-custom py-12">
      <div className="animate-pulse space-y-6">
        <div className="h-12 rounded-2xl bg-gray-200" />
        <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
          <div className="h-72 rounded-3xl bg-gray-200" />
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div className="h-36 rounded-3xl bg-gray-200" key={index} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
