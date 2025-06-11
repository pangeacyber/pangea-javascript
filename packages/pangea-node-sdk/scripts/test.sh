#!/usr/bin/env bash

set -e

cd -- "$(dirname -- "$0")/.."

npx start-server-and-test --expect 404 \
  "npx @stoplight/prism-cli mock -d --json-schema-faker-fillProperties=false tests/testdata/ai-guard.openapi.json" \
  4010 \
  "yarn test tests/integration2/ai_guard.test.ts"
