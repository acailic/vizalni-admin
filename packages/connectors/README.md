# @vizualni/connectors

Data connectors for @vizualni. Fetch and parse data from CSV, JSON, and custom
sources.

## Installation

```bash
npm install @vizualni/connectors @vizualni/core
# or
yarn add @vizualni/connectors @vizualni/core
```

## Connectors

### CSV Connector

Parse CSV data with automatic type inference.

```typescript
import { csvConnector } from "@vizualni/connectors";

const result = await csvConnector.fetch({
  url: "https://example.com/data.csv",
  delimiter: ",", // optional, default: ','
  header: true, // optional, default: true
});

console.log(result.data); // Array of parsed records
console.log(result.schema); // Inferred field types
```

### JSON Connector

Fetch JSON data with optional nested path extraction.

```typescript
import { jsonConnector } from "@vizualni/connectors";

// Simple JSON array
const result = await jsonConnector.fetch({
  url: "https://api.example.com/data",
});

// Nested data extraction
const nested = await jsonConnector.fetch({
  url: "https://api.example.com/data",
  path: "results.items", // Extract nested array
  headers: {
    // Custom headers
    Authorization: "Bearer token",
  },
});
```

## Connector Interface

Create custom connectors:

```typescript
import type { DataConnector, ConnectorResult } from "@vizualni/connectors";

const myConnector: DataConnector<MyConfig> = {
  type: "my-connector",

  async fetch(config: MyConfig): Promise<ConnectorResult> {
    const response = await fetch(config.url);
    if (!response.ok) {
      throw new Error(`Failed: ${response.status}`);
    }
    const data = await response.json();

    return {
      data,
      schema: {
        fields: [
          { name: "id", type: "string" },
          { name: "value", type: "number" },
        ],
      },
    };
  },
};
```

## Data Schema

Connectors return a schema describing the data:

```typescript
interface DataSchema {
  fields: FieldSchema[];
}

interface FieldSchema {
  name: string;
  type: "string" | "number" | "date" | "boolean";
  title?: string;
  description?: string;
}
```

## Error Handling

Connectors throw descriptive errors:

```typescript
try {
  await csvConnector.fetch({ url: "missing.csv" });
} catch (error) {
  // Error: Failed to fetch CSV: 404 Not Found
}
```

## License

MIT
