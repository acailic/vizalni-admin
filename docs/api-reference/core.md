# Core API

Complete reference for core functionality exported from
`@acailic/vizualni-admin/core`.

## Overview

Core utilities for locale handling, configuration validation, and
internationalization. These are pure JavaScript/TypeScript utilities with no
React dependencies.

## Import

```typescript
// Import from main package
import {
  validateConfig,
  DEFAULT_CONFIG,
  locales,
  parseLocaleString,
  i18n,
} from "@acailic/vizualni-admin";

// Import from sub-path (recommended for tree-shaking)
import {
  validateConfig,
  DEFAULT_CONFIG,
  locales,
  parseLocaleString,
  i18n,
} from "@acailic/vizualni-admin/core";
```

## Available Functions

### Configuration

#### validateConfig

Validate configuration objects against schema.

**Signature:**

```typescript
function validateConfig(config: any, schema?: ConfigSchema): ValidationResult;
```

**Parameters:**

- `config: any` - Configuration object to validate
- `schema?: ConfigSchema` - Optional custom schema

**Returns:** Validation result

**Example:**

```typescript
import { validateConfig, DEFAULT_CONFIG } from "@acailic/vizualni-admin/core";

const myConfig = {
  ...DEFAULT_CONFIG,
  locale: "sr-Latn",
  theme: "dark",
};

const validation = validateConfig(myConfig);

if (validation.isValid) {
  console.log("Configuration is valid");
} else {
  console.error("Validation errors:", validation.issues);
}
```

#### DEFAULT_CONFIG

Default configuration values for the application.

**Type:** `VizualniAdminConfig`

**Example:**

```typescript
import { DEFAULT_CONFIG } from "@acailic/vizualni-admin/core";

// Start with defaults
const config = {
  ...DEFAULT_CONFIG,
  locale: "sr-Cyrl",
};

console.log(DEFAULT_CONFIG);
// {
//   locale: 'sr',
//   theme: 'light',
//   animation: true,
//   responsive: true,
//   ... }
```

### Locale Utilities

#### locales

Available locales in the application.

**Type:** `Locale[]`

**Available Locales:**

- `sr` - Serbian (Latin script)
- `sr-Latn` - Serbian (Latin script, explicit)
- `sr-Cyrl` - Serbian (Cyrillic script)
- `en` - English
- `de` - German
- `fr` - French

**Example:**

```typescript
import { locales } from "@acailic/vizualni-admin/core";

console.log(locales);
// ['sr', 'sr-Latn', 'sr-Cyrl', 'en', 'de', 'fr']
```

#### parseLocaleString

Parse locale string into components.

**Signature:**

```typescript
function parseLocaleString(localeString: string): ParsedLocale;
```

**Parameters:**

- `localeString: string` - Locale string to parse

**Returns:** Parsed locale object

**Example:**

```typescript
import { parseLocaleString } from "@acailic/vizualni-admin/core";

const parsed = parseLocaleString("sr-Latn-RS");
console.log(parsed);
// {
//   language: 'sr',
//   script: 'Latn',
//   region: 'RS',
//   full: 'sr-Latn-RS'
// }
```

#### getD3TimeFormatLocale

Get D3 time format locale for specific locale.

**Signature:**

```typescript
function getD3TimeFormatLocale(locale: Locale): D3TimeFormatLocale;
```

**Parameters:**

- `locale: Locale` - Target locale

**Returns:** D3 time format locale object

**Example:**

```typescript
import { getD3TimeFormatLocale } from "@acailic/vizualni-admin/core";

const srLocale = getD3TimeFormatLocale("sr-Cyrl");
const format = d3.timeFormatLocale(srLocale).format("%B %Y");
console.log(format(new Date())); // "јануар 2024"
```

#### getD3FormatLocale

Get D3 number format locale for specific locale.

**Signature:**

```typescript
function getD3FormatLocale(locale: Locale): D3FormatLocale;
```

**Parameters:**

- `locale: Locale` - Target locale

**Returns:** D3 format locale object

**Example:**

```typescript
import { getD3FormatLocale } from "@acailni-admin/core";

const srLocale = getD3FormatLocale("sr-Latn");
const format = d3.formatLocale(srLocale).format(",.2f");
console.log(format(1234.56)); // "1.234,56"
```

### Internationalization

#### i18n

Internationalization utilities for translation management.

**Methods:**

- `addTranslations(locale, translations)` - Add translations for locale
- `getTranslations(locale)` - Get translations for locale
- `t(key, params)` - Translate key with parameters
- `setLocale(locale)` - Set current locale
- `getLocale()` - Get current locale

**Example:**

```typescript
import { i18n } from "@acailic/vizualni-admin/core";

// Add translations
i18n.addTranslations("sr", {
  "chart.title": "Naslov grafikona",
  "chart.loading": "Učitavanje...",
  "chart.error": "Greška: {{message}}",
});

// Set locale
i18n.setLocale("sr");

// Translate
const title = i18n.t("chart.title");
console.log(title); // "Naslov grafikona"

// Translate with parameters
const error = i18n.t("chart.error", { message: "Nešto pošlo je po zlu" });
console.log(error); // "Greška: Nešto pošlo je po zlu"
```

#### defaultLocale

Default locale for the application.

**Type:** `Locale`

**Value:** `'sr'`

**Example:**

```typescript
import { defaultLocale } from "@acailic/vizualni-admin/core";

console.log(defaultLocale); // 'sr'
```

## Type Definitions

### Locale

```typescript
type Locale = "sr" | "sr-Latn" | "sr-Cyrl" | "en" | "de" | "fr";
```

### VizualniAdminConfig

```typescript
interface VizualniAdminConfig {
  // Locale settings
  locale: Locale;
  fallbackLocale?: Locale;

  // Theme settings
  theme: "light" | "dark" | "auto";

  // Animation settings
  animation: boolean;
  animationDuration?: number;

  // Responsiveness
  responsive: boolean;
  breakpoint?: number;

  // Data settings
  cache?: {
    enabled: boolean;
    ttl?: number;
  };

  // API settings
  api?: {
    baseUrl?: string;
    timeout?: number;
  };

  // Chart defaults
  chartDefaults?: {
    colors?: string[];
    font?: string;
  };
}
```

### ValidationResult

```typescript
interface ValidationResult {
  isValid: boolean;
  issues?: ValidationIssue[];
}

interface ValidationIssue {
  path: string[];
  message: string;
  code?: string;
}
```

### ParsedLocale

```typescript
interface ParsedLocale {
  language: string;
  script?: string;
  region?: string;
  full: string;
}
```

## Usage Examples

### Configuration Management

```typescript
import { validateConfig, DEFAULT_CONFIG } from "@acailic/vizualni-admin/core";

// Create custom configuration
const config = {
  ...DEFAULT_CONFIG,
  locale: "sr-Cyrl",
  theme: "dark",
  animation: {
    duration: 500,
  },
};

// Validate configuration
const validation = validateConfig(config);
if (!validation.isValid) {
  throw new Error(`Invalid config: ${validation.issues.join(", ")}`);
}

// Use configuration
export function useConfig() {
  return config;
}
```

### Locale Handling

```typescript
import {
  parseLocaleString,
  locales,
  getD3TimeFormatLocale,
} from "@acailic/vizualni-admin/core";

// Parse user's locale
function getUserLocale(userLocaleString: string) {
  const parsed = parseLocaleString(userLocaleString);

  // Check if locale is supported
  if (locales.includes(parsed.full as Locale)) {
    return parsed.full;
  }

  // Fall back to language only
  const languageOnly = parsed.language;
  if (locales.includes(languageOnly as Locale)) {
    return languageOnly;
  }

  // Fall back to default
  return "sr";
}

// Use D3 locale
const srLocale = getD3TimeFormatLocale("sr-Cyrl");
const timeFormat = d3.timeFormatLocale(srLocale).format("%d. %B %Y.");
```

### Internationalization

```typescript
import { i18n } from '@acailic/vizualni-admin/core';

// Initialize translations
function setupI18n() {
  i18n.addTranslations('sr', {
    'app.title': 'Vizualni Admin',
    'chart.tooltip.value': 'Vrednost: {{value}}',
    'data.loading': 'Učitavanje podataka...',
    'error.message': 'Greška: {{message}}'
  });

  i18n.addTranslations('en', {
    'app.title': 'Vizualni Admin',
    'chart.tooltip.value': 'Value: {{value}}',
    'data.loading': 'Loading data...',
    'error.message': 'Error: {{message}}'
  });
}

// Use in components
function MyComponent() {
  const title = i18n.t('app.title');
  const tooltipValue = (value: number) =>
    i18n.t('chart.tooltip.value', { value });

  return <div>{title}</div>;
}
```

## Best Practices

1. **Always Validate Configuration**: Validate configuration before use

   ```typescript
   const validation = validateConfig(config);
   if (!validation.isValid) {
     console.error(validation.issues);
   }
   ```

2. **Use Default Config**: Start with DEFAULT_CONFIG and override

   ```typescript
   const config = { ...DEFAULT_CONFIG, locale: "sr-Cyrl" };
   ```

3. **Handle Locale Fallbacks**: Provide fallback locale for missing translations

   ```typescript
   const text =
     i18n.t("key", { locale: "sr" }) || i18n.t("key", { locale: "en" });
   ```

4. **Parse Locale Strings**: Use parseLocaleString for complex locales
   ```typescript
   const parsed = parseLocaleString(userInput);
   if (parsed.script === "Cyrl") {
     // Handle Cyrillic script
   }
   ```

## See Also

- [Chart Components](/api-reference/charts) - Chart component APIs
- [React Hooks](/api-reference/hooks) - React hooks for locale
- [Utilities](/api-reference/utilities) - Format utilities
- [Client API](/api-reference/client) - API client documentation
