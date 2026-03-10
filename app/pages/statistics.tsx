import { Box, CircularProgress, Typography } from "@mui/material";
import { rollups, sum } from "d3-array";
import uniq from "lodash/uniq";

import { AppLayout } from "@/components/layout";
import { getFieldLabel } from "@/configurator/components/field-i18n";
import { getIconName } from "@/configurator/components/ui-helpers";
import { Icon } from "@/icons";
import { useLocale } from "@/locales/use-locale";
import { BaseStatsCard } from "@/statistics/base-stats-card";
import { CardGrid } from "@/statistics/card-grid";
import { formatInteger } from "@/statistics/formatters";
import { ChartLink, CubeLink } from "@/statistics/links";
import { SectionTitle, SectionTitleWrapper } from "@/statistics/sections";
import { StatsCard } from "@/statistics/stats-card";
import { StatisticsSummary } from "@/statistics/summary";
import { apiFetch } from "@/utils/api";
import { supportsStatisticsRoutes } from "@/utils/public-paths";
import { useFetchData } from "@/utils/use-fetch-data";

const Statistics = () => {
  const locale = useLocale();
  const { data, error, status } = useFetchData<StatisticsSummary>({
    queryKey: ["statisticsSummary", locale],
    queryFn: () => apiFetch(`/api/statistics/summary?locale=${locale}`),
    options: {
      defaultData: undefined,
    },
  });

  if (!supportsStatisticsRoutes) {
    return (
      <AppLayout>
        <Box sx={{ maxWidth: 720, mx: "auto", my: 8, px: 4 }}>
          <Typography variant="h2" gutterBottom>
            Statistics are unavailable on this deployment
          </Typography>
          <Typography color="text.secondary">
            Chart analytics depend on live API routes and database access, which
            are not included in the static export.
          </Typography>
        </Box>
      </AppLayout>
    );
  }

  if (status === "fetching" || status === "idle") {
    return (
      <AppLayout>
        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
          }}
        >
          <CircularProgress size={24} />
          <Typography>Loading statistics…</Typography>
        </Box>
      </AppLayout>
    );
  }

  if (status === "error" || !data) {
    return (
      <AppLayout>
        <Box sx={{ maxWidth: 720, mx: "auto", my: 8, px: 4 }}>
          <Typography variant="h2" gutterBottom>
            Statistics are unavailable
          </Typography>
          <Typography color="text.secondary">
            {error?.message ??
              "This deployment cannot access the chart analytics data source."}
          </Typography>
        </Box>
      </AppLayout>
    );
  }

  const { charts, views } = data;

  return (
    <AppLayout>
      <Box
        sx={{
          width: "100%",
          maxWidth: 1400,
          mx: "auto",
          my: "36px",
          px: 4,
        }}
      >
        <SectionTitleWrapper>
          <SectionTitle title="Popularity statistics" />
          <Typography>
            Gain insights into number of charts and view trends in Visualize.
          </Typography>
          <Typography>
            The data on chart views <b>is not complete</b> as it was started to
            be collected in 2024.
          </Typography>
        </SectionTitleWrapper>
        <Typography variant="caption" component="p" sx={{ mt: 2 }}>
          <b>Views</b> are counted when a user opens a published chart in{" "}
          <code>/v</code> page or through iframe.
        </Typography>
        <Typography variant="caption" component="p">
          <b>Previews</b> are counted when accessing a chart preview through{" "}
          <code>/preview</code> or <code>/preview_post</code> pages and are not
          connected to a chart config.
        </Typography>
        <CardGrid>
          {charts.countByDay.length > 0 && (
            <StatsCard
              countByDay={charts.countByDay}
              trendAverages={charts.trendAverages}
              title={(total) =>
                `Visualize users created ${formatInteger(total)} charts...`
              }
              subtitle={(total, avgMonthlyCount) =>
                `${
                  total
                    ? ` It's around ${formatInteger(avgMonthlyCount)} chart${
                        avgMonthlyCount > 1 ? "s" : ""
                      } per month on average.`
                    : ""
                }`
              }
            />
          )}
          {views.countByDay.length > 0 && (
            <StatsCard
              countByDay={views.countByDay}
              trendAverages={views.trendAverages}
              title={(total) =>
                `...viewed ${formatInteger(total)}x (including ${formatInteger(
                  sum(
                    views.countByDay.filter((d) => d.type === "preview"),
                    (d) => d.count
                  )
                )} previews)`
              }
              subtitle={(total, avgMonthlyCount) =>
                `${
                  total
                    ? ` It's around ${formatInteger(avgMonthlyCount)} view${
                        avgMonthlyCount > 1 ? "s" : ""
                      } per month on average.`
                    : ""
                }`
              }
            />
          )}
          {charts.mostPopularAllTime.length > 0 && (
            <BaseStatsCard
              title="Most popular charts (all time)"
              subtitle="Top 25 charts by view count."
              data={charts.mostPopularAllTime.map((chart) => [
                chart.key,
                {
                  count: chart.viewCount,
                  label: <ChartLink locale={locale} chartKey={chart.key} />,
                },
              ])}
              columnName="Chart link"
            />
          )}
          {charts.mostPopularThisMonth.length > 0 && (
            <BaseStatsCard
              title="Most popular charts (last 30 days)"
              subtitle="Top 25 charts by view count."
              data={charts.mostPopularThisMonth.map((chart) => [
                chart.key,
                {
                  count: chart.viewCount,
                  label: <ChartLink locale={locale} chartKey={chart.key} />,
                },
              ])}
              columnName="Chart link"
            />
          )}
        </CardGrid>
        <SectionTitleWrapper>
          <SectionTitle title="Charts" />
          <Typography>
            Gain insights into the characteristics of the charts created in
            Visualize.
          </Typography>
        </SectionTitleWrapper>
        <CardGrid>
          <BaseStatsCard
            title={`Visualize users created ${formatInteger(
              sum(charts.countByChartType, (d) => d.count)
            )} individual* charts`}
            subtitle="*Dashboards contain multiple charts; here we show them all."
            data={charts.countByChartType.map(({ type, count }) => [
              type,
              {
                count,
                label: (
                  <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                    <Icon size={18} name={getIconName(type)} />
                    {getFieldLabel(type) || type}
                  </Box>
                ),
              },
            ])}
            columnName="Chart type"
            showPercentage
          />
          <BaseStatsCard
            title={`There are ${formatInteger(
              charts.dashboardCount
            )} Visualize dashboards`}
            subtitle={`It accounts for around ${(
              (charts.dashboardCount / charts.count) *
              100
            ).toFixed(0)}% of all charts created.`}
            data={charts.countByLayoutTypeAndSubtype.map(
              ({ type, subtype, count }) => [
                type,
                {
                  count,
                  label: getChartTypeSubtypeLabel({ type, subtype }),
                },
              ]
            )}
            columnName="Layout type"
            showPercentage
          />
        </CardGrid>
        <SectionTitleWrapper>
          <SectionTitle title="Cubes" />
          <Typography>
            Gain insights into the cubes used in the charts created in
            Visualize.
          </Typography>
        </SectionTitleWrapper>
        <CardGrid>
          <BaseStatsCard
            title={`Individual charts were made using ${formatInteger(
              uniq(charts.countByCubeIri.map((d) => d.iri)).length
            )} cubes`}
            subtitle="Cubes are the data sources used in individual charts."
            data={charts.countByCubeIri.map(({ iri, title, count }) => [
              title,
              {
                count,
                label:
                  iri === title ? (
                    title
                  ) : (
                    <CubeLink locale={locale} iri={iri} title={title} />
                  ),
              },
            ])}
            columnName="Cube name (IRI if name is missing)"
            showPercentage
          />
          <BaseStatsCard
            title={`Cubes come from ${formatInteger(
              uniq(
                charts.countByCubeIri
                  .filter((d) => d.creator)
                  .map((d) => d.creator)
              ).length
            )} known creators`}
            subtitle="Creators are the organizations that create the cubes."
            data={rollups(
              charts.countByCubeIri,
              (v) => sum(v, (d) => d.count),
              (d) => d.creator
            )
              .sort((a, b) =>
                a[0] === undefined ? 1 : b[0] === undefined ? -1 : b[1] - a[1]
              )
              .map(([creator, count]) => [
                creator ?? "Unknown",
                {
                  count,
                  label: creator ?? <i>Unknown</i>,
                },
              ])}
            columnName="Cube creator"
            showPercentage
          />
        </CardGrid>
      </Box>
    </AppLayout>
  );
};

const getChartTypeSubtypeLabel = ({
  type,
  subtype,
}: {
  type: "single" | "dashboard";
  subtype?: StatisticsSummary["charts"]["countByLayoutTypeAndSubtype"][number]["subtype"];
}) => {
  switch (type) {
    case "single":
      return "Single chart";
    case "dashboard":
      switch (subtype) {
        case "tab":
          return "Tab dashboard";
        case "canvas":
          return "Free canvas dashboard";
        case "tall":
          return "Tall dashboard";
        case "vertical":
          return "Vertical dashboard";
        default:
          return type ?? subtype ?? "Unknown";
      }
    default:
      return "Unknown";
  }
};

export default Statistics;
