# API Stability and Deprecation Policy

This document defines the stability levels for all exported APIs in
`@acailic/vizualni-admin` and establishes the deprecation policy for breaking
changes.

---

## Table of Contents

- [Stability Levels](#stability-levels)
- [Classification Criteria](#classification-criteria)
- [Current API Classifications](#current-api-classifications)
  - [Chart Components](#chart-components-acailicvizualni-admincharts)
  - [Chart Plugin System](#chart-plugin-system-acailicvizualni-admincharts)
  - [React Hooks](#react-hooks-acailicvizualni-adminhooks)
  - [Utility Functions](#utility-functions-acailicvizualni-adminutils)
  - [Core Exports](#core-exports-acailicvizualni-admincore)
  - [Data.gov.rs Client](#datagovrs-client-acailicvizualni-adminclient)
  - [Data Connectors](#data-connectors-acailicvizualni-adminconnectors)
- [Deprecation Policy](#deprecation-policy)
- [Versioning Policy](#versioning-policy)
- [Migration Guidelines](#migration-guidelines)

---

## Stability Levels

We use three stability levels to communicate the maturity and commitment to
backward compatibility for each API:

### Stable

**Definition**: APIs that are production-ready and covered by our semantic
versioning commitment. Breaking changes to these APIs will follow the
deprecation policy and require a major version bump.

**Characteristics**:

- Well-documented with comprehensive examples
- Tested with unit and integration tests
- Used in production by the maintainers
- Backward compatibility is maintained within major versions
- Have a mature, finalized API design

**Markers**:

- JSDoc comment: `@stable`
- Explicit stability label in API documentation

**Example**:

```typescript
/**
 * Format a number with thousand separators and decimal places
 * @stable
 * @version 0.1.0
 */
export function formatNumber(
  value: number,
  locale: Locale = "sr-Latn"
): string {
  // ...
}
```

### Experimental

**Definition**: APIs that are under active development and may change in future
releases. These are provided for early feedback and testing but should not be
used in production without accepting potential breaking changes.

**Characteristics**:

- Documented with usage examples
- Have basic test coverage
- API design may evolve based on feedback
- May have known limitations or bugs
- Not yet used in production or only in limited scenarios

**Markers**:

- JSDoc comment: `@experimental`
- Explicit stability label in API documentation
- Version when first introduced

**Example**:

```typescript
/**
 * Chart plugin registry for dynamic chart registration
 * @experimental
 * @since 0.1.0-beta.1
 * @remark This API is under active development and may change in future releases
 */
export function registerChartPlugin<TConfig>(
  plugin: IChartPlugin<TConfig>,
  options?: RegisterPluginOptions
): PluginRegistrationResult {
  // ...
}
```

### Deprecated

**Definition**: APIs that are no longer recommended for use and will be removed
in a future release. These are maintained for backward compatibility but will
emit warnings when used.

**Characteristics**:

- Superseded by a newer, better API
- Will be removed in a future major or minor version
- Documentation includes migration path
- Runtime warnings may be emitted
- No new features or bug fixes (except critical security issues)

**Markers**:

- JSDoc comment: `@deprecated`
- Removal version specified
- Migration guide reference

**Example**:

```typescript
/**
 * @deprecated Use `formatNumber` instead. This function will be removed in v1.0.0
 * @see formatNumber
 * @removal 1.0.0
 */
export function formatSerbianNumber(value: number): string {
  // ...
}
```

---

## Classification Criteria

APIs are classified based on the following criteria:

### Automatic Promotion to Stable

An API is promoted from Experimental to Stable when it meets **all** of the
following criteria:

1. **Usage**: Used in production by at least one internal project or external
   user
2. **Testing**: Has comprehensive test coverage (unit tests + integration tests)
3. **Documentation**: Complete documentation with examples and edge cases
   covered
4. **Stability**: API has remained unchanged for at least one minor version
   cycle
5. **Feedback**: No breaking-change-inducing feedback from users

### Demotion to Deprecated

An API is marked as Deprecated when:

1. **Replacement Exists**: A better alternative is available and documented
2. **Design Flaws**: Fundamental design issues cannot be fixed without breaking
   changes
3. **Low Usage**: Usage metrics show minimal adoption (after at least one minor
   version)
4. **Maintenance Burden**: The API is too costly to maintain relative to its
   value

### Stability Review Process

Stability reviews occur during:

- **Minor releases**: Review experimental APIs for promotion
- **Major releases**: Review all APIs for deprecation and stability changes
- **As needed**: In response to critical bugs or user feedback

---

## Current API Classifications

### Chart Components (`@acailic/vizualni-admin/charts`)

| Export            | Stability    | Since        | Notes                                        |
| ----------------- | ------------ | ------------ | -------------------------------------------- |
| `LineChart`       | Experimental | 0.1.0-beta.1 | Basic functionality complete, API may evolve |
| `BarChart`        | Experimental | 0.1.0-beta.1 | Basic functionality complete, API may evolve |
| `ColumnChart`     | Experimental | 0.1.0-beta.1 | Basic functionality complete, API may evolve |
| `AreaChart`       | Experimental | 0.1.0-beta.1 | Basic functionality complete, API may evolve |
| `PieChart`        | Experimental | 0.1.0-beta.1 | Basic functionality complete, API may evolve |
| `MapChart`        | Experimental | 0.1.0-beta.1 | D3-based map, API may evolve                 |
| `ChartData`       | Stable       | 0.1.0-beta.1 | Type definition, unlikely to change          |
| `BaseChartConfig` | Stable       | 0.1.0-beta.1 | Type definition, unlikely to change          |
| `ChartProps`      | Experimental | 0.1.0-beta.1 | May add more props as features mature        |

### Chart Plugin System (`@acailic/vizualni-admin/charts`)

| Export                     | Stability    | Since        | Notes                               |
| -------------------------- | ------------ | ------------ | ----------------------------------- |
| `registerChartPlugin`      | Experimental | 0.1.0-beta.1 | Core API design may change          |
| `unregisterChartPlugin`    | Experimental | 0.1.0-beta.1 | Core API design may change          |
| `getChartPlugin`           | Experimental | 0.1.0-beta.1 | Core API design may change          |
| `listChartPlugins`         | Experimental | 0.1.0-beta.1 | Core API design may change          |
| `hasChartPlugin`           | Experimental | 0.1.0-beta.1 | Core API design may change          |
| `clearChartPlugins`        | Experimental | 0.1.0-beta.1 | Core API design may change          |
| `getChartPluginStats`      | Experimental | 0.1.0-beta.1 | Stats format may change             |
| `chartRegistry`            | Experimental | 0.1.0-beta.1 | Internal registry, may refactor     |
| `IChartPlugin`             | Experimental | 0.1.0-beta.1 | Interface may extend with new hooks |
| `ChartPluginMetadata`      | Experimental | 0.1.0-beta.1 | Metadata fields may change          |
| `ChartPluginHooks`         | Experimental | 0.1.0-beta.1 | Hooks may be added/removed          |
| `ChartRegistryEntry`       | Experimental | 0.1.0-beta.1 | Internal type, may change           |
| `PluginRegistrationResult` | Experimental | 0.1.0-beta.1 | Result format may change            |
| `RegisterPluginOptions`    | Experimental | 0.1.0-beta.1 | Options may be added                |
| `IChartRegistry`           | Experimental | 0.1.0-beta.1 | Interface may evolve                |

### React Hooks (`@acailic/vizualni-admin/hooks`)

| Export           | Stability    | Since        | Notes                                   |
| ---------------- | ------------ | ------------ | --------------------------------------- |
| `useDataGovRs`   | Experimental | 0.1.0-beta.1 | API design may change based on usage    |
| `useChartConfig` | Experimental | 0.1.0-beta.1 | Early stage, may refactor               |
| `useLocale`      | Stable       | 0.1.0-beta.1 | Simple, well-tested, unlikely to change |

### Utility Functions (`@acailic/vizualni-admin/utils`)

| Export             | Stability    | Since        | Notes                        |
| ------------------ | ------------ | ------------ | ---------------------------- |
| `sortByKey`        | Stable       | 0.1.0-beta.1 | Simple utility, well-tested  |
| `filterData`       | Stable       | 0.1.0-beta.1 | Simple utility, well-tested  |
| `groupByKey`       | Stable       | 0.1.0-beta.1 | Simple utility, well-tested  |
| `aggregateByKey`   | Stable       | 0.1.0-beta.1 | Simple utility, well-tested  |
| `transformData`    | Experimental | 0.1.0-beta.1 | API may need refinement      |
| `formatNumber`     | Stable       | 0.1.0-beta.1 | Core formatting, well-tested |
| `formatCurrency`   | Stable       | 0.1.0-beta.1 | Core formatting, well-tested |
| `formatPercentage` | Stable       | 0.1.0-beta.1 | Core formatting, well-tested |
| `formatScientific` | Experimental | 0.1.0-beta.1 | May need more options        |

### Core Exports (`@acailic/vizualni-admin/core`)

| Export                     | Stability    | Since        | Notes                               |
| -------------------------- | ------------ | ------------ | ----------------------------------- |
| `defaultLocale`            | Stable       | 0.1.0-beta.1 | Constant, unlikely to change        |
| `locales`                  | Stable       | 0.1.0-beta.1 | Constant, unlikely to change        |
| `parseLocaleString`        | Stable       | 0.1.0-beta.1 | Well-tested, mature                 |
| `i18n`                     | Stable       | 0.1.0-beta.1 | Lingui export, stable               |
| `getD3TimeFormatLocale`    | Stable       | 0.1.0-beta.1 | Well-tested, mature                 |
| `getD3FormatLocale`        | Stable       | 0.1.0-beta.1 | Well-tested, mature                 |
| `Locale` type              | Stable       | 0.1.0-beta.1 | Type definition, unlikely to change |
| `validateConfig`           | Experimental | 0.1.0-beta.1 | Validation rules may evolve         |
| `DEFAULT_CONFIG`           | Experimental | 0.1.0-beta.1 | Config structure may change         |
| `VizualniAdminConfig` type | Experimental | 0.1.0-beta.1 | Type may extend                     |
| `ValidationIssue` type     | Experimental | 0.1.0-beta.1 | Type may extend                     |

### Data.gov.rs Client (`@acailic/vizualni-admin/client`)

| Export                   | Stability    | Since        | Notes                                       |
| ------------------------ | ------------ | ------------ | ------------------------------------------- |
| `DataGovRsClient`        | Experimental | 0.1.0-beta.1 | API may evolve based on data.gov.rs changes |
| `createDataGovRsClient`  | Experimental | 0.1.0-beta.1 | Config options may change                   |
| `dataGovRsClient`        | Experimental | 0.1.0-beta.1 | Default instance, config may change         |
| `DatasetMetadata` type   | Experimental | 0.1.0-beta.1 | May add fields as API evolves               |
| `Organization` type      | Experimental | 0.1.0-beta.1 | May add fields as API evolves               |
| `Resource` type          | Experimental | 0.1.0-beta.1 | May add fields as API evolves               |
| `PaginatedResponse` type | Experimental | 0.1.0-beta.1 | May add fields as API evolves               |
| `SearchParams` type      | Experimental | 0.1.0-beta.1 | May add filters as API evolves              |
| `DataGovRsConfig` type   | Experimental | 0.1.0-beta.1 | Config options may change                   |
| `ApiError` type          | Experimental | 0.1.0-beta.1 | Error format may evolve                     |

### Data Connectors (`@acailic/vizualni-admin/connectors`)

| Export                       | Stability    | Since        | Notes                                       |
| ---------------------------- | ------------ | ------------ | ------------------------------------------- |
| `IDataConnector` interface   | Experimental | 0.1.0-beta.1 | Interface may extend with new methods       |
| `BaseConnectorConfig` type   | Experimental | 0.1.0-beta.1 | Config options may be added                 |
| `DataSchema` type            | Experimental | 0.1.0-beta.1 | Schema structure may evolve                 |
| `DataType` type              | Stable       | 0.1.0-beta.1 | Type union, unlikely to change              |
| `ConnectorResult` type       | Experimental | 0.1.0-beta.1 | Result format may change                    |
| `PaginatedResult` type       | Experimental | 0.1.0-beta.1 | Pagination format may change                |
| `HealthCheckResult` type     | Experimental | 0.1.0-beta.1 | Health check format may change              |
| `ConnectorCapabilities` type | Experimental | 0.1.0-beta.1 | Capabilities may be added                   |
| `ConnectorErrorCode` type    | Stable       | 0.1.0-beta.1 | Error code enum, unlikely to change         |
| `ConnectorFactory` type      | Experimental | 0.1.0-beta.1 | Factory signature may change                |
| `ConnectorError` class       | Experimental | 0.1.0-beta.1 | Error handling may evolve                   |
| `CsvUrlConnector` class      | Experimental | 0.1.0-beta.1 | CSV parsing may improve, options may change |
| `createCsvUrlConnector` fn   | Experimental | 0.1.0-beta.1 | Factory function may change                 |
| `CsvUrlConnectorConfig` type | Experimental | 0.1.0-beta.1 | Config options may be added                 |
| `CsvRow` type                | Experimental | 0.1.0-beta.1 | Row type may change based on parsing        |
| `ConnectorRegistry` class    | Experimental | 0.1.0-beta.1 | Registry API may evolve                     |
| `registerConnector` fn       | Experimental | 0.1.0-beta.1 | Registration API may change                 |
| `unregisterConnector` fn     | Experimental | 0.1.0-beta.1 | Unregistration API may change               |
| `createConnector` fn         | Experimental | 0.1.0-beta.1 | Creation API may change                     |
| `getConnector` fn            | Experimental | 0.1.0-beta.1 | Retrieval API may change                    |
| `listConnectors` fn          | Experimental | 0.1.0-beta.1 | List format may change                      |
| `destroyConnector` fn        | Experimental | 0.1.0-beta.1 | Cleanup API may change                      |

---

## Deprecation Policy

### Deprecation Timeline

1. **Announcement**: Deprecated APIs are announced in:
   - Release notes (minor and major versions)
   - API documentation with `@deprecated` tag
   - Migration guide in `docs/MIGRATION.md`

2. **Support Period**:
   - **Major deprecations**: Supported for at least 2 major versions
   - **Minor deprecations**: Supported for at least 3 minor versions
   - **Experimental deprecations**: Can be removed in any release (with notice)

3. **Removal**:
   - Deprecated APIs are removed only in major version bumps
   - Exceptions: Experimental APIs can be removed in minor versions with notice

### Deprecation Process

When deprecating an API:

1. **Document the deprecation**:

   ```typescript
   /**
    * @deprecated Use `newApiFunction` instead
    * @see newApiFunction
    * @removal 2.0.0
    * @migration Follow the guide in docs/MIGRATION.md#oldApiFunction
    */
   export function oldApiFunction() {}
   ```

2. **Add runtime warning** (if applicable):

   ```typescript
   export function oldApiFunction() {
     if (process.env.NODE_ENV !== "production") {
       console.warn(
         "[@acailic/vizualni-admin] oldApiFunction is deprecated and will be removed in v2.0.0. " +
           "Use newApiFunction instead. See docs/MIGRATION.md for details."
       );
     }
     // ... implementation
   }
   ```

3. **Create migration guide** in `docs/MIGRATION.md`:

   ````markdown
   ## oldApiFunction → newApiFunction

   **Deprecated**: v1.5.0 | **Removed**: v2.0.0

   ### Before

   ```ts
   import { oldApiFunction } from "@acailic/vizualni-admin";
   oldApiFunction(data, options);
   ```
   ````

   ### After

   ```ts
   import { newApiFunction } from "@acailic/vizualni-admin";
   newApiFunction({ data, ...options });
   ```

   **Key changes**:
   - Options object is now the first parameter
   - `dataType` option is now inferred automatically

   ```

   ```

4. **Update release notes** with:
   - What was deprecated
   - Why it was deprecated
   - What to use instead
   - Link to migration guide

### Breaking Changes

A change is considered "breaking" if it:

- Changes the API signature (parameters, return type)
- Changes runtime behavior in a way that breaks existing code
- Removes a previously public API
- Changes the semantics of an API in an incompatible way

**Exceptions** (not considered breaking):

- Changes to experimental APIs (with documentation update)
- Bug fixes that change behavior to match documentation
- Adding new optional parameters
- Adding new type members (for TypeScript types)

---

## Versioning Policy

We follow [Semantic Versioning 2.0.0](https://semver.org/):

- **MAJOR**: Incompatible API changes
- **MINOR**: Backward-compatible functionality additions
- **PATCH**: Backward-compatible bug fixes

### Stability and Versioning

| Stability Level | Breaking Changes                  | Version Impact      |
| --------------- | --------------------------------- | ------------------- |
| Stable          | Follow semantic versioning        | Requires MAJOR bump |
| Experimental    | Can change without major bump     | Documented in MINOR |
| Deprecated      | No new features, removal in MAJOR | Documented in MINOR |

### Version Examples

- `0.1.0` → `0.2.0`: Added new chart type, experimental API changes
- `0.2.0` → `1.0.0`: Promoted core APIs to stable, removed deprecated APIs
- `1.0.0` → `1.1.0`: Added new stable features, no breaking changes
- `1.1.0` → `2.0.0`: Breaking changes to stable APIs

### Pre-release Versions

Pre-release versions (e.g., `0.1.0-beta.1`) may have:

- Experimental APIs with no stability guarantee
- Breaking changes between pre-releases
- Incomplete documentation

**Do not use pre-release versions in production.**

---

## Migration Guidelines

### For Users

When using `@acailic/vizualni-admin`:

1. **Check stability levels** before using APIs in production
2. **Avoid experimental APIs** unless you're willing to accept breaking changes
3. **Watch for deprecation warnings** in development builds
4. **Review migration guides** when upgrading versions
5. **Test thoroughly** when upgrading to a new major version

### For Contributors

When adding or modifying APIs:

1. **Mark new APIs as experimental** by default
2. **Add JSDoc stability markers** (`@stable`, `@experimental`, `@deprecated`)
3. **Document the stability level** in `docs/API.md` and `docs/API_STABILITY.md`
4. **Update the classification table** in this document
5. **Follow the deprecation process** when removing or changing APIs
6. **Create migration guides** for breaking changes

### Promotion Checklist

Before promoting an experimental API to stable, ensure:

- [ ] Used in production or by multiple users
- [ ] Comprehensive test coverage (>80%)
- [ ] Complete documentation with examples
- [ ] API unchanged for at least one minor version
- [ ] No outstanding issues or design concerns
- [ ] Migration guide exists (if replacing another API)
- [ ] JSDoc updated with `@stable` marker
- [ ] Documentation updated in `docs/API.md`

---

## Related Documentation

- [API Documentation](./API.md) - Complete API reference with stability labels
- [Migration Guide](./MIGRATION.md) - Step-by-step migration guides for
  deprecated APIs
- [Architecture](./ARCHITECTURE.md) - System architecture and design decisions
- [Contributing Guide](../CONTRIBUTING.md) - How to contribute to the project

---

## Questions and Feedback

If you have questions about API stability or deprecation:

- Check the [migration guide](./MIGRATION.md) for deprecated APIs
- Review [GitHub Issues](https://github.com/acailic/vizualni-admin/issues) for
  ongoing discussions
- Open a new issue for API stability questions or feedback
- Join the discussion in
  [GitHub Discussions](https://github.com/acailic/vizualni-admin/discussions)
