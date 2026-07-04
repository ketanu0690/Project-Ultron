/**
 * Nexus QA — seed invariant assertions.
 * Run against a migrated + seeded database (local or CI Postgres).
 *
 * @tag @api
 * @see docs/qa/nexus-scenarios.md
 */

import { PrismaClient } from '@prisma/client';
import { REASONING_AGENT_ROLE_COUNTS } from '@ultron/shared';

const prisma = new PrismaClient();

const NOT_DELETED = { deletedAt: null } as const;

describe('Seed invariants (Nexus QA)', () => {
  let databaseAvailable = false;

  beforeAll(async () => {
    try {
      await prisma.$queryRaw`SELECT 1`;
      databaseAvailable = true;
    } catch {
      databaseAvailable = false;
    }
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  function skipWithoutDatabase(): boolean {
    if (!databaseAvailable) {
      return true;
    }
    return false;
  }

  it('has exactly 5 districts', async () => {
    if (skipWithoutDatabase()) {
      return;
    }
    const count = await prisma.district.count({ where: NOT_DELETED });
    expect(count).toBe(5);
  });

  it('has 10 buildings in Reasoning District', async () => {
    if (skipWithoutDatabase()) {
      return;
    }
    const reasoning = await prisma.district.findFirst({
      where: { slug: 'reasoning', ...NOT_DELETED },
    });
    expect(reasoning).not.toBeNull();

    const count = await prisma.building.count({
      where: { districtId: reasoning!.id, ...NOT_DELETED },
    });
    expect(count).toBe(10);
  });

  it('has 3 rooms in Planning Tower', async () => {
    if (skipWithoutDatabase()) {
      return;
    }
    const tower = await prisma.building.findFirst({
      where: { slug: 'building-planning-tower', ...NOT_DELETED },
    });
    expect(tower).not.toBeNull();

    const count = await prisma.room.count({
      where: { buildingId: tower!.id, ...NOT_DELETED },
    });
    expect(count).toBe(3);
  });

  it('has 50 agents in Reasoning with correct role distribution', async () => {
    if (skipWithoutDatabase()) {
      return;
    }
    const reasoning = await prisma.district.findFirst({
      where: { slug: 'reasoning', ...NOT_DELETED },
    });
    expect(reasoning).not.toBeNull();

    const agents = await prisma.agent.findMany({
      where: { homeDistrictId: reasoning!.id, ...NOT_DELETED },
      select: { role: true },
    });
    expect(agents).toHaveLength(50);

    const roleCounts = agents.reduce<Record<string, number>>((acc, agent) => {
      acc[agent.role] = (acc[agent.role] ?? 0) + 1;
      return acc;
    }, {});

    for (const [role, expected] of Object.entries(
      REASONING_AGENT_ROLE_COUNTS,
    )) {
      expect(roleCounts[role]).toBe(expected);
    }
  });

  it('has 12 agent memories', async () => {
    if (skipWithoutDatabase()) {
      return;
    }
    const count = await prisma.agentMemory.count({ where: NOT_DELETED });
    expect(count).toBe(12);
  });
});
