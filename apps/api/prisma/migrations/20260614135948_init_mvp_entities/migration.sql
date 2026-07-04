-- CreateEnum
CREATE TYPE "BuildingState" AS ENUM ('planned', 'constructing', 'active', 'degraded', 'offline');

-- CreateEnum
CREATE TYPE "BuildingDetailLevel" AS ENUM ('full', 'lod_footprint');

-- CreateEnum
CREATE TYPE "AgentRole" AS ENUM ('planner', 'simulator', 'debater', 'verifier');

-- CreateEnum
CREATE TYPE "AgentStatus" AS ENUM ('idle', 'thinking', 'acting', 'learning', 'migrating', 'offline', 'error');

-- CreateEnum
CREATE TYPE "MemoryType" AS ENUM ('short_term', 'episodic', 'semantic', 'procedural');

-- CreateTable
CREATE TABLE "districts" (
    "id" UUID NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "theme_config" JSONB NOT NULL DEFAULT '{}',
    "agent_count" INTEGER NOT NULL DEFAULT 0,
    "metrics" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "districts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "buildings" (
    "id" UUID NOT NULL,
    "slug" TEXT NOT NULL,
    "district_id" UUID NOT NULL,
    "building_type" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "state" "BuildingState" NOT NULL DEFAULT 'planned',
    "detail_level" "BuildingDetailLevel" NOT NULL DEFAULT 'lod_footprint',
    "position" JSONB NOT NULL DEFAULT '{"x":0,"y":0,"z":0}',
    "capacity" JSONB NOT NULL DEFAULT '{}',
    "metrics" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "buildings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rooms" (
    "id" UUID NOT NULL,
    "slug" TEXT NOT NULL,
    "building_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "room_type" TEXT NOT NULL,
    "floor_index" INTEGER NOT NULL DEFAULT 1,
    "position" JSONB NOT NULL DEFAULT '{"x":0,"y":0,"z":0}',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "rooms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agents" (
    "id" UUID NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "AgentRole" NOT NULL,
    "home_district_id" UUID NOT NULL,
    "home_building_id" UUID NOT NULL,
    "home_room_id" UUID,
    "model" TEXT NOT NULL,
    "version" TEXT NOT NULL DEFAULT '1.0.0',
    "status" "AgentStatus" NOT NULL DEFAULT 'idle',
    "capabilities" JSONB NOT NULL DEFAULT '[]',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "agents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agent_memories" (
    "id" UUID NOT NULL,
    "agent_id" UUID NOT NULL,
    "type" "MemoryType" NOT NULL,
    "content" TEXT NOT NULL,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "agent_memories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "districts_slug_key" ON "districts"("slug");

-- CreateIndex
CREATE INDEX "districts_deleted_at_idx" ON "districts"("deleted_at");

-- CreateIndex
CREATE UNIQUE INDEX "buildings_slug_key" ON "buildings"("slug");

-- CreateIndex
CREATE INDEX "buildings_district_id_idx" ON "buildings"("district_id");

-- CreateIndex
CREATE INDEX "buildings_state_idx" ON "buildings"("state");

-- CreateIndex
CREATE INDEX "buildings_deleted_at_idx" ON "buildings"("deleted_at");

-- CreateIndex
CREATE UNIQUE INDEX "rooms_slug_key" ON "rooms"("slug");

-- CreateIndex
CREATE INDEX "rooms_building_id_idx" ON "rooms"("building_id");

-- CreateIndex
CREATE INDEX "rooms_deleted_at_idx" ON "rooms"("deleted_at");

-- CreateIndex
CREATE UNIQUE INDEX "agents_slug_key" ON "agents"("slug");

-- CreateIndex
CREATE INDEX "agents_home_district_id_idx" ON "agents"("home_district_id");

-- CreateIndex
CREATE INDEX "agents_home_building_id_idx" ON "agents"("home_building_id");

-- CreateIndex
CREATE INDEX "agents_role_idx" ON "agents"("role");

-- CreateIndex
CREATE INDEX "agents_status_idx" ON "agents"("status");

-- CreateIndex
CREATE INDEX "agents_deleted_at_idx" ON "agents"("deleted_at");

-- CreateIndex
CREATE INDEX "agent_memories_agent_id_idx" ON "agent_memories"("agent_id");

-- CreateIndex
CREATE INDEX "agent_memories_type_idx" ON "agent_memories"("type");

-- CreateIndex
CREATE INDEX "agent_memories_created_at_idx" ON "agent_memories"("created_at");

-- CreateIndex
CREATE INDEX "agent_memories_deleted_at_idx" ON "agent_memories"("deleted_at");

-- AddForeignKey
ALTER TABLE "buildings" ADD CONSTRAINT "buildings_district_id_fkey" FOREIGN KEY ("district_id") REFERENCES "districts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rooms" ADD CONSTRAINT "rooms_building_id_fkey" FOREIGN KEY ("building_id") REFERENCES "buildings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agents" ADD CONSTRAINT "agents_home_district_id_fkey" FOREIGN KEY ("home_district_id") REFERENCES "districts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agents" ADD CONSTRAINT "agents_home_building_id_fkey" FOREIGN KEY ("home_building_id") REFERENCES "buildings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agents" ADD CONSTRAINT "agents_home_room_id_fkey" FOREIGN KEY ("home_room_id") REFERENCES "rooms"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agent_memories" ADD CONSTRAINT "agent_memories_agent_id_fkey" FOREIGN KEY ("agent_id") REFERENCES "agents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
