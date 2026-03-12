# 🚀 Quick Start Guide - Serbian Government Data Platform

## Prerequisites
- Node.js 18+ installed
- npm or yarn
- Git

## 1. Setup (5 minutes)

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/vizuelni-admin-srbije.git
cd vizuelni-admin-srbije

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

Open **http://localhost:3000** in your browser.

## 2. Using the API Client

### Basic Dataset Search
```typescript
import { dataGovAPI } from '@/lib/api/datagov-client';

// Search datasets
const response = await dataGovAPI.datasets.list({
  q: 'environment',          // Search query
  tag: ['life', 'nature'],   // Filter by tags
  organization: 'ministry',  // Filter by org
  page: 1,
  page_size: 20,
  sort: '-created'           // Sort by creation date (newest first)
});

console.log(response.data);      // Array of datasets
console.log(response.total);     // Total results
console.log(response.page_size); // Results per page
```

### Get Single Dataset
```typescript
const dataset = await dataGovAPI.datasets.get('dataset-slug-or-id');

console.log(dataset.title);
console.log(dataset.description);
console.log(dataset.resources);  // Downloadable files
console.log(dataset.organization);
```

### Search Organizations
```typescript
const orgs = await dataGovAPI.organizations.list({
  q: 'ministry',
  badge: 'certified',
  page: 1,
  page_size: 10
});
```

### Get Reuses (Data Applications)
```typescript
const reuses = await dataGovAPI.reuses.list({
  topic: 'environment_and_energy',
  type: 'visualization',
  sort: '-views'
});
```

## 3. Available Data Categories

### Tags for Filtering
- `javne-finansije` - Public Finance
- `mobilnost` - Mobility & Transport
- `obrazovanje` - Education
- `zdravlje` - Health
- `zivotna-sredina` - Environment
- `uprava` - Public Administration
- `ranjive-grupe` - Vulnerable Groups
- `ciljevi-odrzivog-razvoja` - Sustainable Development

### Example: Get Environment Datasets
```typescript
const envDatasets = await dataGovAPI.datasets.list({
  tag: 'zivotna-sredina',
  page_size: 50
});
```

## 4. Caching

The API client automatically caches responses for 5 minutes (configurable):

```typescript
// First call - fetches from API
const datasets1 = await dataGovAPI.datasets.list({ tag: 'health' });

// Second call within 5 minutes - returns cached data
const datasets2 = await dataGovAPI.datasets.list({ tag: 'health' });

// Clear cache manually
dataGovAPI.clearCache();
```

## 5. Error Handling

```typescript
import { DataGovAPIError } from '@/lib/api/datagov-client';

try {
  const dataset = await dataGovAPI.datasets.get('invalid-id');
} catch (error) {
  if (error instanceof DataGovAPIError) {
    console.error('API Error:', error.message);
    console.error('Status:', error.status);
    console.error('Endpoint:', error.endpoint);
  }
}
```

## 6. TypeScript Types

All API responses are fully typed:

```typescript
import type { 
  Dataset, 
  DatasetPage, 
  Organization,
  Resource,
  Reuse 
} from '@/types/datagov-api';

// TypeScript will autocomplete these properties
const dataset: Dataset = await dataGovAPI.datasets.get('some-id');
dataset.title;       // ✓
dataset.description; // ✓
dataset.resources;   // ✓ Resource[]
dataset.invalidProp; // ✗ TypeScript error
```

## 7. React Component Example

```typescript
import { useState, useEffect } from 'react';
import { dataGovAPI } from '@/lib/api/datagov-client';
import type { Dataset } from '@/types/datagov-api';

export function DatasetList() {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDatasets() {
      try {
        const response = await dataGovAPI.datasets.list({
          page: 1,
          page_size: 10,
          sort: '-created'
        });
        setDatasets(response.data);
      } catch (err) {
        setError('Failed to load datasets');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadDatasets();
  }, []);

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {datasets.map(dataset => (
        <div key={dataset.id} className="border rounded-lg p-4 hover:shadow-lg transition">
          <h3 className="font-bold text-lg mb-2">{dataset.title}</h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {dataset.description}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-600">
              {dataset.organization?.name || 'Unknown'}
            </span>
            <span className="text-sm text-gray-500">
              {dataset.resources.length} resources
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
```

## 8. Environment Variables

Required in `.env.local`:

```env
# Required
NEXT_PUBLIC_DATA_GOV_API_URL=https://data.gov.rs/api/1

# Optional (for maps)
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token

# Optional (for analytics)
NEXT_PUBLIC_GA_TRACKING_ID=your_ga_id
```

## 9. Testing

```bash
# Run all tests
npm test

# Run specific test file
npm test -- datagov-client.test.ts

# Run tests with coverage
npm run test:coverage
```

## 10. Common Tasks

### Add a New Dataset Card Component
```typescript
// src/components/DatasetCard.tsx
import type { Dataset } from '@/types/datagov-api';

interface DatasetCardProps {
  dataset: Dataset;
}

export function DatasetCard({ dataset }: DatasetCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
      <h3 className="text-xl font-bold mb-2">{dataset.title}</h3>
      <p className="text-gray-600 mb-4">{dataset.description}</p>
      <div className="flex gap-2">
        {dataset.tags.slice(0, 3).map(tag => (
          <span key={tag} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
```

### Fetch with Filters
```typescript
const datasets = await dataGovAPI.datasets.list({
  q: 'budget',
  tag: ['javne-finansije'],
  organization: 'ministry-of-finance',
  format: 'CSV',
  license: 'cc-by',
  temporal_coverage: '2024',
  page: 1,
  page_size: 20,
  sort: '-followers'  // Most popular first
});
```

### Get Dataset Resources
```typescript
const dataset = await dataGovAPI.datasets.get('budget-2024');

dataset.resources.forEach(resource => {
  console.log('Title:', resource.title);
  console.log('Format:', resource.format);
  console.log('URL:', resource.url);
  console.log('Size:', resource.filesize, 'bytes');
  console.log('Type:', resource.type); // 'main', 'documentation', 'api', etc.
});
```

## 11. Deployment

### Build for Production
```bash
npm run build
npm run start
```

### Docker
```bash
docker build -t vizuelni-admin-srbije .
docker run -p 3000:3000 vizuelni-admin-srbije
```

### Vercel (Recommended)
```bash
vercel --prod
```

## 12. Getting Help

- **Documentation**: Check `SETUP_COMPLETE.md` and `README.md`
- **API Reference**: https://data.gov.rs/api/1/swagger.json
- **Issues**: GitHub Issues tab
- **Data Portal**: https://data.gov.rs

## Quick Reference Card

| Task | Method |
|------|--------|
| Search datasets | `dataGovAPI.datasets.list({ q: 'term' })` |
| Get dataset | `dataGovAPI.datasets.get('id')` |
| List organizations | `dataGovAPI.organizations.list()` |
| Search autocomplete | `dataGovAPI.datasets.suggest('term')` |
| Get featured | `dataGovAPI.site.homeDatasets()` |
| Clear cache | `dataGovAPI.clearCache()` |

---

**That's it! You're ready to build! 🚀**

For detailed information, see:
- `SETUP_COMPLETE.md` - Full setup documentation
- `README.md` - Project overview
- `docs/API.md` - API documentation
- `CONTRIBUTING.md` - How to contribute