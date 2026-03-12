// app/pages/demos/playground/_constants/sampleDatasets.ts
import type { Datum } from "../_types";

interface DatasetInfo {
  name: string;
  description: string;
  data: Datum[];
}

export const SAMPLE_DATASETS: Record<string, DatasetInfo> = {
  sales: {
    name: "Monthly Sales",
    description: "Monthly sales data for 2024",
    data: [
      { label: "Jan", value: 4000 },
      { label: "Feb", value: 3000 },
      { label: "Mar", value: 5000 },
      { label: "Apr", value: 4500 },
      { label: "May", value: 6000 },
      { label: "Jun", value: 5500 },
    ],
  },
  population: {
    name: "Age Distribution",
    description: "Population by age group",
    data: [
      { label: "0-14", value: 15 },
      { label: "15-24", value: 12 },
      { label: "25-44", value: 28 },
      { label: "45-64", value: 25 },
      { label: "65+", value: 20 },
    ],
  },
  revenue: {
    name: "Quarterly Revenue",
    description: "Revenue by quarter",
    data: [
      { label: "Q1", value: 125000 },
      { label: "Q2", value: 180000 },
      { label: "Q3", value: 165000 },
      { label: "Q4", value: 210000 },
    ],
  },
  temperature: {
    name: "Monthly Temperature",
    description: "Average temperature in Belgrade",
    data: [
      { label: "Jan", value: 1 },
      { label: "Feb", value: 3 },
      { label: "Mar", value: 8 },
      { label: "Apr", value: 14 },
      { label: "May", value: 19 },
      { label: "Jun", value: 23 },
      { label: "Jul", value: 25 },
      { label: "Aug", value: 25 },
      { label: "Sep", value: 20 },
      { label: "Oct", value: 14 },
      { label: "Nov", value: 8 },
      { label: "Dec", value: 3 },
    ],
  },
};
