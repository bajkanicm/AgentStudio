#!/bin/sh
# Sync the database schema, then start the Next.js standalone server.
set -e

echo "→ Syncing database schema (prisma db push)…"
n=0
until prisma db push --schema=./prisma/schema.prisma --skip-generate --accept-data-loss; do
  n=$((n + 1))
  if [ "$n" -ge 10 ]; then
    echo "✗ Database not reachable after 10 attempts, giving up." >&2
    exit 1
  fi
  echo "  …database not ready yet (attempt $n/10), retrying in 3s"
  sleep 3
done

echo "→ Starting AgentStudio on :${PORT:-3000}"
exec node server.js
