/**
 * Type definitions for chart configuration UI options.
 *
 * This module contains all type definitions related to chart encoding options,
 * field specifications, and chart configuration metadata.
 */

import type {
  AreaConfig,
  BarConfig,
  ChartConfig,
  ChartSubType,
  ChartType,
  ColorScaleType,
  ColumnConfig,
  ComboLineColumnConfig,
  ComboLineDualConfig,
  ComboLineSingleConfig,
  GenericField,
  LineConfig,
  MapConfig,
  PieConfig,
  ScatterPlotConfig,
  SortingOrder,
  SortingType,
  TableConfig,
} from "@/config-types";
import type { Component, Dimension, Measure, Observation } from "@/domain/data";

// Define ComponentType locally to avoid import issues
type ComponentType = Component["__typename"];

/**
 * Base encoding field type for animations.
 */
type BaseEncodingFieldType = "animation";

/**
 * Map-specific encoding field types for layer configuration.
 */
type MapEncodingFieldType =
  | "baseLayer"
  | "areaLayer"
  | "symbolLayer"
  | "customLayers";

/**
 * Regular chart encoding field types.
 */
type RegularChartEncodingType = "x" | "y" | "segment" | "color";

/**
 * Union type for all encoding field types across different chart types.
 */
export type EncodingFieldType =
  | BaseEncodingFieldType
  | MapEncodingFieldType
  | RegularChartEncodingType;

/**
 * Handler function for encoding option value changes.
 *
 * @template V - Value type
 * @template T - Chart configuration type (extends ChartConfig)
 * @template F - Generic field type (defaults to GenericField)
 */
type OnEncodingOptionChange<
  V,
  T extends ChartConfig = ChartConfig,
  F extends GenericField = GenericField,
> = (
  value: V,
  options: {
    chartConfig: T;
    dimensions: Dimension[];
    measures: Measure[];
    field: EncodingFieldType;
    oldField: F;
  }
) => void;

/**
 * Chart subtype encoding option.
 *
 * @template T - Chart configuration type
 */
export type EncodingOptionChartSubType<T extends ChartConfig = ChartConfig> = {
  field: "chartSubType";
  getValues: (
    chartConfig: T,
    dimensions: Component[]
  ) => {
    value: ChartSubType;
    disabled: boolean;
    warnMessage?: string;
  }[];
  onChange: OnEncodingOptionChange<ChartSubType, T>;
};

/**
 * Color component encoding option.
 */
type EncodingOptionColorComponent = {
  field: "colorComponent";
  optional: boolean;
  componentTypes: ComponentType[];
  enableUseAbbreviations: boolean;
  onComponentIdChange: OnEncodingOptionChange<string, MapConfig>;
  onScaleTypeChange: OnEncodingOptionChange<ColorScaleType, MapConfig>;
};

/**
 * Imputation encoding option.
 *
 * @template T - Chart configuration type
 */
type EncodingOptionImputation<T extends ChartConfig = ChartConfig> = {
  field: "imputation";
  shouldShow: (chartConfig: T, data: Observation[]) => boolean;
};

/**
 * Handler function for encoding changes.
 *
 * @template T - Chart configuration type
 * @template F - Generic field type
 */
export type OnEncodingChange<
  T extends ChartConfig = ChartConfig,
  F extends GenericField = GenericField,
> = (
  value: unknown,
  options: {
    chartConfig: T;
    dimensions: Component[];
    measures: Component[];
    initializing: boolean;
    selectedValues: any[];
    field: EncodingFieldType;
    oldField: F;
  }
) => void;

/**
 * Generic encoding option type.
 *
 * This is a union type that encompasses all possible encoding options
 * for different chart types and configurations.
 *
 * @template T - Chart configuration type
 */
export type EncodingOption<T extends ChartConfig = ChartConfig> =
  | EncodingOptionChartSubType<T>
  | {
      field: "calculation";
      getDisabledState?: (chartConfig: T) => {
        disabled: boolean;
        warnMessage?: string;
      };
    }
  | {
      field: "colorPalette";
    }
  | EncodingOptionColorComponent
  | EncodingOptionImputation<T>
  | {
      field: "showValues";
      getDisabledState?: (chartConfig: T) => {
        disabled: boolean;
        warnMessage?: string;
      };
    }
  | {
      field: "adjustScaleDomain";
      getDefaultDomain: (options: {
        chartConfig: T;
        observations: Observation[];
      }) => [number, number];
    }
  | {
      field: "convertUnit";
    }
  | {
      field: "showStandardError";
    }
  | {
      field: "showConfidenceInterval";
    }
  | {
      field: "sorting";
    }
  | {
      field: "showDots";
    }
  | {
      field: "showDotsSize";
    }
  | {
      field: "size";
      componentTypes: ComponentType[];
      optional: boolean;
    }
  | {
      field: "useAbbreviations";
    }
  // Note: Chart type specific fields could be refactored for better type safety
  | {
      field: "lineAxisOrientation";
      onChange: OnEncodingOptionChange<"left" | "right", ComboLineColumnConfig>;
    }
  | {
      field: "componentIds";
      onChange: OnEncodingOptionChange<string[], ComboLineSingleConfig>;
    }
  | {
      field: "leftAxisComponentId";
      onChange: OnEncodingOptionChange<string, ComboLineDualConfig>;
    }
  | {
      field: "rightAxisComponentId";
      onChange: OnEncodingOptionChange<string, ComboLineDualConfig>;
    }
  | {
      field: "lineComponentId";
      onChange: OnEncodingOptionChange<string, ComboLineColumnConfig>;
    }
  | {
      field: "columnComponentId";
      onChange: OnEncodingOptionChange<string, ComboLineColumnConfig>;
    };

/**
 * Interactive filter type for chart interactions.
 */
type InteractiveFilterType = "legend" | "timeRange" | "animation";

/**
 * Chart specification type.
 *
 * @template T - Chart configuration type
 * @template F - Generic field type
 */
export interface EncodingSpec<
  T extends ChartConfig = ChartConfig,
  F extends GenericField = GenericField,
> {
  field: EncodingFieldType;
  optional: boolean;
  componentTypes: ComponentType[];
  /**
   * Used to find component id inside of encoding.
   * Particularly useful for fields that may contain several components.
   */
  idAttributes: string[];
  /**
   * If true, won't use ChartFieldOption component, but a custom one.
   * Needs to be handled then in ChartOptionsSelector.
   */
  customComponent?: boolean;
  /**
   * If false, using a dimension in this encoding will not prevent it
   * to be used in an other encoding. Default: true
   */
  exclusive?: boolean;
  filters: boolean;
  disableInteractiveFilters?: boolean;
  sorting?: EncodingSortingOption<T>[];
  hide?: boolean;
  options?: {
    [K in EncodingOption["field"]]?: Omit<
      Extract<EncodingOption<T>, { field: K }>,
      "field"
    >;
  };
  onChange?: OnEncodingChange<T, F>;
  onDelete?: (options: { chartConfig: T }) => void;
  getDisabledState?: (
    chartConfig: T,
    components: Component[],
    observations: Observation[]
  ) => {
    disabled: boolean;
    warnMessage?: string;
  };
}

/**
 * Single chart specification type.
 *
 * @template T - Chart configuration type
 */
type ChartSpec<T extends ChartConfig = ChartConfig> = {
  chartType: ChartType;
  encodings: EncodingSpec<T>[];
  interactiveFilters: InteractiveFilterType[];
};

/**
 * All chart specifications indexed by chart type.
 * Exported for potential future use.
 */
export type ChartSpecs = {
  area: ChartSpec<AreaConfig>;
  column: ChartSpec<ColumnConfig>;
  bar: ChartSpec<BarConfig>;
  line: ChartSpec<LineConfig>;
  map: ChartSpec<MapConfig>;
  pie: ChartSpec<PieConfig>;
  scatterplot: ChartSpec<ScatterPlotConfig>;
  table: ChartSpec<TableConfig>;
  comboLineSingle: ChartSpec<ComboLineSingleConfig>;
  comboLineDual: ChartSpec<ComboLineDualConfig>;
  comboLineColumn: ChartSpec<ComboLineColumnConfig>;
};

/**
 * Sorting option for chart encodings.
 *
 * @note Future: Consider differentiating sorting behavior for chart rendering
 *       vs legend/tooltip display.
 *
 * @template T - Chart configuration type
 */
export type EncodingSortingOption<T extends ChartConfig = ChartConfig> = {
  sortingType: SortingType;
  sortingOrder: SortingOrder[];
  getDisabledState?: (chartConfig: T) => {
    disabled: boolean;
    warnMessage?: string;
  };
};
