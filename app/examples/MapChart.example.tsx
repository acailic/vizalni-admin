/**
 * MapChart Component Usage Examples
 *
 * This file demonstrates various ways to use the MapChart component
 * for geospatial visualizations.
 */

import { MapChart } from "./exports/charts/MapChart";

import type { MapData, MapPoint } from "./exports/charts/MapChart";

// Example 1: Basic choropleth map with Serbian regions
export function BasicChoroplethExample() {
  const serbiaGeoData: MapData = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: {
          name: "Beograd",
          value: 2000000,
          population: 1689125,
          area: 3599,
        },
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [20.0, 44.0],
              [21.0, 44.0],
              [21.0, 45.0],
              [20.0, 45.0],
              [20.0, 44.0],
            ],
          ],
        },
      },
      {
        type: "Feature",
        properties: {
          name: "Severnobački okrug",
          value: 180000,
          population: 156767,
          area: 1782,
        },
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [19.0, 45.0],
              [20.0, 45.0],
              [20.0, 46.0],
              [19.0, 46.0],
              [19.0, 45.0],
            ],
          ],
        },
      },
      // Add more regions...
    ],
  };

  return (
    <MapChart
      data={serbiaGeoData}
      config={{
        xAxis: "name",
        yAxis: "value",
        title: "Population by Region",
        colorScale: ["#f0f9ff", "#0ea5e9", "#0369a1"],
      }}
      height={500}
    />
  );
}

// Example 2: Map with point markers
export function MapWithMarkersExample() {
  const cities: MapPoint[] = [
    {
      id: "1",
      name: "Beograd",
      value: 1689125,
      coordinates: [20.4573, 44.7872],
    },
    {
      id: "2",
      name: "Novi Sad",
      value: 341625,
      coordinates: [19.8335, 45.2671],
    },
    {
      id: "3",
      name: "Niš",
      value: 260237,
      coordinates: [21.8954, 43.3247],
    },
    {
      id: "4",
      name: "Kragujevac",
      value: 177468,
      coordinates: [20.9282, 44.0167],
    },
  ];

  return (
    <MapChart
      data={[]}
      config={{
        xAxis: "name",
        yAxis: "value",
        title: "Major Cities in Serbia",
        showPoints: true,
        pointData: cities,
        pointSize: 8,
        pointColor: "#ef4444",
        projection: "mercator",
        center: [20.8, 44.2],
        scale: 5000,
      }}
      height={500}
    />
  );
}

// Example 3: Combined choropleth and points
export function CombinedMapExample() {
  const regionsData: MapData = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: {
          name: "Beograd",
          value: 2000000,
        },
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [20.0, 44.0],
              [21.0, 44.0],
              [21.0, 45.0],
              [20.0, 45.0],
              [20.0, 44.0],
            ],
          ],
        },
      },
      {
        type: "Feature",
        properties: {
          name: "Vojvodina",
          value: 1900000,
        },
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [19.0, 45.0],
              [21.0, 45.0],
              [21.0, 46.0],
              [19.0, 46.0],
              [19.0, 45.0],
            ],
          ],
        },
      },
    ],
  };

  const cityPoints: MapPoint[] = [
    {
      id: "bg",
      name: "Beograd Center",
      value: 100000,
      coordinates: [20.4573, 44.7872],
    },
    {
      id: "ns",
      name: "Novi Sad Center",
      value: 80000,
      coordinates: [19.8335, 45.2671],
    },
  ];

  return (
    <MapChart
      data={regionsData}
      config={{
        xAxis: "name",
        yAxis: "value",
        title: "Population Distribution with Major Cities",
        colorScale: ["#fff7ed", "#fed7aa", "#fb923c", "#f97316"],
        showPoints: true,
        pointData: cityPoints,
        pointSize: 6,
        pointColor: "#7c3aed",
        showLegend: true,
        zoomEnabled: true,
      }}
      height={600}
      width="100%"
    />
  );
}

// Example 4: Custom color palette (green theme)
export function CustomColorPaletteExample() {
  const geoData: MapData = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: {
          name: "Region A",
          value: 100,
        },
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [20.0, 44.0],
              [21.0, 44.0],
              [21.0, 45.0],
              [20.0, 45.0],
              [20.0, 44.0],
            ],
          ],
        },
      },
      {
        type: "Feature",
        properties: {
          name: "Region B",
          value: 200,
        },
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [19.0, 45.0],
              [20.0, 45.0],
              [20.0, 46.0],
              [19.0, 46.0],
              [19.0, 45.0],
            ],
          ],
        },
      },
    ],
  };

  return (
    <MapChart
      data={geoData}
      config={{
        xAxis: "name",
        yAxis: "value",
        colorScale: [
          "#f0fdf4",
          "#dcfce7",
          "#bbf7d0",
          "#86efac",
          "#4ade80",
          "#22c55e",
        ],
        buckets: 5,
      }}
    />
  );
}

// Example 5: Interactive map with click handlers
export function InteractiveMapExample() {
  const handleRegionClick = (properties: any, index: number) => {
    console.log("Clicked region:", properties.name);
    alert(
      `You clicked on ${
        properties.name
      }!\nPopulation: ${properties.value?.toLocaleString()}`
    );
  };

  const customTooltip = (properties: any) => (
    <div>
      <h3 style={{ margin: "0 0 8px 0", fontSize: "14px", fontWeight: "bold" }}>
        {properties.name}
      </h3>
      <div style={{ fontSize: "12px", color: "#666" }}>
        Value: {properties.value?.toLocaleString()}
      </div>
    </div>
  );

  return (
    <MapChart
      data={[]}
      config={{
        xAxis: "name",
        yAxis: "value",
        title: "Interactive Map - Click regions for details",
      }}
      onDataPointClick={handleRegionClick}
      renderTooltip={customTooltip}
    />
  );
}

// Example 6: Equal Earth projection
export function EqualEarthProjectionExample() {
  return (
    <MapChart
      data={[]}
      config={{
        xAxis: "name",
        yAxis: "value",
        projection: "equalEarth",
        title: "Equal Earth Projection",
      }}
    />
  );
}

// Example 7: Map with labels
export function MapWithLabelsExample() {
  return (
    <MapChart
      data={[]}
      config={{
        xAxis: "name",
        yAxis: "value",
        showLabels: true,
        labelKey: "name",
        title: "Map with Region Labels",
      }}
    />
  );
}

// Example 8: Non-interactive map (zoom disabled, no tooltip)
export function StaticMapExample() {
  return (
    <MapChart
      data={[]}
      config={{
        xAxis: "name",
        yAxis: "value",
        title: "Static Map View",
        zoomEnabled: false,
      }}
      showTooltip={false}
      animated={false}
    />
  );
}

// Example 9: Responsive map with custom styling
export function StyledResponsiveMapExample() {
  return (
    <MapChart
      data={[]}
      config={{
        xAxis: "name",
        yAxis: "value",
        borderColor: "#fbbf24",
        borderWidth: 2,
        hoverColor: "rgba(251, 191, 36, 0.4)",
      }}
      width="100%"
      height={400}
      className="my-custom-map"
      style={{ border: "2px solid #e5e7eb", borderRadius: "8px" }}
    />
  );
}

// Example 10: Multiple maps comparison
export function MapComparisonExample() {
  const data: MapData = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: { name: "Region 1", value: 100 },
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [20.0, 44.0],
              [21.0, 44.0],
              [21.0, 45.0],
              [20.0, 45.0],
              [20.0, 44.0],
            ],
          ],
        },
      },
    ],
  };

  return (
    <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
      <div style={{ flex: 1, minWidth: "300px" }}>
        <MapChart
          data={data}
          config={{
            xAxis: "name",
            yAxis: "value",
            colorScale: ["#f0f9ff", "#0ea5e9"],
          }}
          title="Blue Theme"
        />
      </div>
      <div style={{ flex: 1, minWidth: "300px" }}>
        <MapChart
          data={data}
          config={{
            xAxis: "name",
            yAxis: "value",
            colorScale: ["#fef2f2", "#ef4444"],
          }}
          title="Red Theme"
        />
      </div>
      <div style={{ flex: 1, minWidth: "300px" }}>
        <MapChart
          data={data}
          config={{
            xAxis: "name",
            yAxis: "value",
            colorScale: ["#f0fdf4", "#22c55e"],
          }}
          title="Green Theme"
        />
      </div>
    </div>
  );
}
