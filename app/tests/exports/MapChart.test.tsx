/**
 * MapChart Component Tests
 */

import { render, screen } from "@testing-library/react";

import { MapChart } from "../../exports/charts/MapChart";

import type { MapData } from "../../exports/charts/MapChart";

// Mock GeoJSON data for testing
const mockGeoData: MapData = {
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
        name: "Novi Sad",
        value: 400000,
        population: 341625,
        area: 699,
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
        name: "Niš",
        value: 300000,
        population: 260237,
        area: 597,
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [21.0, 43.0],
            [22.0, 43.0],
            [22.0, 44.0],
            [21.0, 44.0],
            [21.0, 43.0],
          ],
        ],
      },
    },
  ],
};

describe("MapChart", () => {
  it("renders without crashing", () => {
    render(
      <MapChart data={mockGeoData} config={{ xAxis: "name", yAxis: "value" }} />
    );
    expect(screen.getByRole("img")).toBeInTheDocument();
  });

  it("renders with custom title", () => {
    render(
      <MapChart
        data={mockGeoData}
        config={{ xAxis: "name", yAxis: "value", title: "Population Map" }}
      />
    );
    expect(screen.getByRole("img")).toHaveAttribute(
      "aria-label",
      "Population Map"
    );
  });

  it("renders with custom dimensions", () => {
    const { container } = render(
      <MapChart
        data={mockGeoData}
        config={{ xAxis: "name", yAxis: "value" }}
        width={800}
        height={600}
      />
    );
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("width", "800");
    expect(svg).toHaveAttribute("height", "600");
  });

  it("renders with custom color scale", () => {
    const { container } = render(
      <MapChart
        data={mockGeoData}
        config={{
          xAxis: "name",
          yAxis: "value",
          colorScale: ["#fff7ed", "#fed7aa", "#f97316"],
        }}
      />
    );
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("renders with legend", () => {
    const { container } = render(
      <MapChart
        data={mockGeoData}
        config={{ xAxis: "name", yAxis: "value", showLegend: true }}
      />
    );
    expect(container.querySelector(".legend")).toBeInTheDocument();
  });

  it("renders with point data", () => {
    const pointData = [
      {
        id: "1",
        name: "Beograd Center",
        value: 100000,
        coordinates: [20.4573, 44.7872] as [number, number],
      },
      {
        id: "2",
        name: "Novi Sad Center",
        value: 50000,
        coordinates: [19.8335, 45.2671] as [number, number],
      },
    ];

    const { container } = render(
      <MapChart
        data={mockGeoData}
        config={{
          xAxis: "name",
          yAxis: "value",
          showPoints: true,
          pointData,
        }}
      />
    );
    expect(container.querySelector(".points")).toBeInTheDocument();
  });

  it("renders without zoom", () => {
    const { container } = render(
      <MapChart
        data={mockGeoData}
        config={{
          xAxis: "name",
          yAxis: "value",
          zoomEnabled: false,
        }}
      />
    );
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("handles click events on regions", () => {
    const handleClick = jest.fn();
    const { container } = render(
      <MapChart
        data={mockGeoData}
        config={{ xAxis: "name", yAxis: "value" }}
        onDataPointClick={handleClick}
      />
    );

    const paths = container.querySelectorAll("path");
    if (paths.length > 0) {
      paths[0].dispatchEvent(new MouseEvent("click", { bubbles: true }));
      expect(handleClick).toHaveBeenCalled();
    }
  });

  it("renders with equal earth projection", () => {
    const { container } = render(
      <MapChart
        data={mockGeoData}
        config={{
          xAxis: "name",
          yAxis: "value",
          projection: "equalEarth",
        }}
      />
    );
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("is accessible", () => {
    render(
      <MapChart
        data={mockGeoData}
        config={{
          xAxis: "name",
          yAxis: "value",
          title: "Serbia Population Map",
        }}
        ariaLabel="Interactive map showing population data"
        description="A choropleth map displaying population distribution across Serbian regions"
      />
    );

    const map = screen.getByRole("img", {
      name: "Interactive map showing population data",
    });
    expect(map).toBeInTheDocument();
    expect(map).toHaveAttribute("aria-describedby");
  });

  it("renders with custom className and style", () => {
    const { container } = render(
      <MapChart
        data={mockGeoData}
        config={{ xAxis: "name", yAxis: "value" }}
        className="custom-map"
        style={{ border: "2px solid red" }}
      />
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass("custom-map");
    expect(wrapper.style.border).toBe("2px solid red");
  });

  it("can disable animations", () => {
    const { container } = render(
      <MapChart
        data={mockGeoData}
        config={{ xAxis: "name", yAxis: "value" }}
        animated={false}
      />
    );
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("renders with labels", () => {
    const { container } = render(
      <MapChart
        data={mockGeoData}
        config={{
          xAxis: "name",
          yAxis: "value",
          showLabels: true,
          labelKey: "name",
        }}
      />
    );
    expect(container.querySelector(".labels")).toBeInTheDocument();
  });

  it("renders with custom bucket count", () => {
    const { container } = render(
      <MapChart
        data={mockGeoData}
        config={{
          xAxis: "name",
          yAxis: "value",
          buckets: 3,
        }}
      />
    );
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("handles array of features instead of FeatureCollection", () => {
    const { container } = render(
      <MapChart
        data={mockGeoData.features}
        config={{ xAxis: "name", yAxis: "value" }}
      />
    );
    expect(container.querySelector("svg")).toBeInTheDocument();
  });
});
