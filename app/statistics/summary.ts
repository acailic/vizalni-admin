import { rollups, sum } from "d3-array";
import groupBy from "lodash/groupBy";
import uniq from "lodash/uniq";

import { ChartType, LayoutDashboard } from "@/config-types";
import { defaultLocale } from "@/locales/locales";
import {
  fetchChartCountByDay,
  fetchChartsMetadata,
  fetchChartTrendAverages,
  fetchMostPopularAllTimeCharts,
  fetchMostPopularThisMonthCharts,
  fetchViewCountByDay,
  fetchViewTrendAverages,
} from "@/statistics/prisma";
import { queryCubesMetadata } from "@/statistics/sparql";
import { StatProps } from "@/statistics/stats-card";

export type StatisticsSummary = {
  charts: StatProps & {
    mostPopularAllTime: {
      key: string;
      createdDate: Date;
      viewCount: number;
    }[];
    mostPopularThisMonth: {
      key: string;
      viewCount: number;
    }[];
    countByChartType: {
      type: ChartType;
      count: number;
    }[];
    countByLayoutTypeAndSubtype: {
      type: "single" | "dashboard";
      subtype?: LayoutDashboard["layout"] | "tab" | null;
      count: number;
    }[];
    count: number;
    dashboardCount: number;
    countByCubeIri: {
      iri: string;
      title: string;
      creator?: string;
      count: number;
    }[];
  };
  views: StatProps;
};

export const fetchStatisticsSummary = async (
  locale = defaultLocale
): Promise<StatisticsSummary> => {
  const [
    mostPopularAllTimeCharts,
    mostPopularThisMonthCharts,
    chartCountByDay,
    chartTrendAverages,
    viewCountByDay,
    viewTrendAverages,
    chartsMetadata,
  ] = await Promise.all([
    fetchMostPopularAllTimeCharts(),
    fetchMostPopularThisMonthCharts(),
    fetchChartCountByDay(),
    fetchChartTrendAverages(),
    fetchViewCountByDay(),
    fetchViewTrendAverages(),
    fetchChartsMetadata(),
  ]);

  const chartCountByLayoutTypeAndSubtype = rollups(
    chartsMetadata,
    (v) => v.length,
    ({ chartTypes, layoutType = "single" }) => {
      if (chartTypes.length === 1 || layoutType === "singleURLs") {
        return "single" as const;
      }

      return "dashboard" as const;
    },
    ({ chartTypes, layoutType, layoutSubtype }) => {
      return chartTypes.length === 1 || layoutType === "singleURLs"
        ? null
        : layoutType === "tab" || !layoutSubtype
        ? ("tab" as const)
        : layoutSubtype;
    }
  )
    .flatMap(([type, subtypeCounts]) => {
      return subtypeCounts.map(([subtype, count]) => ({
        type,
        subtype,
        count,
      }));
    })
    .sort((a, b) => b.count - a.count);

  const chartCountByChartType = rollups(
    chartsMetadata.flatMap((d) => d.chartTypes),
    (v) => v.length,
    (d) => d
  )
    .map(([type, count]) => ({ type, count }))
    .sort((a, b) => b.count - a.count);

  const count = sum(chartCountByLayoutTypeAndSubtype, (d) => d.count);
  const dashboardCount = sum(
    chartCountByLayoutTypeAndSubtype.filter((d) => d.type !== "single"),
    (d) => d.count
  );

  const cubeIris = chartsMetadata.flatMap((d) => d.iris);
  const cubesMetadata = await queryCubesMetadata({
    cubeIris: uniq(cubeIris),
    locale,
  });
  const cubesMetadataByIri = groupBy(cubesMetadata, (d) => d.iri);
  const unversionedCubeIris = cubeIris.map((iri) => {
    const unversionedIri = cubesMetadataByIri[iri]?.[0]?.unversionedIri;
    return unversionedIri ?? iri;
  });
  const cubesMetadataByUnversionedIri = groupBy(
    cubesMetadata,
    (d) => d.unversionedIri
  );
  const countByCubeIri = rollups(
    unversionedCubeIris,
    (v) => v.length,
    (d) => d
  )
    .map(([iri, count]) => {
      const { title, creator } = cubesMetadataByUnversionedIri[iri]?.[0] ?? {
        title: iri,
        creator: undefined,
      };

      return { iri, title, creator, count };
    })
    .sort((a, b) => b.count - a.count);

  return {
    charts: {
      mostPopularAllTime: mostPopularAllTimeCharts,
      mostPopularThisMonth: mostPopularThisMonthCharts,
      countByDay: chartCountByDay,
      countByChartType: chartCountByChartType,
      countByLayoutTypeAndSubtype: chartCountByLayoutTypeAndSubtype,
      count,
      dashboardCount,
      trendAverages: chartTrendAverages,
      countByCubeIri,
    },
    views: {
      countByDay: viewCountByDay,
      trendAverages: viewTrendAverages,
    },
  };
};
