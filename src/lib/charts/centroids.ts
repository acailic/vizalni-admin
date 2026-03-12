/**
 * Centroid calculation utilities for symbol placement on maps
 */

import type { Geometry } from 'geojson'

/**
 * Point representation for centroid
 */
export interface Centroid {
  lng: number
  lat: number
}

/**
 * GeoJSON feature with properties including localized names
 */
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

/**
 * Calculate the centroid of a polygon
 */
function polygonCentroid(coordinates: number[][]): Centroid {
  let sumX = 0
  let sumY = 0
  let area = 0

  const ring = coordinates

  for (let i = 0, j = ring.length - 1; i < ring.length; j = i, i++) {
    const xi = ring[i]![0]!
    const yi = ring[i]![1]!
    const xj = ring[j]![0]!
    const yj = ring[j]![1]!

    const cross = xi * yj - xj * yi
    area += cross
    sumX += (xi + xj) * cross
    sumY += (yi + yj) * cross
  }

  area *= 0.5

  if (Math.abs(area) < 1e-10) {
    // Degenerate polygon, return center of bounding box
    const xs = ring.map(c => c[0]).filter((x): x is number => x !== undefined)
    const ys = ring.map(c => c[1]).filter((y): y is number => y !== undefined)
    if (xs.length === 0 || ys.length === 0) {
      return { lng: 0, lat: 0 }
    }
    return {
      lng: (Math.min(...xs) + Math.max(...xs)) / 2,
      lat: (Math.min(...ys) + Math.max(...ys)) / 2,
    }
  }

  return {
    lng: sumX / (6 * area),
    lat: sumY / (6 * area),
  }
}

/**
 * Calculate the centroid of a MultiPolygon
 */
function multiPolygonCentroid(coordinates: number[][][][]): Centroid {
  let totalArea = 0
  let totalX = 0
  let totalY = 0

  for (const polygon of coordinates) {
    // Use the outer ring for centroid calculation
    const ring = polygon[0]
    if (!ring || ring.length === 0) continue

    let sumX = 0
    let sumY = 0
    let area = 0

    for (let i = 0, j = ring.length - 1; i < ring.length; j = i, i++) {
      const xi = ring[i]![0]!
      const yi = ring[i]![1]!
      const xj = ring[j]![0]!
      const yj = ring[j]![1]!

      const cross = xi * yj - xj * yi
      area += cross
      sumX += (xi + xj) * cross
      sumY += (yi + yj) * cross
    }

    area *= 0.5

    if (Math.abs(area) > 1e-10) {
      const cx = sumX / (6 * area)
      const cy = sumY / (6 * area)
      totalArea += Math.abs(area)
      totalX += cx * Math.abs(area)
      totalY += cy * Math.abs(area)
    }
  }

  if (totalArea < 1e-10) {
    // Fall back to bounding box center
    const allCoords = coordinates.flat(2)
    const xs = allCoords.map(c => c[0]).filter((x): x is number => x !== undefined)
    const ys = allCoords.map(c => c[1]).filter((y): y is number => y !== undefined)
    if (xs.length === 0 || ys.length === 0) {
      return { lng: 0, lat: 0 }
    }
    return {
      lng: (Math.min(...xs) + Math.max(...xs)) / 2,
      lat: (Math.min(...ys) + Math.max(...ys)) / 2,
    }
  }

  return {
    lng: totalX / totalArea,
    lat: totalY / totalArea,
  }
}

/**
 * Calculate the centroid of a GeoJSON geometry
 */
export function geometryCentroid(geometry: Geometry): Centroid {
  switch (geometry.type) {
    case 'Point':
      return {
        lng: geometry.coordinates[0]!,
        lat: geometry.coordinates[1]!,
      }

    case 'MultiPoint': {
      // Average of all points
      const coords = geometry.coordinates
      const sumLng = coords.reduce((acc, c) => acc + c[0]!, 0)
      const sumLat = coords.reduce((acc, c) => acc + c[1]!, 0)
      return {
        lng: sumLng / coords.length,
        lat: sumLat / coords.length,
      }
    }

    case 'Polygon':
      return polygonCentroid(geometry.coordinates[0]!)

    case 'MultiPolygon':
      return multiPolygonCentroid(geometry.coordinates)

    case 'LineString': {
      // Midpoint of the line
      const coords = geometry.coordinates
      const midIndex = Math.floor(coords.length / 2)
      return {
        lng: coords[midIndex]![0]!,
        lat: coords[midIndex]![1]!,
      }
    }

    case 'MultiLineString': {
      // Use first line's midpoint
      const coords = geometry.coordinates[0]!
      const midIndex = Math.floor(coords.length / 2)
      return {
        lng: coords[midIndex]![0]!,
        lat: coords[midIndex]![1]!,
      }
    }

    case 'GeometryCollection': {
      // Use first geometry's centroid
      if (geometry.geometries.length > 0) {
        return geometryCentroid(geometry.geometries[0]!)
      }
      return { lng: 0, lat: 0 }
    }

    default:
      return { lng: 0, lat: 0 }
  }
}

/**
 * Calculate centroids for all features in a FeatureCollection
 */
export function calculateCentroids(
  features: GeoFeature[]
): Map<string, Centroid> {
  const centroids = new Map<string, Centroid>()

  for (const feature of features) {
    const id = feature.properties.id
    if (id) {
      centroids.set(id, geometryCentroid(feature.geometry))
    }
  }

  return centroids
}

/**
 * Calculate the visual center of a feature for label placement
 * This is similar to centroid but may differ for irregular shapes
 */
export function calculateVisualCenter(geometry: Geometry): Centroid {
  // For most cases, the centroid works well as the visual center
  return geometryCentroid(geometry)
}

/**
 * Check if a point is inside a polygon
 */
export function pointInPolygon(point: Centroid, polygon: number[][]): boolean {
  const { lng: x, lat: y } = point
  let inside = false

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i, i++) {
    const xi = polygon[i]![0]!
    const yi = polygon[i]![1]!
    const xj = polygon[j]![0]!
    const yj = polygon[j]![1]!

    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) {
      inside = !inside
    }
  }

  return inside
}

/**
 * Get the bounding box of a geometry
 */
export function getBoundingBox(geometry: Geometry): {
  minLng: number
  minLat: number
  maxLng: number
  maxLat: number
} {
  let coords: number[][]

  switch (geometry.type) {
    case 'Point':
      coords = [geometry.coordinates]
      break
    case 'MultiPoint':
    case 'LineString':
      coords = geometry.coordinates
      break
    case 'Polygon':
      coords = geometry.coordinates[0]!
      break
    case 'MultiLineString':
    case 'MultiPolygon':
      coords = geometry.coordinates.flat(2) as number[][]
      break
    case 'GeometryCollection':
      if (geometry.geometries.length > 0) {
        const firstGeom = geometry.geometries[0]
        if (firstGeom) {
          return getBoundingBox(firstGeom)
        }
      }
      return { minLng: 0, minLat: 0, maxLng: 0, maxLat: 0 }
    default:
      return { minLng: 0, minLat: 0, maxLng: 0, maxLat: 0 }
  }

  const lngs = coords.map(c => c[0]).filter((v): v is number => v !== undefined)
  const lats = coords.map(c => c[1]).filter((v): v is number => v !== undefined)

  if (lngs.length === 0 || lats.length === 0) {
    return { minLng: 0, minLat: 0, maxLng: 0, maxLat: 0 }
  }

  return {
    minLng: Math.min(...lngs),
    minLat: Math.min(...lats),
    maxLng: Math.max(...lngs),
    maxLat: Math.max(...lats),
  }
}
