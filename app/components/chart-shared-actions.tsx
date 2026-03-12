import { Trans } from "@lingui/macro";

import { useChartTablePreview } from "@/components/chart-table-preview";
import { MenuActionItem } from "@/components/menu-action-item";
import { useModifyNode, usePNGMetadata } from "@/components/use-chart-shared";
import { hasChartConfigs, useConfiguratorState } from "@/configurator";
import { ChartConfig } from "@/configurator";
import { getChartIcon } from "@/icons";
import { useLocale } from "@/locales/use-locale";
import { useChartUrls } from "@/utils/chart-urls";
import { createId } from "@/utils/create-id";
import { useScreenshot } from "@/utils/use-screenshot";

/**
 * Menu action item for copying a chart to create a new editable version.
 *
 * @param props - Component props
 * @param props.configKey - Unique identifier for the chart configuration
 */
export const CopyChartMenuActionItem = ({
  configKey,
}: {
  configKey: string;
}) => {
  const locale = useLocale();
  const { getCopyUrl } = useChartUrls(locale);
  const copyUrl = getCopyUrl(configKey);

  return (
    <MenuActionItem
      type="link"
      as="menuitem"
      href={copyUrl}
      target="_blank"
      rel="noopener noreferrer"
      leadingIconName="pen"
      label={<Trans id="chart-controls.copy-and-edit">Copy and edit</Trans>}
    />
  );
};

/**
 * Menu action item for sharing a chart via a public link.
 *
 * @param props - Component props
 * @param props.configKey - Unique identifier for the chart configuration
 */
export const ShareChartMenuActionItem = ({
  configKey,
}: {
  configKey: string;
}) => {
  const locale = useLocale();
  const { getShareUrl } = useChartUrls(locale);
  const shareUrl = getShareUrl(configKey);

  return (
    <MenuActionItem
      type="link"
      as="menuitem"
      href={shareUrl}
      target="_blank"
      rel="noopener noreferrer"
      leadingIconName="share"
      label={<Trans id="button.share">Share</Trans>}
    />
  );
};

/**
 * Menu action item for duplicating a chart within the current dashboard.
 *
 * @param props - Component props
 * @param props.chartConfig - The chart configuration to duplicate
 * @param props.onSuccess - Callback to execute after successful duplication
 */
export const DuplicateChartMenuActionItem = ({
  chartConfig,
  onSuccess,
}: {
  chartConfig: ChartConfig;
  onSuccess: () => void;
}) => {
  const locale = useLocale();
  const [_, dispatch] = useConfiguratorState(hasChartConfigs);

  return (
    <MenuActionItem
      type="button"
      as="menuitem"
      onClick={() => {
        dispatch({
          type: "CHART_CONFIG_ADD",
          value: {
            chartConfig: { ...chartConfig, key: createId() },
            locale,
          },
        });
        onSuccess();
      }}
      leadingIconName="duplicate"
      label={<Trans id="chart-controls.duplicate">Duplicate</Trans>}
    />
  );
};

/**
 * Menu action item for toggling between chart and table view.
 *
 * @param props - Component props
 * @param props.chartType - The current chart type
 * @param props.onSuccess - Callback to execute after toggling view
 */
export const TableViewChartMenuActionItem = ({
  chartType,
  onSuccess,
}: {
  chartType: ChartConfig["chartType"];
  onSuccess: () => void;
}) => {
  const { isTable, setIsTable } = useChartTablePreview();

  return (
    <MenuActionItem
      type="button"
      as="menuitem"
      onClick={() => {
        setIsTable(!isTable);
        onSuccess();
      }}
      leadingIconName={isTable ? getChartIcon(chartType) : "tableChart"}
      label={
        isTable ? (
          <Trans id="chart-controls.chart-view">Chart view</Trans>
        ) : (
          <Trans id="chart-controls.table-view">Table view</Trans>
        )
      }
    />
  );
};

/**
 * Menu action item for downloading chart as PNG image.
 *
 * @param props - Component props
 * @param props.configKey - Unique identifier for the chart configuration
 * @param props.chartKey - Key of the chart within the configuration
 * @param props.components - Chart components to include in metadata
 * @param props.screenshotName - Name to use for the downloaded file
 * @param props.screenshotNode - DOM node to capture for screenshot
 */
export const DownloadPNGImageMenuActionItem = ({
  configKey,
  chartKey,
  components,
  screenshotName,
  screenshotNode,
}: {
  configKey?: string;
  chartKey: string;
  components: any[];
} & Omit<
  import("@/utils/use-screenshot").UseScreenshotProps,
  "type" | "modifyNode" | "pngMetadata"
>) => {
  const modifyNode = useModifyNode(configKey);
  const metadata = usePNGMetadata({
    configKey,
    chartKey,
    components,
  });
  const { loading, screenshot } = useScreenshot({
    type: "png",
    screenshotName,
    screenshotNode,
    modifyNode,
    pngMetadata: metadata,
  });

  return (
    <MenuActionItem
      type="button"
      as="menuitem"
      onClick={screenshot}
      disabled={loading}
      leadingIconName="download"
      label={<Trans id="chart-controls.export-png">Export PNG</Trans>}
    />
  );
};
