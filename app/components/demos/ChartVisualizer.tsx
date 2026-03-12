/**
 * Smart Chart Visualizer
 * Automatically selects appropriate visualization based on data and chart type
 */

import { Alert, Box, Typography } from "@mui/material";
import { useMemo } from "react";

import { useDemoLocale } from "@/hooks/use-demo-locale";
import {
  profileData,
  selectColumns,
  suggestChartType,
  type ChartKind,
} from "@/lib/demos/schema-profiler";
import type { DemoLocale } from "@/types/demos";

import { BarChart, ColumnChart, LineChart, PieChart } from "./charts";
import { CHART_DATA_LIMITS } from "./charts/constants";

// Translation strings
const translations = {
  noData: {
    sr: "Nema dostupnih podataka za vizualizaciju",
    en: "No data available for visualization",
  },
  columnDetectionError: {
    sr: "Nije moguće automatski detektovati kolone za vizualizaciju. Podaci nisu u odgovarajućem formatu.",
    en: "Unable to automatically detect columns for visualization. Data is not in the correct format.",
  },
  showing: {
    sr: "Prikazano",
    en: "Showing",
  },
  of: {
    sr: "od",
    en: "of",
  },
  rows: {
    sr: "redova",
    en: "rows",
  },
  category: {
    sr: "Kategorija",
    en: "Category",
  },
  value: {
    sr: "Vrednost",
    en: "Value",
  },
  map: {
    sr: "Mapa",
    en: "Map",
  },
  areaChart: {
    sr: "Area grafik",
    en: "Area chart",
  },
  chartTypeInDevelopment: {
    sr: "Ovaj tip vizualizacije je u razvoju.",
    en: "This visualization type is in development.",
  },
  showingFallback: {
    sr: "Trenutno prikazujemo stubičasti grafik kao zamenu:",
    en: "Currently showing a column chart as fallback:",
  },
  datasetContains: {
    sr: "Dataset sadrži",
    en: "Dataset contains",
  },
  representativeSamples: {
    sr: "reprezentativnih uzoraka.",
    en: "representative samples.",
  },
};

function getTranslation<T extends keyof typeof translations>(
  key: T,
  locale: DemoLocale
): string {
  return translations[key][locale];
}

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
function prepareDataForVisualization(
  data: any[],
  maxRows: number = CHART_DATA_LIMITS.MAX_VISIBLE_ROWS
): any[] {
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
  const locale = useDemoLocale();
  const { columns, preparedData, resolvedChartType } = useMemo(() => {
    const columns = detectVisualizationColumns(data);
    const preparedData = prepareDataForVisualization(
      data,
      CHART_DATA_LIMITS.VISUALIZER_MAX_ROWS
    );
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
    return <Alert severity="info">{getTranslation("noData", locale)}</Alert>;
  }

  if (!columns.categoryColumn || !columns.valueColumn) {
    return (
      <Alert severity="warning">
        {getTranslation("columnDetectionError", locale)}
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
          <strong>{getTranslation("showing", locale)}:</strong>{" "}
          {preparedData.length} {getTranslation("of", locale)} {data.length}{" "}
          {getTranslation("rows", locale)}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>{getTranslation("category", locale)}:</strong>{" "}
          {columns.categoryColumn} |{" "}
          <strong>{getTranslation("value", locale)}:</strong>{" "}
          {columns.valueColumn}
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
            data={preparedData.slice(0, CHART_DATA_LIMITS.MAX_PIE_SLICES)} // Limit pie chart to 10 slices
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
                ? getTranslation("map", locale)
                : fallbackChartType === "area"
                  ? getTranslation("areaChart", locale)
                  : "Scatterplot"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {getTranslation("chartTypeInDevelopment", locale)}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {getTranslation("showingFallback", locale)}
            </Typography>
            <Box sx={{ mt: 3 }}>
              <ColumnChart data={preparedData} {...commonProps} />
            </Box>
          </Box>
        )}
      </Box>

      {data.length > preparedData.length && (
        <Alert severity="info" sx={{ mt: 2 }}>
          {getTranslation("datasetContains", locale)} {data.length}{" "}
          {getTranslation("rows", locale)}. {getTranslation("showing", locale)}{" "}
          {preparedData.length}{" "}
          {getTranslation("representativeSamples", locale)}
        </Alert>
      )}
    </Box>
  );
};
