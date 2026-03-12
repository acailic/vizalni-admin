# GitHub Pages Deployment

This guide explains how to deploy Vizualni Admin to GitHub Pages, including
setup, configuration, deployment, dynamic route workarounds, and
troubleshooting.

## Overview

The project is configured to automatically deploy to GitHub Pages when changes
are pushed to the `main` branch. The site will be available at:

`https://acailic.github.io/vizualni-admin/`

## 1. Initial Setup

### Request and Implementation

The setup was implemented in response to a request to enable GitHub Pages for
showcasing data visualizations from data.gov.rs.

### Files Created

1. **`.github/workflows/deploy-github-pages.yml`** - GitHub Actions workflow for
   automatic deployment
2. **`docs/GITHUB_PAGES.md`** - This comprehensive deployment guide
3. **`app/public/.nojekyll`** - Ensures GitHub Pages serves files with
   underscores correctly

### Files Modified

1. **`app/next.config.js`** - Added GitHub Pages detection via
   `NEXT_PUBLIC_BASE_PATH`, configured static export mode, set base path and
   asset prefix, disabled image optimization for static export, and disabled
   i18n routing for static mode
2. **`package.json`** - Added `build:static` script for GitHub Pages builds
3. **`README.md`** - Added live demo link in header and GitHub Pages deployment
   section
4. **`QUICKSTART.md`** - Added live demo section at the top

### Enabling GitHub Pages

To enable GitHub Pages for this repository:

1. Go to repository **Settings** → **Pages**
2. Under **Source**, select **GitHub Actions**
3. Save the configuration

The next push to `main` will automatically deploy the site.

### Features Available on GitHub Pages

✅ **Working:**

- Static chart visualizations
- Browse datasets from data.gov.rs API
- Create visualizations
- Interactive filtering
- Responsive design
- Multilingual support
- Export charts

❌ **Not Available (requires server/database):**

- Saving chart configurations
- User authentication
- Database-backed features
- Server-side rendering
- API routes

## 2. Configuration

### Build Process

The GitHub Actions workflow:

1. Checks out the code
2. Installs Node.js and dependencies
3. Compiles translations (`yarn locales:compile`)
4. Builds Rollup bundle
5. Builds static export with `NEXT_PUBLIC_BASE_PATH=/vizualni-admin`
6. Uploads to GitHub Pages
7. Deploys automatically

### Next.js Export Configuration

The `next.config.js` is configured to detect when building for GitHub Pages:

```javascript
const isGitHubPages = process.env.NEXT_PUBLIC_BASE_PATH !== undefined;
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

module.exports = {
  output: isGitHubPages ? "export" : "standalone",
  basePath: basePath,
  assetPrefix: basePath,
  images: {
    unoptimized: isGitHubPages,
  },
  // ...
};
```

When `NEXT_PUBLIC_BASE_PATH` is set:

- Output mode: `export` (static files)
- Base path: `/vizualni-admin`
- Asset prefix: `/vizualni-admin`
- Images: unoptimized (required for static export)
- i18n: disabled (not compatible with static export)

### Environment Variables

GitHub Pages builds use:

- `NEXT_PUBLIC_BASE_PATH=/vizualni-admin` - Sets the base path for assets
- `NEXT_PUBLIC_VERSION` - Populated from package.json
- `NEXT_PUBLIC_GITHUB_REPO` - Populated from package.json

### URL Structure

- Repository: `https://github.com/acailic/vizualni-admin`
- GitHub Pages: `https://acailic.github.io/vizualni-admin/`
- Base path: `/vizualni-admin`

### API Integration

When deployed to GitHub Pages, the app will connect to data.gov.rs API for
fetching datasets. Make sure any API keys are properly configured as GitHub
repository secrets if needed.

## 3. Deployment

### Automatic Deployment

The repository includes a GitHub Actions workflow
(`.github/workflows/deploy-github-pages.yml`) that:

1. Builds the Next.js app as a static export
2. Runs ESLint with the local repo configuration (`yarn lint --max-warnings=0`)
3. Compiles translations
4. Uploads the static files to GitHub Pages
5. Deploys to the GitHub Pages environment

### Manual Deployment

You can also trigger a deployment manually:

1. Go to the repository on GitHub
2. Navigate to **Actions** → **Deploy to GitHub Pages**
3. Click **Run workflow**
4. Select the branch and click **Run workflow**

### Local Testing

To test the static export locally:

```bash
# Build the static site
NEXT_PUBLIC_BASE_PATH=/vizualni-admin yarn build:static

# Serve the output directory
cd app/out
npx serve
```

Then open `http://localhost:3000/vizualni-admin/` in your browser.

### CI Notes

- Linting runs with the repo's ESLint config (`yarn lint --max-warnings=0`), so
  no global eslint is used.
- Sourcemap uploads to Sentry are optional. The workflow sets
  `SENTRY_UPLOAD=false` to avoid requiring `SENTRY_AUTH_TOKEN`. To perform real
  uploads locally or in another CI, provide `SENTRY_AUTH_TOKEN` (and set
  `SENTRY_UPLOAD=true` if you want to override the guard).

## 4. Dynamic Route Workarounds

GitHub Pages only serves static files, but dynamic features like loading
datasets from data.gov.rs API and dynamic routes (e.g., `/demos/budget`,
`/demos/environment`) are needed. The solution is client-side data fetching
instead of server-side rendering (SSR).

### Pattern 1: Client-Side API Calls for Demos

Use `useEffect` to fetch data in the browser after the page loads. Ensure
`getStaticPaths` pre-generates known routes with `fallback: false`.

```typescript
// pages/demos/[category].tsx
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { dataGovRsClient } from '@/domain/data-gov-rs';

export default function DemoPage() {
  const router = useRouter();
  const { category } = router.query;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!category) return;

    async function fetchData() {
      try {
        setLoading(true);
        const results = await dataGovRsClient.searchDatasets({
          q: category as string,
          page_size: 10
        });
        setData(results);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [category]);

  if (loading) return <div>Loading...</div>;

  return <div>{/* Render visualization */}</div>;
}

export async function getStaticPaths() {
  return {
    paths: [
      { params: { category: 'budget' } },
      { params: { category: 'environment' } },
      { params: { category: 'demographics' } },
      { params: { category: 'education' } },
      { params: { category: 'transport' } },
    ],
    fallback: false
  };
}

export async function getStaticProps({ params }: { params: { category: string } }) {
  return {
    props: {
      category: params.category,
    },
  };
}
```

**Note**: Do not use `getServerSideProps` as it fails during static build.

### Pattern 2: Static Generation with Known Dataset IDs

Pre-fetch popular dataset IDs at build time for static pages.

```typescript
// pages/datasets/[id].tsx
export default function DatasetPage({ dataset, chartData }) {
  return (
    <div>
      <h1>{dataset.title}</h1>
      <ChartColumn data={chartData} />
    </div>
  );
}

export async function getStaticPaths() {
  const datasets = await dataGovRsClient.searchDatasets({
    page_size: 50,
    sort: 'views',
    order: 'desc'
  });

  return {
    paths: datasets.data.map((d) => ({
      params: { id: d.id }
    })),
    fallback: false
  };
}

export async function getStaticProps({ params }) {
  const dataset = await dataGovRsClient.getDataset(params.id);
  const resource = getBestVisualizationResource(dataset);
  const rawData = await dataGovRsClient.getResourceJSON(resource);

  return {
    props: {
      dataset,
      chartData: transformData(rawData)
    },
  };
}
```

### Pattern 3: Hybrid Approach (Recommended for Demos)

Combine static shell with client-side data fetching.

```typescript
// pages/demos/index.tsx
import { useState, useEffect } from 'react';
import { DemoCard } from '@/components/DemoCard';

const DEMO_CONFIGS = {
  budget: {
    title: 'Budget Visualization',
    description: 'Explore Serbian public budgets',
    searchQuery: 'budzet',
    chartType: 'column'
  },
  // ... more demos
};

export default function DemosIndex() {
  const [demosWithData, setDemosWithData] = useState({});

  useEffect(() => {
    async function fetchAllDemoData() {
      const entries = await Promise.all(
        Object.entries(DEMO_CONFIGS).map(async ([key, config]) => {
          const results = await dataGovRsClient.searchDatasets({
            q: config.searchQuery,
            page_size: 1
          });
          return [key, results.data[0]];
        })
      );
      const demosData = Object.fromEntries(entries);
      setDemosWithData(demosData);
    }
    fetchAllDemoData();
  }, []);

  return (
    <div>
      <h1>Data Visualization Demos</h1>
      {Object.entries(DEMO_CONFIGS).map(([key, config]) => (
        <DemoCard
          key={key}
          {...config}
          dataset={demosWithData[key]}
          href={`/demos/${key}`}
        />
      ))}
    </div>
  );
}

export async function getStaticProps() {
  return {
    props: {},
  };
}
```

### Pattern 4: Using SWR for Better UX

```typescript
import useSWR from 'swr';
import { dataGovRsClient } from '@/domain/data-gov-rs';

const fetcher = async (datasetId: string) => {
  const dataset = await dataGovRsClient.getDataset(datasetId);
  const resource = getBestVisualizationResource(dataset);
  return await dataGovRsClient.getResourceJSON(resource);
};

export default function BudgetDemo() {
  const { data, error, isLoading } = useSWR('budget-2024-id', fetcher);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  return <ChartColumn data={data} />;
}
```

### Pattern 5: Pre-computed Data for Fast Loading

Pre-fetch data during build and include it in the static bundle.

```typescript
// lib/demos/precomputed-data.ts
export const BUDGET_2024_DATA = {
  // Pre-fetched data
};

// pages/demos/budget.tsx
import { BUDGET_2024_DATA } from '@/lib/demos/precomputed-data';

export default function BudgetDemo() {
  const [data, setData] = useState(BUDGET_2024_DATA);

  useEffect(() => {
    dataGovRsClient.getDataset('budget-2024').then(freshData => {
      setData(freshData);
    });
  }, []);

  return <ChartColumn data={data} />;
}
```

Update `package.json` for prebuild:

```json
{
  "scripts": {
    "prebuild": "node scripts/prebuild-demos.js",
    "build:static": "yarn prebuild && NEXT_PUBLIC_BASE_PATH=/vizualni-admin next build"
  }
}
```

### CORS Considerations

Ensure CORS is allowed for data.gov.rs API. If not, use a proxy or pre-fetch
data.

### Complete Example: Budget Demo

See the full example in the original `GITHUB_PAGES_DYNAMIC_WORKAROUNDS.md` for a
detailed implementation.

### Deployment Checklist

- [ ] All pages use `getStaticProps` or `getStaticPaths` (NOT
      `getServerSideProps`)
- [ ] Dynamic data is fetched client-side
- [ ] Known routes are pre-generated in `getStaticPaths`
- [ ] Loading states are implemented
- [ ] Error handling is in place
- [ ] CORS is configured or data is pre-fetched
- [ ] Build completes successfully: `yarn build:static`
- [ ] Local testing works: `npx serve out`

## 5. Troubleshooting

### Pages Not Updating

If the site doesn't update after a push:

1. Check the **Actions** tab for workflow status
2. Look for any build errors in the workflow logs
3. Verify the `main` branch has the latest changes

### 404 Errors

If you get 404 errors:

1. Ensure GitHub Pages is enabled in repository settings
2. Check that the base path is correct
3. Verify the workflow completed successfully

### Build Failures

If the build fails:

1. Check the workflow logs in the **Actions** tab
2. Common issues:
   - Missing dependencies: Run `yarn install` locally to verify
   - TypeScript errors: Run `yarn typecheck` locally
   - Build errors: Run `yarn build:static` locally to reproduce

### Invariant Error During Build

If you encounter an invariant error during static build:

1. **Check for incompatible fallback values**: Ensure all dynamic routes use
   `fallback: false` in `getStaticPaths`, not `fallback: 'blocking'` or
   `fallback: true`
2. **Verify all paths are pre-generated**: Dynamic routes must return all
   possible paths in `getStaticPaths` for static export
3. **Enable verbose logging**: Set `logging.level: 'info'` in `next.config.js`
   to see detailed build output
4. **Check the build output**: Look for messages about which pages failed to
   generate
5. **Test locally**: Run
   `NEXT_PUBLIC_BASE_PATH=/vizualni-admin yarn build:static` to reproduce the
   issue

**Common causes:**

- Using `fallback: 'blocking'` with static export (not supported)
- Missing `getStaticPaths` in dynamic routes
- Empty paths array without `fallback: false`

## Limitations

GitHub Pages deployments have some limitations compared to full deployments:

| Feature               | GitHub Pages | Full Deployment |
| --------------------- | ------------ | --------------- |
| Static charts         | ✅ Yes       | ✅ Yes          |
| Browse datasets       | ✅ Yes       | ✅ Yes          |
| Browse dynamic routes | ⚠️ Limited   | ✅ Yes          |
| Create visualizations | ✅ Yes       | ✅ Yes          |
| Save configurations   | ❌ No        | ✅ Yes          |
| User accounts         | ❌ No        | ✅ Yes          |
| Database storage      | ❌ No        | ✅ Yes          |
| Server-side rendering | ❌ No        | ✅ Yes          |
| API routes            | ❌ No        | ✅ Yes          |

[^1]: Browse routes work client-side only in static export mode.

## Custom Domain

To use a custom domain with GitHub Pages:

1. Add a `CNAME` file to `app/public/` with your domain
2. Configure DNS settings for your domain
3. Enable HTTPS in repository settings

See
[GitHub's custom domain documentation](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)
for details.

## Security

- GitHub Pages sites are always public
- Don't include sensitive data or API keys in the static export
- Use GitHub repository secrets for any sensitive environment variables

## Further Reading

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Next.js Static Export](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
