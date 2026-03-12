import { t } from "@lingui/macro";
import { ThemeProvider, useTheme } from "@mui/material";
import { select } from "d3-selection";
import deburr from "lodash/deburr";
import uniqBy from "lodash/uniqBy";
import { useCallback, useMemo } from "react";
import { createRoot } from "react-dom/client";

import { extractChartConfigUsedComponents } from "@/charts/shared/chart-helpers";
import {
  CHART_FOOTNOTES_CLASS_NAME,
  VisualizeLink,
} from "@/components/chart-footnotes";
import { TABLE_PREVIEW_WRAPPER_CLASS_NAME } from "@/components/chart-table-preview";
import { useChartWithFiltersClasses } from "@/components/chart-with-filters";
import { getChartConfig } from "@/config-utils";
import { hasChartConfigs, useConfiguratorState } from "@/configurator";
import { Component } from "@/domain/data";
import { truthy } from "@/domain/types";
import { useDataCubesMetadataQuery } from "@/graphql/hooks";
import { useLocale } from "@/locales/use-locale";
import { animationFrame } from "@/utils/animation-frame";
import { UseScreenshotProps } from "@/utils/use-screenshot";

/**
 * Hook to modify DOM node before taking screenshot.
 * Adjusts heights, adds footnotes, removes unwanted elements, and normalizes colors.
 *
 * @param configKey - Unique identifier for the chart configuration (optional)
 * @returns Async function that modifies the cloned node for screenshot
 */
export const useModifyNode = (configKey?: string) => {
  const theme = useTheme();
  const chartWithFiltersClasses = useChartWithFiltersClasses();

  return useCallback(
    async (clonedNode: HTMLElement, originalNode: HTMLElement) => {
      // We need to explicitly set the height of the chart container to the height
      // of the chart, as otherwise screenshot won't work for free canvas charts.
      const tablePreviewWrapper = clonedNode.querySelector(
        `.${TABLE_PREVIEW_WRAPPER_CLASS_NAME}`
      ) as HTMLElement | null;

      if (tablePreviewWrapper) {
        const chart = originalNode.querySelector(
          `.${chartWithFiltersClasses.chartWithFilters}`
        );

        if (chart) {
          const height = chart.clientHeight;
          tablePreviewWrapper.style.height = `${height}px`;
        }
      }

      const footnotes = clonedNode.querySelector(
        `.${CHART_FOOTNOTES_CLASS_NAME}`
      );

      if (footnotes && configKey) {
        const container = document.createElement("div");
        footnotes.appendChild(container);
        const root = createRoot(container);
        root.render(
          <ThemeProvider theme={theme}>
            <VisualizeLink
              configKey={configKey}
              createdWith={t({ id: "metadata.link.created.with" })}
            />
          </ThemeProvider>
        );
        await animationFrame();
      }

      // Remove some elements that should not be included in screenshot.
      // For maps, we can't apply custom classes to internal elements, so we need
      // to remove them here.
      clonedNode.querySelector(".maplibregl-ctrl")?.remove();

      // Every text element should be dark-grey (currently we use primary.main to
      // indicate interactive elements, which doesn't make sense for screenshots)
      // and not have underlines.
      const color = theme.palette.grey[700];
      select(clonedNode)
        .selectAll(
          `:is(p, button, a, span, div, li, h1, h2, h3, h4, h5, h6):not([data-disable-screenshot-color='true'])`
        )
        .style("color", color)
        .style("text-decoration", "none");
      // SVG elements have fill instead of color. Here we only target text elements,
      // to avoid changing the color of other SVG elements (charts).
      select(clonedNode)
        .selectAll(`text:not([data-disable-screenshot-color='true'])`)
        .style("fill", color);
    },
    [chartWithFiltersClasses.chartWithFilters, theme, configKey]
  );
};

/**
 * Hook to generate PNG metadata for chart screenshot.
 * Includes publisher, publish URL, and dataset information.
 *
 * @param props - Metadata generation options
 * @param props.chartKey - Key of the chart within configuration
 * @param props.configKey - Unique identifier for the chart configuration (optional)
 * @param props.components - Chart components to extract metadata from
 * @returns Metadata array compatible with PNG screenshot utility
 */
export const usePNGMetadata = ({
  chartKey,
  configKey,
  components,
}: {
  chartKey: string;
  configKey?: string;
  components: Component[];
}): UseScreenshotProps["pngMetadata"] => {
  const locale = useLocale();
  const [state] = useConfiguratorState(hasChartConfigs);
  const chartConfig = getChartConfig(state, chartKey);

  const usedComponents = useMemo(() => {
    return extractChartConfigUsedComponents(chartConfig, { components });
  }, [chartConfig, components]);

  const [{ data }] = useDataCubesMetadataQuery({
    variables: {
      sourceType: state.dataSource.type,
      sourceUrl: state.dataSource.url,
      locale,
      cubeFilters: uniqBy(
        usedComponents.map((component) => ({ iri: component.cubeIri })),
        "iri"
      ),
    },
    pause: !usedComponents.length,
  });

  return useMemo(() => {
    const publisher = data?.dataCubesMetadata
      .map((cube) =>
        cube.contactPoints
          ? cube.contactPoints
              .map(
                (contactPoint) => `${contactPoint.name} (${contactPoint.email})`
              )
              .join(", ")
          : (cube.creator?.label ?? cube.publisher)
      )
      .join(", ");
    const publisherMetadata = publisher
      ? { key: "Publisher", value: publisher }
      : null;
    const publishURL = configKey
      ? `${window.location.origin}/${locale}/v/${configKey}`
      : null;
    const publishURLMetadata = publishURL
      ? { key: "Publish URL", value: publishURL }
      : null;
    const datasets = data?.dataCubesMetadata
      .map((cube) => `${cube.title} ${cube.version ? `(${cube.version})` : ""}`)
      .join(", ");
    const datasetsMetadata = datasets
      ? { key: "Dataset", value: datasets }
      : null;

    const metadata = [publisherMetadata, publishURLMetadata, datasetsMetadata]
      .filter(truthy)
      .map(({ key, value }) => `${key}: ${value}`)
      .join(" | ");

    return metadata ? [{ key: "Comment", value: deburr(metadata) }] : [];
  }, [configKey, data?.dataCubesMetadata, locale]);
};
