import Head from "next/head";
import Script from "next/script";
import { ErrorBoundary } from "react-error-boundary";

import {
  BarChart,
  ColumnChart,
  LineChart,
  PieChart,
} from "@/components/demos/charts";

const ChartErrorFallback = ({
  error,
  resetErrorBoundary,
}: {
  error: unknown;
  resetErrorBoundary: () => void;
}) => (
  <div style={{ padding: 20, color: "#dc2626" }}>
    <p>
      Chart failed to load:{" "}
      {error instanceof Error ? error.message : String(error)}
    </p>
    <button onClick={resetErrorBoundary}>Retry</button>
  </div>
);

function parseTheme(value: string | null): "light" | "dark" {
  return value === "dark" ? "dark" : "light";
}

function parseLang(value: string | null): "en" | "sr" {
  return value === "sr" ? "sr" : "en";
}

type EmbedChartType = "line" | "bar" | "column" | "pie";

function parseChartType(value: string | null): EmbedChartType {
  if (value === "bar" || value === "column" || value === "pie") {
    return value;
  }
  return "line";
}

const DATASETS: Record<string, Array<{ label: string; value: number }>> = {
  accidents: [
    { label: "2019", value: 34112 },
    { label: "2020", value: 29784 },
    { label: "2021", value: 32540 },
    { label: "2022", value: 33602 },
    { label: "2023", value: 32995 },
  ],
  age: [
    { label: "0-14", value: 14 },
    { label: "15-24", value: 11 },
    { label: "25-44", value: 28 },
    { label: "45-64", value: 27 },
    { label: "65+", value: 20 },
  ],
  budget: [
    { label: "Q1", value: 128 },
    { label: "Q2", value: 141 },
    { label: "Q3", value: 136 },
    { label: "Q4", value: 152 },
  ],
  debt: [
    { label: "2019", value: 52 },
    { label: "2020", value: 58 },
    { label: "2021", value: 57 },
    { label: "2022", value: 55 },
    { label: "2023", value: 53 },
    { label: "2024", value: 51 },
  ],
  demographics: [
    { label: "0-14", value: 14 },
    { label: "15-24", value: 11 },
    { label: "25-44", value: 28 },
    { label: "45-64", value: 27 },
    { label: "65+", value: 20 },
  ],
  air: [
    { label: "Jan", value: 42 },
    { label: "Feb", value: 38 },
    { label: "Mar", value: 45 },
    { label: "Apr", value: 52 },
    { label: "May", value: 48 },
    { label: "Jun", value: 55 },
    { label: "Jul", value: 62 },
    { label: "Aug", value: 58 },
    { label: "Sep", value: 51 },
    { label: "Oct", value: 47 },
    { label: "Nov", value: 43 },
    { label: "Dec", value: 40 },
  ],
  students: [
    { label: "2019", value: 224 },
    { label: "2020", value: 231 },
    { label: "2021", value: 237 },
    { label: "2022", value: 241 },
    { label: "2023", value: 246 },
    { label: "2024", value: 251 },
  ],
  vaccination: [
    { label: "Q1", value: 38 },
    { label: "Q2", value: 44 },
    { label: "Q3", value: 52 },
    { label: "Q4", value: 49 },
  ],
  default: [
    { label: "2019", value: 72 },
    { label: "2020", value: 54 },
    { label: "2021", value: 63 },
    { label: "2022", value: 81 },
    { label: "2023", value: 90 },
    { label: "2024", value: 96 },
  ],
};

function getDataset(dataset: string | null) {
  if (dataset && DATASETS[dataset]) {
    return DATASETS[dataset];
  }
  return DATASETS.default;
}

export default function DemoEmbed() {
  const params =
    typeof window === "undefined"
      ? new URLSearchParams()
      : new URLSearchParams(window.location.search);

  const theme = parseTheme(params.get("theme"));
  const lang = parseLang(params.get("lang"));
  const chartType = parseChartType(params.get("type"));
  const dataset = params.get("dataset");
  const dataSource = params.get("dataSource");
  const datasetFound = Boolean(dataset && DATASETS[dataset]);
  const data = getDataset(dataset);

  const background = theme === "dark" ? "#0b1220" : "#fff";
  const textColor = theme === "dark" ? "#e5e7eb" : "#111827";
  const accent = theme === "dark" ? "#60a5fa" : "#0ea5e9";

  const titleByType: Record<EmbedChartType, string> = {
    line:
      lang === "sr"
        ? "Linijski pregled podataka (demo)"
        : "Line data overview (demo)",
    bar:
      lang === "sr"
        ? "Stubičasti prikaz podataka (demo)"
        : "Bar data view (demo)",
    column:
      lang === "sr"
        ? "Kolonski prikaz podataka (demo)"
        : "Column data view (demo)",
    pie:
      lang === "sr"
        ? "Struktura podataka po segmentima (demo)"
        : "Segment distribution (demo)",
  };

  // Dataset-specific titles for better context
  const datasetTitles: Record<string, Record<EmbedChartType, string>> = {
    air: {
      line:
        lang === "sr"
          ? "Trend kvaliteta vazduha (demo)"
          : "Air Quality Trend (demo)",
      bar:
        lang === "sr"
          ? "Kvalitet vazduha po mesecima (demo)"
          : "Air Quality by Month (demo)",
      column:
        lang === "sr"
          ? "Kolonski prikaz kvaliteta vazduha (demo)"
          : "Air Quality Column View (demo)",
      pie:
        lang === "sr"
          ? "Distribucija kvaliteta vazduha (demo)"
          : "Air Quality Distribution (demo)",
    },
    accidents: {
      line:
        lang === "sr"
          ? "Trend saobraćajnih nezgoda (demo)"
          : "Traffic Accidents Trend (demo)",
      bar:
        lang === "sr"
          ? "Saobraćajne nezgode po godinama (demo)"
          : "Traffic Accidents by Year (demo)",
      column:
        lang === "sr"
          ? "Kolonski prikaz nezgoda (demo)"
          : "Accidents Column View (demo)",
      pie:
        lang === "sr"
          ? "Distribucija nezgoda (demo)"
          : "Accidents Distribution (demo)",
    },
    students: {
      line:
        lang === "sr"
          ? "Trend upisa studenata (demo)"
          : "Student Enrollment Trend (demo)",
      bar:
        lang === "sr"
          ? "Upis studenata po godinama (demo)"
          : "Student Enrollment by Year (demo)",
      column:
        lang === "sr"
          ? "Kolonski prikaz studenata (demo)"
          : "Students Column View (demo)",
      pie:
        lang === "sr"
          ? "Distribucija studenata (demo)"
          : "Students Distribution (demo)",
    },
    vaccination: {
      line:
        lang === "sr" ? "Trend vakcinacije (demo)" : "Vaccination Trend (demo)",
      bar:
        lang === "sr"
          ? "Vakcinacija po kvartalima (demo)"
          : "Vaccination by Quarter (demo)",
      column:
        lang === "sr"
          ? "Kolonski prikaz vakcinacije (demo)"
          : "Vaccination Column View (demo)",
      pie:
        lang === "sr"
          ? "Distribucija vakcinacije (demo)"
          : "Vaccination Distribution (demo)",
    },
    debt: {
      line:
        lang === "sr" ? "Trend javnog duga (demo)" : "Public Debt Trend (demo)",
      bar:
        lang === "sr"
          ? "Javni dug po godinama (demo)"
          : "Public Debt by Year (demo)",
      column:
        lang === "sr"
          ? "Kolonski prikaz duga (demo)"
          : "Debt Column View (demo)",
      pie:
        lang === "sr" ? "Distribucija duga (demo)" : "Debt Distribution (demo)",
    },
  };

  // Use dataset-specific title if available, otherwise fall back to chart type default
  const chartTitle =
    dataset && datasetTitles[dataset]?.[chartType]
      ? datasetTitles[dataset][chartType]
      : titleByType[chartType];

  const footnote =
    lang === "sr"
      ? `Dataset: ${dataset || "demo"}${dataSource ? ` • Izvor: ${dataSource}` : ""}`
      : `Dataset: ${dataset || "demo"}${dataSource ? ` • Source: ${dataSource}` : ""}`;

  return (
    <>
      <Head>
        <meta
          httpEquiv="Content-Security-Policy"
          content="default-src 'self'; script-src 'self' https://cdn.jsdelivr.net/npm/@open-iframe-resizer/; style-src 'self' 'unsafe-inline'; frame-ancestors *;"
        />
      </Head>
      <Script
        type="module"
        src="https://cdn.jsdelivr.net/npm/@open-iframe-resizer/core@1.6.0/dist/index.js"
      />
      <div style={{ padding: 12, background, color: textColor }}>
        {dataset && !datasetFound ? (
          <div style={{ marginBottom: 8, fontSize: 12, opacity: 0.85 }}>
            {lang === "sr"
              ? `Dataset "${dataset}" nije pronađen, prikazujem demo podatke.`
              : `Dataset "${dataset}" was not found, showing demo fallback data.`}
          </div>
        ) : null}
        <ErrorBoundary
          FallbackComponent={ChartErrorFallback}
          resetKeys={[chartType, data]}
        >
          {chartType === "line" ? (
            <LineChart
              data={data}
              xKey="label"
              yKey="value"
              title={chartTitle}
              width={720}
              height={420}
              showTooltip
              showCrosshair
              color={accent}
              colors={[accent, "#22d3ee", "#a855f7", "#fbbf24"]}
            />
          ) : null}
          {chartType === "bar" ? (
            <BarChart
              data={data}
              xKey="label"
              yKey="value"
              title={chartTitle}
              width={720}
              height={420}
              color={accent}
            />
          ) : null}
          {chartType === "column" ? (
            <ColumnChart
              data={data}
              xKey="label"
              yKey="value"
              title={chartTitle}
              width={720}
              height={420}
              color={accent}
            />
          ) : null}
          {chartType === "pie" ? (
            <PieChart
              data={data}
              labelKey="label"
              valueKey="value"
              title={chartTitle}
              width={720}
              height={420}
              colors={[accent, "#22d3ee", "#a855f7", "#fbbf24", "#94a3b8"]}
            />
          ) : null}
        </ErrorBoundary>
        <div style={{ marginTop: 8, fontSize: 12, opacity: 0.8 }}>
          {footnote}
        </div>
      </div>
    </>
  );
}
