import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth-options'
import { prisma } from '@/lib/db/prisma'

/**
 * GET /api/charts/mine
 * Fetch the current user's charts
 */
export async function GET(_request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const sessionUserId = (session?.user as { id?: string })?.id

    if (!sessionUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const charts = await prisma.savedChart.findMany({
      where: {
        userId: sessionUserId,
      },
      orderBy: {
        updatedAt: 'desc',
      },
      select: {
        id: true,
        title: true,
        description: true,
        chartType: true,
        status: true,
        views: true,
        thumbnail: true,
        createdAt: true,
        updatedAt: true,
        publishedAt: true,
      },
    })

    return NextResponse.json({ charts })
  } catch (error) {
    console.error('Error fetching user charts:', error)
    return NextResponse.json({ error: 'Failed to fetch charts' }, { status: 500 })
  }
}
