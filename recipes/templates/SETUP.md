# Goose Auto-Implement: Setup Guide

Autonomous feature implementation via Goose. Drop these files into any repo
and configure them for your project.

## Prerequisites

1. A Goose-ready repo with `scripts/goose/run-recipe.sh`
2. Context files that Goose recipes reference:
   - `recipes/repo-context.md` — what the project is, stack, directory layout
   - `recipes/standards.md` — coding conventions, testing expectations
   - `recipes/architecture-notes.md` — layer boundaries, key design decisions
3. Feature spec files in `recipes/inputs/` describing what to build
4. GitHub Actions secrets: `GOOSE_CONFIG_YAML`, `GOOSE_SECRETS_YAML`

## Files to copy

```
recipes/feature-dispatcher.yaml   # Picks next feature from roadmap
recipes/feature-worker.yaml       # Implements the feature
recipes/roadmap-status.yml        # Copy the template below and fill in your features
.github/workflows/goose-feature-auto.yml  # Cron trigger
```

The dispatcher and worker recipes are project-agnostic — they read project
specifics from your repo-context.md and standards.md files.

## Configuration

### 1. Create your roadmap-status.yml

Copy `roadmap-status-template.yml` to `recipes/roadmap-status.yml` and
fill in your features. Each feature needs:

- `id`: unique identifier (e.g., `feature-01`)
- `name`: human-readable name
- `spec`: path to the feature spec file
- All status fields start as `null` / `not-started`

### 2. Write feature specs

Each feature needs a spec file in `recipes/inputs/`. The spec should describe:
- What the feature does
- What files/routes/components are involved
- Acceptance criteria
- Any constraints or dependencies

### 3. Set the schedule

Edit the cron in `goose-feature-auto.yml`. Default is every 4 hours.
Also set `schedule.interval_hours` in `roadmap-status.yml` to match
(this is for documentation — the actual schedule is in the workflow).

### 4. Add to .gitignore

```
recipes/current-task.yml
```

### 5. Configure GitHub secrets

Same secrets as your existing Goose recipes workflow:
- `GOOSE_CONFIG_YAML` — Goose provider configuration
- `GOOSE_SECRETS_YAML` — API keys and tokens

## How it works

```
Cron trigger → Dispatcher → picks next feature → writes current-task.yml
                                                        ↓
                                                    Worker runs
                                                        ↓
                                              Plan → Scaffold → Implement → Test → PR
```

- Dispatcher reads `roadmap-status.yml`, picks the first `not-started` feature
- If the feature already exists in the codebase, marks it `completed` and skips
- Worker implements in phases, commits along the way, opens a PR
- If tests fail, PR is opened as draft
- If worker gets stuck, opens a GitHub issue and marks the feature `blocked`
- Status file is only updated on `main` (never on feature branches)

## Controls

All via `recipes/roadmap-status.yml`:

| Action | How |
|--------|-----|
| Pause everything | `schedule.enabled: false` |
| Skip a feature | Set status to `completed` or `blocked` |
| Reorder | Rearrange the features list |
| Retry a blocked feature | Set status back to `not-started`, clear block fields |
| Resume interrupted work | Automatic — dispatcher resumes `in-progress` features |

## Guardrails

The worker will NOT:
- Add new dependencies
- Modify CI/CD or infrastructure configs
- Touch files outside the feature's scope

If any of these are needed, the worker notes them in the PR under
"Requires Human Action".
