'use client'

import { useCallback } from 'react'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'

type SearchValue = string | number | undefined

export function useSearch() {
  const router = useRouter()
  const pathname = usePathname()
  const currentParams = useSearchParams()

  const setSearchParams = useCallback(
    (values: Record<string, SearchValue>, resetPage: boolean = false) => {
      const params = new URLSearchParams(currentParams.toString())

      if (resetPage) {
        params.delete('page')
      }

      for (const [key, value] of Object.entries(values)) {
        if (value === undefined || value === '') {
          params.delete(key)
        } else {
          params.set(key, String(value))
        }
      }

      const query = params.toString()
      if (query === currentParams.toString()) {
        return
      }

      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false })
    },
    [currentParams, pathname, router]
  )

  return {
    searchParams: currentParams,
    setSearchParams,
  }
}
