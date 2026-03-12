interface EmptyStateProps {
  title: string
  description: string
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="rounded-3xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center shadow-sm">
      <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-gray-600">{description}</p>
    </div>
  )
}
