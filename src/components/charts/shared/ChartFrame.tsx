'use client'

import { forwardRef, type ReactNode } from 'react'

interface ChartFrameProps {
  title: string
  description?: string
  height?: number
  children?: ReactNode
  emptyMessage?: string
  errorMessage?: string
  filterBar?: ReactNode
}

export const ChartFrame = forwardRef<HTMLDivElement, ChartFrameProps>(
  (
    {
      title,
      description,
      height = 400,
      children,
      emptyMessage,
      errorMessage,
      filterBar,
    },
    ref
  ) => {
    const content = errorMessage ? (
      <div className="flex h-full items-center justify-center rounded-2xl border border-red-200 bg-red-50 px-6 text-center text-sm text-red-700">
        {errorMessage}
      </div>
    ) : emptyMessage ? (
      <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 text-center text-sm text-slate-600">
        {emptyMessage}
      </div>
    ) : (
      children
    )

    return (
      <section
        ref={ref}
        className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm"
      >
        <header className="mb-4 space-y-1">
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
          {description ? (
            <p className="text-sm leading-6 text-slate-600">{description}</p>
          ) : null}
        </header>
        {filterBar}
        <div style={{ height }}>{content}</div>
      </section>
    )
  }
)

ChartFrame.displayName = 'ChartFrame'
