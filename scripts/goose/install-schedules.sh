#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
GOOSE_BIN="${GOOSE_BIN:-goose}"

if ! command -v "$GOOSE_BIN" >/dev/null 2>&1; then
  echo "goose binary not found: $GOOSE_BIN" >&2
  echo "Install it with: npm run goose:install:cli" >&2
  exit 1
fi

install_schedule() {
  local schedule_id="$1"
  local cron_expr="$2"
  local recipe_path="$3"

  "$GOOSE_BIN" schedule remove --schedule-id "$schedule_id" >/dev/null 2>&1 || true
  "$GOOSE_BIN" schedule add \
    --schedule-id "$schedule_id" \
    --cron "$cron_expr" \
    --recipe-source "$REPO_ROOT/$recipe_path"
}

# Goose cron expressions use 6 fields: second minute hour day month weekday.
install_schedule "vizuelni-nightly-review" "0 0 2 * * *" "recipes/nightly-review.yaml"
install_schedule "vizuelni-weekly-release-readiness" "0 0 8 * * 1" "recipes/weekly-release-readiness.yaml"
install_schedule "vizuelni-architecture-drift" "0 0 8 * * 3" "recipes/architecture-drift-review.yaml"
install_schedule "vizuelni-test-health" "0 0 8 * * 5" "recipes/test-health-check.yaml"

echo "Installed Goose schedules:"
"$GOOSE_BIN" schedule list
