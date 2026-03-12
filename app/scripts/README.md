# Scripts

This directory contains utility scripts for development and maintenance tasks.

## Localization Audit

### `check-translation-gaps.ts`

Automated script to audit translation parity between English and Serbian
locales.

**Usage:**

```bash
node scripts/check-translation-gaps.ts
```

**What it does:**

1. Extracts all translation keys from locale files:
   - `app/locales/en/messages.ts`
   - `app/locales/sr-Latn/messages.ts`
   - `app/locales/sr-Cyrl/messages.ts`

2. Compares key presence across locales:
   - Identifies missing keys in Serbian locales
   - Identifies extra keys (present in sr but not en)
   - Verifies total key counts match

3. Reports on:
   - Total key counts per locale
   - Missing keys in each Serbian locale
   - Extra keys in each Serbian locale
   - Priority UI surface key coverage

**Output:**

```
=== Translation Audit Report ===

Total keys in English: 636
Total keys in sr-Latn: 636
Total keys in sr-Cyrl: 636

✅ No missing keys in sr-Latn
✅ No missing keys in sr-Cyrl

📊 Summary:
   - Missing keys in sr-Latn: 0
   - Missing keys in sr-Cyrl: 0
   - Extra keys in sr-Latn: 0
   - Extra keys in sr-Cyrl: 0

✅ All translation keys are in sync!
```

**When to run:**

- After adding new translation keys
- Before releases to verify locale parity
- After merging translation updates
- As part of CI/CD quality checks

**Integration with CI:**

Add to your CI pipeline:

```yaml
- name: Check translation parity
  run: node scripts/check-translation-gaps.ts
```

## Adding New Scripts

When adding new scripts:

1. Use descriptive names with kebab-case
2. Include a shebang line (`#!/usr/bin/env node` or `#!/usr/bin/env tsx`)
3. Add usage comments at the top
4. Update this README with:
   - Script name
   - Purpose
   - Usage instructions
   - Output examples
   - When to run it

5. Make scripts executable:
   ```bash
   chmod +x scripts/your-script.ts
   ```
