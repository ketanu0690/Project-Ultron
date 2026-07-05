import {
  AgentRole,
  AgentStatus,
  BuildingDetailLevel,
  BuildingState,
  DISTRICT_COLORS,
  DISTRICT_IDS,
  MemoryType,
  REASONING_AGENT_ROLE_COUNTS,
  type DistrictId,
} from '@ultron/shared';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const DISTRICT_NAMES: Record<DistrictId, string> = {
  perception: 'Perception District',
  memory: 'Memory District',
  reasoning: 'Reasoning District',
  action: 'Action District',
  self_improvement: 'Self Improvement District',
};

const AGENT_MODELS: Record<AgentRole, string> = {
  planner: 'claude-sonnet-4',
  simulator: 'gpt-4o',
  debater: 'claude-sonnet-4',
  verifier: 'gpt-4o-mini',
};

interface BuildingSeed {
  slug: string;
  buildingType: string;
  name: string;
  state: BuildingState;
  detailLevel: BuildingDetailLevel;
  position: { x: number; y: number; z: number };
  capacity: { maxAgents: number };
}

const REASONING_BUILDINGS: readonly BuildingSeed[] = [
  {
    slug: 'building-planning-tower',
    buildingType: 'planning_tower',
    name: 'Planning Tower',
    state: 'active',
    detailLevel: 'full',
    position: { x: 0, y: 40, z: 0 },
    capacity: { maxAgents: 100 },
  },
  {
    slug: 'simulation-dome',
    buildingType: 'simulation_dome',
    name: 'Simulation Dome',
    state: 'active',
    detailLevel: 'lod_footprint',
    position: { x: -120, y: 2, z: -80 },
    capacity: { maxAgents: 40 },
  },
  {
    slug: 'debate-amphitheater',
    buildingType: 'debate_amphitheater',
    name: 'Debate Amphitheater',
    state: 'active',
    detailLevel: 'lod_footprint',
    position: { x: 60, y: 2, z: -100 },
    capacity: { maxAgents: 200 },
  },
  {
    slug: 'proof-workshop',
    buildingType: 'proof_workshop',
    name: 'Proof Workshop',
    state: 'active',
    detailLevel: 'lod_footprint',
    position: { x: 140, y: 2, z: -40 },
    capacity: { maxAgents: 30 },
  },
  {
    slug: 'model-council-hall',
    buildingType: 'model_council_hall',
    name: 'Model Council Hall',
    state: 'active',
    detailLevel: 'lod_footprint',
    position: { x: -80, y: 2, z: 40 },
    capacity: { maxAgents: 50 },
  },
  {
    slug: 'reasoning-annex-01',
    buildingType: 'reasoning_annex',
    name: 'Reasoning Annex 01',
    state: 'active',
    detailLevel: 'lod_footprint',
    position: { x: 20, y: 2, z: 60 },
    capacity: { maxAgents: 10 },
  },
  {
    slug: 'reasoning-annex-02',
    buildingType: 'reasoning_annex',
    name: 'Reasoning Annex 02',
    state: 'active',
    detailLevel: 'lod_footprint',
    position: { x: 100, y: 2, z: 90 },
    capacity: { maxAgents: 10 },
  },
  {
    slug: 'reasoning-annex-03',
    buildingType: 'reasoning_annex',
    name: 'Reasoning Annex 03',
    state: 'active',
    detailLevel: 'lod_footprint',
    position: { x: -140, y: 2, z: 100 },
    capacity: { maxAgents: 10 },
  },
  {
    slug: 'reasoning-annex-04',
    buildingType: 'reasoning_annex',
    name: 'Reasoning Annex 04',
    state: 'active',
    detailLevel: 'lod_footprint',
    position: { x: -40, y: 2, z: -140 },
    capacity: { maxAgents: 10 },
  },
  {
    slug: 'reasoning-annex-05',
    buildingType: 'reasoning_annex',
    name: 'Reasoning Annex 05',
    state: 'active',
    detailLevel: 'lod_footprint',
    position: { x: 160, y: 2, z: -120 },
    capacity: { maxAgents: 10 },
  },
];

const ROOM_SEEDS = [
  {
    slug: 'room-strategy',
    name: 'Strategy Room',
    roomType: 'strategy',
    floorIndex: 3,
    position: { x: -25, y: 4, z: 0 },
  },
  {
    slug: 'room-plan-vault',
    name: 'Plan Vault',
    roomType: 'plan_vault',
    floorIndex: 5,
    position: { x: 0, y: 4, z: 0 },
  },
  {
    slug: 'room-observation-deck',
    name: 'Observation Deck',
    roomType: 'observation_deck',
    floorIndex: 12,
    position: { x: 25, y: 4, z: 0 },
  },
] as const;

const ROLE_BUILDING_SLUG: Record<AgentRole, string> = {
  planner: 'building-planning-tower',
  simulator: 'simulation-dome',
  debater: 'debate-amphitheater',
  verifier: 'proof-workshop',
};

const PLANNER_ROOM_SLUGS = [
  'room-strategy',
  'room-plan-vault',
  'room-observation-deck',
] as const;

const SIGMA7_MEMORIES = [
  {
    content: 'Initial planning session for Reasoning District allocation.',
    createdAt: new Date('2026-01-12T10:00:00Z'),
    metadata: { tags: ['planning', 'district'] },
  },
  {
    content: 'District allocation review completed with verifier consensus.',
    createdAt: new Date('2026-02-03T14:30:00Z'),
    metadata: { tags: ['review', 'district'] },
  },
  {
    content:
      'Planning Tower construction milestone reached — exterior shell active.',
    createdAt: new Date('2026-03-18T09:15:00Z'),
    metadata: { tags: ['construction', 'tower'] },
  },
  {
    content: 'Agent role assignment matrix finalized for MVP cohort.',
    createdAt: new Date('2026-04-05T16:00:00Z'),
    metadata: { tags: ['agents', 'roles'] },
  },
  {
    content: 'Simulation dry run for multi-agent delegation workflow.',
    createdAt: new Date('2026-05-22T11:45:00Z'),
    metadata: { tags: ['simulation', 'delegation'] },
  },
  {
    content: 'Governance policy draft reviewed — deferred to v2 scope.',
    createdAt: new Date('2026-06-01T08:00:00Z'),
    metadata: { tags: ['governance', 'policy'] },
  },
] as const;

async function seedDistricts(): Promise<Map<DistrictId, string>> {
  const idBySlug = new Map<DistrictId, string>();

  for (const slug of DISTRICT_IDS) {
    const colors = DISTRICT_COLORS[slug];
    const district = await prisma.district.upsert({
      where: { slug },
      create: {
        slug,
        name: DISTRICT_NAMES[slug],
        themeConfig: {
          primary: colors.primary,
          secondary: colors.secondary,
          accent: colors.accent,
        },
        agentCount: slug === 'reasoning' ? 50 : 0,
        metrics: {},
      },
      update: {
        name: DISTRICT_NAMES[slug],
        themeConfig: {
          primary: colors.primary,
          secondary: colors.secondary,
          accent: colors.accent,
        },
        agentCount: slug === 'reasoning' ? 50 : 0,
      },
    });
    idBySlug.set(slug, district.id);
  }

  return idBySlug;
}

async function seedBuildings(
  reasoningDistrictId: string,
): Promise<Map<string, string>> {
  const idBySlug = new Map<string, string>();

  for (const building of REASONING_BUILDINGS) {
    const record = await prisma.building.upsert({
      where: { slug: building.slug },
      create: {
        slug: building.slug,
        districtId: reasoningDistrictId,
        buildingType: building.buildingType,
        name: building.name,
        state: building.state,
        detailLevel: building.detailLevel,
        position: building.position,
        capacity: building.capacity,
        metrics: { utilization: building.state === 'active' ? 0.35 : 0 },
      },
      update: {
        districtId: reasoningDistrictId,
        buildingType: building.buildingType,
        name: building.name,
        state: building.state,
        detailLevel: building.detailLevel,
        position: building.position,
        capacity: building.capacity,
      },
    });
    idBySlug.set(building.slug, record.id);
  }

  return idBySlug;
}

async function seedRooms(
  planningTowerId: string,
): Promise<Map<string, string>> {
  const idBySlug = new Map<string, string>();

  for (const room of ROOM_SEEDS) {
    const record = await prisma.room.upsert({
      where: { slug: room.slug },
      create: {
        slug: room.slug,
        buildingId: planningTowerId,
        name: room.name,
        roomType: room.roomType,
        floorIndex: room.floorIndex,
        position: room.position,
      },
      update: {
        buildingId: planningTowerId,
        name: room.name,
        roomType: room.roomType,
        floorIndex: room.floorIndex,
        position: room.position,
      },
    });
    idBySlug.set(room.slug, record.id);
  }

  return idBySlug;
}

function formatAgentName(role: AgentRole, index: number): string {
  const label = role.charAt(0).toUpperCase() + role.slice(1);
  return `${label} Unit ${String(index).padStart(2, '0')}`;
}

async function seedAgents(
  reasoningDistrictId: string,
  buildingIds: Map<string, string>,
  roomIds: Map<string, string>,
): Promise<Map<string, string>> {
  const idBySlug = new Map<string, string>();
  let plannerIndex = 0;
  let agentIndex = 0;
  const totalAgents = Object.values(REASONING_AGENT_ROLE_COUNTS).reduce(
    (sum, count) => sum + count,
    0,
  );

  for (const role of Object.keys(REASONING_AGENT_ROLE_COUNTS) as AgentRole[]) {
    const count = REASONING_AGENT_ROLE_COUNTS[role];
    const buildingId = buildingIds.get(ROLE_BUILDING_SLUG[role]);
    if (!buildingId) {
      throw new Error(`Missing building for role ${role}`);
    }

    for (let i = 1; i <= count; i += 1) {
      const isSigma7 = role === 'planner' && i === 7;
      const slug = isSigma7
        ? 'agent-sigma-7'
        : `agent-${role}-${String(i).padStart(2, '0')}`;
      const name = isSigma7 ? 'Sigma-7' : formatAgentName(role, i);

      let homeRoomId: string | null = null;
      if (role === 'planner') {
        const roomSlug =
          PLANNER_ROOM_SLUGS[plannerIndex % PLANNER_ROOM_SLUGS.length];
        homeRoomId = roomIds.get(roomSlug) ?? null;
        plannerIndex += 1;
      }

      const spacing = 2.8;
      const cols = Math.ceil(Math.sqrt(totalAgents));
      const row = Math.floor(agentIndex / cols);
      const col = agentIndex % cols;
      const rows = Math.ceil(totalAgents / cols);
      const positionX = col * spacing - ((cols - 1) * spacing) / 2;
      const positionZ = row * spacing - ((rows - 1) * spacing) / 2;
      agentIndex += 1;

      const record = await prisma.agent.upsert({
        where: { slug },
        create: {
          slug,
          name,
          role,
          homeDistrictId: reasoningDistrictId,
          homeBuildingId: buildingId,
          homeRoomId,
          model: AGENT_MODELS[role],
          version: '1.0.0',
          status: 'idle' satisfies AgentStatus,
          positionX,
          positionY: 0,
          positionZ,
          rotationY: 0,
          capabilities: [],
        },
        update: {
          name,
          role,
          homeDistrictId: reasoningDistrictId,
          homeBuildingId: buildingId,
          homeRoomId,
          model: AGENT_MODELS[role],
          positionX,
          positionY: 0,
          positionZ,
        },
      });
      idBySlug.set(slug, record.id);
    }
  }

  return idBySlug;
}

async function seedMemories(agentIds: Map<string, string>): Promise<void> {
  const sigma7Id = agentIds.get('agent-sigma-7');
  if (!sigma7Id) {
    throw new Error('agent-sigma-7 not found after seed');
  }

  for (const memory of SIGMA7_MEMORIES) {
    const existing = await prisma.agentMemory.findFirst({
      where: {
        agentId: sigma7Id,
        content: memory.content,
        deletedAt: null,
      },
    });

    if (existing) {
      await prisma.agentMemory.update({
        where: { id: existing.id },
        data: {
          type: 'episodic',
          metadata: memory.metadata,
          createdAt: memory.createdAt,
        },
      });
    } else {
      await prisma.agentMemory.create({
        data: {
          agentId: sigma7Id,
          type: 'episodic',
          content: memory.content,
          metadata: memory.metadata,
          createdAt: memory.createdAt,
        },
      });
    }
  }

  const leadMemories: Array<{
    agentSlug: string;
    entries: Array<{
      type: MemoryType;
      content: string;
      createdAt: Date;
      metadata?: Record<string, unknown>;
    }>;
  }> = [
    {
      agentSlug: 'agent-simulator-01',
      entries: [
        {
          type: 'episodic',
          content:
            'Baseline scenario simulation for tower throughput completed.',
          createdAt: new Date('2026-03-10T12:00:00Z'),
          metadata: { tags: ['simulation'] },
        },
        {
          type: 'semantic',
          content:
            'Simulation Dome variable control ranges documented for MVP.',
          createdAt: new Date('2026-04-18T09:30:00Z'),
          metadata: { tags: ['documentation'] },
        },
      ],
    },
    {
      agentSlug: 'agent-debater-01',
      entries: [
        {
          type: 'episodic',
          content:
            'Arena debate on agent delegation policy — consensus deferred.',
          createdAt: new Date('2026-02-20T18:00:00Z'),
          metadata: { tags: ['debate'] },
        },
        {
          type: 'semantic',
          content: 'Debate Amphitheater seating layout mapped to role cohorts.',
          createdAt: new Date('2026-05-01T10:00:00Z'),
          metadata: { tags: ['layout'] },
        },
      ],
    },
    {
      agentSlug: 'agent-verifier-01',
      entries: [
        {
          type: 'episodic',
          content: 'Proof bench validation of Planning Tower metric bindings.',
          createdAt: new Date('2026-03-25T15:45:00Z'),
          metadata: { tags: ['verification'] },
        },
        {
          type: 'semantic',
          content: 'Verification checklist for MVP agent role distribution.',
          createdAt: new Date('2026-05-15T13:20:00Z'),
          metadata: { tags: ['checklist'] },
        },
      ],
    },
  ];

  for (const { agentSlug, entries } of leadMemories) {
    const agentId = agentIds.get(agentSlug);
    if (!agentId) {
      throw new Error(`${agentSlug} not found after seed`);
    }

    for (const entry of entries) {
      const existing = await prisma.agentMemory.findFirst({
        where: {
          agentId,
          content: entry.content,
          deletedAt: null,
        },
      });

      if (existing) {
        await prisma.agentMemory.update({
          where: { id: existing.id },
          data: {
            type: entry.type,
            metadata: entry.metadata ?? {},
            createdAt: entry.createdAt,
          },
        });
      } else {
        await prisma.agentMemory.create({
          data: {
            agentId,
            type: entry.type,
            content: entry.content,
            metadata: entry.metadata ?? {},
            createdAt: entry.createdAt,
          },
        });
      }
    }
  }
}

async function printVerification(): Promise<void> {
  const [districts, buildings, rooms, agents, memories] = await Promise.all([
    prisma.district.count({ where: { deletedAt: null } }),
    prisma.building.count({ where: { deletedAt: null } }),
    prisma.room.count({ where: { deletedAt: null } }),
    prisma.agent.count({ where: { deletedAt: null } }),
    prisma.agentMemory.count({ where: { deletedAt: null } }),
  ]);

  const roleCounts = await prisma.agent.groupBy({
    by: ['role'],
    where: { deletedAt: null },
    _count: { role: true },
  });

  console.log('Seed complete:');
  console.log(`  districts: ${districts}`);
  console.log(`  buildings: ${buildings}`);
  console.log(`  rooms: ${rooms}`);
  console.log(`  agents: ${agents}`);
  console.log(`  memories: ${memories}`);
  console.log(
    '  role counts:',
    Object.fromEntries(roleCounts.map((row) => [row.role, row._count.role])),
  );
}

async function main(): Promise<void> {
  const districtIds = await seedDistricts();
  const reasoningDistrictId = districtIds.get('reasoning');
  if (!reasoningDistrictId) {
    throw new Error('reasoning district not seeded');
  }

  const buildingIds = await seedBuildings(reasoningDistrictId);
  const planningTowerId = buildingIds.get('building-planning-tower');
  if (!planningTowerId) {
    throw new Error('building-planning-tower not seeded');
  }

  const roomIds = await seedRooms(planningTowerId);
  const agentIds = await seedAgents(reasoningDistrictId, buildingIds, roomIds);
  await seedMemories(agentIds);

  await prisma.worldState.upsert({
    where: { id: 'current' },
    create: {
      id: 'current',
      variables: {
        planetaryHealth: 78,
        cityProsperity: 94,
        agentMorale: 82,
        defenseReadiness: 71,
        knowledgeIndex: 88,
        innovationRate: 76,
      },
      tickCount: 0,
    },
    update: {},
  });

  await printVerification();
}

main()
  .catch((error: unknown) => {
    console.error('Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
