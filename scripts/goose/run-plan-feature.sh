#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
RECIPES_DIR="$REPO_ROOT/recipes"
GOOSE_BIN="${GOOSE_BIN:-goose}"

usage() {
  echo "Usage: $0 <feature-input-path> [output-path] [goose args...]" >&2
  echo "Example: $0 recipes/inputs/plans/feature-04-chart-configurator.md" >&2
}

if [[ $# -lt 1 ]]; then
  usage
  exit 1
fi

INPUT_PATH="$1"
shift

if [[ "$INPUT_PATH" != /* ]]; then
  INPUT_PATH="$REPO_ROOT/$INPUT_PATH"
fi

if [[ ! -f "$INPUT_PATH" ]]; then
  echo "Feature input not found: $INPUT_PATH" >&2
  exit 1
fi

OUTPUT_PATH=""

if [[ $# -gt 0 && "${1#-}" == "$1" ]]; then
  OUTPUT_PATH="$1"
  shift
fi

if ! command -v "$GOOSE_BIN" >/dev/null 2>&1; then
  echo "goose binary not found: $GOOSE_BIN" >&2
  echo "Install it with: npm run goose:install:cli" >&2
  exit 1
fi

TMP_RECIPE_DIR="$(mktemp -d "${TMPDIR:-/tmp}/goose-plan-feature.XXXXXX")"
TMP_OUTPUT=""
TMP_JSON=""
cleanup() {
  rm -rf "$TMP_RECIPE_DIR"
  [[ -n "$TMP_OUTPUT" ]] && rm -f "$TMP_OUTPUT"
  [[ -n "$TMP_JSON" ]] && rm -f "$TMP_JSON"
}
trap cleanup EXIT

mkdir -p "$TMP_RECIPE_DIR/inputs/plans"

cp "$RECIPES_DIR/plan-feature.yaml" "$TMP_RECIPE_DIR/plan-feature.yaml"
cp "$RECIPES_DIR/repo-context.md" "$TMP_RECIPE_DIR/repo-context.md"
cp "$RECIPES_DIR/standards.md" "$TMP_RECIPE_DIR/standards.md"
cp "$RECIPES_DIR/architecture-notes.md" "$TMP_RECIPE_DIR/architecture-notes.md"
INPUT_NAME="$(basename "$INPUT_PATH")"
INPUT_STEM="${INPUT_NAME%.md}"
cp "$INPUT_PATH" "$TMP_RECIPE_DIR/inputs/plans/$INPUT_NAME"

export GOOSE_RECIPE_PATH="$TMP_RECIPE_DIR"

if [[ -z "$OUTPUT_PATH" ]]; then
  OUTPUT_PATH="$REPO_ROOT/recipes/outputs/plan-$INPUT_STEM.md"
elif [[ "$OUTPUT_PATH" != /* ]]; then
  OUTPUT_PATH="$REPO_ROOT/$OUTPUT_PATH"
fi

mkdir -p "$(dirname "$OUTPUT_PATH")"
TMP_OUTPUT="$(mktemp "${TMPDIR:-/tmp}/goose-plan-output.XXXXXX.md")"
TMP_JSON="$(mktemp "${TMPDIR:-/tmp}/goose-plan-output.XXXXXX.json")"

"$GOOSE_BIN" recipe validate "$TMP_RECIPE_DIR/plan-feature.yaml" >/dev/null
"$GOOSE_BIN" run \
  --recipe "$TMP_RECIPE_DIR/plan-feature.yaml" \
  --quiet \
  --no-session \
  --output-format json \
  "$@" >"$TMP_JSON"

jq -r '
  [
    .messages[]
    | select(.role == "assistant")
    | {
        text: (
          [.content[]? | select(.type == "text" and ((.text // "") | test("\\S"))) | .text]
          | join("\n\n")
        )
      }
  ]
  | (
      map(select(.text | test("(^|\\n)## Feature:|(^|\\n)# Feature")))
      | last
    ) // (
      map(select(.text | test("\\S")))
      | last
    )
  | .text // empty
' "$TMP_JSON" >"$TMP_OUTPUT"

if ! grep -q '[^[:space:]]' "$TMP_OUTPUT"; then
  echo "Goose did not produce a final assistant response." >&2
  exit 1
fi

if grep -q '^## Feature:' "$TMP_OUTPUT"; then
  sed -n '/^## Feature:/,$p' "$TMP_OUTPUT" >"${TMP_OUTPUT}.trimmed"
  mv "${TMP_OUTPUT}.trimmed" "$TMP_OUTPUT"
elif grep -q '^# Feature' "$TMP_OUTPUT"; then
  sed -n '/^# Feature/,$p' "$TMP_OUTPUT" >"${TMP_OUTPUT}.trimmed"
  mv "${TMP_OUTPUT}.trimmed" "$TMP_OUTPUT"
fi

if ! grep -Eq '^(## Feature:|# Feature)' "$TMP_OUTPUT"; then
  echo "Goose did not produce a structured feature plan." >&2
  exit 1
fi

mv "$TMP_OUTPUT" "$OUTPUT_PATH"
echo "Wrote plan to $OUTPUT_PATH"
