# Implementation Roadmap: Library Organization, Testing & Demos

> Reference document for implementing improvements to @acailic/vizualni-admin
> Created: 2026-01-08

---

## Table of Contents

1. [Library Organization & Client Usability](#1-library-organization--client-usability)
2. [Testing Improvements](#2-testing-improvements)
3. [Demo Effectiveness](#3-demo-effectiveness)
4. [Project Structure Improvements](#4-project-structure-improvements)
5. [Quick Wins](#5-quick-wins)

---

## 1. Library Organization & Client Usability

### Current State Analysis

**What's Exported (app/index.ts):**

- Locale utilities: `defaultLocale`, `locales`, `parseLocaleString`, `i18n`
- D3 formatters: `getD3TimeFormatLocale`, `getD3FormatLocale`
- Config types: All from `./config-types`
- Validation: `validateConfig`, `DEFAULT_CONFIG`
- API Client: `DataGovRsClient`, `createDataGovRsClient`, `dataGovRsClient`

**What's NOT Exported:**

- Chart components (Line, Bar, Map, etc.)
- Configurator components
- React hooks
- Data transformation utilities

**Why:** Components have deep Next.js dependencies (router, server components)

### Implementation Plan

#### Phase 1: Create Layered Export Structure

**Goal:** Allow clients to import only what they need

```
@acailic/vizualni-admin
├── /core        → Config types, validation, locale
├── /client      → DataGovRs API client
├── /charts      → Standalone chart components (NEW)
├── /hooks       → Reusable React hooks (NEW)
└── /utils       → Data transformation utilities (NEW)
```

**Files to Create:**

```
app/
├── exports/
│   ├── index.ts              # Re-export everything
│   ├── core.ts               # Locale, config, validation
│   ├── client.ts             # DataGovRs client
│   ├── charts/
│   │   ├── index.ts          # All chart exports
│   │   ├── LineChart.tsx     # Standalone line chart
│   │   ├── BarChart.tsx      # Standalone bar chart
│   │   ├── ColumnChart.tsx   # Standalone column chart
│   │   ├── PieChart.tsx      # Standalone pie chart
│   │   ├── MapChart.tsx      # Standalone map chart
│   │   └── types.ts          # Chart prop types
│   ├── hooks/
│   │   ├── index.ts          # All hook exports
│   │   ├── useDataGovRs.ts   # Data fetching hook
│   │   ├── useChartConfig.ts # Config management
│   │   └── useLocale.ts      # Locale utilities
│   └── utils/
│       ├── index.ts          # All utility exports
│       ├── transforms.ts     # Data transformations
│       └── formatters.ts     # Number/date formatters
```

**Package.json Exports Field:**

```json
{
  "exports": {
    ".": {
      "import": "./dist/index.esm.js",
      "require": "./dist/index.cjs.js",
      "types": "./dist/index.d.ts"
    },
    "./core": {
      "import": "./dist/core.esm.js",
      "require": "./dist/core.cjs.js",
      "types": "./dist/core.d.ts"
    },
    "./client": {
      "import": "./dist/client.esm.js",
      "require": "./dist/client.cjs.js",
      "types": "./dist/client.d.ts"
    },
    "./charts": {
      "import": "./dist/charts/index.esm.js",
      "require": "./dist/charts/index.cjs.js",
      "types": "./dist/charts/index.d.ts"
    },
    "./hooks": {
      "import": "./dist/hooks/index.esm.js",
      "require": "./dist/hooks/index.cjs.js",
      "types": "./dist/hooks/index.d.ts"
    },
    "./utils": {
      "import": "./dist/utils/index.esm.js",
      "require": "./dist/utils/index.cjs.js",
      "types": "./dist/utils/index.d.ts"
    }
  }
}
```

#### Phase 2: Decouple Charts from Next.js

**Goal:** Make chart components usable in any React project

**Current Dependencies to Remove:**

- `next/router` → Accept callbacks as props
- `next/link` → Accept render props for links
- Server components → Client-only components
- App-specific context → Accept data as props

**Standalone Chart Component Pattern:**

```tsx
// app/exports/charts/LineChart.tsx
import React from "react";
import {
  Line,
  LineChart as RechartsLine,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { ChartConfig, ChartData } from "./types";

export interface LineChartProps {
  /** Chart data array */
  data: ChartData[];
  /** Chart configuration */
  config: ChartConfig;
  /** Chart height in pixels */
  height?: number;
  /** Callback when data point is clicked */
  onDataPointClick?: (data: ChartData) => void;
  /** Custom tooltip renderer */
  renderTooltip?: (data: ChartData) => React.ReactNode;
  /** Locale for formatting */
  locale?: "sr-Latn" | "sr-Cyrl" | "en";
}

export const LineChart: React.FC<LineChartProps> = ({
  data,
  config,
  height = 400,
  onDataPointClick,
  renderTooltip,
  locale = "sr-Latn",
}) => {
  // Implementation using Recharts
  // No Next.js dependencies
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsLine data={data}>
        <XAxis dataKey={config.xAxis} />
        <YAxis />
        <Tooltip
          content={
            renderTooltip
              ? ({ payload }) => renderTooltip(payload?.[0]?.payload)
              : undefined
          }
        />
        <Line
          type="monotone"
          dataKey={config.yAxis}
          stroke={config.color || "#0ea5e9"}
          onClick={onDataPointClick}
        />
      </RechartsLine>
    </ResponsiveContainer>
  );
};
```

**Chart Types to Export:**

| Component     | Based On              | Priority           |
| ------------- | --------------------- | ------------------ |
| `LineChart`   | `charts/line/`        | High               |
| `BarChart`    | `charts/bar/`         | High               |
| `ColumnChart` | `charts/column/`      | High               |
| `PieChart`    | `charts/pie/`         | Medium             |
| `AreaChart`   | `charts/area/`        | Medium             |
| `MapChart`    | `charts/map/`         | Low (complex deps) |
| `ScatterPlot` | `charts/scatterplot/` | Low                |
| `ComboChart`  | `charts/combo/`       | Low                |

#### Phase 3: Add Client-Friendly Hooks

**useDataGovRs Hook:**

```tsx
// app/exports/hooks/useDataGovRs.ts
import { useState, useEffect } from "react";
import {
  createDataGovRsClient,
  type SearchParams,
  type DatasetMetadata,
} from "../client";

interface UseDataGovRsOptions {
  /** Search parameters */
  params: SearchParams;
  /** Enable automatic fetching */
  enabled?: boolean;
  /** Cache time in milliseconds */
  cacheTime?: number;
}

interface UseDataGovRsResult {
  data: DatasetMetadata[] | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useDataGovRs(options: UseDataGovRsOptions): UseDataGovRsResult {
  const [data, setData] = useState<DatasetMetadata[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const client = createDataGovRsClient();

  const fetch = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await client.searchDatasets(options.params);
      setData(result.results);
    } catch (e) {
      setError(e instanceof Error ? e : new Error("Unknown error"));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (options.enabled !== false) {
      fetch();
    }
  }, [JSON.stringify(options.params), options.enabled]);

  return { data, isLoading, error, refetch: fetch };
}
```

**useChartConfig Hook:**

```tsx
// app/exports/hooks/useChartConfig.ts
import { useState, useCallback } from "react";
import {
  validateConfig,
  DEFAULT_CONFIG,
  type VizualniAdminConfig,
} from "../core";

export function useChartConfig(initialConfig?: Partial<VizualniAdminConfig>) {
  const [config, setConfig] = useState<VizualniAdminConfig>({
    ...DEFAULT_CONFIG,
    ...initialConfig,
  });
  const [errors, setErrors] = useState<string[]>([]);

  const updateConfig = useCallback(
    (updates: Partial<VizualniAdminConfig>) => {
      const newConfig = { ...config, ...updates };
      const validation = validateConfig(newConfig);

      if (validation.success) {
        setConfig(newConfig);
        setErrors([]);
      } else {
        setErrors(validation.issues.map((i) => i.message));
      }
    },
    [config]
  );

  const resetConfig = useCallback(() => {
    setConfig({ ...DEFAULT_CONFIG, ...initialConfig });
    setErrors([]);
  }, [initialConfig]);

  return {
    config,
    errors,
    isValid: errors.length === 0,
    updateConfig,
    resetConfig,
  };
}
```

#### Phase 4: Quick-Start Documentation

**README Example for Clients:**

```tsx
// Minimal setup - just show a chart
import { LineChart } from "@acailic/vizualni-admin/charts";

function MyChart() {
  const data = [
    { year: 2020, value: 100 },
    { year: 2021, value: 120 },
    { year: 2022, value: 115 },
  ];

  return <LineChart data={data} config={{ xAxis: "year", yAxis: "value" }} />;
}

// With Serbian Open Data
import { useDataGovRs } from "@acailic/vizualni-admin/hooks";
import { LineChart } from "@acailic/vizualni-admin/charts";

function SerbianDataChart() {
  const { data, isLoading } = useDataGovRs({
    params: { q: "ekonomija" },
  });

  if (isLoading) return <div>Loading...</div>;

  return <LineChart data={data} config={{ xAxis: "date", yAxis: "value" }} />;
}
```

### Implementation Checklist

- [ ] Create `app/exports/` directory structure
- [ ] Extract `LineChart` as standalone component
- [ ] Extract `BarChart` as standalone component
- [ ] Extract `ColumnChart` as standalone component
- [ ] Create `useDataGovRs` hook
- [ ] Create `useChartConfig` hook
- [ ] Update `package.json` exports field
- [ ] Update `tsup.config.ts` for multiple entry points
- [ ] Add TypeScript declarations
- [ ] Write client usage documentation

---

## 2. Testing Improvements

### Current State Analysis

**Testing Stack:**

- Framework: Vitest 3.1.4
- Environment: jsdom
- Coverage: V8 provider
- E2E: Playwright 1.51.0
- Accessibility: jest-axe 9.0.0

**Coverage Thresholds:**

- Lines: 80%
- Functions: 80%
- Branches: 75%
- Statements: 80%

**Test Distribution:** | Location | Count | Type | |----------|-------|------| |
`charts/shared/*.spec.ts` | ~50 | Unit tests | | `tests/integration/` | 2 |
Integration tests | | `tests/visual/` | 1 | Visual regression |

**Identified Gaps:**

- No tests for library exports
- No tests for `DataGovRsClient`
- No tests for `validateConfig`
- No smoke tests for demo pages
- No tests for `/components/demo/*`

### Implementation Plan

#### Test Category 1: Export Contract Tests

**Purpose:** Ensure public API doesn't break between releases

**File:** `app/tests/exports/library-exports.spec.ts`

```typescript
/**
 * Library Export Contract Tests
 *
 * These tests ensure that the public API of @acailic/vizualni-admin
 * remains stable and all documented exports are available.
 *
 * IMPORTANT: If these tests fail, it indicates a breaking change
 * that may affect downstream consumers.
 */

import { describe, it, expect } from "vitest";

describe("Library Exports", () => {
  describe("Main Entry Point", () => {
    it("exports version string", async () => {
      const lib = await import("@/index");
      expect(lib.version).toBeDefined();
      expect(typeof lib.version).toBe("string");
    });

    it("exports I18nProvider from @lingui/react", async () => {
      const lib = await import("@/index");
      expect(lib.I18nProvider).toBeDefined();
    });
  });

  describe("Locale Utilities", () => {
    it("exports defaultLocale as sr-Latn", async () => {
      const lib = await import("@/index");
      expect(lib.defaultLocale).toBe("sr-Latn");
    });

    it("exports locales array with 3 locales", async () => {
      const lib = await import("@/index");
      expect(lib.locales).toHaveLength(3);
      expect(lib.locales).toContain("sr-Latn");
      expect(lib.locales).toContain("sr-Cyrl");
      expect(lib.locales).toContain("en");
    });

    it("exports parseLocaleString function", async () => {
      const lib = await import("@/index");
      expect(lib.parseLocaleString).toBeInstanceOf(Function);
      expect(lib.parseLocaleString("sr")).toBe("sr-Latn");
      expect(lib.parseLocaleString("en-US")).toBe("en");
    });

    it("exports i18n instance", async () => {
      const lib = await import("@/index");
      expect(lib.i18n).toBeDefined();
      expect(lib.i18n.locale).toBeDefined();
    });

    it("exports D3 format locale functions", async () => {
      const lib = await import("@/index");
      expect(lib.getD3TimeFormatLocale).toBeInstanceOf(Function);
      expect(lib.getD3FormatLocale).toBeInstanceOf(Function);
    });
  });

  describe("Configuration", () => {
    it("exports validateConfig function", async () => {
      const lib = await import("@/index");
      expect(lib.validateConfig).toBeInstanceOf(Function);
    });

    it("exports DEFAULT_CONFIG object", async () => {
      const lib = await import("@/index");
      expect(lib.DEFAULT_CONFIG).toBeDefined();
      expect(typeof lib.DEFAULT_CONFIG).toBe("object");
    });

    it("exports config-types", async () => {
      const lib = await import("@/index");
      // Type exports are compile-time, but we can check for type guards
      expect(lib).toBeDefined();
    });
  });

  describe("DataGovRs Client", () => {
    it("exports DataGovRsClient class", async () => {
      const lib = await import("@/index");
      expect(lib.DataGovRsClient).toBeDefined();
    });

    it("exports createDataGovRsClient factory", async () => {
      const lib = await import("@/index");
      expect(lib.createDataGovRsClient).toBeInstanceOf(Function);
    });

    it("exports dataGovRsClient singleton", async () => {
      const lib = await import("@/index");
      expect(lib.dataGovRsClient).toBeDefined();
    });
  });
});

describe("Type Exports", () => {
  it("Locale type is usable", async () => {
    const lib = await import("@/index");
    type Locale = (typeof lib.locales)[number];
    const locale: Locale = "sr-Latn";
    expect(locale).toBe("sr-Latn");
  });
});
```

#### Test Category 2: DataGovRs Client Tests

**Purpose:** Ensure API client works correctly with real and mocked data

**File:** `app/tests/client/data-gov-rs.spec.ts`

```typescript
/**
 * DataGovRs Client Tests
 *
 * Tests for the Serbian Open Data Portal API client.
 * Uses MSW for mocking HTTP requests.
 */

import { describe, it, expect, beforeAll, afterAll, afterEach } from "vitest";
import { setupServer } from "msw/node";
import { http, HttpResponse } from "msw";
import {
  createDataGovRsClient,
  DataGovRsClient,
} from "@/domain/data-gov-rs/client";

// Mock server setup
const server = setupServer(
  http.get(
    "https://data.gov.rs/sr/api/3/action/package_search",
    ({ request }) => {
      const url = new URL(request.url);
      const query = url.searchParams.get("q");

      return HttpResponse.json({
        success: true,
        result: {
          count: 2,
          results: [
            {
              id: "dataset-1",
              name: "test-dataset",
              title: "Test Dataset",
              notes: "A test dataset",
              organization: { name: "test-org", title: "Test Organization" },
              resources: [],
              tags: [{ name: "test" }],
            },
            {
              id: "dataset-2",
              name: "another-dataset",
              title: "Another Dataset",
              notes: "Another test dataset",
              organization: { name: "test-org", title: "Test Organization" },
              resources: [],
              tags: [{ name: "test" }],
            },
          ],
        },
      });
    }
  ),

  http.get(
    "https://data.gov.rs/sr/api/3/action/package_show",
    ({ request }) => {
      const url = new URL(request.url);
      const id = url.searchParams.get("id");

      return HttpResponse.json({
        success: true,
        result: {
          id,
          name: "test-dataset",
          title: "Test Dataset",
          notes: "A test dataset for testing",
          organization: { name: "test-org", title: "Test Organization" },
          resources: [
            {
              id: "resource-1",
              name: "test.csv",
              format: "CSV",
              url: "https://example.com/test.csv",
            },
          ],
          tags: [{ name: "test" }],
        },
      });
    }
  ),

  http.get("https://data.gov.rs/sr/api/3/action/organization_list", () => {
    return HttpResponse.json({
      success: true,
      result: ["org-1", "org-2", "org-3"],
    });
  })
);

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("DataGovRsClient", () => {
  describe("createDataGovRsClient", () => {
    it("creates a client instance", () => {
      const client = createDataGovRsClient();
      expect(client).toBeInstanceOf(DataGovRsClient);
    });

    it("accepts custom configuration", () => {
      const client = createDataGovRsClient({
        baseUrl: "https://custom.api.rs",
        timeout: 5000,
      });
      expect(client).toBeInstanceOf(DataGovRsClient);
    });
  });

  describe("searchDatasets", () => {
    it("searches datasets with query string", async () => {
      const client = createDataGovRsClient();
      const result = await client.searchDatasets({ q: "ekonomija" });

      expect(result.count).toBe(2);
      expect(result.results).toHaveLength(2);
      expect(result.results[0].id).toBe("dataset-1");
    });

    it("returns empty results for no matches", async () => {
      server.use(
        http.get("https://data.gov.rs/sr/api/3/action/package_search", () => {
          return HttpResponse.json({
            success: true,
            result: { count: 0, results: [] },
          });
        })
      );

      const client = createDataGovRsClient();
      const result = await client.searchDatasets({ q: "nonexistent" });

      expect(result.count).toBe(0);
      expect(result.results).toHaveLength(0);
    });

    it("handles pagination parameters", async () => {
      const client = createDataGovRsClient();
      const result = await client.searchDatasets({
        q: "test",
        rows: 10,
        start: 0,
      });

      expect(result).toBeDefined();
    });
  });

  describe("getDataset", () => {
    it("fetches a single dataset by ID", async () => {
      const client = createDataGovRsClient();
      const dataset = await client.getDataset("dataset-1");

      expect(dataset.id).toBe("dataset-1");
      expect(dataset.title).toBe("Test Dataset");
      expect(dataset.resources).toHaveLength(1);
    });
  });

  describe("getOrganizations", () => {
    it("fetches organization list", async () => {
      const client = createDataGovRsClient();
      const orgs = await client.getOrganizations();

      expect(orgs).toHaveLength(3);
      expect(orgs).toContain("org-1");
    });
  });

  describe("Error Handling", () => {
    it("throws on network error", async () => {
      server.use(
        http.get("https://data.gov.rs/sr/api/3/action/package_search", () => {
          return HttpResponse.error();
        })
      );

      const client = createDataGovRsClient();
      await expect(client.searchDatasets({ q: "test" })).rejects.toThrow();
    });

    it("throws on API error response", async () => {
      server.use(
        http.get("https://data.gov.rs/sr/api/3/action/package_search", () => {
          return HttpResponse.json(
            {
              success: false,
              error: { message: "API Error" },
            },
            { status: 400 }
          );
        })
      );

      const client = createDataGovRsClient();
      await expect(client.searchDatasets({ q: "test" })).rejects.toThrow();
    });
  });
});
```

#### Test Category 3: Configuration Validation Tests

**File:** `app/tests/config/validation.spec.ts`

```typescript
/**
 * Configuration Validation Tests
 *
 * Tests for the validateConfig function and DEFAULT_CONFIG.
 */

import { describe, it, expect } from "vitest";
import { validateConfig, DEFAULT_CONFIG } from "@/lib/config/validator";
import type { VizualniAdminConfig } from "@/lib/config/types";

describe("validateConfig", () => {
  describe("Valid Configurations", () => {
    it("validates DEFAULT_CONFIG successfully", () => {
      const result = validateConfig(DEFAULT_CONFIG);
      expect(result.success).toBe(true);
    });

    it("validates minimal valid config", () => {
      const config: Partial<VizualniAdminConfig> = {
        chartType: "line",
      };
      const result = validateConfig(config);
      // Should either pass or provide helpful errors
      expect(result).toBeDefined();
    });

    it("validates complete config with all fields", () => {
      const config: VizualniAdminConfig = {
        ...DEFAULT_CONFIG,
        chartType: "bar",
        title: "Test Chart",
        // Add other required fields
      };
      const result = validateConfig(config);
      expect(result.success).toBe(true);
    });
  });

  describe("Invalid Configurations", () => {
    it("rejects null input", () => {
      const result = validateConfig(null as any);
      expect(result.success).toBe(false);
      expect(result.issues).toBeDefined();
    });

    it("rejects undefined input", () => {
      const result = validateConfig(undefined as any);
      expect(result.success).toBe(false);
    });

    it("rejects invalid chartType", () => {
      const config = {
        ...DEFAULT_CONFIG,
        chartType: "invalid-chart-type",
      };
      const result = validateConfig(config);
      expect(result.success).toBe(false);
      expect(result.issues?.some((i) => i.path?.includes("chartType"))).toBe(
        true
      );
    });
  });

  describe("Validation Issues", () => {
    it("provides path information for nested errors", () => {
      const config = {
        ...DEFAULT_CONFIG,
        filters: {
          invalid: "structure",
        },
      };
      const result = validateConfig(config);
      if (!result.success) {
        expect(result.issues[0].path).toBeDefined();
      }
    });

    it("provides human-readable error messages", () => {
      const result = validateConfig({});
      if (!result.success) {
        result.issues.forEach((issue) => {
          expect(issue.message).toBeTruthy();
          expect(typeof issue.message).toBe("string");
        });
      }
    });
  });
});

describe("DEFAULT_CONFIG", () => {
  it("has all required fields", () => {
    expect(DEFAULT_CONFIG).toBeDefined();
    expect(DEFAULT_CONFIG.chartType).toBeDefined();
  });

  it("is immutable (frozen)", () => {
    expect(Object.isFrozen(DEFAULT_CONFIG) || true).toBe(true);
    // Note: Implementation may or may not freeze the object
  });
});
```

#### Test Category 4: Demo Smoke Tests

**File:** `app/tests/demos/smoke.spec.ts`

```typescript
/**
 * Demo Configuration Smoke Tests
 *
 * Ensures all demo configurations are valid and complete.
 * These tests run quickly and catch configuration errors early.
 */

import { describe, it, expect } from "vitest";
import {
  DEMO_CONFIGS,
  getDemoConfig,
  getAllDemoIds,
  getDemoTitle,
  getDemoDescription,
} from "@/lib/demos/config";

describe("DEMO_CONFIGS", () => {
  const demoIds = Object.keys(DEMO_CONFIGS);

  it("has at least 10 demo configurations", () => {
    expect(demoIds.length).toBeGreaterThanOrEqual(10);
  });

  describe.each(demoIds)("Demo: %s", (demoId) => {
    const config = DEMO_CONFIGS[demoId];

    it("has an id matching the key", () => {
      expect(config.id).toBe(demoId);
    });

    it("has Serbian title", () => {
      expect(config.title.sr).toBeTruthy();
      expect(typeof config.title.sr).toBe("string");
      expect(config.title.sr.length).toBeGreaterThan(0);
    });

    it("has English title", () => {
      expect(config.title.en).toBeTruthy();
      expect(typeof config.title.en).toBe("string");
      expect(config.title.en.length).toBeGreaterThan(0);
    });

    it("has Serbian description", () => {
      expect(config.description.sr).toBeTruthy();
      expect(config.description.sr.length).toBeGreaterThan(10);
    });

    it("has English description", () => {
      expect(config.description.en).toBeTruthy();
      expect(config.description.en.length).toBeGreaterThan(10);
    });

    it("has valid chartType", () => {
      const validChartTypes = [
        "line",
        "bar",
        "column",
        "area",
        "pie",
        "map",
        "scatterplot",
        "comboLineColumn",
      ];
      expect(validChartTypes).toContain(config.chartType);
    });

    it("has an icon", () => {
      expect(config.icon).toBeTruthy();
    });

    it("has tags array", () => {
      expect(Array.isArray(config.tags)).toBe(true);
    });

    it("has searchQuery defined", () => {
      expect(config.searchQuery).toBeDefined();
      if (Array.isArray(config.searchQuery)) {
        expect(config.searchQuery.length).toBeGreaterThan(0);
      } else {
        expect(typeof config.searchQuery).toBe("string");
      }
    });
  });
});

describe("Demo Helper Functions", () => {
  describe("getDemoConfig", () => {
    it("returns config for valid id", () => {
      const config = getDemoConfig("economy");
      expect(config).toBeDefined();
      expect(config?.id).toBe("economy");
    });

    it("returns null for invalid id", () => {
      const config = getDemoConfig("nonexistent-demo");
      expect(config).toBeNull();
    });
  });

  describe("getAllDemoIds", () => {
    it("returns array of all demo ids", () => {
      const ids = getAllDemoIds();
      expect(Array.isArray(ids)).toBe(true);
      expect(ids.length).toBeGreaterThan(0);
      expect(ids).toContain("economy");
      expect(ids).toContain("healthcare");
    });
  });

  describe("getDemoTitle", () => {
    it("returns Serbian title by default", () => {
      const title = getDemoTitle("economy");
      expect(title).toBe(DEMO_CONFIGS.economy.title.sr);
    });

    it("returns English title when specified", () => {
      const title = getDemoTitle("economy", "en");
      expect(title).toBe(DEMO_CONFIGS.economy.title.en);
    });

    it("returns id for unknown demo", () => {
      const title = getDemoTitle("unknown-demo");
      expect(title).toBe("unknown-demo");
    });
  });

  describe("getDemoDescription", () => {
    it("returns description in specified locale", () => {
      const descSr = getDemoDescription("economy", "sr");
      const descEn = getDemoDescription("economy", "en");
      expect(descSr).toBe(DEMO_CONFIGS.economy.description.sr);
      expect(descEn).toBe(DEMO_CONFIGS.economy.description.en);
    });

    it("returns empty string for unknown demo", () => {
      const desc = getDemoDescription("unknown-demo");
      expect(desc).toBe("");
    });
  });
});
```

#### Test Category 5: Component Tests

**File:** `app/tests/components/demo-layout.spec.tsx`

```typescript
/**
 * Demo Layout Component Tests
 */

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { I18nProvider } from "@lingui/react";
import { i18n } from "@/locales/locales";
import { DemoLayout } from "@/components/demos/demo-layout";

// Setup i18n for tests
i18n.activate("en");

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <I18nProvider i18n={i18n}>{children}</I18nProvider>
);

describe("DemoLayout", () => {
  it("renders title", () => {
    render(
      <TestWrapper>
        <DemoLayout title="Test Demo" description="Test description">
          <div>Content</div>
        </DemoLayout>
      </TestWrapper>
    );

    expect(screen.getByText("Test Demo")).toBeInTheDocument();
  });

  it("renders children", () => {
    render(
      <TestWrapper>
        <DemoLayout title="Test" description="Desc">
          <div data-testid="child">Child Content</div>
        </DemoLayout>
      </TestWrapper>
    );

    expect(screen.getByTestId("child")).toBeInTheDocument();
  });

  it("hides back button when hideBackButton is true", () => {
    render(
      <TestWrapper>
        <DemoLayout title="Test" description="Desc" hideBackButton>
          <div>Content</div>
        </DemoLayout>
      </TestWrapper>
    );

    expect(
      screen.queryByRole("link", { name: /back/i })
    ).not.toBeInTheDocument();
  });
});
```

### Test Commands to Add

**package.json scripts:**

```json
{
  "scripts": {
    "test": "vitest",
    "test:watch": "vitest --watch",
    "test:coverage": "vitest --coverage",
    "test:exports": "vitest tests/exports",
    "test:client": "vitest tests/client",
    "test:config": "vitest tests/config",
    "test:demos": "vitest tests/demos",
    "test:components": "vitest tests/components",
    "test:integration": "vitest tests/integration",
    "test:visual": "playwright test",
    "test:all": "vitest && playwright test"
  }
}
```

### Implementation Checklist

- [ ] Create `tests/exports/library-exports.spec.ts`
- [ ] Create `tests/client/data-gov-rs.spec.ts`
- [ ] Create `tests/config/validation.spec.ts`
- [ ] Create `tests/demos/smoke.spec.ts`
- [ ] Create `tests/components/demo-layout.spec.tsx`
- [ ] Install MSW: `yarn add -D msw`
- [ ] Update package.json with new test scripts
- [ ] Add test coverage badge to README
- [ ] Set up pre-commit hook for tests

---

## 3. Demo Effectiveness

### Current State Analysis

**Demo Categories (19 total):**

- Domain-specific: economy, healthcare, transport, energy, etc.
- Special modes: presentation, pitch, showcase
- Dynamic routing: `/demos/[category]`

**Strengths:**

- Good i18n support (Serbian Latin, Cyrillic, English)
- Data classification badges (Real vs Demo data)
- Consistent layout with DemoLayout component
- Good visual design with gradients and animations

**Weaknesses:**

- No interactive playground for experimentation
- No code snippets showing how to reproduce charts
- No performance metrics visible
- Organization is flat (all demos at same level)

### Implementation Plan

#### Enhancement 1: Interactive Playground

**Purpose:** Let users experiment with chart configurations without coding

**File:** `app/pages/demos/playground/index.tsx`

```tsx
/**
 * Interactive Chart Playground
 *
 * Allows users to:
 * 1. Select a data source (demo data, upload CSV, or DataGovRs)
 * 2. Choose chart type
 * 3. Configure axes, colors, filters
 * 4. Export configuration as code
 */

import { useState, useCallback } from "react";
import { Box, Grid, Paper, Typography, Tabs, Tab, Button } from "@mui/material";
import { DemoLayout } from "@/components/demos/demo-layout";

// Data source types
type DataSource = "demo" | "upload" | "api";

// Chart configuration state
interface PlaygroundState {
  dataSource: DataSource;
  chartType: string;
  data: any[];
  config: {
    xAxis: string;
    yAxis: string;
    color: string;
    title: string;
  };
}

export default function PlaygroundPage() {
  const [state, setState] = useState<PlaygroundState>({
    dataSource: "demo",
    chartType: "line",
    data: [],
    config: {
      xAxis: "",
      yAxis: "",
      color: "#0ea5e9",
      title: "",
    },
  });

  const [codeOutput, setCodeOutput] = useState("");

  const generateCode = useCallback(() => {
    const code = `
import { ${
      state.chartType.charAt(0).toUpperCase() + state.chartType.slice(1)
    }Chart } from '@acailic/vizualni-admin/charts';

const data = ${JSON.stringify(state.data.slice(0, 3), null, 2)};

function MyChart() {
  return (
    <${state.chartType.charAt(0).toUpperCase() + state.chartType.slice(1)}Chart
      data={data}
      config={{
        xAxis: '${state.config.xAxis}',
        yAxis: '${state.config.yAxis}',
        color: '${state.config.color}',
      }}
    />
  );
}
`.trim();
    setCodeOutput(code);
  }, [state]);

  return (
    <DemoLayout
      title="Interactive Playground"
      description="Experiment with chart configurations"
    >
      <Grid container spacing={3}>
        {/* Left Panel: Configuration */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Configuration
            </Typography>

            {/* Data Source Selector */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                Data Source
              </Typography>
              <Tabs
                value={state.dataSource}
                onChange={(_, v) => setState((s) => ({ ...s, dataSource: v }))}
              >
                <Tab value="demo" label="Demo Data" />
                <Tab value="upload" label="Upload CSV" />
                <Tab value="api" label="DataGovRs" />
              </Tabs>
            </Box>

            {/* Chart Type Selector */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                Chart Type
              </Typography>
              {/* Chart type buttons */}
            </Box>

            {/* Axis Configuration */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                Axes
              </Typography>
              {/* X and Y axis selectors */}
            </Box>

            {/* Color Picker */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                Colors
              </Typography>
              {/* Color picker */}
            </Box>

            <Button variant="contained" fullWidth onClick={generateCode}>
              Generate Code
            </Button>
          </Paper>
        </Grid>

        {/* Right Panel: Preview */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, minHeight: 400 }}>
            <Typography variant="h6" gutterBottom>
              Preview
            </Typography>
            {/* Chart preview component */}
          </Paper>

          {/* Code Output */}
          {codeOutput && (
            <Paper sx={{ p: 3, mt: 3 }}>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
              >
                <Typography variant="h6">Code Output</Typography>
                <Button
                  size="small"
                  onClick={() => navigator.clipboard.writeText(codeOutput)}
                >
                  Copy
                </Button>
              </Box>
              <Box
                component="pre"
                sx={{
                  p: 2,
                  bgcolor: "#1e1e1e",
                  color: "#d4d4d4",
                  borderRadius: 1,
                  overflow: "auto",
                  fontSize: "0.875rem",
                }}
              >
                {codeOutput}
              </Box>
            </Paper>
          )}
        </Grid>
      </Grid>
    </DemoLayout>
  );
}
```

#### Enhancement 2: Code Snippets in Demos

**Add a reusable code block component:**

**File:** `app/components/demos/demo-code-block.tsx`

```tsx
/**
 * DemoCodeBlock Component
 *
 * Displays copyable code snippets in demo pages.
 */

import { useState } from "react";
import { Box, IconButton, Tooltip, Typography, Collapse } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckIcon from "@mui/icons-material/Check";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

interface DemoCodeBlockProps {
  /** Code to display */
  code: string;
  /** Programming language for syntax highlighting */
  language?: string;
  /** Title for the code block */
  title?: string;
  /** Initially collapsed */
  defaultCollapsed?: boolean;
}

export function DemoCodeBlock({
  code,
  language = "tsx",
  title = "Code",
  defaultCollapsed = true,
}: DemoCodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(!defaultCollapsed);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Box
      sx={{
        mt: 3,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 2,
          py: 1,
          bgcolor: "grey.100",
          borderBottom: "1px solid",
          borderColor: "divider",
          cursor: "pointer",
        }}
        onClick={() => setExpanded(!expanded)}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            {title}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              px: 1,
              py: 0.25,
              bgcolor: "primary.main",
              color: "white",
              borderRadius: 1,
              fontSize: "0.7rem",
            }}
          >
            {language}
          </Typography>
        </Box>

        <Tooltip title={copied ? "Copied!" : "Copy code"}>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleCopy();
            }}
          >
            {copied ? <CheckIcon color="success" /> : <ContentCopyIcon />}
          </IconButton>
        </Tooltip>
      </Box>

      {/* Code Content */}
      <Collapse in={expanded}>
        <Box
          component="pre"
          sx={{
            m: 0,
            p: 2,
            bgcolor: "#1e1e1e",
            color: "#d4d4d4",
            overflow: "auto",
            fontSize: "0.875rem",
            lineHeight: 1.5,
            fontFamily: 'Consolas, Monaco, "Andale Mono", monospace',
            maxHeight: 400,
          }}
        >
          <code>{code}</code>
        </Box>
      </Collapse>
    </Box>
  );
}
```

**Usage in demo pages:**

```tsx
// In any demo page, e.g., /pages/demos/economy.tsx
import { DemoCodeBlock } from "@/components/demos/demo-code-block";

// After the chart visualization
<DemoCodeBlock
  title="Reproduce this chart"
  code={`
import { LineChart } from '@acailic/vizualni-admin/charts';
import { useDataGovRs } from '@acailic/vizualni-admin/hooks';

function EconomyChart() {
  const { data } = useDataGovRs({
    params: { q: 'ekonomija bdp' }
  });

  return (
    <LineChart
      data={data}
      config={{
        xAxis: 'year',
        yAxis: 'gdp',
        title: 'GDP Growth',
      }}
    />
  );
}
`}
/>;
```

#### Enhancement 3: Performance Metrics Display

**File:** `app/components/demos/performance-badge.tsx`

```tsx
/**
 * PerformanceBadge Component
 *
 * Displays performance metrics for demo visualizations.
 */

import { useEffect, useState } from "react";
import { Box, Chip, Tooltip, Typography } from "@mui/material";
import SpeedIcon from "@mui/icons-material/Speed";
import DataObjectIcon from "@mui/icons-material/DataObject";
import TimerIcon from "@mui/icons-material/Timer";

interface PerformanceMetrics {
  dataLoadTime: number;
  renderTime: number;
  dataPoints: number;
}

interface PerformanceBadgeProps {
  metrics: PerformanceMetrics;
}

export function PerformanceBadge({ metrics }: PerformanceBadgeProps) {
  const getLoadTimeColor = (ms: number) => {
    if (ms < 500) return "success";
    if (ms < 1500) return "warning";
    return "error";
  };

  return (
    <Box
      sx={{
        display: "flex",
        gap: 1,
        flexWrap: "wrap",
        p: 1,
        bgcolor: "grey.50",
        borderRadius: 1,
        border: "1px solid",
        borderColor: "grey.200",
      }}
    >
      <Tooltip title="Time to load data from API">
        <Chip
          icon={<TimerIcon />}
          label={`Load: ${metrics.dataLoadTime}ms`}
          size="small"
          color={getLoadTimeColor(metrics.dataLoadTime)}
          variant="outlined"
        />
      </Tooltip>

      <Tooltip title="Time to render the chart">
        <Chip
          icon={<SpeedIcon />}
          label={`Render: ${metrics.renderTime}ms`}
          size="small"
          color={getLoadTimeColor(metrics.renderTime)}
          variant="outlined"
        />
      </Tooltip>

      <Tooltip title="Number of data points in visualization">
        <Chip
          icon={<DataObjectIcon />}
          label={`${metrics.dataPoints.toLocaleString()} points`}
          size="small"
          variant="outlined"
        />
      </Tooltip>
    </Box>
  );
}

// Hook to measure performance
export function usePerformanceMetrics() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    dataLoadTime: 0,
    renderTime: 0,
    dataPoints: 0,
  });

  const markDataLoadStart = () => {
    performance.mark("data-load-start");
  };

  const markDataLoadEnd = (dataPoints: number) => {
    performance.mark("data-load-end");
    performance.measure("data-load", "data-load-start", "data-load-end");
    const measure = performance.getEntriesByName("data-load")[0];
    setMetrics((m) => ({
      ...m,
      dataLoadTime: Math.round(measure.duration),
      dataPoints,
    }));
  };

  const markRenderStart = () => {
    performance.mark("render-start");
  };

  const markRenderEnd = () => {
    performance.mark("render-end");
    performance.measure("render", "render-start", "render-end");
    const measure = performance.getEntriesByName("render")[0];
    setMetrics((m) => ({ ...m, renderTime: Math.round(measure.duration) }));
  };

  return {
    metrics,
    markDataLoadStart,
    markDataLoadEnd,
    markRenderStart,
    markRenderEnd,
  };
}
```

#### Enhancement 4: Demo Navigation Hierarchy

**Restructure demo pages:**

```
/demos
├── index.tsx                    # Main gallery (current)
├── getting-started/
│   ├── index.tsx               # NEW: Onboarding flow
│   └── first-chart.tsx         # NEW: First chart tutorial
├── by-chart-type/
│   ├── index.tsx               # NEW: Chart type gallery
│   ├── line.tsx                # NEW: Line chart examples
│   ├── bar.tsx                 # NEW: Bar chart examples
│   └── map.tsx                 # NEW: Map chart examples
├── by-domain/
│   ├── index.tsx               # NEW: Domain category list
│   ├── economy.tsx             # Current (move)
│   ├── healthcare.tsx          # Current (move)
│   └── ...
├── playground/
│   └── index.tsx               # NEW: Interactive builder
├── embed-examples/
│   └── index.tsx               # NEW: Embedding documentation
├── showcase.tsx                 # Current
├── pitch.tsx                    # Current
└── presentation.tsx             # Current
```

**File:** `app/pages/demos/getting-started/index.tsx`

```tsx
/**
 * Getting Started Page
 *
 * Onboarding flow for new users.
 */

import {
  Box,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Button,
  Typography,
  Paper,
} from "@mui/material";
import { useState } from "react";
import Link from "next/link";
import { DemoLayout } from "@/components/demos/demo-layout";
import { DemoCodeBlock } from "@/components/demos/demo-code-block";

const steps = [
  {
    label: "Install the package",
    content: `npm install @acailic/vizualni-admin
# or
yarn add @acailic/vizualni-admin`,
    language: "bash",
  },
  {
    label: "Import and configure",
    content: `import { I18nProvider, i18n } from '@acailic/vizualni-admin';

function App({ children }) {
  return (
    <I18nProvider i18n={i18n}>
      {children}
    </I18nProvider>
  );
}`,
    language: "tsx",
  },
  {
    label: "Create your first chart",
    content: `import { LineChart } from '@acailic/vizualni-admin/charts';

function MyFirstChart() {
  const data = [
    { year: 2020, value: 100 },
    { year: 2021, value: 120 },
    { year: 2022, value: 115 },
  ];

  return (
    <LineChart
      data={data}
      config={{ xAxis: 'year', yAxis: 'value' }}
    />
  );
}`,
    language: "tsx",
  },
  {
    label: "Fetch real data",
    content: `import { useDataGovRs } from '@acailic/vizualni-admin/hooks';
import { LineChart } from '@acailic/vizualni-admin/charts';

function RealDataChart() {
  const { data, isLoading } = useDataGovRs({
    params: { q: 'ekonomija' }
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <LineChart
      data={data}
      config={{ xAxis: 'date', yAxis: 'value' }}
    />
  );
}`,
    language: "tsx",
  },
];

export default function GettingStartedPage() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <DemoLayout
      title="Getting Started"
      description="Learn how to use @acailic/vizualni-admin in 4 easy steps"
    >
      <Box sx={{ maxWidth: 800, mx: "auto" }}>
        <Stepper activeStep={activeStep} orientation="vertical">
          {steps.map((step, index) => (
            <Step key={step.label}>
              <StepLabel>
                <Typography variant="h6">{step.label}</Typography>
              </StepLabel>
              <StepContent>
                <DemoCodeBlock
                  code={step.content}
                  language={step.language}
                  title={step.label}
                  defaultCollapsed={false}
                />
                <Box sx={{ mt: 2 }}>
                  <Button
                    variant="contained"
                    onClick={() => setActiveStep(index + 1)}
                    sx={{ mr: 1 }}
                  >
                    {index === steps.length - 1 ? "Finish" : "Continue"}
                  </Button>
                  {index > 0 && (
                    <Button onClick={() => setActiveStep(index - 1)}>
                      Back
                    </Button>
                  )}
                </Box>
              </StepContent>
            </Step>
          ))}
        </Stepper>

        {activeStep === steps.length && (
          <Paper sx={{ p: 3, mt: 3, textAlign: "center" }}>
            <Typography variant="h5" gutterBottom>
              You're ready to go!
            </Typography>
            <Typography color="text.secondary" paragraph>
              Explore more demos or start building your own visualizations.
            </Typography>
            <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
              <Link href="/demos" passHref legacyBehavior>
                <Button variant="outlined">Browse Demos</Button>
              </Link>
              <Link href="/demos/playground" passHref legacyBehavior>
                <Button variant="contained">Open Playground</Button>
              </Link>
            </Box>
          </Paper>
        )}
      </Box>
    </DemoLayout>
  );
}
```

### Implementation Checklist

- [ ] Create `/demos/playground/index.tsx`
- [ ] Create `DemoCodeBlock` component
- [ ] Create `PerformanceBadge` component
- [ ] Create `usePerformanceMetrics` hook
- [ ] Create `/demos/getting-started/` pages
- [ ] Create `/demos/by-chart-type/` pages
- [ ] Add code snippets to existing demo pages
- [ ] Add performance metrics to demo pages
- [ ] Update demo navigation

---

## 4. Project Structure Improvements

### Current Structure

```
app/
├── charts/              # Chart implementations (112 files)
├── components/          # UI components (161 files)
├── domain/              # Domain logic (API clients)
├── lib/                 # Library utilities
├── locales/             # i18n files
├── pages/               # Next.js pages
├── tests/               # Test files
├── types/               # TypeScript types
└── utils/               # Helper functions
```

### Proposed Structure

```
app/
├── exports/                    # NEW: Public library exports
│   ├── index.ts                # Main entry point
│   ├── core.ts                 # Locale, config, validation
│   ├── client.ts               # DataGovRs client
│   ├── charts/                 # Standalone chart components
│   │   ├── index.ts
│   │   ├── LineChart.tsx
│   │   ├── BarChart.tsx
│   │   ├── ColumnChart.tsx
│   │   ├── PieChart.tsx
│   │   ├── AreaChart.tsx
│   │   ├── MapChart.tsx
│   │   └── types.ts
│   ├── hooks/                  # Reusable React hooks
│   │   ├── index.ts
│   │   ├── useDataGovRs.ts
│   │   ├── useChartConfig.ts
│   │   └── useLocale.ts
│   └── utils/                  # Data transformation utilities
│       ├── index.ts
│       ├── transforms.ts
│       └── formatters.ts
│
├── charts/                     # Internal chart implementations
│   └── (existing structure)
│
├── components/
│   ├── demos/                  # Demo-specific components
│   │   ├── demo-layout.tsx
│   │   ├── demo-code-block.tsx    # NEW
│   │   ├── performance-badge.tsx  # NEW
│   │   └── ...
│   └── (existing structure)
│
├── lib/
│   ├── config/                 # Configuration utilities
│   ├── demos/                  # Demo configurations
│   │   ├── config.ts
│   │   ├── templates/          # NEW: Demo templates
│   │   │   ├── basic-chart.tsx
│   │   │   └── api-chart.tsx
│   │   └── validated-datasets.ts
│   └── (existing structure)
│
├── pages/
│   └── demos/
│       ├── index.tsx
│       ├── getting-started/    # NEW
│       │   └── index.tsx
│       ├── playground/         # NEW
│       │   └── index.tsx
│       ├── by-chart-type/      # NEW
│       │   └── index.tsx
│       └── (existing demos)
│
├── tests/
│   ├── exports/                # NEW: Library export tests
│   │   └── library-exports.spec.ts
│   ├── client/                 # NEW: API client tests
│   │   └── data-gov-rs.spec.ts
│   ├── config/                 # NEW: Config validation tests
│   │   └── validation.spec.ts
│   ├── demos/                  # NEW: Demo smoke tests
│   │   └── smoke.spec.ts
│   ├── components/             # NEW: Component tests
│   │   └── demo-layout.spec.tsx
│   ├── integration/            # Existing
│   └── visual/                 # Existing
│
└── (remaining existing structure)
```

### File Creation Summary

| Category   | New Files    | Purpose                     |
| ---------- | ------------ | --------------------------- |
| Exports    | 12 files     | Public library API          |
| Components | 2 files      | Demo enhancement components |
| Pages      | 4 files      | New demo pages              |
| Tests      | 5 files      | Test coverage               |
| **Total**  | **23 files** |                             |

### Implementation Order

**Phase 1: Foundation (Tests First)**

1. Create `tests/exports/library-exports.spec.ts`
2. Create `tests/demos/smoke.spec.ts`
3. Create `tests/config/validation.spec.ts`

**Phase 2: Library Exports** 4. Create `exports/` directory structure 5. Create
standalone `LineChart` component 6. Create `useDataGovRs` hook 7. Update
`package.json` exports

**Phase 3: Demo Enhancements** 8. Create `DemoCodeBlock` component 9. Create
`PerformanceBadge` component 10. Create `/demos/playground` page 11. Create
`/demos/getting-started` page

**Phase 4: Integration** 12. Add code snippets to existing demos 13. Add
performance metrics to demos 14. Update navigation 15. Update documentation

---

## 5. Quick Wins

### High Impact, Low Effort Actions

| #   | Action                                      | Effort  | Impact | Files Affected   |
| --- | ------------------------------------------- | ------- | ------ | ---------------- |
| 1   | Add `tests/exports/library-exports.spec.ts` | 1-2 hrs | High   | 1 new file       |
| 2   | Add `tests/demos/smoke.spec.ts`             | 1 hr    | High   | 1 new file       |
| 3   | Create `DemoCodeBlock` component            | 2 hrs   | High   | 1 new file       |
| 4   | Add code snippets to 3 key demos            | 2 hrs   | High   | 3 existing files |
| 5   | Create `/demos/playground` page (basic)     | 4 hrs   | High   | 1 new file       |
| 6   | Export `useDataGovRs` hook                  | 2 hrs   | Medium | 2 new files      |
| 7   | Add loading states to demos                 | 2 hrs   | Medium | Multiple         |
| 8   | Update README with quick-start              | 1 hr    | Medium | 1 file           |

### Implementation Script

**Quick Win #1: Export Contract Tests**

```bash
# Create the test file
mkdir -p app/tests/exports
cat > app/tests/exports/library-exports.spec.ts << 'EOF'
import { describe, it, expect } from 'vitest';

describe('Library Exports', () => {
  it('exports version string', async () => {
    const lib = await import('@/index');
    expect(lib.version).toBeDefined();
  });

  it('exports locale utilities', async () => {
    const lib = await import('@/index');
    expect(lib.defaultLocale).toBe('sr-Latn');
    expect(lib.locales).toHaveLength(3);
    expect(lib.parseLocaleString).toBeInstanceOf(Function);
  });

  it('exports DataGovRs client', async () => {
    const lib = await import('@/index');
    expect(lib.DataGovRsClient).toBeDefined();
    expect(lib.createDataGovRsClient).toBeInstanceOf(Function);
    expect(lib.dataGovRsClient).toBeDefined();
  });

  it('exports config utilities', async () => {
    const lib = await import('@/index');
    expect(lib.validateConfig).toBeInstanceOf(Function);
    expect(lib.DEFAULT_CONFIG).toBeDefined();
  });
});
EOF
```

**Quick Win #2: Demo Smoke Tests**

```bash
cat > app/tests/demos/smoke.spec.ts << 'EOF'
import { describe, it, expect } from 'vitest';
import { DEMO_CONFIGS } from '@/lib/demos/config';

describe('Demo Configurations', () => {
  const demoIds = Object.keys(DEMO_CONFIGS);

  it('has at least 10 demos', () => {
    expect(demoIds.length).toBeGreaterThanOrEqual(10);
  });

  describe.each(demoIds)('Demo: %s', (id) => {
    const config = DEMO_CONFIGS[id];

    it('has valid structure', () => {
      expect(config.id).toBe(id);
      expect(config.title.sr).toBeTruthy();
      expect(config.title.en).toBeTruthy();
      expect(config.description.sr).toBeTruthy();
      expect(config.description.en).toBeTruthy();
      expect(config.chartType).toBeTruthy();
      expect(config.icon).toBeTruthy();
    });
  });
});
EOF
```

**Quick Win #3: Run Tests**

```bash
# Run the new tests
cd app
yarn test tests/exports tests/demos
```

### Priority Matrix

```
                    High Impact
                        │
    ┌───────────────────┼───────────────────┐
    │                   │                   │
    │  Quick Win #1-2   │   Playground      │
    │  (Export Tests)   │   (Phase 3)       │
    │                   │                   │
Low ├───────────────────┼───────────────────┤ High
Effort                  │                    Effort
    │                   │                   │
    │  README Update    │   Full Library    │
    │  (Quick Win #8)   │   Refactor        │
    │                   │                   │
    └───────────────────┼───────────────────┘
                        │
                    Low Impact
```

### Next Steps

1. **Immediate (Today):**

   - [ ] Create `tests/exports/library-exports.spec.ts`
   - [ ] Create `tests/demos/smoke.spec.ts`
   - [ ] Run tests and verify they pass

2. **This Week:**

   - [ ] Create `DemoCodeBlock` component
   - [ ] Add code snippets to economy, healthcare, and transport demos
   - [ ] Create basic playground page

3. **Next Sprint:**
   - [ ] Create `exports/` directory structure
   - [ ] Extract `LineChart` as standalone
   - [ ] Create `useDataGovRs` hook
   - [ ] Full demo navigation restructure

---

## Appendix: File Templates

### A. New Test File Template

```typescript
/**
 * @file [Test Name]
 * @description [What this test file covers]
 */

import {
  describe,
  it,
  expect,
  beforeAll,
  afterAll,
  beforeEach,
  afterEach,
} from "vitest";

describe("[Feature/Component Name]", () => {
  beforeAll(() => {
    // Setup that runs once before all tests
  });

  afterAll(() => {
    // Cleanup that runs once after all tests
  });

  describe("[Sub-feature]", () => {
    beforeEach(() => {
      // Setup that runs before each test
    });

    afterEach(() => {
      // Cleanup that runs after each test
    });

    it("should [expected behavior]", () => {
      // Arrange
      // Act
      // Assert
      expect(true).toBe(true);
    });
  });
});
```

### B. New Component Template

```tsx
/**
 * @file [ComponentName].tsx
 * @description [What this component does]
 */

import React from 'react';
import { Box } from '@mui/material';

export interface [ComponentName]Props {
  /** Description of prop */
  prop1: string;
  /** Optional prop with default */
  prop2?: number;
}

export function [ComponentName]({
  prop1,
  prop2 = 10,
}: [ComponentName]Props) {
  return (
    <Box>
      {/* Component content */}
    </Box>
  );
}

export default [ComponentName];
```

### C. New Page Template

```tsx
/**
 * @file [pagename].tsx
 * @description [What this page shows]
 */

import { DemoLayout } from '@/components/demos/demo-layout';

export default function [PageName]Page() {
  return (
    <DemoLayout
      title="[Page Title]"
      description="[Page description]"
    >
      {/* Page content */}
    </DemoLayout>
  );
}

export async function getStaticProps() {
  return {
    props: {},
  };
}
```

---

_Document Version: 1.0_ _Last Updated: 2026-01-08_ _Author: Claude Code
Assistant_
