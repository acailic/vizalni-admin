import { NextRequest, NextResponse } from 'next/server'

import { z } from 'zod'

import { fetchPreviewPayload, isAllowedPreviewHost, isPreviewableFormat } from '@/lib/api/browse'

const previewSchema = z.object({
  url: z.string().url(),
  format: z.string().min(1),
  limit: z.coerce.number().int().positive().max(1000).optional(),
})

export async function GET(request: NextRequest) {
  const rawParams = Object.fromEntries(request.nextUrl.searchParams.entries())
  const parsed = previewSchema.safeParse(rawParams)

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid preview params' }, { status: 400 })
  }

  const previewUrl = new URL(parsed.data.url)

  if (!['http:', 'https:'].includes(previewUrl.protocol)) {
    return NextResponse.json({ error: 'Unsupported preview protocol' }, { status: 400 })
  }

  if (!isAllowedPreviewHost(previewUrl.hostname)) {
    return NextResponse.json({ error: 'Preview host is not allowed' }, { status: 400 })
  }

  if (!isPreviewableFormat(parsed.data.format)) {
    return NextResponse.json({ error: 'Preview format is not supported' }, { status: 400 })
  }

  try {
    const payload = await fetchPreviewPayload(
      previewUrl.toString(),
      parsed.data.format,
      parsed.data.limit ?? 100
    )
    return NextResponse.json(payload)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to load preview' },
      { status: 500 }
    )
  }
}
