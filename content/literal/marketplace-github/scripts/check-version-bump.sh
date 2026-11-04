#!/usr/bin/env bash
# For every plugin whose plugins/<name>/** changed between <base> and HEAD (skills,
# agents, anything) other than its own .claude-plugin/plugin.json, fail unless that
# plugin's .claude-plugin/plugin.json "version" differs from the version at <base>. A new plugin.json (absent at <base>) passes.
# Usage: check-version-bump.sh <base-ref-or-sha>
set -euo pipefail

base="${1:?usage: check-version-bump.sh <base-ref-or-sha>}"

# All-zero "before" means the first push of a branch: there is nothing to compare.
if [[ "$base" =~ ^0+$ ]]; then
  echo "::warning::version-bump check SKIPPED: first push, no base revision"
  echo "SKIP: first push (all-zero base)"
  exit 0
fi

# An unresolvable base is fatal, except on a push (set ALLOW_UNKNOWN_BASE=1), where a
# force-push can legitimately drop the old tip.
if ! git cat-file -e "${base}^{commit}" 2>/dev/null; then
  if [ -n "${ALLOW_UNKNOWN_BASE:-}" ]; then
    echo "::warning::version-bump check SKIPPED: base $base not found (force-push?)"
    echo "SKIP: base $base not found"
    exit 0
  fi
  echo "::error::version-bump check cannot run: base revision $base does not resolve" >&2
  echo "FAIL: base revision $base does not resolve" >&2
  exit 1
fi

version_of() { node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>console.log(JSON.parse(s).version))'; }

# Capture first: set -e / pipefail do not propagate out of a $(...) used as a loop word list.
changed="$(git diff --name-only "$base" HEAD)"
plugins="$(printf '%s\n' "$changed" | grep -v '^plugins/[^/]*/\.claude-plugin/plugin\.json$' | sed -n 's#^plugins/\([^/]*\)/.*#\1#p' | sort -u || true)"

status=0
for plugin in $plugins; do
  manifest="plugins/$plugin/.claude-plugin/plugin.json"
  if ! git cat-file -e "$base:$manifest" 2>/dev/null; then
    echo "OK: $plugin has no plugin.json at base (new plugin)"
    continue
  fi
  old="$(git show "$base:$manifest" | version_of)"
  new="$(git show "HEAD:$manifest" | version_of)"
  if [ "$old" = "$new" ]; then
    echo "FAIL: plugins/$plugin changed but $manifest version is still $old" >&2
    status=1
  else
    echo "OK: $plugin $old -> $new"
  fi
done

[ "$status" -eq 0 ] && echo "OK: version-bump check passed"
exit "$status"
