import { Box, Typography, useTheme } from "@mui/material";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  AreaChart,
  Area,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
} from "recharts";

import { PlaygroundState } from "@/hooks/use-playground-state";

interface ChartPreviewProps {
  state: PlaygroundState;
}

/**
 * Gets the data keys from the data array.
 * Assumes first key is the label/category and second key is the value.
 */
function getDataKeys(data: Array<Record<string, string | number>>): {
  labelKey: string;
  valueKeys: string[];
} {
  if (data.length === 0) {
    return { labelKey: "label", valueKeys: ["value"] };
  }

  const keys = Object.keys(data[0]);
  const labelKey = keys[0]; // First key is typically the label
  const valueKeys = keys.slice(1); // Remaining keys are values

  return { labelKey, valueKeys };
}

/**
 * ChartPreview component for the interactive playground.
 * Renders the appropriate chart based on the current playground state.
 */
export const ChartPreview = ({ state }: ChartPreviewProps) => {
  const theme = useTheme();
  const {
    chartType,
    title,
    subtitle,
    xAxisLabel,
    yAxisLabel,
    data,
    colors,
    showLegend,
    showGrid,
  } = state;

  const { labelKey, valueKeys } = getDataKeys(data);

  // Determine if we have valid data to display
  const hasData = data.length > 0;

  // Get the primary value key for simple charts
  const primaryValueKey = valueKeys[0] || "value";

  // Render empty state if no data
  if (!hasData) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: 400,
          border: `1px dashed ${theme.palette.divider}`,
          borderRadius: 1,
          backgroundColor: theme.palette.background.default,
        }}
      >
        <Typography variant="h6" color="text.secondary">
          No data to display
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Add some data to see your chart
        </Typography>
      </Box>
    );
  }

  // Common axis configuration
  const xAxisConfig = {
    dataKey: labelKey,
    label: { value: xAxisLabel, position: "bottom" as const, offset: 0 },
  };

  const yAxisConfig = {
    label: { value: yAxisLabel, angle: -90, position: "insideLeft" as const },
  };

  // Render chart based on type
  const renderChart = () => {
    switch (chartType) {
      case "line":
        return (
          <LineChart data={data}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" />}
            <XAxis {...xAxisConfig} />
            <YAxis {...yAxisConfig} />
            <Tooltip />
            {showLegend && <Legend />}
            {valueKeys.map((key, index) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={colors[index % colors.length]}
                strokeWidth={2}
                dot={{ fill: colors[index % colors.length] }}
              />
            ))}
          </LineChart>
        );

      case "bar":
        // Horizontal bar chart
        return (
          <BarChart data={data} layout="vertical">
            {showGrid && <CartesianGrid strokeDasharray="3 3" />}
            <XAxis type="number" {...yAxisConfig} />
            <YAxis type="category" dataKey={labelKey} width={100} />
            <Tooltip />
            {showLegend && <Legend />}
            {valueKeys.map((key, index) => (
              <Bar
                key={key}
                dataKey={key}
                fill={colors[index % colors.length]}
              />
            ))}
          </BarChart>
        );

      case "column":
        // Vertical bar chart (default BarChart)
        return (
          <BarChart data={data}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" />}
            <XAxis {...xAxisConfig} />
            <YAxis {...yAxisConfig} />
            <Tooltip />
            {showLegend && <Legend />}
            {valueKeys.map((key, index) => (
              <Bar
                key={key}
                dataKey={key}
                fill={colors[index % colors.length]}
              />
            ))}
          </BarChart>
        );

      case "pie":
        return (
          <PieChart>
            <Pie
              data={data}
              dataKey={primaryValueKey}
              nameKey={labelKey}
              cx="50%"
              cy="50%"
              outerRadius={120}
              label={({ name, percent }) =>
                `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`
              }
            >
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={colors[index % colors.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            {showLegend && <Legend />}
          </PieChart>
        );

      case "area":
        return (
          <AreaChart data={data}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" />}
            <XAxis {...xAxisConfig} />
            <YAxis {...yAxisConfig} />
            <Tooltip />
            {showLegend && <Legend />}
            {valueKeys.map((key, index) => (
              <Area
                key={key}
                type="monotone"
                dataKey={key}
                stroke={colors[index % colors.length]}
                fill={colors[index % colors.length]}
                fillOpacity={0.3}
              />
            ))}
          </AreaChart>
        );

      case "scatter":
        // For scatter, we use label as X and value as Y
        // If data has numeric labelKey, use it directly
        return (
          <ScatterChart>
            {showGrid && <CartesianGrid strokeDasharray="3 3" />}
            <XAxis name={xAxisLabel} type="number" {...xAxisConfig} />
            <YAxis
              dataKey={primaryValueKey}
              name={yAxisLabel}
              {...yAxisConfig}
            />
            <Tooltip
              cursor={{ strokeDasharray: "3 3" }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const point = payload[0].payload;
                  return (
                    <Box
                      sx={{
                        backgroundColor: "white",
                        p: 1.5,
                        border: `1px solid ${theme.palette.divider}`,
                        borderRadius: 1,
                        boxShadow: 2,
                      }}
                    >
                      <Typography variant="body2" fontWeight="medium">
                        {point[labelKey]}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {primaryValueKey}: {point[primaryValueKey]}
                      </Typography>
                    </Box>
                  );
                }
                return null;
              }}
            />
            {showLegend && <Legend />}
            <Scatter
              name={title || "Data"}
              data={data.map((item) => ({
                ...item,
                // Convert label to number for scatter (use index if not numeric)
                [labelKey]:
                  typeof item[labelKey] === "number"
                    ? item[labelKey]
                    : data.indexOf(item),
              }))}
              fill={colors[0]}
            />
          </ScatterChart>
        );

      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      {/* Title and Subtitle */}
      {title && (
        <Typography
          variant="h6"
          component="h3"
          sx={{ mb: subtitle ? 0.5 : 2, textAlign: "center" }}
        >
          {title}
        </Typography>
      )}
      {subtitle && (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 2, textAlign: "center" }}
        >
          {subtitle}
        </Typography>
      )}

      {/* Chart Container */}
      <ResponsiveContainer width="100%" height={400}>
        {renderChart()}
      </ResponsiveContainer>
    </Box>
  );
};

export default ChartPreview;
