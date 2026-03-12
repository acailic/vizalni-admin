// src/lib/examples/index.ts
/**
 * Featured Examples Module
 *
 * This module provides pre-configured chart examples for the homepage.
 */

// Types
export * from './types'

// Cache
export * from './cache'

// Import all configs
import { youthDemographicsConfig } from './configs/youth-demographics'
import { healthStatisticsConfig } from './configs/health-statistics'
import { populationPyramidConfig } from './configs/population-pyramid'

import type { FeaturedExampleConfig } from './types'

/**
 * All featured example configurations
 * Order determines display order on homepage
 */
export const featuredExamples: FeaturedExampleConfig[] = [
  youthDemographicsConfig,
  healthStatisticsConfig,
  populationPyramidConfig,
]
