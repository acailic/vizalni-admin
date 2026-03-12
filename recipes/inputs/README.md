# Recipe Input Files

These templates drive file-based Goose workflows. Copy a template, fill it in, and point a recipe at it.

## Usage

1. Copy the relevant template:
   ```bash
   cp recipes/inputs/feature-request-template.md recipes/inputs/feature-add-dataset-export.md
   ```

2. Fill in the fields. Be specific. The more concrete your input, the better the agent's output.

3. Run the recipe referencing your input:
   ```bash
   goose run --recipe recipes/plan-feature.yaml -- --input recipes/inputs/feature-add-dataset-export.md
   ```

## Templates

| Template | Used by | Purpose |
|----------|---------|---------|
| `feature-request-template.md` | `plan-feature.yaml` | Describe a feature to plan |
| `bug-report-template.md` | `debug-issue.yaml` | Describe a bug to investigate |
| `refactor-request-template.md` | `refactor-safely.yaml` | Describe a refactor to execute |
| `release-input-template.md` | `ship-checklist.yaml` | Define a release to prepare |
| `review-scope-template.md` | `review-code.yaml`, `pr-review.yaml` | Define what code to review |

## Naming convention

Name filled-in inputs descriptively:
- `feature-dataset-csv-export.md`
- `bug-chart-crashes-on-empty-data.md`
- `refactor-extract-api-client.md`
- `release-v1.2.0.md`
- `review-chart-renderer-rewrite.md`

Keep completed inputs in `recipes/inputs/` so they serve as a log of work. Add them to `.gitignore` if you prefer not to track them, or commit them as engineering artifacts.
