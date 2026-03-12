import { NextRequest, NextResponse } from 'next/server'

import { z } from 'zod'

import { listCharts, createChart } from '@/lib/db'
import { chartConfigSchema } from '@/types/chart-config'
import { ChartStatus } from '@/types/persistence'

const createChartSchema = z.object({
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().max(1000).optional(),
  config: chartConfigSchema,
  datasetIds: z.array(z.string()).default([]),
  thumbnail: z.string().optional(),
})

const listQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  sortBy: z.enum(['createdAt', 'views', 'updatedAt']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
  chartType: z.string().optional(),
})

/**
 * GET /api/charts - List published charts (public gallery)
 * Query params: page, pageSize, sortBy, sortOrder, chartType
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const queryResult = listQuerySchema.safeParse(Object.fromEntries(searchParams))

    if (!queryResult.success) {
      return NextResponse.json(
        { error: 'Invalid query parameters', details: queryResult.error.flatten() },
        { status: 400 }
      )
    }

    const { page, pageSize, sortBy, sortOrder, chartType } = queryResult.data

    const result = await listCharts(
      { status: ChartStatus.PUBLISHED, chartType },
      { page, pageSize, sortBy, sortOrder }
    )

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error listing charts:', error)
    return NextResponse.json({ error: 'Failed to list charts' }, { status: 500 })
  }
}

/**
 * POST /api/charts - Create a new chart (anonymous or authenticated)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parseResult = createChartSchema.safeParse(body)

    if (!parseResult.success) {
      return NextResponse.json(
        { error: 'Invalid request body', details: parseResult.error.flatten() },
        { status: 400 }
      )
    }

    const { title, description, config, datasetIds, thumbnail } = parseResult.data

    const chart = await createChart({
      title,
      description,
      config: config as any, // Type cast to avoid discriminated union issues
      datasetIds,
      thumbnail,
      chartType: config.type,
      // userId will be added later with authentication
    })

    return NextResponse.json(chart, { status: 201 })
  } catch (error) {
    console.error('Error creating chart:', error)
    return NextResponse.json({ error: 'Failed to create chart' }, { status: 500 })
  }
}
