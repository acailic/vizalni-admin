/**
 * Smart Chart Visualizer
 * Automatically selects appropriate visualization based on data and chart type
 */

import { Alert, Box, Typography } from "@mui/material";
import { useMemo } from "react";

import {
  profileData,
  selectColumns,
  suggestChartType,
  type ChartKind,
} from "@/lib/demos/schema-profiler";

import { BarChart, ColumnChart, LineChart, PieChart } from "./charts";

export interface ChartVisualizerProps {
  data: any[];
  chartType?:
    | "line"
    | "bar"
    | "column"
    | "area"
    | "pie"
    | "map"
    | "scatterplot";
  title?: string;
  description?: string;
}

const unsupportedChartTypes = new Set<ChartVisualizerProps["chartType"]>([
  "area",
  "map",
  "scatterplot",
]);

const isSupportedChartType = (
  type: ChartVisualizerProps["chartType"]
): type is ChartKind => Boolean(type && !unsupportedChartTypes.has(type));

/**
 * Automatically detect the best columns to visualize
 */
function detectVisualizationColumns(data: any[]): {
  categoryColumn: string | null;
  valueColumn: string | null;
  allNumericColumns: string[];
  allTextColumns: string[];
} {
  if (!data || data.length === 0) {
    return {
      categoryColumn: null,
      valueColumn: null,
      allNumericColumns: [],
      allTextColumns: [],
    };
  }

  const profile = profileData(data);
  const selected = selectColumns(profile);

  return {
    categoryColumn: selected.category,
    valueColumn: selected.value,
    allNumericColumns: profile.numericColumns,
    allTextColumns: profile.textColumns,
  };
}

/**
 * Prepare data for visualization (limit rows if too many)
 */
function prepareDataForVisualization(data: any[], maxRows: number = 20): any[] {
  if (data.length <= maxRows) {
    return data;
  }

  // For large datasets, take a sample
  const step = Math.ceil(data.length / maxRows);
  return data.filter((_, index) => index % step === 0).slice(0, maxRows);
}

export const ChartVisualizer = ({
  data,
  chartType,
  title,
  description,
}: ChartVisualizerProps) => {
  const { columns, preparedData, resolvedChartType } = useMemo(() => {
    const columns = detectVisualizationColumns(data);
    const preparedData = prepareDataForVisualization(data, 25);
    const profile = profileData(data);
    const resolvedChartType: ChartKind = isSupportedChartType(chartType)
      ? chartType
      : suggestChartType(profile);

    return {
      columns,
      preparedData,
      resolvedChartType,
    };
  }, [data, chartType]);

  const placeholderType =
    chartType && unsupportedChartTypes.has(chartType) ? chartType : null;
  const fallbackChartType =
    placeholderType ??
    (resolvedChartType === "scatterplot" ? "scatterplot" : null);

  if (!data || data.length === 0) {
    return (
      <Alert severity="info">Nema dostupnih podataka za vizualizaciju</Alert>
    );
  }

  if (!columns.categoryColumn || !columns.valueColumn) {
    return (
      <Alert severity="warning">
        Nije moguće automatski detektovati kolone za vizualizaciju. Podaci nisu
        u odgovarajućem formatu.
      </Alert>
    );
  }

  const commonProps = {
    xKey: columns.categoryColumn,
    yKey: columns.valueColumn,
    xLabel: columns.categoryColumn,
    yLabel: columns.valueColumn,
  };

  return (
    <Box>
      {title && (
        <Typography variant="h6" sx={{ mb: 2, textAlign: "center" }}>
          {title}
        </Typography>
      )}
      {description && (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 2, textAlign: "center" }}
        >
          {description}
        </Typography>
      )}

      <Box sx={{ mb: 2, p: 2, backgroundColor: "grey.100", borderRadius: 1 }}>
        <Typography variant="body2" color="text.secondary">
          <strong>Prikazano:</strong> {preparedData.length} od {data.length}{" "}
          redova
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Kategorija:</strong> {columns.categoryColumn} |{" "}
          <strong>Vrednost:</strong> {columns.valueColumn}
        </Typography>
      </Box>

      <Box sx={{ minHeight: 400 }}>
        {!fallbackChartType && resolvedChartType === "line" && (
          <LineChart data={preparedData} {...commonProps} color="#4caf50" />
        )}

        {!fallbackChartType && resolvedChartType === "bar" && (
          <BarChart data={preparedData} {...commonProps} color="#2196f3" />
        )}

        {!fallbackChartType && resolvedChartType === "column" && (
          <ColumnChart data={preparedData} {...commonProps} />
        )}

        {!fallbackChartType && resolvedChartType === "pie" && (
          <PieChart
            data={preparedData.slice(0, 10)} // Limit pie chart to 10 slices
            labelKey={columns.categoryColumn}
            valueKey={columns.valueColumn}
            width={600}
            height={600}
          />
        )}

        {fallbackChartType && (
          <Box
            sx={{
              p: 4,
              textAlign: "center",
              backgroundColor: "grey.50",
              borderRadius: 1,
            }}
          >
            <Typography variant="h6" color="text.secondary" gutterBottom>
              📊{" "}
              {fallbackChartType === "map"
                ? "Mapa"
                : fallbackChartType === "area"
                  ? "Area grafik"
                  : "Scatterplot"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Ovaj tip vizualizacije je u razvoju.
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Trenutno prikazujemo stubičasti grafik kao zamenu:
            </Typography>
            <Box sx={{ mt: 3 }}>
              <ColumnChart data={preparedData} {...commonProps} />
            </Box>
          </Box>
        )}
      </Box>

      {data.length > preparedData.length && (
        <Alert severity="info" sx={{ mt: 2 }}>
          Dataset sadrži {data.length} redova. Prikazano je{" "}
          {preparedData.length} reprezentativnih uzoraka.
        </Alert>
      )}
    </Box>
  );
};
