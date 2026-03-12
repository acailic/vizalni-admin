# DataGov.rs Client API

Complete reference for the DataGov.rs API client exported from
`@acailic/vizualni-admin/client`.

## Overview

The DataGov.rs client provides a TypeScript/JavaScript interface for accessing
the Serbian Open Data Portal (data.gov.rs) API.

## Import

```typescript
// Import from main package
import {
  DataGovRsClient,
  createDataGovRsClient,
  dataGovRsClient,
} from "@acailic/vizualni-admin";

// Import from sub-path (recommended for tree-shaking)
import {
  DataGovRsClient,
  createDataGovRsClient,
  dataGovRsClient,
} from "@acailic/vizualni-admin/client";
```

## Classes

### DataGovRsClient

Main client class for interacting with the DataGov.rs API.

#### Constructor

```typescript
constructor(config: DataGovRsConfig)
```

**Parameters:**

- `config: DataGovRsConfig` - Client configuration

**Configuration:**

```typescript
interface DataGovRsConfig {
  baseUrl?: string;
  apiKey?: string;
  timeout?: number;
  headers?: Record<string, string>;
}
```

**Example:**

```typescript
import { DataGovRsClient } from "@acailic/vizualni-admin/client";

const client = new DataGovRsClient({
  baseUrl: "https://data.gov.rs/api/1",
  apiKey: process.env.DATA_GOV_RS_API_KEY,
  timeout: 30000,
});
```

#### Methods

##### getDataset

Get a dataset by ID.

**Signature:**

```typescript
async getDataset(
  datasetId: string
): Promise<DatasetMetadata>
```

**Parameters:**

- `datasetId: string` - Dataset ID

**Returns:** Dataset metadata

**Example:**

```typescript
const dataset = await client.getDataset("dataset-id");
console.log(dataset.title);
console.log(dataset.description);
```

##### listResources

List all resources in a dataset.

**Signature:**

```typescript
async listResources(
  datasetId: string,
  options?: ListOptions
): Promise<Resource[]>
```

**Parameters:**

- `datasetId: string` - Dataset ID
- `options?: ListOptions` - List options

**Returns:** Array of resources

**Example:**

```typescript
const resources = await client.listResources("dataset-id", {
  limit: 10,
  offset: 0,
});

resources.forEach((resource) => {
  console.log(resource.name, resource.format);
});
```

##### getResource

Get a specific resource.

**Signature:**

```typescript
async getResource(
  resourceId: string
): Promise<Resource>
```

**Parameters:**

- `resourceId: string` - Resource ID

**Returns:** Resource details

**Example:**

```typescript
const resource = await client.getResource("resource-id");
console.log(resource.url);
console.log(resource.format);
```

##### fetchResourceData

Fetch data from a resource.

**Signature:**

```typescript
async fetchResourceData(
  resourceId: string,
  format?: 'json' | 'csv' | 'xml'
): Promise<any[]>
```

**Parameters:**

- `resourceId: string` - Resource ID
- `format?: 'json' | 'csv' | 'xml'` - Response format

**Returns:** Parsed data array

**Example:**

```typescript
const data = await client.fetchResourceData("resource-id", "json");
console.log(data); // Array of data objects
```

##### searchDatasets

Search for datasets.

**Signature:**

```typescript
async searchDatasets(
  params: SearchParams
): Promise<PaginatedResponse<DatasetMetadata>>
```

**Parameters:**

- `params: SearchParams` - Search parameters

**Returns:** Paginated response

**Example:**

```typescript
const results = await client.searchDatasets({
  q: "population",
  limit: 20,
  offset: 0,
});

console.log(results.total);
results.results.forEach((dataset) => {
  console.log(dataset.title);
});
```

##### listOrganizations

List all organizations.

**Signature:**

```typescript
async listOrganizations(
  options?: ListOptions
): Promise<Organization[]>
```

**Returns:** Array of organizations

**Example:**

```typescript
const orgs = await client.listOrganizations();
orgs.forEach((org) => {
  console.log(org.name, org.title);
});
```

## Factory Functions

### createDataGovRsClient

Create a configured DataGov.rs client instance.

**Signature:**

```typescript
function createDataGovRsClient(config?: DataGovRsConfig): DataGovRsClient;
```

**Parameters:**

- `config?: DataGovRsConfig` - Client configuration

**Returns:** Configured client instance

**Example:**

```typescript
import { createDataGovRsClient } from "@acailic/vizualni-admin/client";

const client = createDataGovRsClient({
  apiKey: process.env.DATA_GOV_RS_API_KEY,
});
```

### dataGovRsClient

Default client instance with default configuration.

**Type:** `DataGovRsClient`

**Example:**

```typescript
import { dataGovRsClient } from "@acailic/vizualni-admin/client";

// Use default client
const dataset = await dataGovRsClient.getDataset("dataset-id");
```

## Type Definitions

### DatasetMetadata

```typescript
interface DatasetMetadata {
  id: string;
  name: string;
  title: string;
  notes?: string;
  description?: string;
  owner: string;
  ownerOrganization?: string;
  author?: string;
  authorEmail?: string;
  maintainer?: string;
  maintainerEmail?: string;
  license?: string;
  licenseId?: string;
  tags?: string[];
  resources?: Resource[];
  created?: string;
  modified?: string;
  extras?: Record<string, any>;
}
```

### Resource

```typescript
interface Resource {
  id: string;
  packageId: string;
  name: string;
  description?: string;
  format: string;
  mimeType?: string;
  url: string;
  size?: number;
  created?: string;
  modified?: string;
  extras?: Record<string, any>;
}
```

### Organization

```typescript
interface Organization {
  id: string;
  name: string;
  title: string;
  description?: string;
  image_url?: string;
  created?: string;
  type?: string;
  isOrganization?: boolean;
  approvalStatus?: string;
  state?: string;
}
```

### SearchParams

```typescript
interface SearchParams {
  q?: string; // Search query
  fq?: string; // Filter query
  rows?: number; // Number of results
  start?: number; // Offset
  sort?: string; // Sort field
  order?: "asc" | "desc"; // Sort order
}
```

### PaginatedResponse

```typescript
interface PaginatedResponse<T> {
  count: number;
  total: number;
  results: T[];
  offset?: number;
  limit?: number;
}
```

### ApiError

```typescript
interface ApiError {
  message: string;
  status?: number;
  code?: string;
  details?: any;
}
```

### ListOptions

```typescript
interface ListOptions {
  limit?: number;
  offset?: number;
}
```

### DataGovRsConfig

```typescript
interface DataGovRsConfig {
  baseUrl?: string; // Default: 'https://data.gov.rs/api/1'
  apiKey?: string; // Optional API key
  timeout?: number; // Request timeout in ms
  headers?: Record<string, string>; // Additional headers
}
```

## Usage Examples

### Basic Usage

```typescript
import { createDataGovRsClient } from "@acailic/vizualni-admin/client";

const client = createDataGovRsClient({
  apiKey: process.env.DATA_GOV_RS_API_KEY,
});

// Get dataset
const dataset = await client.getDataset("budzet-srbije");
console.log(dataset.title);

// List resources
const resources = await client.listResources(dataset.id);

// Fetch data
const data = await client.fetchResourceData(resources[0].id);
console.log(data);
```

### Search

```typescript
import { dataGovRsClient } from "@acailic/vizualni-admin/client";

const results = await dataGovRsClient.searchDatasets({
  q: "population",
  rows: 20,
});

console.log(`Found ${results.total} datasets`);
results.results.forEach((dataset) => {
  console.log(`${dataset.title}: ${dataset.id}`);
});
```

### Error Handling

```typescript
import { createDataGovRsClient } from "@acailic/vizualni-admin/client";

const client = createDataGovRsClient();

try {
  const dataset = await client.getDataset("invalid-id");
} catch (error) {
  if (error.status === 404) {
    console.error("Dataset not found");
  } else {
    console.error("Error:", error.message);
  }
}
```

### Pagination

```typescript
async function getAllDatasets(query: string) {
  const client = createDataGovRsClient();
  const limit = 100;
  let offset = 0;
  const allDatasets = [];

  while (true) {
    const response = await client.searchDatasets({
      q: query,
      rows: limit,
      start: offset,
    });

    allDatasets.push(...response.results);

    if (offset + response.count >= response.total) {
      break;
    }

    offset += limit;
  }

  return allDatasets;
}
```

### React Integration

```typescript
import { useEffect, useState } from "react";
import { createDataGovRsClient } from "@acailic/vizualni-admin/client";

function useDataset(datasetId: string) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const client = createDataGovRsClient();

    async function fetchData() {
      try {
        setLoading(true);
        const dataset = await client.getDataset(datasetId);
        const resources = await client.listResources(datasetId);
        const resourceData = await client.fetchResourceData(resources[0].id);
        setData(resourceData);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [datasetId]);

  return { data, loading, error };
}
```

## Best Practices

1. **Use Factory Function**: Use `createDataGovRsClient()` for consistent
   configuration

   ```typescript
   const client = createDataGovRsClient({ apiKey: "xxx" });
   ```

2. **Error Handling**: Always handle API errors

   ```typescript
   try {
     const data = await client.fetchResourceData(id);
   } catch (error) {
     if (error.status === 404) {
       // Handle not found
     }
   }
   ```

3. **Pagination**: Use pagination for large datasets

   ```typescript
   const { results, total } = await client.searchDatasets({
     q: "query",
     rows: 100,
     start: 0,
   });
   ```

4. **Caching**: Implement caching for frequently accessed data

   ```typescript
   const cache = new Map();

   async function getCachedDataset(id: string) {
     if (cache.has(id)) {
       return cache.get(id);
     }

     const data = await client.getDataset(id);
     cache.set(id, data);
     return data;
   }
   ```

5. **Timeout**: Set appropriate timeouts
   ```typescript
   const client = createDataGovRsClient({
     timeout: 30000, // 30 seconds
   });
   ```

## See Also

- [React Hooks](/api-reference/hooks) - useDataGovRs hook
- [Utilities](/api-reference/utilities) - Data transformation utilities
- [Core API](/api-reference/core) - Configuration utilities
