import React from "react";
import ReactDOM from "react-dom/client";
import { LineChart, BarChart, PieChart } from "@vizualni/react";
import "./styles.css";

// Sample data
const lineData = [
  { date: new Date("2024-01-01"), value: 100 },
  { date: new Date("2024-02-01"), value: 150 },
  { date: new Date("2024-03-01"), value: 120 },
  { date: new Date("2024-04-01"), value: 180 },
  { date: new Date("2024-05-01"), value: 200 },
  { date: new Date("2024-06-01"), value: 170 },
];

const barData = [
  { category: "React", downloads: 40000 },
  { category: "Vue", downloads: 25000 },
  { category: "Angular", downloads: 30000 },
  { category: "Svelte", downloads: 15000 },
];

const pieData = [
  { label: "Production", value: 45 },
  { label: "Development", value: 25 },
  { label: "Testing", value: 15 },
  { label: "Documentation", value: 10 },
  { label: "Other", value: 5 },
];

function App() {
  return (
    <div className="app">
      <h1>@vizualni/react Examples</h1>
      <p>Framework-agnostic visualization library</p>

      <div className="chart-section">
        <h2>Line Chart</h2>
        <LineChart
          data={lineData}
          config={{
            type: "line",
            x: { field: "date", type: "date" },
            y: { field: "value", type: "number" },
          }}
          width={500}
          height={300}
        />
      </div>

      <div className="chart-section">
        <h2>Bar Chart</h2>
        <BarChart
          data={barData}
          config={{
            type: "bar",
            x: { field: "category", type: "string" },
            y: { field: "downloads", type: "number" },
          }}
          width={500}
          height={300}
        />
      </div>

      <div className="chart-section">
        <h2>Pie Chart</h2>
        <PieChart
          data={pieData}
          config={{
            type: "pie",
            value: { field: "value", type: "number" },
            category: { field: "label", type: "string" },
          }}
          width={400}
          height={400}
        />
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(<App />);
