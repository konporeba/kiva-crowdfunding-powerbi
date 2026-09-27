#!/usr/bin/env bash
# Copy an MCP TMDL export (arg 1) over the project's semantic-model definition.
# Keeps the project's database.tmdl (the export adds a GUID name + props Desktop doesn't write).
# Usage: bash _build/sync-model.sh <export-folder>
set -euo pipefail
SRC="$1"
DST="/x/Data Science for Good Kiva Crowdfunding/Data Science for Good Kiva Crowdfunding With AI.SemanticModel/definition"
[ -f "$SRC/model.tmdl" ] || { echo "no model.tmdl in $SRC"; exit 1; }
echo "== changes:"; diff -rq "$DST" "$SRC" | grep -v "database.tmdl" || true
# Remove table files that no longer exist in the export, then copy everything except database.tmdl.
for f in "$DST"/tables/*.tmdl; do [ -f "$SRC/tables/$(basename "$f")" ] || { echo "removing $(basename "$f")"; rm "$f"; }; done
( cd "$SRC" && find . -type f ! -name database.tmdl ) | while read -r rel; do
  mkdir -p "$(dirname "$DST/$rel")"; cp "$SRC/$rel" "$DST/$rel"
done
echo "== synced: $(grep -c $'^\tmeasure ' "$DST/tables/_Measures.tmdl") measures in _Measures; tables: $(ls "$DST/tables" | tr '\n' ' ')"
