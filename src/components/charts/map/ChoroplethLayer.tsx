'use client'

import { useMemo, useCallback } from 'react'

import type { Geometry, GeoJsonObject } from 'geojson'
import L from 'leaflet'
import { GeoJSON } from 'react-leaflet'

import {
  classifyData,
  createColorScale,
  MISSING_DATA_COLORS,
} from '@/lib/charts/color-scales'
import type {
  ColorScaleType,
  ClassificationMethod,
  MapPalette,
} from '@/types/chart-config'

export interface GeoFeature {
  type: 'Feature'
  properties: {
    id: string
    code: string
    name_sr_cyrl: string
    name_sr_latn: string
    name_en: string
    [key: string]: unknown
  }
  geometry: Geometry
}

interface ChoroplethLayerProps {
  data: GeoJSON.FeatureCollection<Geometry, GeoFeature['properties']>
  values: Map<string, number>
  colorScaleType: ColorScaleType
  palette: MapPalette
  classificationMethod: ClassificationMethod
  classCount: number
  customBreaks?: number[]
  fillOpacity?: number
  showMissingDataPattern?: boolean
  onFeatureHover?: (feature: GeoFeature | null, position?: { x: number; y: number }) => void
}

export function ChoroplethLayer({
  data,
  values,
  colorScaleType,
  palette,
  classificationMethod,
  classCount,
  customBreaks,
  fillOpacity = 0.8,
  showMissingDataPattern = true,
  onFeatureHover,
}: ChoroplethLayerProps) {
  // Calculate classification breaks
  const { breaks } = useMemo(() => {
    if (customBreaks && customBreaks.length > 0) {
      return {
        breaks: customBreaks,
      }
    }

    const validValues = Array.from(values.values()).filter(v => !isNaN(v))
    return classifyData(validValues, classificationMethod, classCount)
  }, [values, classificationMethod, classCount, customBreaks])

  // Create color scale function
  const colorScale = useMemo(() => {
    if (breaks.length === 0) {
      return () => '#4B90F5'
    }
    return createColorScale(breaks, palette, colorScaleType)
  }, [breaks, palette, colorScaleType])

  // Style function for GeoJSON features
  const getFeatureStyle = useCallback(
    (feature: GeoJSON.Feature<Geometry, GeoFeature['properties']> | undefined): L.PathOptions => {
      if (!feature?.properties) {
        return {
          fillColor: MISSING_DATA_COLORS.fill,
          weight: 1,
          opacity: 1,
          color: '#FFFFFF',
          fillOpacity: 0.3,
        }
      }

      const featureId = feature.properties.id
      const value = values.get(featureId)
      const hasData = value !== undefined && !isNaN(value)

      return {
        fillColor: hasData ? colorScale(value) : MISSING_DATA_COLORS.fill,
        weight: 1,
        opacity: 1,
        color: hasData ? '#FFFFFF' : MISSING_DATA_COLORS.stroke,
        dashArray: hasData ? undefined : '4, 4',
        fillOpacity: hasData ? fillOpacity : showMissingDataPattern ? 0.5 : 0.3,
      }
    },
    [values, colorScale, fillOpacity, showMissingDataPattern]
  )

  // Event handlers for GeoJSON features
  const onEachFeature = useCallback(
    (
      feature: GeoJSON.Feature<Geometry, GeoFeature['properties']>,
      layer: L.Layer
    ) => {
      layer.on({
        mouseover: (e: L.LeafletMouseEvent) => {
          const target = e.target as L.Path
          target.setStyle({
            weight: 2,
            color: '#0D4077',
            fillOpacity: 0.9,
          })
          target.bringToFront()
          if (onFeatureHover) {
            onFeatureHover(feature as GeoFeature, {
              x: e.containerPoint.x,
              y: e.containerPoint.y,
            })
          }
        },
        mouseout: (e: L.LeafletMouseEvent) => {
          const target = e.target as L.Path
          target.setStyle(getFeatureStyle(feature))
          if (onFeatureHover) {
            onFeatureHover(null)
          }
        },
        mousemove: (e: L.LeafletMouseEvent) => {
          if (onFeatureHover) {
            onFeatureHover(feature as GeoFeature, {
              x: e.containerPoint.x,
              y: e.containerPoint.y,
            })
          }
        },
      })
    },
    [getFeatureStyle, onFeatureHover]
  )

  // Key for forcing re-render when data changes
  const layerKey = useMemo(() => {
    return JSON.stringify({
      palette,
      breaks,
      classCount,
      valuesSize: values.size,
    })
  }, [palette, breaks, classCount, values])

  if (!data || !data.features) {
    return null
  }

  return (
    <GeoJSON
      key={layerKey}
      data={data as unknown as GeoJsonObject}
      style={getFeatureStyle}
      onEachFeature={onEachFeature}
    />
  )
}

// Export breaks for use in legend
export function useClassificationBreaks(
  values: Map<string, number>,
  classificationMethod: ClassificationMethod,
  classCount: number,
  customBreaks?: number[]
) {
  return useMemo(() => {
    if (customBreaks && customBreaks.length > 0) {
      return customBreaks
    }

    const validValues = Array.from(values.values()).filter(v => !isNaN(v))
    return classifyData(validValues, classificationMethod, classCount)
  }, [values, classificationMethod, classCount, customBreaks])
}
