declare module "inquirer" {
  const inquirer: any;
  export = inquirer;
}

declare module "table" {
  export function table(data: any[], options?: any): string;
}

declare module "gzip-size" {
  const gzipSize: { sync(input: Buffer | string): number };
  export default gzipSize;
}

declare module "jest-axe" {
  export const configureAxe: any;
  export const toHaveNoViolations: any;
  export const axe: any;
}

declare module "react-grid-layout" {
  export type Layout = any;
  export type Layouts = any;
  export type ResponsiveProps = any;
  export type WidthProviderProps = any;
  export const Responsive: any;
  export const WidthProvider: any;
  const ReactGridLayout: any;
  export default ReactGridLayout;
}

declare module "use-debounce" {
  export function useDebounce<T>(value: T, delay?: number, options?: any): [T];
}

declare module "@/charts/shared/chart-props" {
  export type ChartWithFiltersProps = any;
  export type VisualizationProps = any;
  export type ChartProps<T = any> = any;
  export type BaseChartProps = any;
}

declare module "@braintree/sanitize-url" {
  export function sanitizeUrl(url: string): string;
}

declare module "ts-pattern" {
  export const match: any;
}

declare module "immer/dist/types/types-external" {
  export const WritableDraft: any;
}

declare module "react-inspector" {
  export const Inspector: any;
  export const ObjectInspector: any;
}

declare module "@uiw/react-color" {
  export const SketchPicker: any;
  export const hexToRgba: any;
  export const hexToHsva: any;
  export const hsvaToHex: any;
  export type HsvaColor = any;
  export const Hue: any;
  export const Saturation: any;
  export const Chrome: any;
}

declare module "@/config-types" {
  export type ColorMapping = any;
  export type Config = any;
  export type CustomPaletteType = any;
  export const convertDBTypeToPaletteType: any;
  export const convertPaletteTypeToDBType: any;
  export type TableColumn = any;
  export type TableFields = any;
  export type ColumnStyle = any;
  export type ConfiguratorStateConfiguringChart = any;
  export type ConfiguratorStatePublishing = any;
  export type ConfiguratorStatePublished = any;
  export type ConfiguratorStateSelectingDataSet = any;
  export type TableConfig = any;
  export type TableSortingOption = any;
  export type ChartType = any;
  export type ChartSubType = any;
  export type EncodingFieldType = any;
  export type GenericField = any;
  export type GenericFields = any;
  export type Filters = any;
  export type InteractiveFiltersConfig = any;
  export const isTableConfig: any;
  export const isAreaConfig: any;
  export const isMapConfig: any;
  export const isColorInConfig: any;
  export const isColorFieldInConfig: any;
  export const isSegmentInConfig: any;
  export const isComboChartConfig: any;
  export const isAnimationInConfig: any;
  export const isBarConfig: any;
  export const isColumnConfig: any;
  export const isLineConfig: any;
  export const isPieConfig: any;
  export const isScatterPlotConfig: any;
  export type AreaConfig = any;
  export type BarConfig = any;
  export type Limit = any;
  export type ChartConfig = any;
  export const decodeChartConfig: any;
  export type ChartSegmentField = any;
  export type AreaSegmentField = any;
  export type BarSegmentField = any;
  export type ColumnSegmentField = any;
  export type ColorScaleType = any;
  export type SortingType = any;
  export type SortingOrder = any;
  export type ColumnConfig = any;
  export type LineSegmentField = any;
  export type ComboLineColumnConfig = any;
  export type ComboLineDualConfig = any;
  export type ComboLineSingleConfig = any;
  export type LineConfig = any;
  export type ScaleType = any;
  export const fieldHasComponentId: any;
  export const getAnimationField: any;
  export const isSortingInConfig: any;
  export type AnimationField = any;
  export type ImputationType = any;
  export type InteractiveFiltersLegend = any;
  export type InteractiveFiltersDataConfig = any;
  export type InteractiveFiltersTimeRange = any;
  export type ConfiguratorState = any;

  // Additional exports to support compilation
  export const ANIMATION_FIELD_SPEC: any;
  export const CHART_GRID_ROW_COUNT: any;
  export const categoricalPalettes: any;
  export const divergingPalettes: any;
  export const sequentialPalettes: any;
  export type ShowDotsSize = "Small" | "Medium" | "Large" | undefined;
  export type Cube = any;
  export type MapConfig = any;
  export type MapFields = any;
  export type PieConfig = any;
  export type ScatterPlotConfig = any;
  export type BBox = any;
  export type BaseLayer = any;
  export type MapSymbolLayer = any;
  export type NumericalColorField = any;
  export type CategoricalColorField = any;
  export type FixedColorField = any;
  export type PaletteType = any;
  export type DivergingPaletteType = any;
  export type SequentialPaletteType = any;
  export type PieFields = any;
  export type PieSegmentField = any;
  export type BarFields = any;
  export type ColumnFields = any;
  export type AreaFields = any;
  export type LineFields = any;
  export type ScatterPlotFields = any;
  export type ScatterPlotSegmentField = any;
  export type ComboLineDualFields = any;
  export type ComboLineSingleFields = any;
  export type ComboLineColumnFields = any;
  export type GenericChartConfig = any;
  export type InteractiveFiltersCalculation = any;
  export type RegularChartConfig = any;
  export type WMSCustomLayer = any;
  export type WMTSCustomLayer = any;
  export type DataSource = any;
  export type DashboardFiltersConfig = any;
  export type LayoutBlock = any;
  export type ColorField = any;
  export type ColorFieldType = any;
  export type ColorScaleInterpolationType = any;
  export const ColorPicker: any;
  export type ComponentType = any;
  export const SortingField: any;
  export const Checkbox: any;
  export const Radio: any;
  export const RadioGroup: any;
  export const Select: any;
  export const CheckboxProps: any;
  export const FormControlLabel: any;
  export const ChartOptionRadioField: any;
  export const ChartOptionField: any;
  export const ChartFieldField: any;
  export const ChartAnnotatorTabField: any;
  export type Annotation = any;
  export type AnnotationTarget = any;
  export const addDatasetInConfig: any;
  export const removeDatasetFromConfig: any;
  export type ColumnStyleCategory = any;
  export type ComboChartConfig = any;
  export type ConversionUnit = any;
  export type CalculationType = any;
  export const IMPUTATION_TYPES: any;
  export type FilterValueSingle = any;
  export type AnimationType = any;
  export type ConfiguratorStateLayouting = any;
  export const CONFIGURATOR_STATE_LAYOUTING: any;
  export type InteractiveDataFilterType = any;
  export type MetaKey = any;
  export const enableLayouting: any;
  export type ReactGridLayoutType = any;
  export type FilterValueMulti = any;
  export type SingleFilters = any;
  export type FilterValue = any;
  export type TableLinks = any;
  export type Layout = any;
  export type LayoutType = any;
  export type LayoutDashboard = any;
  export type LayoutTextBlock = any;
  export type Meta = any;
  export type DashboardTimeRangeFilter = any;
  export const supportsAnnotations: any;
  export type HighlightAnnotation = any;
  export const decodeConfiguratorState: any;
  export type SingleColorField = any;
}

declare module "@/configurator/constants" {
  export const FIELD_VALUE_NONE: any;
}

declare module "@/palettes" {
  export const getDefaultCategoricalPalette: any;
  export const getDefaultCategoricalPaletteId: any;
  export const getDefaultDivergingSteppedPalette: any;
  export const DEFAULT_CATEGORICAL_PALETTE_ID: any;
  export const getPalette: any;
  export const createDivergingInterpolator: any;
  export const createSequentialInterpolator: any;
  export const getColorInterpolator: any;
  export type Palette<T = any> = any;
  export const categoricalPalettes: any;
  export const divergingSteppedPalettes: any;
  export const sequentialPalettes: any;
  export const divergingPalettes: any;
  export type ColorItem = any;
  export const getDefaultColorValues: any;
  export const ColorsByType: any;
}

declare module "@testing-library/react-hooks" {
  export const renderHook: any;
}

declare module "@visual-regression-tracker/sdk" {
  export const VisualRegressionTracker: any;
}

declare module "d3-zoom" {
  export const zoom: any;
  export const zoomIdentity: any;
  export type ZoomTransform = any;
}

declare module "isomorphic-unfetch" {
  const fetch: any;
  export default fetch;
}

declare module "node-fetch" {
  const fetch: any;
  export default fetch;
}

declare module "react-dom/client" {
  export const hydrateRoot: any;
}

declare module "@/configurator/components/ui-helpers" {
  export const getTimeIntervalFormattedSelectOptions: any;
  export const getTimeIntervalWithProps: any;
}

declare module "@/components/auth/LoginForm" {
  export const LoginForm: any;
}

declare module "@/components/charts/ChartBuilder" {
  export const ChartBuilder: any;
}

declare module "@/components/dashboard/Dashboard" {
  export const Dashboard: any;
}

declare module "@/components/data/DatasetExplorer" {
  export const DatasetExplorer: any;
}

declare module "@/config-types/config-types" {
  export * from "@/config-types";
}

declare module "@/configurator/configurator-state" {
  export const isConfiguring: any;
  export const useConfiguratorState: any;
  export const hasChartConfigs: any;
  export const isLayouting: any;
  export const addDatasetInConfig: any;
  export const removeDatasetInConfig: any;
  export const ConfiguratorStateProvider: any;
  export const initChartStateFromCube: any;
  export const initChartStateFromChartEdit: any;
  export const getFiltersByMappingStatus: any;
  export const moveFilterField: any;
  export const saveChartLocally: any;
  export const getChartOptionField: any;
  export type GetConfiguratorStateAction = any;
  export const getFilterValue: any;
  export const getPreviousState: any;
  export const getStateWithCurrentDataSource: any;
}

declare module "@/configurator/components/ui-helpers" {
  export const mapValueIrisToColor: any;
  export const useOrderedTableColumns: any;
  export const getOrderedTableColumns: any;
  export const extractDataPickerOptionsFromDimension: any;
  export const parseDate: any;
  export const useErrorMeasure: any;
  export const useErrorRange: any;
  export const useErrorVariable: any;
  export const mkNumber: any;
  export const getIconName: any;
  export const timeUnitToFormatter: any;
  export const timeUnitToParser: any;
  export const getComponentDescription: any;
  export const getComponentLabel: any;
  export const canUseAbbreviations: any;
}

declare module "@/configurator/config-form" {
  export type FieldProps = any;
  export type Option = any;
  export const getNewChartConfig: any;
  export const useActiveChartField: any;
  export const useAddOrEditChartType: any;
  export const isMultiFilterFieldChecked: any;
  export const useActiveLayoutField: any;
  export const useChartFieldField: any;
  export const useChartOptionBooleanField: any;
  export const useChartOptionRadioField: any;
  export const useChartOptionSelectField: any;
  export const useChartOptionSliderField: any;
  export const useMetaField: any;
  export const useMultiFilterContext: any;
  export const useSingleFilterField: any;
  export const useSingleFilterSelect: any;
}

declare module "@/icons" {
  export const Icon: any;
  export type IconName = any;
  export const getChartIcon: any;
}

declare module "@/configurator/components/chart-controls/color-palette" {
  export const ColorPalette: any;
  export const ColorSquare: any;
}

declare module "@/configurator/components/chart-controls/section" {
  export const ControlSection: any;
  export const ControlSectionContent: any;
  export const SectionTitle: any;
  export const useControlSectionContext: any;
  export const ControlSectionSkeleton: any;
  export const useSectionTitleStyles: any;
}

declare module "@/configurator/components/filters" {
  export const DimensionValuesMultiFilter: any;
  export const DimensionValuesSingleFilter: any;
  export const TimeFilter: any;
  export const sortFilterValue: any;
  export const sortFilterValues: any;
  export const getHasColorMapping: any;
}

declare module "@/configurator/components/field" {
  export const ChartOptionCheckboxField: any;
  export const ChartOptionSelectField: any;
  export const ColorPickerField: any;
  export const FieldLabel: any;
  export const LoadingIndicator: any;
  export const MetaInputField: any;
  export const ChartAnnotatorTabField: any;
  export const LayoutAnnotatorTabField: any;
  export const TextBlockInputField: any;
  export const ColorPicker: any;
  export const ControlTabField: any;
  export const DataFilterSelect: any;
  export const DataFilterTemporal: any;
  export const OnOffControlTabField: any;
  export const dimensionToFieldProps: any;
  export const ChartFieldField: any;
  export const ChartOptionSwitchField: any;
  export const ChartOptionRadioField: any;
  export const ChartOptionSliderField: any;
  export const TimeInput: any;
  export const MultiFilterField: any;
  export const ShowValuesMappingField: any;
  export const SingleFilterField: any;
}

declare module "@/configurator/components/field-i18n" {
  export const ChartOptionFieldI18n: any;
  export const getFieldLabel: any;
}

declare module "@/configurator/table/table-chart-sorting-options" {
  export const TableSortingOptions: any;
}

declare module "@/configurator/table/table-config-state" {
  export const updateIsGroup: any;
  export const updateIsHidden: any;
  export const removeSortingOption: any;
  export const changeSortingOptionOrder: any;
  export const updateSortingOption: any;
  export const moveSortingOption: any;
  export const addSortingOption: any;
  export const changeSortingOption: any;
  export const moveSortingOptions: any;
  export const moveFields: any;
  export type TableSortingOption = any;
  export type TableConfig = any;
}

declare module "@/components/form" {
  export const Checkbox: any;
  export const Radio: any;
  export const RadioGroup: any;
  export const Select: any;
  export const SearchField: any;
  export const FormControlLabel: any;
  export const Switch: any;
  export const Input: any;
  export const MarkdownInput: any;
  export type CheckboxProps = any;
  export type SearchFieldProps = any;
  export const getSelectOptions: any;
  export const Label: any;
  export const SelectOption: any;
  export const SelectOptionGroup: any;
  export const selectSizeToTypography: any;
  export type SelectOption = any;
  export type SelectOptionGroup = any;
  export const DisabledMessageIcon: any;
  export const selectMenuProps: any;
  export const Slider: any;
}

declare module "@/components/hint" {
  export const HintError: any;
  export const HintInfo: any;
  export const HintWarning: any;
  export const Loading: any;
  export const LoadingDataError: any;
  export const LoadingOverlay: any;
  export const NoDataHint: any;
  export const NoGeometriesHint: any;
  export const Error: any;
  export const InlineLoading: any;
  export const Spinner: any;
  export const OnlyNegativeDataHint: any;
  export const ChartUnexpectedError: any;
  export const PublishSuccess: any;
}

declare module "@/components/visually-hidden" {
  export const VisuallyHidden: any;
}

declare module "@/components/chart-shared" {
  export const useChartStyles: any;
  export const DISABLE_SCREENSHOT_COLOR_WIPE_ATTR: any;
  export const ChartControls: any;
  export const ChartMoreButton: any;
  export const DuplicateChartMenuActionItem: any;
  export const CHART_GRID_ROW_COUNT: any;
}

declare module "@/utils/use-event" {
  export const useEvent: any;
}

declare module "@/config-utils" {
  export const getChartConfig: any;
  export const useLimits: any;
  export const useChartConfigFilters: any;
  export const useDefinitiveFilters: any;
  export const useDefinitiveTemporalFilterValue: any;
  export const extractSingleFilters: any;
  export const getChartConfigFilters: any;
  export const getAxisDimension: any;
  export const getMaybeValidChartConfigLimit: any;
  export const getSupportsLimitSymbols: any;
  export const isSingleFilters: any;
  export const makeMultiFilter: any;
}

declare module "@/charts/chart-config-ui-options" {
  export type EncodingFieldType = any;
  export const EncodingFieldType: any;
  export const getChartSpec: any;
  export const ANIMATION_FIELD_SPEC: any;
  export type EncodingSpec = any;
  export type EncodingOptionChartSubType = any;
  export type EncodingOption = any;
  export type EncodingSortingOption = any;
  export const getChartFieldChangeSideEffect: any;
  export const getChartFieldDeleteSideEffect: any;
  export const getChartFieldOptionChangeSideEffect: any;
}

declare module "@/graphql/query-hooks" {
  export type RelatedDimensionType = any;
  export type TimeUnit = any;
  export type ScaleType = any;
  export const RelatedDimensionType: any;
  export const TimeUnit: any;
  export const ScaleType: any;
  export type SearchCubeResult = any;
  export type DataCubePublicationStatus = any;
  export type DataCubeOrganization = any;
  export type DataCubeTermset = any;
  export type DataCubeTheme = any;
  export const SearchCubeResultOrder: any;
  export type SearchCubeResultOrder = any;
  export const SearchCubeFilterType: any;
  export type SearchCubeFilterType = any;
  export const SearchCubeFilter: any;
  export type SearchCubeFilter = any;
  export const useDataCubeMetadataQuery: any;
  export const useSearchCubesQuery: any;
  export type DataCubeObservationFilter = any;
  export const useDataCubeDimensionGeoShapesQuery: any;
  export const useDataCubeComponentsQuery: any;
  export const useDataCubesComponentsQuery: any;
  export const useDataCubeComponentTermsetsQuery: any;
  export const DataCubeComponentsQuery: any;
  export type DataCubeComponentsQuery = any;
  export type DataCubeComponentFilter = any;
  export const DataCubeComponentsDocument: any;
  export type DataCubeComponentsQueryVariables = any;
  export type DataCubeObservationsQuery = any;
  export type DataCubeObservationsQueryVariables = any;
  export type Exact<T = any> = any;
  export type DataCubeUnversionedIriDocument = any;
  export const DataCubeUnversionedIriQuery: any;
  export type DataCubeUnversionedIriQueryVariables = any;
  export const DataCubeLatestIriDocument: any;
  export const DataCubeLatestIriQuery: any;
  export type DataCubeLatestIriQueryVariables = any;
  export const DataCubeUnversionedIriDocument: any;
  export const useDataCubeUnversionedIriQuery: any;
  export const PossibleFiltersDocument: any;
  export type DataCubeComponentTermsetsQueryVariables = any;
  export type PossibleFiltersQuery = any;
  export type PossibleFiltersQueryVariables = any;
  export type PossibleFilterValue = any;
  export const DataCubePreviewDocument: any;
  export type DataCubePreviewQuery = any;
  export type DataCubePreviewQueryVariables = any;
  export type DataCubeMetadataQuery = any;
  export type DataCubeMetadataQueryVariables = any;
  export const useDataCubePreviewQuery: any;
  export const DataCubePublicationStatus: any;
}

declare module "@/intervals" {
  export const getTimeInterval: any;
}

declare type $IntentionalAny = any;
declare const $IntentionalAny: any;

// Workaround for chart-props module resolution issues
declare module "@/charts/shared/chart-props" {
  export type DimensionsById = any;
  export type MeasuresById = any;
}

declare global {
  interface Window {
    gtag?: (
      command: string,
      action: string,
      options?: Record<string, any>
    ) => void;
  }
}
