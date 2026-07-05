/**
 * Prisma mock fixtures for in-process API integration tests.
 * @see docs/qa/nexus-scenarios.md
 */

const NOW = new Date('2026-07-04T12:00:00.000Z');

export const MOCK_DISTRICT_REASONING = {
  id: '11111111-1111-4111-8111-111111111111',
  slug: 'reasoning',
  name: 'Reasoning District',
  themeConfig: { primary: '#00E5FF', secondary: '#0088AA', accent: '#00E5FF' },
  agentCount: 50,
  metrics: { throughput: 1200, simulations: 8 },
  createdAt: NOW,
  updatedAt: NOW,
  deletedAt: null,
};

export const MOCK_BUILDING_PLANNING_TOWER = {
  id: '22222222-2222-4222-8222-222222222222',
  slug: 'building-planning-tower',
  districtId: MOCK_DISTRICT_REASONING.id,
  buildingType: 'planning_tower',
  name: 'Planning Tower',
  state: 'active' as const,
  detailLevel: 'full' as const,
  position: { x: 0, y: 0, z: 0 },
  capacity: {},
  metrics: { utilization: 0.87 },
  createdAt: NOW,
  updatedAt: NOW,
  deletedAt: null,
};

export const MOCK_AGENT_SIGMA_7 = {
  id: '33333333-3333-4333-8333-333333333333',
  slug: 'agent-sigma-7',
  name: 'Analyst Sigma-7',
  role: 'planner' as const,
  homeDistrictId: MOCK_DISTRICT_REASONING.id,
  homeBuildingId: MOCK_BUILDING_PLANNING_TOWER.id,
  homeRoomId: null,
  model: 'ultron-v1',
  version: '1.0.0',
  status: 'idle' as const,
  positionX: 0,
  positionY: 0,
  positionZ: 0,
  rotationY: 0,
  wanderTargetX: null,
  wanderTargetZ: null,
  capabilities: [],
  createdAt: NOW,
  updatedAt: NOW,
  deletedAt: null,
};

export const MOCK_AGENT_MEMORY = {
  id: '44444444-4444-4444-8444-444444444444',
  agentId: MOCK_AGENT_SIGMA_7.id,
  type: 'episodic' as const,
  content: 'Threat assessment completed for sector 7.',
  metadata: { source: 'simulation', confidence: 0.92 },
  createdAt: NOW,
  expiresAt: null,
  deletedAt: null,
};

export interface PrismaMock {
  $connect: jest.Mock;
  $disconnect: jest.Mock;
  $queryRaw: jest.Mock;
  district: {
    findMany: jest.Mock;
    findFirst: jest.Mock;
  };
  building: {
    findMany: jest.Mock;
    findFirst: jest.Mock;
  };
  room: {
    findMany: jest.Mock;
  };
  agent: {
    findMany: jest.Mock;
    findFirst: jest.Mock;
    update: jest.Mock;
    count: jest.Mock;
    groupBy: jest.Mock;
  };
  agentMemory: {
    findMany: jest.Mock;
  };
  worldState: {
    findUnique: jest.Mock;
    upsert: jest.Mock;
  };
  governancePolicy: {
    findMany: jest.Mock;
    findFirst: jest.Mock;
    upsert: jest.Mock;
    update: jest.Mock;
  };
  simulationEvent: {
    create: jest.Mock;
    findMany: jest.Mock;
  };
}

export function createPrismaMock(
  overrides: Partial<PrismaMock> = {},
): PrismaMock {
  const mock: PrismaMock = {
    $connect: jest.fn().mockResolvedValue(undefined),
    $disconnect: jest.fn().mockResolvedValue(undefined),
    $queryRaw: jest.fn().mockResolvedValue([{ '?column?': 1 }]),
    district: {
      findMany: jest.fn().mockResolvedValue([MOCK_DISTRICT_REASONING]),
      findFirst: jest.fn().mockImplementation(({ where }) => {
        if (where?.slug === 'reasoning') {
          return Promise.resolve(MOCK_DISTRICT_REASONING);
        }
        return Promise.resolve(null);
      }),
    },
    building: {
      findMany: jest.fn().mockResolvedValue([MOCK_BUILDING_PLANNING_TOWER]),
      findFirst: jest.fn().mockResolvedValue(MOCK_BUILDING_PLANNING_TOWER),
    },
    room: {
      findMany: jest.fn().mockResolvedValue([]),
    },
    agent: {
      findMany: jest
        .fn()
        .mockResolvedValue([{ ...MOCK_AGENT_SIGMA_7, homeRoom: null }]),
      findFirst: jest.fn().mockImplementation(({ where }) => {
        if (
          where?.slug === 'agent-sigma-7' ||
          where?.id === MOCK_AGENT_SIGMA_7.id
        ) {
          return Promise.resolve(MOCK_AGENT_SIGMA_7);
        }
        return Promise.resolve(null);
      }),
      update: jest.fn().mockResolvedValue(MOCK_AGENT_SIGMA_7),
      count: jest.fn().mockResolvedValue(1),
      groupBy: jest.fn().mockResolvedValue([]),
    },
    agentMemory: {
      findMany: jest.fn().mockResolvedValue([MOCK_AGENT_MEMORY]),
    },
    worldState: {
      findUnique: jest.fn().mockResolvedValue(null),
      upsert: jest.fn().mockResolvedValue({
        id: 'current',
        variables: {},
        tickCount: 0,
        updatedAt: NOW,
      }),
    },
    governancePolicy: {
      findMany: jest.fn().mockResolvedValue([]),
      findFirst: jest.fn().mockResolvedValue(null),
      upsert: jest.fn().mockResolvedValue({
        id: 'policy-1',
        slug: 'movement-curfew',
        domain: 'movement',
        name: 'District Curfew',
        rules: {},
        version: 1,
        active: true,
        createdAt: NOW,
        updatedAt: NOW,
        deletedAt: null,
      }),
      update: jest.fn().mockResolvedValue({
        id: 'policy-1',
        slug: 'defense-posture',
        domain: 'defense',
        name: 'Orbital Defense Posture',
        rules: {},
        version: 2,
        active: true,
        createdAt: NOW,
        updatedAt: NOW,
        deletedAt: null,
      }),
    },
    simulationEvent: {
      create: jest.fn().mockResolvedValue({ id: 'event-1' }),
      findMany: jest.fn().mockResolvedValue([]),
    },
    ...overrides,
  };

  return mock;
}
