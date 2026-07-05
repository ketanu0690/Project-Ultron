-- Agent world positions for server-authoritative movement
ALTER TABLE "agents" ADD COLUMN IF NOT EXISTS "position_x" DOUBLE PRECISION NOT NULL DEFAULT 0;
ALTER TABLE "agents" ADD COLUMN IF NOT EXISTS "position_y" DOUBLE PRECISION NOT NULL DEFAULT 0;
ALTER TABLE "agents" ADD COLUMN IF NOT EXISTS "position_z" DOUBLE PRECISION NOT NULL DEFAULT 0;
ALTER TABLE "agents" ADD COLUMN IF NOT EXISTS "rotation_y" DOUBLE PRECISION NOT NULL DEFAULT 0;
ALTER TABLE "agents" ADD COLUMN IF NOT EXISTS "wander_target_x" DOUBLE PRECISION;
ALTER TABLE "agents" ADD COLUMN IF NOT EXISTS "wander_target_z" DOUBLE PRECISION;

-- World simulation state
CREATE TABLE IF NOT EXISTS "world_state" (
    "id" TEXT NOT NULL DEFAULT 'current',
    "variables" JSONB NOT NULL DEFAULT '{}',
    "tick_count" INTEGER NOT NULL DEFAULT 0,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "world_state_pkey" PRIMARY KEY ("id")
);

-- Governance policies (seeded defaults, v2 UI)
CREATE TABLE IF NOT EXISTS "governance_policies" (
    "id" UUID NOT NULL,
    "slug" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "rules" JSONB NOT NULL DEFAULT '{}',
    "version" INTEGER NOT NULL DEFAULT 1,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    CONSTRAINT "governance_policies_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "governance_policies_slug_key" ON "governance_policies"("slug");
CREATE INDEX IF NOT EXISTS "governance_policies_domain_idx" ON "governance_policies"("domain");
CREATE INDEX IF NOT EXISTS "governance_policies_active_idx" ON "governance_policies"("active");

-- Simulation event log
CREATE TABLE IF NOT EXISTS "simulation_events" (
    "id" UUID NOT NULL,
    "type" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "data" JSONB NOT NULL DEFAULT '{}',
    "tick_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "simulation_events_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "simulation_events_type_idx" ON "simulation_events"("type");
CREATE INDEX IF NOT EXISTS "simulation_events_created_at_idx" ON "simulation_events"("created_at");
