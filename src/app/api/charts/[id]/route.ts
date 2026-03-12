import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { authOptions } from '@/lib/auth/auth-options'
import { getChartById, updateChart, deleteChart, incrementViews } from '@/lib/db/charts'
import { chartConfigSchema } from '@/types/chart-config'

const updateChartSchema = z.object({
  title: z.string().trim().min(1).max(200).optional(),
  description: z.string().trim().max(1000).optional(),
  config: chartConfigSchema.optional(),
  datasetIds: z.array(z.string()).optional(),
  thumbnail: z.string().optional(),
})

interface RouteParams {
  params: Promise<{ id: string }>
}

/**
 * GET /api/charts/[id] - Get a single chart by ID
 * Public for PUBLISHED charts, owner only for DRAFTs
 */
export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const chart = await getChartById(id)

    if (!chart) {
      return NextResponse.json({ error: 'Chart not found' }, { status: 404 })
    }

    // Increment views for published charts (fire and forget)
    if (chart.status === 'PUBLISHED') {
      incrementViews(id).catch(() => {})
    }

    // For drafts, check ownership
    if (chart.status !== 'PUBLISHED') {
      const session = await getServerSession(authOptions)
      const sessionUserId = (session?.user as { id?: string })?.id
      if (!sessionUserId || chart.userId !== sessionUserId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
    }

    return NextResponse.json(chart)
  } catch (error) {
    console.error('Error fetching chart:', error)
    return NextResponse.json({ error: 'Failed to fetch chart' }, { status: 500 })
  }
}

/**
 * PUT /api/charts/[id] - Update a chart (owner only)
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions)
    const sessionUserId = (session?.user as { id?: string })?.id
    if (!sessionUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const chart = await getChartById(id)

    if (!chart) {
      return NextResponse.json({ error: 'Chart not found' }, { status: 404 })
    }

    // Check ownership - allow anonymous charts to be claimed by first editor
    if (chart.userId && chart.userId !== sessionUserId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const parseResult = updateChartSchema.safeParse(body)

    if (!parseResult.success) {
      return NextResponse.json(
        { error: 'Invalid request body', details: parseResult.error.flatten() },
        { status: 400 }
      )
    }

    const { title, description, config, datasetIds, thumbnail } = parseResult.data

    const updatedChart = await updateChart(id, {
      title,
      description,
      config: config as any,
      datasetIds,
      thumbnail,
      chartType: config?.type,
    })

    return NextResponse.json(updatedChart)
  } catch (error) {
    console.error('Error updating chart:', error)
    return NextResponse.json({ error: 'Failed to update chart' }, { status: 500 })
  }
}

/**
 * DELETE /api/charts/[id] - Delete a chart (owner only)
 */
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions)
    const sessionUserId = (session?.user as { id?: string })?.id
    if (!sessionUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const chart = await getChartById(id)

    if (!chart) {
      return NextResponse.json({ error: 'Chart not found' }, { status: 404 })
    }

    // Check ownership - only owner can delete
    if (chart.userId && chart.userId !== sessionUserId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const success = await deleteChart(id)

    if (!success) {
      return NextResponse.json({ error: 'Failed to delete chart' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting chart:', error)
    return NextResponse.json({ error: 'Failed to delete chart' }, { status: 500 })
  }
}
