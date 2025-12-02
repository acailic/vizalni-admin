import Head from "next/head";
import Script from "next/script";

import { LineChart } from "@/components/demos/charts";

function parseTheme(value: string | null): "light" | "dark" {
  return value === "dark" ? "dark" : "light";
}

function parseLang(value: string | null): "en" | "sr" {
  return value === "sr" ? "sr" : "en";
}

const data = [
  { label: "2019", value: 72 },
  { label: "2020", value: 54 },
  { label: "2021", value: 63 },
  { label: "2022", value: 81 },
  { label: "2023", value: 90 },
  { label: "2024", value: 96 },
];

export default function DemoEmbed() {
  const params = new URLSearchParams(
    typeof window !== "undefined" ? window.location.search : ""
  );
  const theme = parseTheme(params.get("theme"));
  const lang = parseLang(params.get("lang"));

  const background = theme === "dark" ? "#0b1220" : "#fff";
  const textColor = theme === "dark" ? "#e5e7eb" : "#111827";
  const accent = theme === "dark" ? "#60a5fa" : "#0ea5e9";

  const title =
    lang === "sr" ? "Opоravak zaposlenosti (demo)" : "Employment recovery (demo)";

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
        <LineChart
          data={data}
          xKey="label"
          yKey="value"
          title={title}
          width={720}
          height={420}
          showTooltip
          showCrosshair
          color={accent}
          colors={[accent, "#22d3ee", "#a855f7", "#fbbf24"]}
        />
      </div>
    </>
  );
}
