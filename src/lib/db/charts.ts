import type { ChartConfig } from '@/types/chart-config'
import type { SavedChart, SavedChartMeta, CreateChartInput, UpdateChartInput, ChartListFilters, ChartListPagination, ChartListResult } from '@/types/persistence'
import { ChartStatus } from '@/types/persistence'

import prisma from './prisma'

/**
 * Create a new saved chart
 */
export async function createChart(input: CreateChartInput): Promise<SavedChart> {
  const chart = await prisma.savedChart.create({
    data: {
      title: input.title,
      description: input.description,
      config: JSON.stringify(input.config),
      datasetIds: JSON.stringify(input.datasetIds),
      thumbnail: input.thumbnail,
      chartType: input.chartType,
      userId: input.userId,
      status: ChartStatus.DRAFT,
    },
  })

  return dbChartToSavedChart(chart)
}

/**
 * Get a chart by ID
 */
export async function getChartById(id: string): Promise<SavedChart | null> {
  const chart = await prisma.savedChart.findUnique({
    where: { id },
  })

  if (!chart) return null
  return dbChartToSavedChart(chart)
}

/**
 * List charts with filters and pagination
 */
export async function listCharts(
  filters: ChartListFilters = {},
  pagination: ChartListPagination = { page: 1, pageSize: 20, sortBy: 'createdAt', sortOrder: 'desc' }
): Promise<ChartListResult> {
  const where = {
    ...(filters.status && { status: filters.status }),
    ...(filters.userId && { userId: filters.userId }),
    ...(filters.chartType && { chartType: filters.chartType }),
  }

  const [charts, total] = await Promise.all([
    prisma.savedChart.findMany({
      where,
      orderBy: { [pagination.sortBy]: pagination.sortOrder },
      skip: (pagination.page - 1) * pagination.pageSize,
      take: pagination.pageSize,
    }),
    prisma.savedChart.count({ where }),
  ])

  return {
    charts: charts.map(dbChartToMeta),
    total,
    page: pagination.page,
    pageSize: pagination.pageSize,
    totalPages: Math.ceil(total / pagination.pageSize),
  }
}

/**
 * Update a chart
 */
export async function updateChart(id: string, input: UpdateChartInput): Promise<SavedChart | null> {
  const chart = await prisma.savedChart.update({
    where: { id },
    data: {
      ...(input.title !== undefined && { title: input.title }),
      ...(input.description !== undefined && { description: input.description }),
      ...(input.config !== undefined && { config: JSON.stringify(input.config) }),
      ...(input.datasetIds !== undefined && { datasetIds: JSON.stringify(input.datasetIds) }),
      ...(input.thumbnail !== undefined && { thumbnail: input.thumbnail }),
      ...(input.chartType !== undefined && { chartType: input.chartType }),
    },
  })

  return dbChartToSavedChart(chart)
}

/**
 * Soft delete a chart (set status to ARCHIVED)
 */
export async function deleteChart(id: string): Promise<boolean> {
  try {
    await prisma.savedChart.update({
      where: { id },
      data: { status: ChartStatus.ARCHIVED },
    })
    return true
  } catch {
    return false
  }
}

/**
 * Publish a chart (set status to PUBLISHED)
 */
export async function publishChart(id: string): Promise<SavedChart | null> {
  const chart = await prisma.savedChart.update({
    where: { id },
    data: {
      status: ChartStatus.PUBLISHED,
      publishedAt: new Date(),
    },
  })

  return dbChartToSavedChart(chart)
}

/**
 * Increment view counter (fire-and-forget)
 */
export async function incrementViews(id: string): Promise<void> {
  try {
    await prisma.savedChart.update({
      where: { id },
      data: { views: { increment: 1 } },
    })
  } catch (error) {
    // Log but don't throw - view counting should not affect user experience
    console.error('Failed to increment view count:', error)
  }
}

/**
 * Get public gallery charts (published only)
 */
export async function getGalleryCharts(
  pagination: Omit<ChartListPagination, 'status'> = { page: 1, pageSize: 20, sortBy: 'createdAt', sortOrder: 'desc' }
): Promise<ChartListResult> {
  return listCharts({ status: ChartStatus.PUBLISHED }, pagination)
}

// Helper functions to convert DB models to domain types

function dbChartToSavedChart(chart: {
  id: string
  title: string
  description: string | null
  config: string
  datasetIds: string
  thumbnail: string | null
  chartType: string
  status: string
  views: number
  userId: string | null
  createdAt: Date
  updatedAt: Date
  publishedAt: Date | null
}): SavedChart {
  return {
    id: chart.id,
    title: chart.title,
    description: chart.description,
    config: JSON.parse(chart.config) as ChartConfig,
    datasetIds: JSON.parse(chart.datasetIds) as string[],
    thumbnail: chart.thumbnail,
    chartType: chart.chartType,
    status: chart.status as ChartStatus,
    views: chart.views,
    userId: chart.userId,
    createdAt: chart.createdAt,
    updatedAt: chart.updatedAt,
    publishedAt: chart.publishedAt,
  }
}

function dbChartToMeta(chart: {
  id: string
  title: string
  description: string | null
  chartType: string
  status: string
  views: number
  userId: string | null
  createdAt: Date
  updatedAt: Date
  publishedAt: Date | null
}): SavedChartMeta {
  return {
    id: chart.id,
    title: chart.title,
    description: chart.description,
    chartType: chart.chartType,
    status: chart.status as ChartStatus,
    views: chart.views,
    userId: chart.userId,
    createdAt: chart.createdAt,
    updatedAt: chart.updatedAt,
    publishedAt: chart.publishedAt,
  }
}
