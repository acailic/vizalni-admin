# data.gov.rs API Documentation

## Overview

This document provides comprehensive documentation for integrating with the Serbian Open Data Portal API (data.gov.rs), which is built on the **udata** platform by Etalab.

**Base URLs:**
- **API v1**: `https://data.gov.rs/api/1`
- **API v2**: `https://data.gov.rs/api/2`
- **Swagger Spec**: `https://data.gov.rs/api/1/swagger.json`

## Authentication

Most endpoints are publicly accessible without authentication. However, rate limiting may apply.

### Rate Limits
- **Unauthenticated**: 100 requests/minute
- **Authenticated** (future): 1000 requests/minute

### API Key (Future)
```http
X-API-KEY: your_api_key_here
```

## Core Endpoints

### 1. Datasets

#### List All Datasets
```http
GET /datasets
```

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | integer | 1 | Page number |
| `page_size` | integer | 20 | Results per page (max 100) |
| `q` | string | - | Search query |
| `sort` | string | `-created` | Sort field (prefix with `-` for descending) |
| `organization` | string | - | Filter by organization ID |
| `topic` | string | - | Filter by topic |
| `tag` | string | - | Filter by tag |
| `license` | string | - | Filter by license ID |
| `format` | string | - | Filter by resource format |

**Response:**
```json
{
  "data": [
    {
      "id": "dataset-id",
      "title": "Наслов скупа података",
      "description": "Опис скупа података",
      "organization": {
        "id": "org-id",
        "name": "Назив организације",
        "logo": "https://...",
        "certified": true
      },
      "tags": ["tag1", "tag2"],
      "resources": [
        {
          "id": "resource-id",
          "title": "Resource title",
          "format": "CSV",
          "url": "https://...",
          "filesize": 1024,
          "mime": "text/csv"
        }
      ],
      "temporal_coverage": {
        "start": "2020-01-01",
        "end": "2023-12-31"
      },
      "spatial": {
        "granularity": "municipality",
        "zones": [" Serbia"]
      },
      "frequency": "monthly",
      "license": "cc-by",
      "created_at": "2024-01-15T10:30:00Z",
      "last_modified": "2024-03-01T14:20:00Z",
      "metrics": {
        "views": 1234,
        "downloads": 567,
        "reuses": 5
      }
    }
  ],
  "next_page": "https://data.gov.rs/api/1/datasets?page=2",
  "page": 1,
  "page_size": 20,
  "total": 3412
}
```

#### Get Single Dataset
```http
GET /datasets/{dataset_id}
```

**Response:** Single dataset object (see structure above)

#### Search Datasets
```http
GET /datasets/search
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `q` | string | Search query (full-text search) |
| `filters` | object | Faceted filters |
| `facets` | boolean | Include facet counts |

**Response:**
```json
{
  "data": [...],
  "facets": {
    "tags": [
      {"value": "finance", "count": 150},
      {"value": "health", "count": 89}
    ],
    "organizations": [
      {"value": "ministry-of-finance", "count": 45},
      {"value": "statistical-office", "count": 120}
    ],
    "formats": [
      {"value": "CSV", "count": 2500},
      {"value": "JSON", "count": 890},
      {"value": "XLSX", "count": 654}
    ]
  }
}
```

### 2. Organizations

#### List Organizations
```http
GET /organizations
```

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | integer | 1 | Page number |
| `page_size` | integer | 20 | Results per page |
| `q` | string | - | Search query |
| `sort` | string | `-created` | Sort field |

**Response:**
```json
{
  "data": [
    {
      "id": "org-id",
      "name": "Назив организације",
      "description": "Опис организације",
      "logo": "https://...",
      "certified": true,
      "metrics": {
        "datasets": 45,
        "followers": 123
      },
      "created_at": "2020-01-01T00:00:00Z"
    }
  ],
  "page": 1,
  "page_size": 20,
  "total": 155
}
```

#### Get Organization Details
```http
GET /organizations/{org_id}
```

#### Get Organization Datasets
```http
GET /organizations/{org_id}/datasets
```

### 3. Topics (Tags)

#### List Topics
```http
GET /topics
```

**Response:**
```json
[
  {
    "id": "javne-finansije",
    "name": "Јавне финансије",
    "slug": "javne-finansije",
    "description": "Подаци о јавним финансијама",
    "count": 245,
    "created_at": "2020-01-01T00:00:00Z"
  },
  {
    "id": "zdravlje",
    "name": "Здравље",
    "slug": "zdravlje",
    "description": "Подаци о здравству",
    "count": 189,
    "created_at": "2020-01-01T00:00:00Z"
  }
]
```

#### Get Topic Datasets
```http
GET /topics/{topic_id}/datasets
```

### 4. Reuses

#### List Reuses
```http
GET /reuses
```

**Response:**
```json
{
  "data": [
    {
      "id": "reuse-id",
      "title": "Наслов примене",
      "description": "Опис примене",
      "type": "visualization",
      "url": "https://...",
      "image": "https://...",
      "datasets": [
        {"id": "dataset-1", "title": "Dataset 1"}
      ],
      "tags": ["vizualizacija", "mapa"],
      "created_at": "2024-01-01T00:00:00Z",
      "metrics": {
        "views": 456,
        "datasets_count": 3
      }
    }
  ]
}
```

### 5. Resources

#### Download Resource
```http
GET /datasets/{dataset_id}/resources/{resource_id}
```

**Headers:**
```http
Accept: application/json
# or
Accept: text/csv
# or
Accept: application/xml
```

## Data Types

### Dataset Object
```typescript
interface Dataset {
  id: string;
  title: string;
  description: string;
  organization: Organization;
  tags: string[];
  resources: Resource[];
  temporal_coverage?: {
    start: string;
    end: string;
  };
  spatial?: {
    granularity: string;
    zones: string[];
  };
  frequency?: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'irregular';
  license: string;
  created_at: string;
  last_modified: string;
  metrics: {
    views: number;
    downloads: number;
    reuses: number;
  };
  archived: boolean;
  deleted: boolean;
}
```

### Organization Object
```typescript
interface Organization {
  id: string;
  name: string;
  description?: string;
  logo?: string;
  certified: boolean;
  metrics: {
    datasets: number;
    followers: number;
  };
  created_at: string;
}
```

### Resource Object
```typescript
interface Resource {
  id: string;
  title: string;
  description?: string;
  format: string; // CSV, JSON, XML, XLSX, PDF, etc.
  url: string;
  filesize?: number;
  mime: string;
  checksum?: {
    type: 'sha256' | 'md5';
    value: string;
  };
  created_at: string;
  last_modified: string;
  metrics: {
    views: number;
    downloads: number;
  };
}
```

## Search Syntax

### Full-Text Search
```
?q=budget
?q=saobraćajne nezgode
?q=COVID-19 vakcinacija
```

### Field-Specific Search
```
?q=title:budget
?q=organization:ministry-finance
?q=tag:zdravlje
```

### Boolean Operators
```
?q=budget AND finance
?q=health OR zdravlje
?q=transport NOT rail
```

### Range Queries
```
?q=created_at:[2023-01-01 TO 2024-12-31]
?q=filesize:[* TO 1048576]  # Files < 1MB
```

## Pagination

All list endpoints support cursor-based pagination:

```http
GET /datasets?page=2&page_size=50
```

**Response Headers:**
```http
X-Total-Count: 3412
X-Page: 2
X-Per-Page: 50
Link: <https://data.gov.rs/api/1/datasets?page=3>; rel="next",
      <https://data.gov.rs/api/1/datasets?page=1>; rel="prev",
      <https://data.gov.rs/api/1/datasets?page=69>; rel="last"
```

## Error Handling

### Error Response Format
```json
{
  "error": {
    "code": "NotFoundError",
    "message": "Dataset not found",
    "details": {
      "dataset_id": "invalid-id"
    }
  },
  "status_code": 404
}
```

### HTTP Status Codes
| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created (POST) |
| 204 | No Content (DELETE) |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 429 | Too Many Requests (Rate Limit) |
| 500 | Internal Server Error |
| 503 | Service Unavailable |

## Examples

### JavaScript/TypeScript Client
```typescript
import axios from 'axios';

const client = axios.create({
  baseURL: 'https://data.gov.rs/api/1',
  timeout: 30000,
});

// Get datasets with filters
async function getDatasets(topic: string) {
  const response = await client.get('/datasets', {
    params: {
      topic,
      page_size: 50,
      sort: '-created'
    }
  });
  return response.data;
}

// Search datasets
async function searchDatasets(query: string) {
  const response = await client.get('/datasets/search', {
    params: { q: query }
  });
  return response.data;
}

// Get organization details
async function getOrganization(orgId: string) {
  const response = await client.get(`/organizations/${orgId}`);
  return response.data;
}
```

### Using SWR in React
```typescript
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(r => r.json());

function useDatasets(topic: string) {
  const { data, error, isLoading } = useSWR(
    `https://data.gov.rs/api/1/datasets?topic=${topic}`,
    fetcher
  );
  
  return {
    datasets: data?.data || [],
    total: data?.total || 0,
    isLoading,
    error
  };
}
```

## Best Practices

### 1. Caching
- Cache responses for at least 1 hour
- Use ETag headers for conditional requests
- Implement client-side caching with SWR or React Query

### 2. Error Handling
```typescript
try {
  const datasets = await getDatasets('finance');
} catch (error) {
  if (axios.isAxiosError(error)) {
    if (error.response?.status === 429) {
      // Rate limited - wait and retry
      await sleep(60000);
      return retry();
    }
    if (error.response?.status === 404) {
      // Dataset not found
      return handleNotFound();
    }
  }
  // Generic error
  return handleError(error);
}
```

### 3. Pagination
- Always use pagination for list endpoints
- Default page_size is 20, max is 100
- Fetch only what you need

### 4. Performance
- Use field projection to reduce payload size
- Implement debounce for search (200-300ms)
- Prefetch next page for better UX

### 5. Internationalization
- Dataset titles and descriptions are primarily in Serbian (Cyrillic)
- Some datasets may have English translations
- Always handle both scripts (Cyrillic and Latin)

## Webhooks (Future Feature)

data.gov.rs may support webhooks for dataset updates:

```typescript
interface WebhookPayload {
  event: 'dataset.created' | 'dataset.updated' | 'dataset.deleted';
  timestamp: string;
  data: {
    dataset_id: string;
    changes?: string[];
  };
}
```

## Additional Resources

- **Swagger Documentation**: https://data.gov.rs/api/1/swagger.json
- **API Status Page**: https://status.data.gov.rs/
- **Developer Portal**: https://hub.data.gov.rs/
- **GitHub**: https://github.com/opendatateam/udata

## Changelog

### v1 API (Current)
- Initial public API
- Full dataset access
- Search capabilities
- Organization listings

### v2 API (Beta)
- GraphQL endpoint
- Real-time updates
- Enhanced filtering
- Bulk operations

---

**Last Updated**: March 11, 2026
**API Version**: 1.0
**Maintainer**: Office for IT and eGovernment (ITE)
