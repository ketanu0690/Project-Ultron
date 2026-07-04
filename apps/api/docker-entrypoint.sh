#!/bin/sh
set -e

PGHOST="${PGHOST:-postgres}"
PGUSER="${PGUSER:?PGUSER is required}"
PGDATABASE="${PGDATABASE:?PGDATABASE is required}"
PGPASSWORD="${PGPASSWORD:?PGPASSWORD is required}"
export PGPASSWORD

echo "[entrypoint] Waiting for PostgreSQL (${PGHOST})..."
until pg_isready -h "$PGHOST" -U "$PGUSER" -d "$PGDATABASE" -q; do
  echo "[entrypoint] PostgreSQL unavailable — retrying in 2s"
  sleep 2
done
echo "[entrypoint] PostgreSQL is ready"

echo "[entrypoint] Applying Prisma migrations..."
npx prisma migrate deploy

echo "[entrypoint] Seeding database..."
node prisma/dist/seed.js

echo "[entrypoint] Starting NestJS..."
exec "$@"
