#!/bin/sh
# Put a new kb export's data in place: scripts/import-export.sh ~/Downloads/kb-export-xxxx.zip
# Only src/lib/data is taken (tickets.json is ours and stays). Then: npm run build, npm run issues, push.
set -eu
zip="$1"
tmp="$(mktemp -d)"
unzip -q "$zip" -d "$tmp"
src="$tmp/support-kb/src/lib/data"
[ -f "$src/reports-4471.json" ] || { echo "no support-kb/src/lib/data/reports-4471.json in $zip" >&2; exit 1; }
cp "$src/reports-4471.json" "$src/desk-notes.json" src/lib/data/
rm -rf src/lib/data/tenants && cp -R "$src/tenants" src/lib/data/tenants
rm -rf "$tmp"
git diff --stat -- src/lib/data
