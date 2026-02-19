import { z } from "zod";

const fieldSchema = z.object({
  componentId: z.string(),
});

export const barChartSchema = z.object({
  key: z.string(),
  chartType: z.literal("bar"),
  cubeIri: z.string().url(),
  fields: z.object({
    x: fieldSchema,
    y: fieldSchema,
    segment: fieldSchema.optional(),
  }),
  sorting: z
    .object({
      sortingType: z.enum(["byDimensionLabel", "byMeasure", "byAuto"]),
      sortingOrder: z.enum(["asc", "desc"]),
    })
    .optional(),
});

export type BarChartConfig = z.infer<typeof barChartSchema>;

export const getInitialBarConfig = (cubeIri: string): BarChartConfig => ({
  key: Math.random().toString(36).slice(2),
  chartType: "bar",
  cubeIri,
  fields: {
    x: { componentId: "" },
    y: { componentId: "" },
  },
});
