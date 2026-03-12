{
  "name": "my-visualization-project",
  "dependencies": {
    "visualize-admin": "^6.2.0"
  },
  "repository": {
    "url": "https://github.com/swiss/visualize-admin"
  }
}
```

**package.json** - After:
```json
{
  "name": "my-visualization-project",
  "dependencies": {
    "@acailic/vizualni-admin": "^1.0.0"
  },
  "repository": {
    "url": "https://github.com/acailic/vizualni-admin"
  }
}
```

**Configuration** - Before (Swiss data):
```typescript
const config = {
  dataSource: {
    url: "https://swiss-data-api.example.com",
    // ... other Swiss-specific config
  }
};
```

**Configuration** - After (Serbian data):
```typescript
const config = {
  dataSource: {
    url: "https://data.gov.rs/api",
    // ... Serbian-specific config
  }
};
```

### Automated Migration Script

No automated script is available for this major migration. Manual updates are required due to the significant changes in data sources and branding.

## Upgrading from v1.0.0 to v1.0.1

This is a maintenance release with cleanup changes.

### Breaking Changes

None

### Deprecated Features

- Duplicate configuration files
- Deprecated component files
- Temporary planning documents

### Migration Steps

1. Update package version in `package.json`
2. No code changes required

### Code Examples

**package.json**:
```json
{
  "dependencies": {
    "@acailic/vizualni-admin": "^1.0.1"
  }
}
```

## Upgrading from v1.0.1 to v0.1.0-beta.1

This release introduces the npm package format and build tooling changes.

### Breaking Changes

- **Build Tooling**: Switched from preconstruct to tsup
- **Import Paths**: Changed from `@/` aliases to relative imports
- **Package Entry Points**: Updated for modern module resolution

### Deprecated Features

None

### Migration Steps

1. Update package version
2. Update import statements to use relative paths
3. Verify package entry points work correctly

### Code Examples

**Imports** - Before:
```typescript
import { parseLocaleString } from '@/locales/utils';
import { ConfigType } from '@/config/types';
```

**Imports** - After:
```typescript
import { parseLocaleString } from './locales/utils';
import { ConfigType } from './config/types';
```

### Automated Migration Script

For import path changes, you can use a find-and-replace tool or script:

```bash
# Example sed command to update imports (use with caution)
find . -name "*.ts" -o -name "*.tsx" | xargs sed -i 's|@/|./|g'
```

## Upgrading from v0.1.0-beta.1 to v1.0.0

This release expands the package with full component exports and additional features.

### Breaking Changes

None planned - this is an additive release.

### New Features

- Full component exports (Configurator, Charts, etc.)
- Expanded TypeScript types
- Additional utility functions
- CLI tools
- Enhanced documentation

### Deprecated Features

None

### Migration Steps

1. Update package version in `package.json`
2. No code changes required - new exports are additive
3. Optionally adopt new components and utilities

### Code Examples

**New Exports Available**:
```typescript
// Additional exports now available
import {
  Configurator,
  Chart,
  // ... other components
  transformData,
  useChartData
} from '@acailic/vizualni-admin';