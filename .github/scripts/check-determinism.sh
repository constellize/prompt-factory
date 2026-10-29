#!/usr/bin/env bash
# Run both generators twice into temp directories; fail on any difference between runs.
# Run from the prompt-factory root.
set -euo pipefail

work="$(mktemp -d)"
trap 'rm -rf "$work"' EXIT

status=0
for target in marketplace website; do
  for run in a b; do
    mkdir -p "$work/$target-$run"
    npx ts-node -e "require('./build/generate-$target').generate(process.argv[1])" "$work/$target-$run" >/dev/null
  done
  if /usr/bin/diff -r "$work/$target-a" "$work/$target-b"; then
    echo "OK: $target generator is deterministic ($(find "$work/$target-a" -type f | wc -l | tr -d ' ') files)"
  else
    echo "FAIL: $target generator output differs between runs" >&2
    status=1
  fi
done
exit "$status"
