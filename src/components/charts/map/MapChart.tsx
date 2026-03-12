'use client'

import { useEffect, useState, useMemo, useCallback } from 'react'

import L from 'leaflet'
import { MapContainer, TileLayer, useMap } from 'react-leaflet'

import 'leaflet/dist/leaflet.css'
import { createChartFormatters } from '@/components/charts/shared/chart-formatters'
import { ChartFrame } from '@/components/charts/shared/ChartFrame'
import { classifyData } from '@/lib/charts/color-scales'
import { matchGeoColumn } from '@/lib/data/geo-matcher'
import type {
  ChartRendererComponentProps,
  GeoLevel,
  ColorScaleType,
  ClassificationMethod,
  MapPalette,
} from '@/types/chart-config'

import { ChoroplethLayer, type GeoFeature } from './ChoroplethLayer'
import { MapControls, SERBIA_BOUNDS } from './MapControls'
import { MapLegend } from './MapLegend'
import { MapTooltip, calculateRank } from './MapTooltip'
import { SymbolLayer } from './SymbolLayer'

// Serbia center
const SERBIA_CENTER: [number, number] = [44.0, 21.0]

// Fix for default marker icons in Leaflet with Next.js
delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/leaflet/marker-icon-2x.png',
  iconUrl: '/leaflet/marker-icon.png',
  shadowUrl: '/leaflet/marker-shadow.png',
})

// GeoJSON file paths
const GEO_JSON_PATHS: Record<GeoLevel, string> = {
  region: '/geo/serbia-regions.geojson',
  district: '/geo/serbia-districts.geojson',
  municipality: '/geo/serbia-municipalities.geojson',
}

// Default map options
const DEFAULT_OPTIONS = {
  colorScaleType: 'sequential' as ColorScaleType,
  colorPalette: 'blues' as MapPalette,
  classificationMethod: 'quantiles' as ClassificationMethod,
  classCount: 5,
  showSymbols: false,
  symbolMinSize: 8,
  symbolMaxSize: 40,
  symbolOpacity: 0.7,
  showMissingDataPattern: true,
  basemapStyle: 'streets' as const,
}

interface GeoJSONData {
  type: 'FeatureCollection'
  features: GeoFeature[]
}

// Component to fit bounds on mount
function FitBounds({
  bounds,
}: {
  bounds: [[number, number], [number, number]]
}) {
  const map = useMap()

  useEffect(() => {
    map.fitBounds(bounds, { padding: [20, 20] })
  }, [map, bounds])

  return null
}

export function MapChart({
  config,
  data,
  height = 400,
  locale = 'en',
  filterBar,
}: ChartRendererComponentProps) {
  const [geoData, setGeoData] = useState<GeoJSONData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hoveredFeature, setHoveredFeature] = useState<GeoFeature | null>(null)
  const [tooltipPosition, setTooltipPosition] = useState<{
    x: number
    y: number
  } | null>(null)
  const [showChoropleth, setShowChoropleth] = useState(true)
  const [showSymbols, setShowSymbols] = useState(
    config.options?.showSymbols ?? DEFAULT_OPTIONS.showSymbols
  )

  // Extract options with defaults
  const geoLevel = (config.options?.geoLevel as GeoLevel) || 'district'
  const geoField = config.x_axis?.field || ''
  const measureField = config.y_axis?.field || ''
  const measureLabel = config.y_axis?.label || ''

  const colorScaleType =
    (config.options?.colorScaleType as ColorScaleType) ||
    DEFAULT_OPTIONS.colorScaleType
  const colorPalette =
    (config.options?.colorPalette as MapPalette) || DEFAULT_OPTIONS.colorPalette
  const classificationMethod =
    (config.options?.classificationMethod as ClassificationMethod) ||
    DEFAULT_OPTIONS.classificationMethod
  const classCount = config.options?.classCount || DEFAULT_OPTIONS.classCount
  const customBreaks = config.options?.customBreaks
  const symbolMinSize = config.options?.symbolMinSize || DEFAULT_OPTIONS.symbolMinSize
  const symbolMaxSize = config.options?.symbolMaxSize || DEFAULT_OPTIONS.symbolMaxSize
  const symbolOpacity = config.options?.symbolOpacity || DEFAULT_OPTIONS.symbolOpacity
  const showMissingDataPattern =
    config.options?.showMissingDataPattern ?? DEFAULT_OPTIONS.showMissingDataPattern

  const { formatNumber } = createChartFormatters(locale)

  // Get name based on locale
  const getLocalizedName = useCallback(
    (feature: GeoFeature) => {
      switch (locale) {
        case 'sr-Cyrl':
          return feature.properties.name_sr_cyrl
        case 'sr-Latn':
          return feature.properties.name_sr_latn
        default:
          return feature.properties.name_en
      }
    },
    [locale]
  )

  // Load GeoJSON data
  useEffect(() => {
    const loadGeoData = async () => {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch(GEO_JSON_PATHS[geoLevel])
        if (!response.ok) {
          throw new Error(`Failed to load ${geoLevel} data`)
        }
        const json = await response.json()
        setGeoData(json)
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to load geographic data'
        )
      } finally {
        setLoading(false)
      }
    }

    loadGeoData()
  }, [geoLevel])

  // Match data values to geographic features
  const { matchedData, matchResult, minValue, maxValue, allValues, ranks } =
    useMemo(() => {
      if (!geoData || !geoField || !measureField || data.length === 0) {
        return {
          matchedData: new Map<string, number>(),
          matchResult: null,
          minValue: 0,
          maxValue: 0,
          allValues: [],
          ranks: new Map<string, number>(),
        }
      }

      const values = data.map((row) => String(row[geoField] ?? ''))
      const result = matchGeoColumn(values, geoLevel)

      const dataMap = new Map<string, number>()
      const numericValues: number[] = []

      for (const row of data) {
        const geoValue = String(row[geoField] ?? '')
        const matchedId = result.matched.get(geoValue)

        if (matchedId) {
          const measureValue = row[measureField]
          const numValue =
            typeof measureValue === 'number' ? measureValue : null

          if (numValue !== null) {
            dataMap.set(matchedId, numValue)
            numericValues.push(numValue)
          }
        }
      }

      const min =
        numericValues.length > 0 ? Math.min(...numericValues) : 0
      const max =
        numericValues.length > 0 ? Math.max(...numericValues) : 0

      // Calculate ranks
      const ranksMap = new Map<string, number>()
      dataMap.forEach((value, id) => {
        const rank = calculateRank(value, numericValues, 'descending')
        ranksMap.set(id, rank)
      })

      return {
        matchedData: dataMap,
        matchResult: result,
        minValue: min,
        maxValue: max,
        allValues: numericValues,
        ranks: ranksMap,
      }
    }, [geoData, geoField, measureField, data, geoLevel])

  // Calculate classification breaks
  const classificationBreaks = useMemo(() => {
    if (customBreaks && customBreaks.length > 0) {
      return { breaks: customBreaks, min: minValue, max: maxValue }
    }
    return classifyData(allValues, classificationMethod, classCount)
  }, [allValues, classificationMethod, classCount, customBreaks, minValue, maxValue])

  // Handle feature hover
  const handleFeatureHover = useCallback(
    (feature: GeoFeature | null, position?: { x: number; y: number }) => {
      setHoveredFeature(feature)
      if (position) {
        setTooltipPosition(position)
      }
    },
    []
  )

  // Loading state
  if (loading) {
    return (
      <ChartFrame
        title={config.title}
        description={config.description}
        height={height}
      >
        <div className="flex h-full items-center justify-center text-slate-500">
          {locale === 'sr-Cyrl'
            ? 'Учитавање података мапе...'
            : locale === 'sr-Latn'
              ? 'Učitavanje podataka mape...'
              : 'Loading map data...'}
        </div>
      </ChartFrame>
    )
  }

  // Error state
  if (error) {
    return (
      <ChartFrame
        title={config.title}
        description={config.description}
        height={height}
      >
        <div className="flex h-full items-center justify-center text-red-500">
          {locale === 'sr-Cyrl'
            ? `Грешка: ${error}`
            : locale === 'sr-Latn'
              ? `Greška: ${error}`
              : `Error: ${error}`}
        </div>
      </ChartFrame>
    )
  }

  // No data state
  if (!geoData) {
    return (
      <ChartFrame
        title={config.title}
        description={config.description}
        height={height}
      >
        <div className="flex h-full items-center justify-center text-slate-500">
          {locale === 'sr-Cyrl'
            ? 'Нема географских података'
            : locale === 'sr-Latn'
              ? 'Nema geografskih podataka'
              : 'No geographic data available'}
        </div>
      </ChartFrame>
    )
  }

  // Get basemap URL
  const basemapUrl =
    config.options?.basemapStyle === 'satellite'
      ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
      : config.options?.basemapStyle === 'light'
        ? 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
        : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'

  return (
    <ChartFrame
      title={config.title}
      description={config.description}
      height={height}
      filterBar={filterBar}
    >
      <div className="relative h-full w-full">
        <MapContainer
          center={SERBIA_CENTER}
          zoom={7}
          minZoom={6}
          maxZoom={12}
          bounds={SERBIA_BOUNDS}
          className="h-full w-full rounded-lg"
          style={{ height: '100%', width: '100%' }}
        >
          {/* Fit bounds */}
          <FitBounds bounds={SERBIA_BOUNDS} />

          {/* Base map layer */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url={basemapUrl}
          />

          {/* Choropleth layer */}
          {showChoropleth && (
            <ChoroplethLayer
              data={geoData}
              values={matchedData}
              colorScaleType={colorScaleType}
              palette={colorPalette}
              classificationMethod={classificationMethod}
              classCount={classCount}
              customBreaks={customBreaks}
              fillOpacity={0.8}
              showMissingDataPattern={showMissingDataPattern}
              onFeatureHover={handleFeatureHover}
            />
          )}

          {/* Symbol layer */}
          {showSymbols && (
            <SymbolLayer
              features={geoData.features}
              values={matchedData}
              minSize={symbolMinSize}
              maxSize={symbolMaxSize}
              opacity={symbolOpacity}
              color="#4B90F5"
              strokeColor="#FFFFFF"
              strokeWidth={2}
              onSymbolHover={handleFeatureHover}
            />
          )}

          {/* Map controls */}
          <MapControls
            locale={locale}
            showLayerToggle={showSymbols}
            choroplethVisible={showChoropleth}
            symbolsVisible={showSymbols}
            onToggleChoropleth={() => setShowChoropleth(!showChoropleth)}
            onToggleSymbols={() => setShowSymbols(!showSymbols)}
          />
        </MapContainer>

        {/* Legend */}
        {classificationBreaks.breaks.length > 0 && (
          <MapLegend
            breaks={classificationBreaks.breaks}
            palette={colorPalette}
            scaleType={colorScaleType}
            formatNumber={formatNumber}
            locale={locale}
            min={minValue}
            max={maxValue}
            showSymbols={showSymbols}
            symbolMinSize={symbolMinSize}
            symbolMaxSize={symbolMaxSize}
            className="absolute bottom-3 left-3"
          />
        )}

        {/* Tooltip */}
        {hoveredFeature && tooltipPosition && (
          <MapTooltip
            feature={hoveredFeature}
            value={matchedData.get(hoveredFeature.properties.id) ?? null}
            position={tooltipPosition}
            locale={locale}
            formatNumber={formatNumber}
            getLocalizedName={getLocalizedName}
            measureLabel={measureLabel}
            rank={ranks.get(hoveredFeature.properties.id)}
            totalEntities={allValues.length}
          />
        )}

        {/* Match rate indicator */}
        {matchResult && matchResult.matchRate < 0.9 && (
          <div className="absolute bottom-3 right-3 rounded bg-amber-100 px-2 py-1 text-xs text-amber-800">
            {locale === 'sr-Cyrl'
              ? `Подударање ${Math.round(matchResult.matchRate * 100)}% вредности`
              : locale === 'sr-Latn'
                ? `Podudaranje ${Math.round(matchResult.matchRate * 100)}% vrednosti`
                : `Matched ${Math.round(matchResult.matchRate * 100)}% of values`}
          </div>
        )}
      </div>
    </ChartFrame>
  )
}
