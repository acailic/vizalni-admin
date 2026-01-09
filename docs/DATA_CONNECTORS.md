# Data Connectors

The Data Connectors system provides a standardized interface for fetching data
from various sources beyond data.gov.rs. This enables you to integrate with CSV
files, CKAN instances, Socrata APIs, databases, and other data sources using a
consistent API.

## Overview

The connector system consists of:

- **Connector Interface** - A generic `IDataConnector` interface that all
  connectors implement
- **Connector Registry** - Central registry for managing and creating connector
  instances
- **Built-in Connectors** - Included connectors like CSV URL
- **Custom Connectors** - Ability to create your own connectors

## Installation

Connectors are exported from the main package:

```bash
npm install @acailic/vizualni-admin
```

```typescript
// Import connectors
import {
  CsvUrlConnector,
  ConnectorRegistry,
  createConnector,
  listConnectors,
} from "@acailic/vizualni-admin/connectors";
```

## Quick Start

### Using the CSV URL Connector

```typescript
import { CsvUrlConnector } from "@acailic/vizualni-admin/connectors";

// Create a connector instance
const connector = new CsvUrlConnector({
  id: "my-csv-data",
  name: "My CSV Data",
  url: "https://example.com/data.csv",
  timeout: 10000,
});

// Initialize and fetch data
await connector.initialize();
const result = await connector.fetch();
console.log(result.data); // Array of parsed CSV rows

// Get schema information
const schema = await connector.getSchema();
console.log(schema.columns); // List of column names
console.log(schema.columnTypes); // Type information for each column
```

### Using the Registry

```typescript
import {
  ConnectorRegistry,
  createConnector,
  listConnectors,
} from "@acailic/vizualni-admin/connectors";

// List available connector types
const types = listConnectors();
console.log("Available connectors:", types);

// Create a connector using the registry
const connector = createConnector("csv-url", {
  id: "my-data",
  name: "My Data",
  url: "https://example.com/data.csv",
});

// Fetch data
const result = await connector.fetch();
```

## Connector Interface

All connectors implement the `IDataConnector` interface:

```typescript
interface IDataConnector<TConfig extends BaseConnectorConfig = any> {
  readonly config: TConfig;
  readonly capabilities: ConnectorCapabilities;

  initialize?(): Promise<void>;
  healthCheck?(): Promise<HealthCheckResult>;
  fetch(): Promise<ConnectorResult<unknown[]>>;
  fetchPaginated?(params: PaginationParams): Promise<PaginatedResult<unknown>>;
  getSchema?(): Promise<DataSchema>;
  testConnection?(): Promise<boolean>;
  destroy?(): Promise<void> | void;
}
```

### Configuration

All connectors accept a base configuration:

```typescript
interface BaseConnectorConfig {
  id: string; // Unique identifier
  name: string; // Human-readable name
  description?: string; // Optional description
  timeout?: number; // Request timeout in ms (default: 10000)
  maxRetries?: number; // Max retry attempts (default: 3)
  debug?: boolean; // Enable debug logging (default: false)
}
```

### Capabilities

Each connector declares its capabilities:

```typescript
interface ConnectorCapabilities {
  supportsPagination: boolean;
  supportsFiltering: boolean;
  supportsSorting: boolean;
  supportsRealtime: boolean;
  supportedFormats: string[];
}
```

## Built-in Connectors

### CSV URL Connector

Fetches and parses CSV data from a URL.

#### Configuration

```typescript
interface CsvUrlConnectorConfig extends BaseConnectorConfig {
  url: string; // URL to fetch CSV from
  delimiter?: string; // CSV delimiter (default: ",")
  hasHeader?: boolean; // First row contains headers (default: true)
  quoteChar?: string; // Quote character (default: '"')
  escapeChar?: string; // Escape character (default: '"')
  skipEmptyLines?: boolean; // Skip empty lines (default: true)
  maxFileSize?: number; // Max file size in bytes (default: 10485760)
}
```

#### Example

```typescript
import { CsvUrlConnector } from "@acailic/vizualni-admin/connectors";

const connector = new CsvUrlConnector({
  id: "population-data",
  name: "Population Data",
  description: "Population statistics by region",
  url: "https://data.example.com/population.csv",
  delimiter: ",",
  hasHeader: true,
  maxFileSize: 5 * 1024 * 1024, // 5MB
});

// Fetch data
const { data } = await connector.fetch();

// Data is returned as an array of objects
// [
//   { region: 'Belgrade', population: 1680000, year: 2023 },
//   { region: 'Novi Sad', population: 350000, year: 2023 },
//   ...
// ]

// Get schema
const schema = await connector.getSchema();
// {
//   columns: ['region', 'population', 'year'],
//   columnTypes: { region: 'string', population: 'integer', year: 'integer' },
//   nullableColumns: []
// }

// Health check
const health = await connector.healthCheck();
console.log(health.healthy); // true/false
console.log(health.message); // Status message
```

#### Error Handling

```typescript
try {
  const result = await connector.fetch();
} catch (error) {
  if (error instanceof ConnectorError) {
    switch (error.code) {
      case "NETWORK_ERROR":
        console.error("Network error:", error.message);
        break;
      case "TIMEOUT":
        console.error("Request timeout:", error.message);
        break;
      case "FILE_TOO_LARGE":
        console.error("File too large:", error.message);
        break;
      case "PARSING_ERROR":
        console.error("CSV parsing error:", error.message);
        break;
      default:
        console.error("Unknown error:", error.message);
    }
  }
}
```

## Creating Custom Connectors

You can create custom connectors by implementing the `IDataConnector` interface.

### Example: JSON API Connector

```typescript
import type {
  IDataConnector,
  BaseConnectorConfig,
  ConnectorResult,
  ConnectorCapabilities,
  DataSchema,
  DataType,
} from "@acailic/vizualni-admin/connectors";

interface JsonApiConfig extends BaseConnectorConfig {
  apiUrl: string;
  apiKey?: string;
}

class JsonApiConnector implements IDataConnector<JsonApiConfig> {
  readonly config: JsonApiConfig;
  readonly capabilities: ConnectorCapabilities;

  constructor(config: JsonApiConfig) {
    this.config = config;
    this.capabilities = {
      supportsPagination: true,
      supportsFiltering: true,
      supportsSorting: false,
      supportsRealtime: false,
      supportedFormats: ["json"],
    };
  }

  async fetch(): Promise<ConnectorResult<unknown[]>> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (this.config.apiKey) {
      headers["Authorization"] = `Bearer ${this.config.apiKey}`;
    }

    const response = await fetch(this.config.apiUrl, {
      headers,
      signal: AbortSignal.timeout(this.config.timeout || 10000),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return { data };
  }

  async getSchema(): Promise<DataSchema> {
    // Fetch a sample to detect schema
    const { data } = await this.fetch();
    if (!Array.isArray(data) || data.length === 0) {
      return {
        columns: [],
        columnTypes: {},
        nullableColumns: [],
      };
    }

    const sample = data[0];
    const columns = Object.keys(sample);
    const columnTypes: Record<string, DataType> = {};
    const nullableColumns: string[] = [];

    columns.forEach((col) => {
      const value = sample[col];
      columnTypes[col] = this.detectType(value);
      if (value === null || value === undefined) {
        nullableColumns.push(col);
      }
    });

    return { columns, columnTypes, nullableColumns };
  }

  private detectType(value: unknown): DataType {
    if (value === null || value === undefined) return "unknown";
    if (typeof value === "boolean") return "boolean";
    if (typeof value === "number")
      return Number.isInteger(value) ? "integer" : "number";
    if (typeof value === "string") {
      if (!isNaN(Date.parse(value))) return "date";
      return "string";
    }
    return "unknown";
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.fetch();
      return true;
    } catch {
      return false;
    }
  }

  destroy(): void {
    // Cleanup if needed
  }
}
```

### Registering Custom Connectors

```typescript
import { ConnectorRegistry } from "@acailic/vizualni-admin/connectors";

// Register your custom connector
ConnectorRegistry.register(
  "json-api",
  (config) => new JsonApiConnector(config),
  {
    description: "Fetch JSON data from REST APIs",
    schema: "https://example.com/schema/json-api-connector.json",
  }
);

// Use your connector
const connector = ConnectorRegistry.create("json-api", {
  id: "my-json-api",
  name: "My JSON API",
  url: "https://api.example.com/data",
  apiKey: process.env.API_KEY,
});

const result = await connector.fetch();
```

## Connector Registry

The connector registry provides a central way to manage connectors.

### API

```typescript
// Register a connector type
ConnectorRegistry.register(type, factory, metadata?)

// Unregister a connector type
ConnectorRegistry.unregister(type): boolean

// Create a connector instance
ConnectorRegistry.create(type, config): IDataConnector

// Get an existing instance
ConnectorRegistry.getInstance(id): IDataConnector | undefined

// Destroy an instance
ConnectorRegistry.destroyInstance(id): boolean

// Check if a type is registered
ConnectorRegistry.has(type): boolean

// List all registered types
ConnectorRegistry.list(): string[]

// Get metadata for all connectors
ConnectorRegistry.listMetadata(): Array<{type, description?, schema?}>

// Clear all registrations and instances
ConnectorRegistry.clear(): void
```

### Convenience Functions

```typescript
import {
  registerConnector,
  unregisterConnector,
  createConnector,
  getConnector,
  listConnectors,
  destroyConnector,
} from "@acailic/vizualni-admin/connectors";

// These are aliases to ConnectorRegistry methods
registerConnector("my-type", factory, metadata);
const connector = createConnector("my-type", config);
const types = listConnectors();
```

## Error Handling

All connectors throw `ConnectorError` with standardized error codes:

| Error Code             | Description                       |
| ---------------------- | --------------------------------- |
| `NETWORK_ERROR`        | Network connection failed         |
| `TIMEOUT`              | Request timed out                 |
| `PARSING_ERROR`        | Failed to parse data              |
| `AUTHENTICATION_ERROR` | Authentication failed             |
| `AUTHORIZATION_ERROR`  | Not authorized to access resource |
| `NOT_FOUND`            | Resource not found (404)          |
| `RATE_LIMIT_EXCEEDED`  | Rate limit exceeded               |
| `INVALID_REQUEST`      | Invalid request parameters        |
| `UNSUPPORTED_FORMAT`   | Unsupported data format           |
| `UNKNOWN_ERROR`        | Unknown error                     |

```typescript
import { ConnectorError } from "@acailic/vizualni-admin/connectors";

try {
  await connector.fetch();
} catch (error) {
  if (error instanceof ConnectorError) {
    console.error(`Error ${error.code}: ${error.message}`);
    console.error("Details:", error.details);
  }
}
```

## Data Types

Connectors support the following data types:

- `string` - Text values
- `number` - Floating-point numbers
- `integer` - Whole numbers
- `boolean` - true/false values
- `date` - Date values (ISO 8601)
- `datetime` - Date-time values (ISO 8601)
- `json` - JSON-encoded strings
- `unknown` - Unknown or null values

## Best Practices

### 1. Always Check Health Before Use

```typescript
const health = await connector.healthCheck();
if (!health.healthy) {
  console.error("Connector unhealthy:", health.message);
  return;
}
```

### 2. Handle Errors Gracefully

```typescript
try {
  const result = await connector.fetch();
  // Process data
} catch (error) {
  if (error instanceof ConnectorError) {
    // Handle specific error types
  }
}
```

### 3. Clean Up Resources

```typescript
// When done with a connector
if (connector.destroy) {
  await connector.destroy();
}

// Or use the registry
destroyConnector(connector.config.id);
```

### 4. Use Timeouts

Always set appropriate timeouts for network requests:

```typescript
const connector = new CsvUrlConnector({
  // ... other config
  timeout: 30000, // 30 seconds
});
```

### 5. Enable Debug Logging for Development

```typescript
const connector = new CsvUrlConnector({
  // ... other config
  debug: true,
});
```

## Roadmap

Future connectors planned for implementation:

### CKAN Connector

- Fetch data from CKAN data portals
- Support for CKAN API v3
- Dataset and resource metadata
- Search and filtering capabilities

### Socrata Connector

- Integration with Socrata Open Data API
- SoQL query support
- Dataset metadata
- Pagination support

### Database Connector

- Direct database connections
- Support for PostgreSQL, MySQL, SQLite
- SQL query execution
- Connection pooling

### Google Sheets Connector

- Fetch data from Google Sheets
- OAuth2 authentication
- Sheet and range selection
- Real-time updates

### Additional CSV Formats

- Excel file support (.xlsx)
- TSV (Tab-Separated Values)
- Custom delimiters
- Encoding detection

## Contributing

To contribute a new connector:

1. Create the connector class implementing `IDataConnector`
2. Add comprehensive error handling
3. Include schema detection if applicable
4. Write TypeScript types for configuration
5. Add examples to this documentation
6. Register the connector in the registry

See the existing connectors for reference implementations.

## Related Documentation

- [API Documentation](./API.md) - Full API reference
- [Architecture](./ARCHITECTURE.md) - System architecture
- [Getting Started](./GETTING-STARTED.md) - Quick start guide
- [Data.gov.rs Client](../app/exports/client.ts) - Data.gov.rs API client source

## License

BSD-3-Clause - See LICENSE file for details.
