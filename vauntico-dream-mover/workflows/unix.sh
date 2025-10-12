#!/usr/bin/env bash
set -euo pipefail
# cd to module root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MODULE_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$MODULE_DIR"

echo "Bootstrapping Dream Mover (Unix)..."
npm install
npm run build

echo "Note: Windows scan paths are primary; Unix support will expand in Milestone 2."
