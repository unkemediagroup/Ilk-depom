#!/bin/bash
set -euo pipefail

# Sadece Claude Code cloud oturumlarında çalış
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

# OmniRoute (AI gateway/router) yoksa global olarak kur
if ! command -v omniroute >/dev/null 2>&1; then
  npm install -g omniroute
fi
