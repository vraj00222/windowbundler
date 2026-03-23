#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

echo "Compiling WindowHelper.swift..."
swiftc WindowHelper.swift \
    -o window-helper \
    -framework Cocoa \
    -framework CoreGraphics \
    -O

chmod +x window-helper
echo "Built: native/window-helper"
