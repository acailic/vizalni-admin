# Goose Recipes

Autonomous and human-triggered engineering workflows for this repository.

## Folder structure

```
recipes/
├── README.md                         # This file
├── repo-context.md                   # Project description, stack, conventions
├── standards.md                      # Coding, testing, and review standards
├── architecture-notes.md             # Intended architecture and boundaries
│
├── inputs/                           # File-driven workflow inputs
│   ├── README.md                     # How to use input files
│   ├── feature-request-template.md   # Template: feature to plan
│   ├── bug-report-template.md        # Template: bug to investigate
│   ├── refactor-request-template.md  # Template: refactor to execute
│   ├── release-input-template.md     # Template: release to prepare
│   └── review-scope-template.md      # Template: code to review
│
├── outputs/                          # Generated reports (gitignored or committed)
│
├── review-code.yaml                  # Human: deep code review
├── plan-feature.yaml                 # Human: feature implementation plan
├── debug-issue.yaml                  # Human: systematic debugging
├── fix-failing-tests.yaml            # Human: diagnose and fix test failures
├── refactor-safely.yaml              # Human: safe incremental refactoring
├── pr-review.yaml                    # Human: pull request review
├── ship-checklist.yaml               # Human: pre-release verification
│
├── nightly-review.yaml               # Scheduled: daily health check
├── weekly-release-readiness.yaml     # Scheduled: weekly release assessment
├── architecture-drift-review.yaml    # Scheduled: weekly architecture audit
├── test-health-check.yaml            # Scheduled: test suite assessment
│
└── workers/                          # Focused reusable checks
    ├── risky-code-scan.yaml          # Scan for unsafe patterns
    ├── test-health.yaml              # Quick test suite status
    ├── dependency-check.yaml         # Dependency health audit
    ├── docs-drift.yaml               # Documentation accuracy check
    ├── config-drift.yaml             # Configuration consistency check
    └── migration-risk-check.yaml     # Upgrade and deprecation risks
```

## Setup

### Set the recipe path

```bash
export GOOSE_RECIPE_PATH="./recipes"
```

Or add to your shell profile:
```bash
echo 'export GOOSE_RECIPE_PATH="./recipes"' >> ~/.bashrc
```

### Create the outputs directory

```bash
mkdir -p recipes/outputs
```

Optionally gitignore outputs:
```bash
echo "recipes/outputs/" >> .gitignore
```

Or commit them as engineering artifacts for trend tracking.

### Repo automation helpers

This repository now includes shell wrappers for headless Goose usage:

```bash
# Install the official Goose CLI to ~/.local/bin
npm run goose:install:cli

# Run any recipe with logging to recipes/outputs/
npm run goose:run -- recipes/nightly-review.yaml

# Install the default local Goose schedules for this repo
npm run goose:schedule:install
```

The schedule installer creates four Goose-native schedules with these IDs:

- `vizuelni-nightly-review`
- `vizuelni-weekly-release-readiness`
- `vizuelni-architecture-drift`
- `vizuelni-test-health`

If you change the underlying recipe files later, rerun `npm run goose:schedule:install` so Goose refreshes its copied scheduled recipes.

## How to use

### Human-triggered recipes

Run from the repo root:

```bash
# Code review (interactive — agent asks what to review)
goose run --recipe recipes/review-code.yaml

# Code review (file-driven — reads from input file)
cp recipes/inputs/review-scope-template.md recipes/inputs/review-chart-renderer.md
# Edit the file, then:
goose run --recipe recipes/review-code.yaml

# Plan a feature
cp recipes/inputs/feature-request-template.md recipes/inputs/feature-csv-export.md
# Fill it in, then:
goose run --recipe recipes/plan-feature.yaml

# Plan a specific roadmap feature from recipes/inputs/plans/
npm run goose:plan -- recipes/inputs/plans/feature-04-chart-configurator.md
# Writes the final plan to recipes/outputs/plan-feature-04-chart-configurator.md

# Debug an issue
cp recipes/inputs/bug-report-template.md recipes/inputs/bug-map-not-loading.md
# Fill it in, then:
goose run --recipe recipes/debug-issue.yaml

# Fix failing tests
goose run --recipe recipes/fix-failing-tests.yaml

# Safe refactor
cp recipes/inputs/refactor-request-template.md recipes/inputs/refactor-split-api-client.md
# Fill it in, then:
goose run --recipe recipes/refactor-safely.yaml

# PR review (reviews current branch vs main)
goose run --recipe recipes/pr-review.yaml

# Ship checklist
cp recipes/inputs/release-input-template.md recipes/inputs/release-v1.1.0.md
# Fill it in, then:
goose run --recipe recipes/ship-checklist.yaml
```

### Scheduled recipes

These are designed for unattended execution. Run via cron, CI, or any scheduler:

```bash
# Nightly health check (run every night)
goose run --recipe recipes/nightly-review.yaml

# Weekly release readiness (run Monday mornings)
goose run --recipe recipes/weekly-release-readiness.yaml

# Weekly architecture drift (run mid-week)
goose run --recipe recipes/architecture-drift-review.yaml

# Weekly test health (run end of week)
goose run --recipe recipes/test-health-check.yaml
```

Example crontab:
```cron
# Nightly review at 2am
0 2 * * * cd /path/to/repo && goose run --recipe recipes/nightly-review.yaml >> recipes/outputs/nightly.log 2>&1

# Weekly release readiness, Monday 8am
0 8 * * 1 cd /path/to/repo && goose run --recipe recipes/weekly-release-readiness.yaml >> recipes/outputs/weekly-release.log 2>&1

# Architecture drift, Wednesday 8am
0 8 * * 3 cd /path/to/repo && goose run --recipe recipes/architecture-drift-review.yaml >> recipes/outputs/arch-drift.log 2>&1

# Test health, Friday 8am
0 8 * * 5 cd /path/to/repo && goose run --recipe recipes/test-health-check.yaml >> recipes/outputs/test-health.log 2>&1
```

### GitHub Actions scheduling

The repo includes [`.github/workflows/goose-recipes.yml`](../.github/workflows/goose-recipes.yml) for scheduled or manual recipe runs in GitHub Actions.

Required repository secrets:

- `GOOSE_CONFIG_YAML`: the contents of your `~/.config/goose/config.yaml`
- `GOOSE_SECRETS_YAML`: optional, the contents of your `~/.config/goose/secrets.yaml`

The workflow installs the official Goose CLI, writes those config files at runtime, runs the selected recipe, and uploads logs from `recipes/outputs/` as an artifact.

### Worker recipes

Run standalone for focused checks:

```bash
goose run --recipe recipes/workers/risky-code-scan.yaml
goose run --recipe recipes/workers/test-health.yaml
goose run --recipe recipes/workers/dependency-check.yaml
goose run --recipe recipes/workers/docs-drift.yaml
goose run --recipe recipes/workers/config-drift.yaml
goose run --recipe recipes/workers/migration-risk-check.yaml
```

Workers are also referenced by larger recipes and can be composed into custom workflows.

## File-driven workflow

The input file workflow:

1. **Copy a template** from `recipes/inputs/` and give it a descriptive name
2. **Fill in the fields** — be specific, skip fields you don't know
3. **Run the recipe** — the recipe auto-discovers input files by pattern
4. **Review the output** — the agent produces structured findings

For roadmap features already stored under `recipes/inputs/plans/`, prefer
`npm run goose:plan -- <path>` so Goose evaluates only the specified feature
input instead of scanning every `feature-*.md` file in the repo.
The wrapper persists Goose's final answer directly to
`recipes/outputs/plan-<feature-file-name>.md` by default.

Input files serve as both instructions and documentation. Keep them around as a record of engineering decisions.

### How recipes find inputs

Recipes look for non-template files matching their pattern in `recipes/inputs/`:
- `plan-feature.yaml` first looks for `inputs/plans/feature-*.md`, then falls back to `inputs/feature-*.md`
- `debug-issue.yaml` looks for `inputs/bug-*.md`
- `refactor-safely.yaml` looks for `inputs/refactor-*.md`
- `ship-checklist.yaml` looks for `inputs/release-*.md`
- `review-code.yaml` and `pr-review.yaml` look for `inputs/review-*.md`

If multiple matching files exist, the agent will use the most recently modified one or ask which to use.

## Context files

Three files provide standing context to every recipe:

| File | Purpose | Update frequency |
|------|---------|------------------|
| `repo-context.md` | Project description, stack, directory layout | When project structure changes |
| `standards.md` | Coding and review expectations | When standards evolve |
| `architecture-notes.md` | Intended architecture and boundaries | When architecture decisions change |

Keep these files accurate. Recipes trust them. Stale context produces stale advice.

## Extending the system

### Add a new recipe

1. Create `recipes/your-recipe.yaml` with `title`, `description`, and `prompt`
2. Reference context files with `{{ recipe_dir }}/repo-context.md`
3. If file-driven, document the expected input pattern
4. Add structured output format to the prompt
5. Add validation steps if the recipe makes changes

### Add a new worker

1. Create `recipes/workers/your-worker.yaml`
2. Keep it focused on one concern
3. Make the output format table-based for easy scanning
4. End with a status line: HEALTHY / NEEDS ATTENTION / AT RISK

### Add a new input template

1. Create `recipes/inputs/your-template.md`
2. Use HTML comments for field instructions
3. Keep fields minimal — only what the recipe needs to do its job
4. Document which recipe uses it in `recipes/inputs/README.md`

## Design principles

- **Inspect before acting.** Recipes read the codebase before forming conclusions.
- **Structured output.** Reports use tables and sections, not prose.
- **Safe by default.** Recipes that change code validate at every step.
- **Honest about uncertainty.** Assumptions and risks are called out explicitly.
- **Incremental.** Large changes are broken into small, independently valid steps.
- **Read-only when scheduled.** Autonomous recipes report; they don't modify.
