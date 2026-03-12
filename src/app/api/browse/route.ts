import { NextRequest, NextResponse } from 'next/server'

import { z } from 'zod'

import { getBrowseDatasets } from '@/lib/api/browse'

const querySchema = z.object({
  q: z.string().optional(),
  page: z.coerce.number().int().positive().optional(),
  pageSize: z.coerce.number().int().positive().max(50).optional(),
  organization: z.string().optional(),
  topic: z.string().optional(),
  format: z.string().optional(),
  frequency: z.string().optional(),
  sort: z.string().optional(),
})

export async function GET(request: NextRequest) {
  const rawParams = Object.fromEntries(request.nextUrl.searchParams.entries())
  const parsed = querySchema.safeParse(rawParams)

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid browse params' }, { status: 400 })
  }

  try {
    const data = await getBrowseDatasets(parsed.data)
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch datasets' },
      { status: 500 }
    )
  }
}
