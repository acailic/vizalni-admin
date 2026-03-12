import { NextRequest, NextResponse } from 'next/server'

import { searchDatasets, getFeaturedDatasets, getRecentDatasets } from '@/lib/api/datagov'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('q') || undefined
  // Validate and clamp pagination parameters to prevent abuse
  const page = Math.max(1, Math.min(1000, parseInt(searchParams.get('page') || '1') || 1))
  const pageSize = Math.max(1, Math.min(100, parseInt(searchParams.get('pageSize') || '20') || 20))
  const type = searchParams.get('type') // 'featured' or 'recent'

  try {
    let result

    if (type === 'featured') {
      const datasets = await getFeaturedDatasets()
      result = {
        datasets,
        total: datasets.length,
        page: 1,
        page_size: datasets.length,
      }
    } else if (type === 'recent') {
      const datasets = await getRecentDatasets(pageSize)
      result = {
        datasets,
        total: datasets.length,
        page: 1,
        page_size: datasets.length,
      }
    } else {
      result = await searchDatasets(query, page, pageSize)
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch datasets' },
      { status: 500 }
    )
  }
}
