'use client'

import { useMemo, useEffect, useRef } from 'react'

import L from 'leaflet'
import { useMap } from 'react-leaflet'

import { calculateCentroids, type GeoFeature } from '@/lib/charts/centroids'

interface SymbolLayerProps {
  features: GeoFeature[]
  values: Map<string, number>
  minSize?: number
  maxSize?: number
  opacity?: number
  color?: string
  strokeColor?: string
  strokeWidth?: number
  onSymbolHover?: (feature: GeoFeature | null, position?: { x: number; y: number }) => void
}

export function SymbolLayer({
  features,
  values,
  minSize = 8,
  maxSize = 40,
  opacity = 0.7,
  color = '#4B90F5',
  strokeColor = '#FFFFFF',
  strokeWidth = 2,
  onSymbolHover,
}: SymbolLayerProps) {
  const map = useMap()
  const layerRef = useRef<L.LayerGroup | null>(null)

  // Calculate value range for scaling
  const { minValue, maxValue } = useMemo(() => {
    const validValues = Array.from(values.values()).filter(v => !isNaN(v) && isFinite(v))
    if (validValues.length === 0) {
      return { minValue: 0, maxValue: 1 }
    }
    return {
      minValue: Math.min(...validValues),
      maxValue: Math.max(...validValues),
    }
  }, [values])

  // Calculate centroids for all features
  const centroids = useMemo(() => {
    return calculateCentroids(features)
  }, [features])

  // Calculate symbol size based on value
  const getSymbolSize = useMemo(() => {
    return (value: number): number => {
      if (maxValue === minValue) return (minSize + maxSize) / 2

      const normalized = (value - minValue) / (maxValue - minValue)
      // Use square root scaling for proportional symbols (area proportional to value)
      const scaledNormalized = Math.sqrt(normalized)
      return minSize + scaledNormalized * (maxSize - minSize)
    }
  }, [minValue, maxValue, minSize, maxSize])

  // Create and update circle markers
  useEffect(() => {
    if (!map) return

    // Remove existing layer
    if (layerRef.current) {
      map.removeLayer(layerRef.current)
    }

    // Create new layer group
    const layerGroup = L.layerGroup()

    features.forEach(feature => {
      const featureId = feature.properties.id
      const centroid = centroids.get(featureId)
      const value = values.get(featureId)

      if (!centroid || value === undefined || isNaN(value) || !isFinite(value)) {
        return
      }

      const size = getSymbolSize(value)
      const radius = size / 2

      const circleMarker = L.circleMarker([centroid.lat, centroid.lng], {
        radius,
        fillColor: color,
        color: strokeColor,
        weight: strokeWidth,
        opacity: 1,
        fillOpacity: opacity,
      })

      // Add hover events
      circleMarker.on({
        mouseover: (e: L.LeafletMouseEvent) => {
          circleMarker.setStyle({
            weight: strokeWidth + 1,
            fillOpacity: Math.min(opacity + 0.2, 1),
          })
          circleMarker.bringToFront()
          if (onSymbolHover) {
            onSymbolHover(feature, {
              x: e.containerPoint.x,
              y: e.containerPoint.y,
            })
          }
        },
        mouseout: () => {
          circleMarker.setStyle({
            weight: strokeWidth,
            fillOpacity: opacity,
          })
          if (onSymbolHover) {
            onSymbolHover(null)
          }
        },
        mousemove: (e: L.LeafletMouseEvent) => {
          if (onSymbolHover) {
            onSymbolHover(feature, {
              x: e.containerPoint.x,
              y: e.containerPoint.y,
            })
          }
        },
      })

      layerGroup.addLayer(circleMarker)
    })

    // Add to map
    layerGroup.addTo(map)
    layerRef.current = layerGroup

    return () => {
      if (layerRef.current) {
        map.removeLayer(layerRef.current)
        layerRef.current = null
      }
    }
  }, [
    map,
    features,
    centroids,
    values,
    minSize,
    maxSize,
    opacity,
    color,
    strokeColor,
    strokeWidth,
    getSymbolSize,
    onSymbolHover,
  ])

  // Update circle sizes on zoom
  useEffect(() => {
    if (!map) return

    const handleZoom = () => {
      if (!layerRef.current) return

      // Reserved for future zoom-based radius scaling
      // const zoom = map.getZoom()
      // const zoomFactor = Math.pow(1.05, zoom - 7)

      layerRef.current.eachLayer((layer) => {
        if (layer instanceof L.CircleMarker) {
          const currentRadius = layer.getRadius()
          // This is a simplified approach - in production you'd want to store original radius
          layer.setRadius(currentRadius)
        }
      })
    }

    map.on('zoomend', handleZoom)
    return () => {
      map.off('zoomend', handleZoom)
    }
  }, [map])

  return null
}

/**
 * Calculate legend values for symbol layer
 */
export function getSymbolLegendValues(
  values: Map<string, number>,
  count: number = 4
): { value: number; size: number }[] {
  const validValues = Array.from(values.values())
    .filter(v => !isNaN(v) && isFinite(v))
    .sort((a, b) => a - b)

  if (validValues.length === 0) {
    return []
  }

  const min = Math.min(...validValues)
  const max = Math.max(...validValues)
  const range = max - min

  const legendValues: { value: number; size: number }[] = []

  for (let i = 0; i < count; i++) {
    const value = min + (range * i) / (count - 1)
    legendValues.push({
      value,
      size: 0, // Will be calculated by parent component
    })
  }

  return legendValues
}
