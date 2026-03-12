# API Documentation - data.gov.rs Integration

## Overview

This document describes the data.gov.rs API integration for the Vizuelni Admin Srbije platform.

## data.gov.rs API Details

### Base Information

- **Base URL**: `https://data.gov.rs/api/1/`
- **API Version**: 1
- **API Spec**: `https://data.gov.rs/api/1/swagger.json`
- **Platform**: uData (CKAN-compatible)
- **Language Support**: Serbian (Cyrillic/Latin), English

### Platform Statistics

As of March 2026:
- **3,412** Datasets (Скупови података)
- **6,589** Resources (Ресурси)
- **74** Reuses (Примери употребе)
- **2,586** Users (Корисници)
- **155** Organizations (Организације)
- **123** Discussions (Дискусије)

## Available Endpoints

### Dataset Endpoints

#### List Datasets
```http
GET /datasets/
```

Query Parameters:
- `page` (int): Page number (default: 1)
- `page_size` (int): Items per page (default: 20)
- `q` (string): Search query
- `tag` (string): Filter by tag
- `organization` (string): Filter by organization
- `license` (string): Filter by license

Example Response:
```json
{
  "data": [
    {
      "id": "dataset-id",
      "title": "Dataset Title",
      "description": "Dataset description",
      "organization": {
        "id": "org-id",
        "name": "Organization Name"
      },
      "tags": ["tag1", "tag2"],
      "resources": [
        {
          "id": "resource-id",
          "title": "Resource Title",
          "format": "CSV",
          "url": "https://..."
        }
      ]
    }
  ],
  "total": 3412,
  "page": 1,
  "page_size": 20
}
```

#### Get Dataset
```http
GET /datasets/{dataset_id}/
```

#### Search Datasets
```http
GET /datasets/search/
```

### Organization Endpoints

#### List Organizations
```http
GET /organizations/
```

#### Get Organization
```http
GET /organizations/{org_id}/
```

### Reuse Endpoints

#### List Reuses
```http
GET /reuses/
```

## Data Categories

### 1. Јавне финансије (Public Finance)
- Budget data
- Financial reports
- Price registries
- Tax information

### 2. Мобилност (Mobility)
- Traffic accident data
- Transportation statistics
- Infrastructure projects
- Vehicle registrations

### 3. Образовање (Education)
- School directories
- Enrollment statistics
- Educational performance
- University data

### 4. Здравље (Health)
- Public health statistics
- Medical facilities
- Disease monitoring
- Health insurance data

### 5. Животна средина (Environment)
- Air quality monitoring
- Water quality data
- Environmental assessments
- Natural resource inventories

### 6. Управа (Public Administration)
- Administrative divisions
- Public services
- Government registries
- Civil service data

### 7. Рањиве групе (Vulnerable Groups)
- Social protection statistics
- Demographic data
- Support program data
- Accessibility information

### 8. Циљеви одрживог развоја (Sustainable Development Goals)
- UN SDG indicators
- Progress metrics
- Development targets
- Sustainability reports

## Featured Datasets

### Ценовници (Price Lists)
- **Description**: Product prices from 27 retail chains
- **Format**: CSV, JSON
- **Update Frequency**: Daily
- **Use Case**: Price comparison, inflation tracking

### Саобраћајне незгоде (Traffic Accidents)
- **Description**: Traffic accident data by police districts and municipalities
- **Format**: CSV, GeoJSON
- **Update Frequency**: Monthly
- **Use Case**: Safety analysis, infrastructure planning

### Квалитет ваздуха (Air Quality)
- **Description**: Real-time air quality monitoring from multiple stations
- **Format**: JSON API, CSV
- **Update Frequency**: Hourly
- **Use Case**: Environmental monitoring, health alerts

### Адресни регистар (Address Registry)
- **Description**: Official address database for Serbia
- **Format**: CSV, GeoJSON
- **Update Frequency**: Quarterly
- **Use Case**: Geolocation, administrative mapping

### Финансијски извештаји (Financial Reports)
- **Description**: Business financial statements and reports
- **Format**: XBRL, PDF, CSV
- **Update Frequency**: Annual
- **Use Case**: Economic analysis, business intelligence

## API Client Implementation

### TypeScript Client

```typescript
// lib/api/datagov-client.ts
import axios from 'axios';

const DATA_GOV_API_URL = process.env.NEXT_PUBLIC_DATA_GOV_API_URL || 'https://data.gov.rs/api/1';

const client = axios.create({
  baseURL: DATA_GOV_API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Cache implementation
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export const dataGovClient = {
  async getDatasets(params?: DatasetQueryParams) {
    const cacheKey = `datasets-${JSON.stringify(params)}`;
    const cached = cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.data;
    }
    
    const response = await client.get('/datasets/', { params });
    cache.set(cacheKey, { data: response.data, timestamp: Date.now() });
    return response.data;
  },
  
  async getDataset(id: string) {
    const response = await client.get(`/datasets/${id}/`);
    return response.data;
  },
  
  async searchDatasets(query: string) {
    const response = await client.get('/datasets/search/', {
      params: { q: query }
    });
    return response.data;
  },
  
  async getOrganizations() {
    const response = await client.get('/organizations/');
    return response.data;
  },
};
```

## Error Handling

The API client should handle these common errors:

- **404 Not Found**: Dataset or resource not found
- **429 Too Many Requests**: Rate limit exceeded (implement backoff)
- **500 Server Error**: Temporary server issues (retry with exponential backoff)
- **Timeout**: Request timeout (retry up to 3 times)

## Rate Limiting

- Default rate limit: 100 requests per minute
- Implement request queuing for bulk operations
- Use caching to minimize API calls
- Consider using webhooks for real-time updates (if available)

## Data Formats

### Supported Formats
- **CSV**: Most common for tabular data
- **JSON**: API responses and structured data
- **GeoJSON**: Geographic data for maps
- **XML**: Legacy data format
- **Excel/XLSX**: Spreadsheet data
- **PDF**: Documents and reports

### Data Transformations

The platform transforms raw API data into standardized formats:

```typescript
interface TransformedDataset {
  id: string;
  title: {
    sr: string;  // Serbian Cyrillic
    lat: string; // Serbian Latin
    en: string;  // English
  };
  description: {
    sr: string;
    lat: string;
    en: string;
  };
  organization: Organization;
  resources: Resource[];
  tags: string[];
  category: DataCategory;
  temporalCoverage?: DateRange;
  spatialCoverage?: GeographicArea;
  license: string;
  lastModified: Date;
}
```

## Best Practices

1. **Always cache responses** to reduce API load
2. **Handle language variants** properly (Cyrillic, Latin, English)
3. **Validate data** before processing
4. **Log errors** for debugging
5. **Monitor API health** and response times
6. **Respect rate limits** and implement backoff strategies

## Related Resources

- [data.gov.rs API Swagger Documentation](https://data.gov.rs/api/1/swagger.json)
- [uData Documentation](https://github.com/etalab/udata)
- [CKAN API Guide](https://docs.ckan.org/en/latest/api/)
