/**
 * MapChart Demo Page
 *
 * This page demonstrates the MapChart component with various configurations
 * for visualizing geospatial data.
 */

import { MapChart } from "../../exports/charts/MapChart";

import type { MapData, MapPoint } from "../../exports/charts/MapChart";

export default function MapChartDemo() {
  // Sample GeoJSON data for Serbian regions
  const serbiaRegions: MapData = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: {
          name: "Beograd",
          value: 2000000,
          population: 1689125,
          area: 3599,
          density: 469,
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
          density: 88,
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
      {
        type: "Feature",
        properties: {
          name: "Južnobački okrug",
          value: 200000,
          population: 189072,
          area: 4016,
          density: 47,
        },
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [19.0, 44.5],
              [20.0, 44.5],
              [20.0, 45.0],
              [19.0, 45.0],
              [19.0, 44.5],
            ],
          ],
        },
      },
      {
        type: "Feature",
        properties: {
          name: "Sremski okrug",
          value: 150000,
          population: 174605,
          area: 3486,
          density: 50,
        },
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [19.5, 44.5],
              [20.0, 44.5],
              [20.0, 45.0],
              [19.5, 45.0],
              [19.5, 44.5],
            ],
          ],
        },
      },
    ],
  };

  // Sample city point data
  const majorCities: MapPoint[] = [
    {
      id: "bg",
      name: "Beograd",
      value: 1689125,
      coordinates: [20.4573, 44.7872],
    },
    {
      id: "ns",
      name: "Novi Sad",
      value: 341625,
      coordinates: [19.8335, 45.2671],
    },
    {
      id: "ni",
      name: "Niš",
      value: 260237,
      coordinates: [21.8954, 43.3247],
    },
    {
      id: "kg",
      name: "Kragujevac",
      value: 177468,
      coordinates: [20.9282, 44.0167],
    },
  ];

  const handleRegionClick = (properties: any, index: number) => {
    console.log("Clicked region:", properties);
    alert(
      `Region: ${
        properties.name
      }\nPopulation: ${properties.value?.toLocaleString()}`
    );
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "1400px", margin: "0 auto" }}>
      <h1
        style={{
          fontSize: "2.5rem",
          fontWeight: "bold",
          marginBottom: "1rem",
          color: "#1f2937",
        }}
      >
        MapChart Component Demo
      </h1>

      <p style={{ fontSize: "1.1rem", color: "#6b7280", marginBottom: "2rem" }}>
        Interactive geospatial visualization using D3.js. Hover over regions for
        details, click for more information.
      </p>

      {/* Demo 1: Basic Choropleth */}
      <section style={{ marginBottom: "3rem" }}>
        <h2
          style={{
            fontSize: "1.5rem",
            fontWeight: "600",
            marginBottom: "1rem",
            color: "#374151",
          }}
        >
          1. Population by Region (Choropleth)
        </h2>
        <div
          style={{
            background: "#f9fafb",
            padding: "1rem",
            borderRadius: "8px",
            border: "1px solid #e5e7eb",
          }}
        >
          <MapChart
            data={serbiaRegions}
            config={{
              xAxis: "name",
              yAxis: "value",
              title: "Population Distribution in Serbia",
              colorScale: [
                "#f0f9ff",
                "#e0f2fe",
                "#bae6fd",
                "#7dd3fc",
                "#38bdf8",
                "#0ea5e9",
                "#0284c7",
              ],
            }}
            height={450}
          />
        </div>
      </section>

      {/* Demo 2: City Markers */}
      <section style={{ marginBottom: "3rem" }}>
        <h2
          style={{
            fontSize: "1.5rem",
            fontWeight: "600",
            marginBottom: "1rem",
            color: "#374151",
          }}
        >
          2. Major Cities (Point Markers)
        </h2>
        <div
          style={{
            background: "#f9fafb",
            padding: "1rem",
            borderRadius: "8px",
            border: "1px solid #e5e7eb",
          }}
        >
          <MapChart
            data={[]}
            config={{
              xAxis: "name",
              yAxis: "value",
              title: "Major Cities in Serbia",
              showPoints: true,
              pointData: majorCities,
              pointSize: 8,
              pointColor: "#ef4444",
            }}
            height={450}
          />
        </div>
      </section>

      {/* Demo 3: Combined Map */}
      <section style={{ marginBottom: "3rem" }}>
        <h2
          style={{
            fontSize: "1.5rem",
            fontWeight: "600",
            marginBottom: "1rem",
            color: "#374151",
          }}
        >
          3. Combined: Regions + Cities
        </h2>
        <div
          style={{
            background: "#f9fafb",
            padding: "1rem",
            borderRadius: "8px",
            border: "1px solid #e5e7eb",
          }}
        >
          <MapChart
            data={serbiaRegions}
            config={{
              xAxis: "name",
              yAxis: "value",
              title: "Population Density with Major Cities",
              colorScale: ["#fff7ed", "#fed7aa", "#fb923c", "#f97316"],
              showPoints: true,
              pointData: majorCities,
              pointSize: 6,
              pointColor: "#7c3aed",
              showLegend: true,
              zoomEnabled: true,
            }}
            height={500}
          />
        </div>
      </section>

      {/* Demo 4: Interactive with Click Handler */}
      <section style={{ marginBottom: "3rem" }}>
        <h2
          style={{
            fontSize: "1.5rem",
            fontWeight: "600",
            marginBottom: "1rem",
            color: "#374151",
          }}
        >
          4. Interactive Map (Click Regions)
        </h2>
        <p style={{ color: "#6b7280", marginBottom: "1rem" }}>
          Click on any region to see detailed information in an alert.
        </p>
        <div
          style={{
            background: "#f9fafb",
            padding: "1rem",
            borderRadius: "8px",
            border: "1px solid #e5e7eb",
          }}
        >
          <MapChart
            data={serbiaRegions}
            config={{
              xAxis: "name",
              yAxis: "value",
              title: "Interactive Population Map",
              colorScale: [
                "#f0fdf4",
                "#dcfce7",
                "#bbf7d0",
                "#86efac",
                "#4ade80",
                "#22c55e",
              ],
            }}
            onDataPointClick={handleRegionClick}
            height={450}
          />
        </div>
      </section>

      {/* Demo 5: Custom Styling */}
      <section style={{ marginBottom: "3rem" }}>
        <h2
          style={{
            fontSize: "1.5rem",
            fontWeight: "600",
            marginBottom: "1rem",
            color: "#374151",
          }}
        >
          5. Custom Styling & Colors
        </h2>
        <div
          style={{
            background: "#f9fafb",
            padding: "1rem",
            borderRadius: "8px",
            border: "1px solid #e5e7eb",
          }}
        >
          <MapChart
            data={serbiaRegions}
            config={{
              xAxis: "name",
              yAxis: "value",
              title: "Custom Styled Map",
              colorScale: [
                "#faf5ff",
                "#f3e8ff",
                "#e9d5ff",
                "#d8b4fe",
                "#c084fc",
                "#a855f7",
              ],
              borderColor: "#a855f7",
              borderWidth: 2,
            }}
            height={450}
            style={{ border: "2px solid #a855f7", borderRadius: "12px" }}
          />
        </div>
      </section>

      {/* Code Example */}
      <section style={{ marginTop: "3rem" }}>
        <h2
          style={{
            fontSize: "1.5rem",
            fontWeight: "600",
            marginBottom: "1rem",
            color: "#374151",
          }}
        >
          Usage Example
        </h2>
        <pre
          style={{
            background: "#1f2937",
            color: "#f3f4f6",
            padding: "1.5rem",
            borderRadius: "8px",
            overflow: "auto",
            fontSize: "0.9rem",
            lineHeight: "1.5",
          }}
        >
          {`import { MapChart } from '@acailic/vizualni-admin/charts';

<MapChart
  data={{
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: { name: 'Region', value: 100 },
        geometry: {
          type: 'Polygon',
          coordinates: [[[20, 44], [21, 44], [21, 45], [20, 45], [20, 44]]]
        }
      }
    ]
  }}
  config={{
    xAxis: 'name',
    yAxis: 'value',
    title: 'My Map',
    colorScale: ['#f0f9ff', '#0ea5e9', '#0369a1']
  }}
  height={500}
  onDataPointClick={(props, index) => console.log(props)}
/>`}
        </pre>
      </section>

      <footer
        style={{
          marginTop: "3rem",
          paddingTop: "2rem",
          borderTop: "1px solid #e5e7eb",
        }}
      >
        <p style={{ color: "#6b7280", fontSize: "0.9rem" }}>
          Built with D3.js, React, and TypeScript. Part of the Vizualni Admin
          library.
        </p>
      </footer>
    </div>
  );
}
