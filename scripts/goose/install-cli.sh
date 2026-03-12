#!/usr/bin/env bash

set -euo pipefail

GOOSE_BIN_DIR="${GOOSE_BIN_DIR:-$HOME/.local/bin}"

mkdir -p "$GOOSE_BIN_DIR"

if [[ -n "${GOOSE_VERSION:-}" ]]; then
  curl -fsSL https://github.com/block/goose/releases/download/stable/download_cli.sh \
    | GOOSE_VERSION="$GOOSE_VERSION" CONFIGURE=false GOOSE_BIN_DIR="$GOOSE_BIN_DIR" bash
else
  curl -fsSL https://github.com/block/goose/releases/download/stable/download_cli.sh \
    | CONFIGURE=false GOOSE_BIN_DIR="$GOOSE_BIN_DIR" bash
fi

echo "Installed goose CLI to $GOOSE_BIN_DIR"
echo "Add it to PATH if needed: export PATH=\"$GOOSE_BIN_DIR:\$PATH\""
