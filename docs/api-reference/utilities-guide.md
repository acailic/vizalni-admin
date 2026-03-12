# Utilities API

Complete reference for all utility functions exported from
`@acailic/vizualni-admin/utils`.

## Overview

Utility functions for data transformation, formatting, and manipulation in
Vizualni Admin applications.

## Import

```typescript
// Import from main package
import {
  formatNumber,
  formatDate,
  transformData,
  normalizeData,
} from "@acailic/vizualni-admin";

// Import from sub-path (recommended for tree-shaking)
import {
  formatNumber,
  formatDate,
  transformData,
  normalizeData,
} from "@acailic/vizualni-admin/utils";
```

## Available Utilities

### Formatters

#### formatNumber

Format numbers according to locale conventions.

**Signature:**

```typescript
function formatNumber(value: number, options?: FormatNumberOptions): string;
```

**Parameters:**

- `value: number` - Number to format
- `options?: FormatNumberOptions` - Formatting options

**Options:**

```typescript
interface FormatNumberOptions {
  locale?: Locale;
  decimals?: number;
  currency?: string;
  unit?: string;
  notation?: "standard" | "compact" | "scientific";
}
```

**Returns:** Formatted number string

**Example:**

```typescript
import { formatNumber } from "@acailic/vizualni-admin/utils";

formatNumber(1234.56);
// "1.234,56" (using default locale)

formatNumber(1234.56, { locale: "sr-Latn" });
// "1.234,56"

formatNumber(1234.56, { locale: "en" });
// "1,234.56"

formatNumber(1234567, { notation: "compact", locale: "sr-Latn" });
// "1,2M"

formatNumber(1234.56, { currency: "RSD", locale: "sr-Latn" });
// "1.234,56 RSD"
```

#### formatDate

Format dates according to locale conventions.

**Signature:**

```typescript
function formatDate(
  value: Date | string | number,
  options?: FormatDateOptions
): string;
```

**Parameters:**

- `value: Date | string | number` - Date to format
- `options?: FormatDateOptions` - Formatting options

**Options:**

```typescript
interface FormatDateOptions {
  locale?: Locale;
  format?: "short" | "medium" | "long" | "full";
  timezone?: string;
}
```

**Returns:** Formatted date string

**Example:**

```typescript
import { formatDate } from "@acailic/vizualni-admin/utils";

formatDate(new Date());
// "12.01.2024." (using default locale)

formatDate(new Date(), { format: "long", locale: "sr-Cyrl" });
// "12. јануар 2024."

formatDate(new Date(), { format: "full", locale: "en" });
// "Friday, January 12, 2024"

formatDate("2024-01-12", { format: "short" });
// "12.01.2024."
```

### Data Transformers

#### transformData

Transform data structures for chart consumption.

**Signature:**

```typescript
function transformData(data: any[], transformation: DataTransformation): any[];
```

**Parameters:**

- `data: any[]` - Input data array
- `transformation: DataTransformation` - Transformation specification

**Transformation:**

```typescript
interface DataTransformation {
  // Field mappings
  map?: Record<string, string>;

  // Type conversions
  convert?: Record<string, "number" | "string" | "date" | "boolean">;

  // Filtering
  filter?: (item: any) => boolean;

  // Sorting
  sort?: {
    by: string;
    order?: "asc" | "desc";
  };

  // Aggregation
  aggregate?: {
    groupBy: string;
    measures: Record<string, "sum" | "avg" | "count" | "min" | "max">;
  };
}
```

**Returns:** Transformed data array

**Example:**

```typescript
import { transformData } from "@acailic/vizualni-admin/utils";

const rawData = [
  { godina: "2020", vrednost: "100" },
  { godina: "2021", vrednost: "120" },
];

const transformed = transformData(rawData, {
  map: {
    godina: "year",
    vrednost: "value",
  },
  convert: {
    year: "number",
    value: "number",
  },
});

// Result:
// [
//   { year: 2020, value: 100 },
//   { year: 2021, value: 120 }
// ]
```

## See Also

- [Chart Components](/api-reference/charts) - Chart component APIs
- [React Hooks](/api-reference/hooks) - Data fetching hooks
- [Core API](/api-reference/core) - Core functionality
