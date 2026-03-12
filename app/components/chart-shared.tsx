import { t, Trans } from "@lingui/macro";
import { Box, IconButton } from "@mui/material";
import { ReactNode, useCallback, useEffect, useMemo } from "react";

import {
  ChartDataFiltersToggle,
  useChartDataFiltersState,
} from "@/charts/shared/chart-data-filters";
import { ChartDataFiltersList } from "@/charts/shared/chart-data-filters/filters-list";
import { ArrowMenuTopBottom } from "@/components/arrow-menu";
import {
  CopyChartMenuActionItem,
  DownloadPNGImageMenuActionItem,
  DuplicateChartMenuActionItem,
  ShareChartMenuActionItem,
  TableViewChartMenuActionItem,
} from "@/components/chart-shared-actions";
// Re-exports for convenience
export { DuplicateChartMenuActionItem };
import {
  CHART_GRID_ROW_COUNT,
  DISABLE_SCREENSHOT_COLOR_WIPE_ATTR,
  useChartStyles,
} from "@/components/chart-shared-styles";
// Re-exports for convenience
export {
  CHART_GRID_ROW_COUNT,
  DISABLE_SCREENSHOT_COLOR_WIPE_ATTR,
  useChartStyles,
};
import { useChartTablePreview } from "@/components/chart-table-preview";
import { MenuActionItem } from "@/components/menu-action-item";
import { MetadataPanel } from "@/components/metadata-panel";
import { getChartConfig } from "@/config-utils";
import {
  ChartConfig,
  DashboardFiltersConfig,
  DataSource,
  hasChartConfigs,
  isConfiguring,
  isPublished,
  useConfiguratorState,
} from "@/configurator";
import { timeUnitToFormatter } from "@/configurator/components/ui-helpers";
import { Component } from "@/domain/data";
import { Icon } from "@/icons";
import { useLocale } from "@/locales/use-locale";
import { useAnchorMenu } from "@/utils/use-anchor-menu";
import { DISABLE_SCREENSHOT_ATTR } from "@/utils/use-screenshot";

/**
 * Chart controls component that displays filters and metadata panel.
 *
 * @param props - Component props
 * @param props.dataSource - Data source configuration
 * @param props.chartConfig - Chart configuration
 * @param props.dashboardFilters - Dashboard-level filters (optional)
 * @param props.metadataPanelProps - Additional props for MetadataPanel component
 */
export const ChartControls = ({
  dataSource,
  chartConfig,
  dashboardFilters,
  metadataPanelProps,
}: {
  dataSource: DataSource;
  chartConfig: ChartConfig;
  dashboardFilters: DashboardFiltersConfig | undefined;
  metadataPanelProps?: Omit<
    React.ComponentProps<typeof MetadataPanel>,
    "dataSource" | "chartConfig" | "dashboardFilters"
  >;
}) => {
  const chartDataFilters = chartConfig.interactiveFiltersConfig.dataFilters;
  const dashboardDataFilters = dashboardFilters?.dataFilters;
  const showFilters =
    chartDataFilters.active &&
    chartDataFilters.componentIds.some(
      (id) => !dashboardDataFilters?.componentIds.includes(id)
    );
  const chartFiltersState = useChartDataFiltersState({
    dataSource,
    chartConfig,
    dashboardFilters,
  });

  return showFilters || metadataPanelProps ? (
    <Box
      {...DISABLE_SCREENSHOT_ATTR}
      sx={{
        display: "grid",
        gridTemplateAreas: `
    "filtersToggle metadataToggle"
    "filtersList filtersList"`,
        mt: 4,
      }}
    >
      <Box sx={{ gridArea: "filtersToggle" }}>
        {showFilters && <ChartDataFiltersToggle {...chartFiltersState} />}
      </Box>
      {metadataPanelProps ? (
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gridArea: "metadataToggle",
          }}
        >
          <MetadataPanel
            dataSource={dataSource}
            chartConfig={chartConfig}
            dashboardFilters={dashboardFilters}
            {...metadataPanelProps}
          />
        </div>
      ) : null}
      <Box sx={{ gridArea: "filtersList" }}>
        {showFilters && <ChartDataFiltersList {...chartFiltersState} />}
      </Box>
    </Box>
  ) : (
    <span style={{ height: 1 }} />
  );
};

/**
 * More options button for charts.
 * Displays different actions based on whether the chart is published or unpublished.
 *
 * @param props - Component props
 * @param props.configKey - Unique identifier for the chart configuration (optional)
 * @param props.chartKey - Key of the chart within configuration
 * @param props.chartWrapperNode - DOM node containing the chart (for screenshots)
 * @param props.components - Chart components to include in metadata
 * @param props.disableDatabaseRelatedActions - Whether to disable database-related actions like copy and share
 */
export const ChartMoreButton = ({
  configKey,
  chartKey,
  chartWrapperNode,
  components,
  disableDatabaseRelatedActions,
}: {
  configKey?: string;
  chartKey: string;
  chartWrapperNode?: HTMLElement | null;
  components: Component[];
  disableDatabaseRelatedActions?: boolean;
}) => {
  const locale = useLocale();
  const [state, dispatch] = useConfiguratorState(hasChartConfigs);
  const menu = useAnchorMenu();
  const chartConfig = getChartConfig(state, chartKey);
  const { setIsTableRaw } = useChartTablePreview();

  // Reset back to chart view when switching chart type.
  useEffect(() => {
    setIsTableRaw(false);
  }, [chartConfig.chartType, setIsTableRaw]);

  const disableButton =
    isPublished(state) &&
    state.layout.type === "dashboard" &&
    chartConfig.chartType === "table";

  const screenshotName = useMemo(() => {
    const date = timeUnitToFormatter.Day(new Date());
    const label = chartConfig.meta.title[locale] || chartConfig.chartType;
    return `${date}_${label}`;
  }, [chartConfig.meta.title, chartConfig.chartType, locale]);

  const getPublishedActions = useCallback(() => {
    const actions: ReactNode[] = [];

    if (chartConfig.chartType !== "table") {
      actions.push(
        <TableViewChartMenuActionItem
          chartType={chartConfig.chartType}
          onSuccess={menu.close}
        />
      );
      actions.push(
        <DownloadPNGImageMenuActionItem
          configKey={configKey}
          chartKey={chartKey}
          components={components}
          screenshotName={screenshotName}
          screenshotNode={chartWrapperNode}
        />
      );
    }

    if (
      state.layout.type !== "dashboard" &&
      configKey &&
      !disableDatabaseRelatedActions
    ) {
      actions.push(<CopyChartMenuActionItem configKey={configKey} />);
      actions.push(<ShareChartMenuActionItem configKey={configKey} />);
    }

    return actions;
  }, [
    chartConfig.chartType,
    state.layout.type,
    configKey,
    disableDatabaseRelatedActions,
    menu.close,
    chartKey,
    components,
    screenshotName,
    chartWrapperNode,
  ]);

  const getUnpublishedActions = useCallback(() => {
    const actions: ReactNode[] = [];

    if (!isConfiguring(state)) {
      actions.push(
        <MenuActionItem
          type="button"
          as="menuitem"
          onClick={() => {
            dispatch({ type: "CONFIGURE_CHART", value: { chartKey } });
            menu.close();
          }}
          leadingIconName="pen"
          label={<Trans id="chart-controls.edit">Edit</Trans>}
        />
      );
    }

    actions.push(
      <DuplicateChartMenuActionItem
        chartConfig={chartConfig}
        onSuccess={menu.close}
      />
    );

    if (chartConfig.chartType !== "table") {
      actions.push(
        <TableViewChartMenuActionItem
          chartType={chartConfig.chartType}
          onSuccess={menu.close}
        />
      );
      actions.push(
        <DownloadPNGImageMenuActionItem
          configKey={configKey}
          chartKey={chartKey}
          components={components}
          screenshotName={screenshotName}
          screenshotNode={chartWrapperNode}
        />
      );
    }

    if (state.chartConfigs.length > 1) {
      actions.push(
        <MenuActionItem
          type="button"
          as="menuitem"
          color="red"
          requireConfirmation
          confirmationTitle={t({
            id: "chart-controls.delete.title",
            message: "Delete chart?",
          })}
          confirmationText={t({
            id: "chart-controls.delete.confirmation",
            message: "Are you sure you want to delete this chart?",
          })}
          onClick={() => {
            dispatch({
              type: "CHART_CONFIG_REMOVE",
              value: { chartKey },
            });
            menu.close();
          }}
          leadingIconName="trash"
          label={<Trans id="chart-controls.delete">Delete</Trans>}
        />
      );
    }

    return actions;
  }, [
    state,
    chartConfig,
    menu,
    dispatch,
    chartKey,
    configKey,
    components,
    screenshotName,
    chartWrapperNode,
  ]);

  const published = isPublished(state);

  const availableActions = useMemo(() => {
    return published ? getPublishedActions() : getUnpublishedActions();
  }, [getPublishedActions, getUnpublishedActions, published]);

  if (disableButton || availableActions.length === 0) {
    return null;
  }

  return (
    <>
      <IconButton
        {...DISABLE_SCREENSHOT_ATTR}
        data-testid="chart-more-button"
        onClick={menu.open}
        sx={{ height: "fit-content" }}
      >
        <Icon name="dots" />
      </IconButton>
      <ArrowMenuTopBottom
        open={menu.isOpen}
        anchorEl={menu.anchor}
        onClose={menu.close}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
      >
        {availableActions}
      </ArrowMenuTopBottom>
    </>
  );
};
