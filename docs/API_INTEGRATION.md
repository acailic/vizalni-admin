# Data.gov.rs API Integration Guide

**Водич за интеграцију са data.gov.rs АПИ-јем**

---

## 📋 Overview

Complete guide for integrating with the official Serbian government open data API.

**API Version:** 1.0  
**Base URL:** `https://data.gov.rs/api/1/`  
**Swagger Docs:** https://data.gov.rs/api/1/swagger.json

---

## 1. Quick Start

### Environment Setup

```env
# .env.local
DATA_GOV_RS_API_URL=https://data.gov.rs/api/1
DATA_GOV_RS_API_KEY=your_api_key_here  # Optional
DATA_GOV_RS_API_TIMEOUT=30000
```

### Basic Usage

```typescript
import { dataGovClient } from '@/lib/api/datagov-client';

// Get datasets
const datasets = await dataGovClient.getDatasets({
  page: 1,
  page_size: 20
});

// Get specific dataset
const dataset = await dataGovClient.getDataset('dataset-id');

// Search datasets
const results = await dataGovClient.searchDatasets('саобраћај');
```

---

## 2. API Client Implementation

### Core Client

```typescript
// lib/api/datagov-client.ts
export class DataGovRSClient {
  private baseURL = process.env.DATA_GOV_RS_API_URL || 'https://data.gov.rs/api/1';
  
  async getDatasets(params?: {
    q?: string;
    organization?: string;
    topic?: string;
    page?: number;
    page_size?: number;
  }) {
    const response = await fetch(`${this.baseURL}/datasets/?${new URLSearchParams(params)}`);
    return response.json();
  }
  
  async getDataset(id: string) {
    const response = await fetch(`${this.baseURL}/datasets/${id}/`);
    return response.json();
  }
  
  async getResourceData(resourceId: string, limit = 100) {
    const response = await fetch(
      `${this.baseURL}/datastore/search/${resourceId}?limit=${limit}`
    );
    return response.json();
  }
  
  async getOrganizations() {
    const response = await fetch(`${this.baseURL}/organizations/`);
    return response.json();
  }
  
  async getTopics() {
    const response = await fetch(`${this.baseURL}/topics/`);
    return response.json();
  }
}

export const dataGovClient = new DataGovRSClient();
```

---

## 3. React Query Hooks

### Custom Hooks

```typescript
// hooks/useDatasets.ts
import { useQuery } from '@tanstack/react-query';
import { dataGovClient } from '@/lib/api/datagov-client';

export function useDatasets(params?: any) {
  return useQuery({
    queryKey: ['datasets', params],
    queryFn: () => dataGovClient.getDatasets(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useDataset(id: string) {
  return useQuery({
    queryKey: ['dataset', id],
    queryFn: () => dataGovClient.getDataset(id),
    enabled: !!id,
  });
}

export function useResourceData(resourceId: string, limit?: number) {
  return useQuery({
    queryKey: ['resource', resourceId, limit],
    queryFn: () => dataGovClient.getResourceData(resourceId, limit),
    enabled: !!resourceId,
  });
}
```

### Component Usage

```typescript
// components/DatasetBrowser.tsx
import { useDatasets } from '@/hooks/useDatasets';

export function DatasetBrowser() {
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = useDatasets({ page, page_size: 20 });
  
  if (isLoading) return <Spinner />;
  if (error) return <Error error={error} />;
  
  return (
    <div>
      {data.data.map(dataset => (
        <DatasetCard key={dataset.id} dataset={dataset} />
      ))}
      <Pagination total={data.total} onPageChange={setPage} />
    </div>
  );
}
```

---

## 4. API Endpoints Reference

### Datasets

```
GET /api/1/datasets/                  # List all datasets
GET /api/1/datasets/{id}               # Get dataset details
GET /api/1/datasets/?q={query}         # Search datasets
GET /api/1/datasets/?organization={id} # Filter by organization
GET /api/1/datasets/?topic={id}        # Filter by topic
```

### Organizations

```
GET /api/1/organizations/             # List organizations
GET /api/1/organizations/{id}          # Get organization details
```

### Topics

```
GET /api/1/topics/                    # List topics
GET /api/1/topics/{id}                 # Get topic details
```

### Datastore (Actual Data)

```
GET /api/1/datastore/info/{resource_id}     # Resource metadata
GET /api/1/datastore/search/{resource_id}   # Query data
```

### Query Parameters

```
page: Page number (default: 1)
page_size: Items per page (default: 20, max: 100)
q: Search query
organization: Filter by organization ID
topic: Filter by topic ID
format: Filter by format (csv, json, xlsx)
sort: Sort field (created, modified, title)
```

---

## 5. Popular Datasets

### Traffic Accidents
```typescript
const TRAFFIC_DATASET = 'podatsi-o-saobratshajnim-nezgodama';
// Contains data about traffic accidents by police districts and municipalities
```

### Business Registry
```typescript
const BUSINESS_REGISTRY = 'api-za-registar-privrednikh-drushtava';
// API for Registry of Business Entities
```

### Air Quality
```typescript
const AIR_QUALITY = 'kvalitet-vazdukha-api';
// Real-time air quality measurements
```

### Address Registry
```typescript
const ADDRESS_REGISTRY = 'adresni-registar';
// Official address database
```

---

## 6. Error Handling

```typescript
// lib/api/error-handler.ts
export class DataGovAPIError extends Error {
  constructor(public status: number, message: string) {
    super(`API Error ${status}: ${message}`);
  }
}

// Usage in API client
async request<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${this.baseURL}${endpoint}`);
  
  if (!response.ok) {
    throw new DataGovAPIError(
      response.status,
      response.statusText
    );
  }
  
  return response.json();
}

// React component error handling
const { data, error } = useDatasets();

if (error instanceof DataGovAPIError) {
  return <div>API Error: {error.message}</div>;
}
```

---

## 7. Caching Strategy

### React Query Configuration

```typescript
// app/providers.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,     // Data fresh for 5 minutes
      gcTime: 60 * 60 * 1000,       // Cache kept for 1 hour
      refetchOnWindowFocus: false,  // Don't refetch on tab switch
      retry: 2,                     // Retry failed requests twice
    },
  },
});
```

### Server-Side Caching (Optional)

```typescript
// For API routes with Redis
export async function GET(request: Request) {
  const cacheKey = `dataset-${id}`;
  const cached = await redis.get(cacheKey);
  
  if (cached) {
    return Response.json(JSON.parse(cached));
  }
  
  const data = await dataGovClient.getDataset(id);
  await redis.setex(cacheKey, 3600, JSON.stringify(data));
  
  return Response.json(data);
}
```

---

## 8. Rate Limiting

The data.gov.rs API has rate limits. Implement client-side throttling:

```typescript
// lib/api/rate-limiter.ts
export class RateLimiter {
  private requests: number[] = [];
  private limit = 60; // 60 requests per minute
  
  async waitForSlot(): Promise<void> {
    const now = Date.now();
    this.requests = this.requests.filter(time => now - time < 60000);
    
    if (this.requests.length >= this.limit) {
      const waitTime = 60000 - (now - this.requests[0]);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
    
    this.requests.push(now);
  }
}
```

---

## 9. Testing

### Mock Client

```typescript
// __mocks__/datagov-client.ts
export const mockDataGovClient = {
  getDatasets: jest.fn().mockResolvedValue({
    data: [{ id: '1', title: 'Test Dataset' }],
    total: 1
  }),
  getDataset: jest.fn().mockResolvedValue({
    id: '1',
    title: 'Test Dataset'
  })
};
```

### Test Example

```typescript
// __tests__/useDatasets.test.ts
import { renderHook } from '@testing-library/react';
import { useDatasets } from '@/hooks/useDatasets';

jest.mock('@/lib/api/datagov-client');

test('fetches datasets', async () => {
  const { result } = renderHook(() => useDatasets());
  await waitFor(() => expect(result.current.isSuccess).toBe(true));
  expect(result.current.data).toBeDefined();
});
```

---

## 10. Best Practices

### ✅ Do's

- Use React Query for caching and state management
- Implement proper error handling
- Set appropriate cache times
- Use TypeScript types
- Handle loading and error states
- Implement pagination for large datasets
- Test your integration

### ❌ Don'ts

- Don't fetch in useEffect without caching
- Don't ignore errors
- Don't hardcode URLs
- Don't skip TypeScript types
- Don't fetch all data at once

---

## 11. Support & Resources

- **API Documentation:** https://data.gov.rs/api/1/swagger.json
- **Data Portal:** https://data.gov.rs
- **Contact:** opendata@ite.gov.rs
- **GitHub Issues:** Report bugs and request features

---

**Document Status:** Complete ✅  
**Last Updated:** March 11, 2026
