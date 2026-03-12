# Configuration Module

Source-of-truth schema, types, defaults, and validation for Vizualni Admin configurations.

## Files
- `schema.json` — JSON Schema (draft 2020-12) describing the config structure.
- `types.ts` — TypeScript interfaces matching the schema.
- `defaults.ts` — Sensible defaults used by the config UI and onboarding.
- `validator.ts` — Ajv-based runtime validator that returns friendly errors.

## Shape
```json
{
  "project": { "name": "", "language": "sr|en", "theme": "light|dark|custom" },
  "categories": { "enabled": [], "featured": [] },
  "datasets": { "autoDiscovery": true, "manualIds": { "<category>": ["id1", "id2"] } },
  "visualization": { "defaultChartType": "bar|line|area|pie|map|table", "colorPalette": "", "customColors": [] },
  "features": { "embedding": false, "export": true, "sharing": true, "tutorials": true },
  "deployment": { "basePath": "/", "customDomain": "", "target": "local|github-pages|custom" }
}
```

## Usage
```ts
import { DEFAULT_CONFIG } from "@/lib/config/defaults";
import { validateConfig } from "@/lib/config/validator";

const candidate = loadFromSomewhere();
const result = validateConfig(candidate);

if (result.valid) {
  // result.data is typed as VizualniAdminConfig
} else {
  console.error(result.errors);
}
```

Keep the JSON Schema as the single source of truth; update `types.ts` and `defaults.ts` when the schema changes.
