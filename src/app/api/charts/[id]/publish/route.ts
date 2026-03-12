import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth-options'
import { getChartById, publishChart } from '@/lib/db'

interface RouteParams {
  params: Promise<{ id: string }>
}

/**
 * POST /api/charts/[id]/publish - Publish a draft chart (owner only)
 */
export async function POST(
  _request: NextRequest,
  { params }: RouteParams
) {
  try {
    // Check authentication
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

    // Check ownership - only owner can publish
    if (chart.userId && chart.userId !== sessionUserId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const publishedChart = await publishChart(id)

    if (!publishedChart) {
      return NextResponse.json({ error: 'Failed to publish chart' }, { status: 500 })
    }

    return NextResponse.json(publishedChart)
  } catch (error) {
    console.error('Error publishing chart:', error)
    return NextResponse.json({ error: 'Failed to publish chart' }, { status: 500 })
  }
}
