# Data.gov.rs Integration Documentation

## Overview

This document provides comprehensive documentation for integrating with Serbia's Open Data Portal (data.gov.rs), which powers the Vizuelni Admin Srbije platform.

## Platform Information

### Technology Stack
- **Platform**: udata (open-source data portal platform by Etalab)
- **Version**: udata 10.1.4.dev0, udata-front 1.2.4.dev0
- **Base URL**: https://data.gov.rs
- **API Versions**: 
  - `/api/1/` - Legacy API (v1)
  - `/api/2/` - Current API (v2)

### Portal Statistics (as of March 2026)
- **Datasets**: 3,412
- **Resources**: 6,589
- **Organizations**: 155
- **Users**: 2,586
- **Reuse Examples**: 74
- **Discussions**: 123

## API Endpoints

### Base URLs
```
Production: https://data.gov.rs
API v1: https://data.gov.rs/api/1/
API v2: https://data.gov.rs/api/2/
Swagger Spec: https://data.gov.rs/api/1/swagger.json
```

### Authentication
The portal uses CSRF token-based authentication for write operations. Most read operations are publicly accessible without authentication.

```http
CSRF-Token: [token_value]
```

### Common Endpoints

#### Datasets
```http
GET /api/1/datasets/
GET /api/1/datasets/{id}/
GET /api/1/datasets/{id}/resources/
POST /api/1/datasets/ (requires auth)
```

#### Organizations
```http
GET /api/1/organizations/
GET /api/1/organizations/{id}/
GET /api/1/organizations/{id}/datasets/
```

#### Reuse Examples
```http
GET /api/1/reuses/
GET /api/1/reuses/{id}/
```

#### Topics
```http
GET /api/1/topics/
GET /api/1/topics/{id}/
```

## Data Categories/Topics

The portal organizes data into the following thematic categories:

1. **Јавне финансије** (Public Finance)
2. **Мобилност** (Mobility)
3. **Образовање** (Education)
4. **Рањиве групе** (Vulnerable Groups)
5. **Управа** (Administration)
6. **Здравље** (Health)
7. **Животна средина** (Environment)
8. **Циљеви одрживог развоја** (Sustainable Development Goals)

## Featured Datasets

### High-Value Datasets

1. **АПИ за Регистар привредних друштава** (Business Registry API)
   - Organization: Агенција за привредне регистре (APR)
   - Resources: 2
   - Certified: ✅

2. **Подаци о саобраћајним незгодама** (Traffic Accident Data)
   - Organization: Министарство унутрашњих послова (MUP)
   - Resources: 12
   - Reuse Examples: 3
   - Certified: ✅

3. **КВАЛИТЕТ ВАЗДУХА (АПИ)** (Air Quality API)
   - Organization: Агенција за заштиту животне средине
   - Resources: 1
   - Certified: ✅

4. **Адресни регистар** (Address Registry)
   - Organization: Републички геодетски завод
   - Resources: 4
   - Certified: ✅

5. **Ценовници по уредби** (Price Lists by Decree)
   - Multiple retailers (27 trading chains)
   - Resources: Multiple
   - Updated: Daily

## Data Formats

The portal supports various data formats:
- **CSV**: Most common format
- **JSON**: API responses and structured data
- **XML**: Some legacy datasets
- **XLS/XLSX**: Excel spreadsheets
- **GeoJSON**: Geographic data
- **PDF**: Documentation and reports

## Integration Examples

### Fetching Datasets

```typescript
// Example: Fetch all datasets
const response = await fetch('https://data.gov.rs/api/1/datasets/', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
  },
});

const data = await response.json();
```

### Filtering by Organization

```typescript
// Example: Get datasets from a specific organization
const orgId = 'your-org-id';
const response = await fetch(
  `https://data.gov.rs/api/1/organizations/${orgId}/datasets/`
);
```

### Search

```typescript
// Example: Search datasets
const query = 'буџет';
const response = await fetch(
  `https://data.gov.rs/api/1/datasets/?q=${encodeURIComponent(query)}`
);
```

## Rate Limiting

The portal does not explicitly publish rate limits. However, it's recommended to:
- Implement caching for frequently accessed data
- Use appropriate delays between requests
- Respect server resources

## Data Quality

### Certification System

Datasets from certified organizations display a certification badge:
```html
<span class="certified" title="Идентитет овог јавног сервиса је сертификован од стране data.gov.rs">
  <!-- Badge SVG -->
</span>
```

### Data Freshness

Each dataset includes metadata about:
- Last update date
- Update frequency (Daily, Weekly, Monthly, etc.)
- Temporal coverage
- Spatial granularity (Country, Region, Municipality)

## Key Organizations

### Government Agencies
1. **Агенција за привредне регистре (APR)** - Business Registry Agency
2. **Министарство унутрашњих послова (MUP)** - Ministry of Interior
3. **Републички завод за статистику (RZS)** - Statistical Office
4. **Агенција за заштиту животне средине** - Environmental Protection Agency
5. **Републички геодетски завод (RGZ)** - Republic Geodetic Authority

## Best Practices

### 1. Error Handling
Always implement proper error handling:
```typescript
try {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();
  return data;
} catch (error) {
  console.error('API Error:', error);
  // Implement retry logic or fallback
}
```

### 2. Caching
Use Next.js built-in caching:
```typescript
// Next.js 14 App Router
export const revalidate = 3600; // Revalidate every hour

async function getDatasets() {
  const res = await fetch('https://data.gov.rs/api/1/datasets/');
  return res.json();
}
```

### 3. Language Support
The portal supports:
- `sr` - Serbian Cyrillic
- `sl` - Serbian Latin
- Include language parameter in URLs when needed

### 4. Metadata Handling
Always respect and preserve dataset metadata:
- License information
- Attribution requirements
- Update timestamps
- Data quality indicators

## Related Portals

1. **Open Data Hub**: https://hub.data.gov.rs/
   - Developer resources
   - Documentation
   - Tools

2. **ГеоСрбија (GeoSerbia)**: https://download.geosrbija.rs/
   - Geographic data
   - Maps
   - Spatial datasets

3. **РЗС Open Data**: https://opendata.stat.gov.rs/
   - Statistical data
   - Census information
   - Economic indicators

4. **Повереник (Commissioner)**: https://data.poverenik.rs/
   - Access to information
   - Data protection

5. **МПН (Education Ministry)**: https://opendata.mpn.gov.rs/
   - Education statistics
   - School data

6. **EU Data Portal**: https://data.europa.eu/
   - European datasets
   - Cross-border data

## Support and Resources

- **API Documentation**: https://data.gov.rs/rs/apidoc
- **Terms of Use**: https://data.gov.rs/terms
- **Contact**: opendata@ite.gov.rs
- **Twitter**: @kancelarijaITE
- **LinkedIn**: /company/kancelarija-ite/
- **RSS Feeds**: 
  - Recent datasets: /sr/datasets/recent.atom
  - Recent reuses: /sr/reuses/recent.atom

## Implementation Notes

### Client Implementation
See `src/lib/api/datagov-client.ts` for our implementation of the API client with:
- Automatic retry logic
- Rate limiting
- Caching
- Error handling
- TypeScript types

### Data Transformation
See `src/lib/api/datagov.ts` for data transformation utilities:
- Response normalization
- Data cleaning
- Format conversion
- Localization support

## Updates and Maintenance

This documentation is based on data.gov.rs as of March 2026. For the latest information:
1. Check the portal directly
2. Review the API changelog
3. Monitor the RSS feeds for new datasets
4. Follow the Open Data Hub for announcements

---

Last Updated: March 11, 2026
