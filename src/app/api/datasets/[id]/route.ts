import { NextResponse } from 'next/server'

import { getDataset, getDatasetResources } from '@/lib/api/datagov'

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id

  try {
    const dataset = await getDataset(id)
    const resources = await getDatasetResources(id)

    return NextResponse.json({
      dataset,
      resources,
    })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dataset' },
      { status: 500 }
    )
  }
}
