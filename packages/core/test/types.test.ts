import { describe, it, expectTypeOf } from "vitest";
import type { Datum, ChartData, Field } from "../src/types";

describe("Core Types", () => {
  it("Datum should accept record of values", () => {
    const datum: Datum = {
      x: new Date("2024-01-01"),
      y: 42,
      category: "A",
    };
    expectTypeOf(datum).toMatchTypeOf<Datum>();
  });

  it("Field should define field schema", () => {
    const field: Field = {
      name: "x",
      type: "date",
      title: "Date",
    };
    expectTypeOf(field).toMatchTypeOf<Field>();
  });

  it("ChartData should accept data and schema", () => {
    const chartData: ChartData = {
      data: [{ x: 1, y: 2 }],
      schema: {
        fields: [
          { name: "x", type: "number" },
          { name: "y", type: "number" },
        ],
      },
    };
    expectTypeOf(chartData).toMatchTypeOf<ChartData>();
  });
});
