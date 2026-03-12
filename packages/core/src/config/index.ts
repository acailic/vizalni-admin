/**
 * @vizualni/core - Config
 *
 * Chart configuration schemas and types using Zod for runtime validation.
 *
 * @module config
 * @public
 */

import { z } from "zod";

/**
 * Encoding field schema (x, y, segment, etc.).
 *
 * @internal
 */
const EncodingFieldSchema = z.object({
  /** Field name in data */
  field: z.string(),
  /** Field type */
  type: z.enum(["string", "number", "date", "boolean"]),
  /** Human-readable label */
  label: z.string().optional(),
  /** Custom format string */
  format: z.string().optional(),
});

/**
 * Encoding field configuration.
 *
 * @public
 */
export type EncodingField = z.infer<typeof EncodingFieldSchema>;

/**
 * Line chart configuration schema.
 *
 * @internal
 */
export const LineChartConfigSchema = z.object({
  type: z.literal("line"),
  x: EncodingFieldSchema,
  y: EncodingFieldSchema,
  segment: EncodingFieldSchema.optional(),
  /** Show dots on line */
  showDots: z.boolean().optional(),
  /** Curve type */
  curve: z.enum(["linear", "step", "cardinal", "monotone"]).optional(),
});

/**
 * Line chart configuration.
 *
 * @public
 */
export type LineChartConfig = z.infer<typeof LineChartConfigSchema>;

/**
 * Bar chart configuration schema.
 *
 * @internal
 */
export const BarChartConfigSchema = z.object({
  type: z.literal("bar"),
  x: EncodingFieldSchema,
  y: EncodingFieldSchema,
  segment: EncodingFieldSchema.optional(),
  /** Bar orientation */
  orientation: z
    .enum(["vertical", "horizontal"])
    .optional()
    .default("vertical"),
  /** Stack mode */
  stack: z.enum(["none", "stacked", "grouped"]).optional().default("none"),
});

/**
 * Bar chart configuration.
 *
 * @public
 */
export type BarChartConfig = z.infer<typeof BarChartConfigSchema>;

/**
 * Pie chart configuration schema.
 *
 * @internal
 */
export const PieConfigSchema = z.object({
  type: z.literal("pie"),
  value: EncodingFieldSchema,
  category: EncodingFieldSchema,
  /** Inner radius for donut charts (0-1 as proportion) */
  innerRadius: z.number().min(0).max(1).optional(),
});

/**
 * Pie chart configuration.
 *
 * @public
 */
export type PieConfig = z.infer<typeof PieConfigSchema>;

/**
 * Union of all chart configuration schemas.
 *
 * @internal
 */
export const ChartConfigSchema = z.discriminatedUnion("type", [
  LineChartConfigSchema,
  BarChartConfigSchema,
  PieConfigSchema,
]);

/**
 * Union of all chart configuration types.
 *
 * @public
 */
export type ChartConfig = z.infer<typeof ChartConfigSchema>;
