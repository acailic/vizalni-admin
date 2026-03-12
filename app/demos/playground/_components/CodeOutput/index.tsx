import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { Box, Typography, IconButton, Tooltip } from "@mui/material";
import { useState } from "react";

import { useLocale } from "@/locales/use-locale";

import type { ChartType, Datum, PlaygroundConfig } from "../../_types";

interface GenerateCodeOptions {
  chartType: ChartType;
  data: Datum[];
  config: PlaygroundConfig;
}

export function generateCode({
  chartType,
  data,
  config,
}: GenerateCodeOptions): string {
  const chartComponent =
    chartType === "line"
      ? "LineChart"
      : chartType === "bar"
        ? "BarChart"
        : chartType === "area"
          ? "AreaChart"
          : chartType === "pie"
            ? "PieChart"
            : "ScatterChart";

  const dataStr = JSON.stringify(data, null, 2);

  const configStr =
    chartType === "pie"
      ? `{
    value: { field: "${config.yAxis}", type: "number" },
    category: { field: "${config.xAxis}", type: "string" },
    color: "${config.color}",
  }`
      : `{
    xAxis: "${config.xAxis}",
    yAxis: "${config.yAxis}",
    color: "${config.color}",
  }`;

  return `import { ${chartComponent} } from '@vizualni/react';

function MyChart() {
  const data = ${dataStr};

  return (
    <${chartComponent}
      data={data}
      config={${configStr}}
      height={400}
    />
  );
}

export default MyChart;`;
}

interface CodeOutputProps {
  chartType: ChartType;
  data: Datum[];
  config: PlaygroundConfig;
}

export function CodeOutput({ chartType, data, config }: CodeOutputProps) {
  const locale = useLocale();
  const isSerbian = locale.startsWith("sr");
  const [copied, setCopied] = useState(false);
  const code = generateCode({ chartType, data, config });

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 1,
        }}
      >
        <Typography variant="subtitle2" fontWeight={600}>
          {isSerbian ? "Generisani kod" : "Generated Code"}
        </Typography>
        <Tooltip
          title={
            copied
              ? isSerbian
                ? "Kopirano!"
                : "Copied!"
              : isSerbian
                ? "Kopiraj kod"
                : "Copy code"
          }
        >
          <IconButton onClick={handleCopy} size="small">
            <ContentCopyIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
      <Box
        sx={{
          p: 2,
          backgroundColor: "#1e1e1e",
          color: "#d4d4d4",
          borderRadius: 2,
          fontFamily: "monospace",
          fontSize: "0.85rem",
          overflow: "auto",
          whiteSpace: "pre",
        }}
      >
        {code}
      </Box>
    </Box>
  );
}
