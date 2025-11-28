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

declare module "@mui/material" {
  export type BoxProps = any;
  export type SxProps = any;
  export type Theme = any;
  const content: any;
  export = content;
}

declare module "@mui/styles" {
  const content: any;
  export = content;
}

declare module "@mui/icons-material" {
  const content: any;
  export = content;
}

declare module "@mui/lab" {
  const content: any;
  export = content;
}

declare module "@mui/lab/themeAugmentation" {
  const content: any;
  export = content;
}

declare module "@mui/material/styles" {
  const content: any;
  export = content;
}

declare module "@mui/material/styles/createTypography" {
  const content: any;
  export = content;
}

declare module "@mui/material/styles/shadows" {
  const content: any;
  export = content;
}

declare module "@mui/material/Button" {
  const content: any;
  export = content;
}

declare module "@mui/material/InputBase" {
  const content: any;
  export = content;
}

declare module "@mui/material/Typography" {
  const content: any;
  export = content;
}

declare module "use-debounce" {
  export function useDebounce<T>(value: T, delay?: number): [T];
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

declare module "@hello-pangea/dnd" {
  export const DragDropContext: any;
  export const Droppable: any;
  export const Draggable: any;
  export type OnDragEndResponder = any;
  export type DraggableLocation = any;
  export type DraggableProvided = any;
  export type DraggableStateSnapshot = any;
  export type DroppableProvided = any;
  export type DroppableStateSnapshot = any;
}

declare module "immer" {
  const produce: any;
  export default produce;
}

declare module "@uiw/react-color" {
  export const SketchPicker: any;
}

declare module "@/config-types" {
  export type ColorMapping = any;
  export type CustomPaletteType = any;
  export type TableColumn = any;
  export type TableFields = any;
  export type ColumnStyle = any;
  export type ConfiguratorStateConfiguringChart = any;
  export type TableConfig = any;
  export type TableSortingOption = any;
  export type ChartType = any;
  export type EncodingFieldType = any;
  export type GenericField = any;
  export type GenericFields = any;
  export type Filters = any;
  export type InteractiveFiltersConfig = any;
  export const isTableConfig: any;
}

declare module "@/configurator/constants" {
  export const FIELD_VALUE_NONE: any;
}

declare module "@/domain/data" {
  export type Component = any;
  export type Dimension = any;
  export type Measure = any;
  export type DimensionValue = any;
  export const isDimension: any;
  export const isNumericalMeasure: any;
  export const isTemporalDimension: any;
  export const isTemporalEntityDimension: any;
  export const isJoinByComponent: any;
  export const getTemporalEntityValue: any;
  export type Observation = any;
  export type TemporalDimension = any;
  export type TemporalEntityDimension = any;
}

declare module "@/palettes" {
  export const getDefaultCategoricalPalette: any;
  export const getDefaultCategoricalPaletteId: any;
  export const getDefaultDivergingSteppedPalette: any;
  export const DEFAULT_CATEGORICAL_PALETTE_ID: any;
  export const getPalette: any;
}

declare module "@/configurator/configurator-state" {
  export const isConfiguring: any;
  export const useConfiguratorState: any;
}

declare module "@/configurator/components/ui-helpers" {
  export const mapValueIrisToColor: any;
  export const useOrderedTableColumns: any;
}

declare module "@/configurator/config-form" {
  export type FieldProps = any;
}

declare module "@/icons" {
  export const Icon: any;
  export type IconName = any;
}

declare module "@/configurator/components/chart-controls/color-palette" {
  export const ColorPalette: any;
}

declare module "@/configurator/components/chart-controls/section" {
  export const ControlSection: any;
  export const ControlSectionContent: any;
  export const SectionTitle: any;
}

declare module "@/configurator/components/filters" {
  export const DimensionValuesMultiFilter: any;
  export const DimensionValuesSingleFilter: any;
  export const TimeFilter: any;
}

declare module "@/configurator/components/field" {
  export const ChartOptionCheckboxField: any;
  export const ChartOptionSelectField: any;
  export const ColorPickerField: any;
}

declare module "@/configurator/components/field-i18n" {
  export const ChartOptionFieldI18n: any;
  export const getFieldLabel: any;
}

declare module "@/configurator/configurator-state" {
  export const useConfiguratorState: any;
  export const isConfiguring: any;
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
  export type TableSortingOption = any;
  export type TableConfig = any;
}

declare module "@/components/form" {
  export const Checkbox: any;
  export const Radio: any;
  export const RadioGroup: any;
  export const Select: any;
}

declare module "@/components/hint" {
  export const HintError: any;
}

declare module "@/components/visually-hidden" {
  export const VisuallyHidden: any;
}

declare module "@/utils/use-event" {
  const useEvent: any;
  export { useEvent };
}

declare module "@/config-utils" {
  export const getChartConfig: any;
}

declare module "@/charts/chart-config-ui-options" {
  export type EncodingFieldType = any;
  export const EncodingFieldType: any;
}

declare module "@/graphql/query-hooks" {
  export type RelatedDimensionType = any;
  export type TimeUnit = any;
  export const RelatedDimensionType: any;
  export const TimeUnit: any;
}

declare module "@/intervals" {
  export const getTimeInterval: any;
}

declare module "@mui/material" {
  export const Box: any;
  export const Button: any;
  export const Typography: any;
  export type SelectChangeEvent = any;
  export type BoxProps = any;
  export type SxProps = any;
  export type Theme = any;
  const content: any;
  export = content;
}

declare module "@mui/styles" {
  export const makeStyles: any;
}

declare module "@mui/material/styles" {
  export const createTheme: any;
}

declare type $IntentionalAny = any;
declare const $IntentionalAny: any;
