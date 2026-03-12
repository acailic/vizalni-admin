#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
OUTPUT_DIR="$REPO_ROOT/recipes/outputs"

usage() {
  echo "Usage: $0 <recipe-path> [goose args...]" >&2
  echo "Example: $0 recipes/nightly-review.yaml" >&2
}

if [[ $# -lt 1 ]]; then
  usage
  exit 1
fi

RECIPE_PATH="$1"
shift

if [[ "$RECIPE_PATH" != /* ]]; then
  RECIPE_PATH="$REPO_ROOT/$RECIPE_PATH"
fi

if [[ ! -f "$RECIPE_PATH" ]]; then
  echo "Recipe not found: $RECIPE_PATH" >&2
  exit 1
fi

GOOSE_BIN="${GOOSE_BIN:-goose}"

if ! command -v "$GOOSE_BIN" >/dev/null 2>&1; then
  echo "goose binary not found: $GOOSE_BIN" >&2
  echo "Install it with: npm run goose:install:cli" >&2
  exit 1
fi

mkdir -p "$OUTPUT_DIR"

export GOOSE_RECIPE_PATH="${GOOSE_RECIPE_PATH:-$REPO_ROOT/recipes}"

RECIPE_NAME="$(basename "$RECIPE_PATH")"
RECIPE_STEM="${RECIPE_NAME%.*}"
TIMESTAMP="$(date +%Y%m%d-%H%M%S)"
LOG_FILE="${GOOSE_LOG_FILE:-$OUTPUT_DIR/$RECIPE_STEM-$TIMESTAMP.log}"

echo "Running recipe: $RECIPE_PATH"
echo "Log file: $LOG_FILE"

"$GOOSE_BIN" recipe validate "$RECIPE_PATH" >/dev/null
"$GOOSE_BIN" run --recipe "$RECIPE_PATH" "$@" 2>&1 | tee "$LOG_FILE"
