#!/usr/bin/env bash
# Regenerate prisma/schema.postgres.prisma from prisma/schema.prisma
set -euo pipefail
cd "$(dirname "$0")/.."
{
  echo "// AgentStudio — production schema (PostgreSQL). Copied over schema.prisma in the Docker build."
  echo "// Do not edit models here directly — edit schema.prisma and re-run scripts/sync-schemas.sh"
  tail -n +5 prisma/schema.prisma | sed 's/provider = "sqlite"/provider = "postgresql"/'
} > prisma/schema.postgres.prisma
echo "Synced prisma/schema.postgres.prisma"
