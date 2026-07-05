import { Injectable } from '@nestjs/common';
import type { GovernancePolicy, PolicyDomain } from '@ultron/shared';
import type { Prisma } from '@prisma/client';

import { PrismaService } from '../../common/prisma/prisma.service';

const SEEDED_POLICIES: ReadonlyArray<{
  slug: string;
  domain: PolicyDomain;
  name: string;
  rules: Record<string, unknown>;
}> = [
  {
    slug: 'movement-curfew',
    domain: 'movement',
    name: 'District Curfew',
    rules: {
      enforceRoomBounds: true,
      maxWanderSpeed: 1.2,
      defenseLockdown: false,
    },
  },
  {
    slug: 'agent-population-cap',
    domain: 'agent',
    name: 'Reasoning District Population Cap',
    rules: { maxAgentsPerDistrict: 500, crossDistrictDelegation: true },
  },
  {
    slug: 'resource-allocation',
    domain: 'resource',
    name: 'Equal District Power Allocation',
    rules: { districtPowerShare: 0.2, buildingUtilizationCeiling: 0.95 },
  },
  {
    slug: 'defense-posture',
    domain: 'defense',
    name: 'Orbital Defense Posture',
    rules: { threatResponseLevel: 'auto', restrictCrossDistrictOnAlert: true },
  },
];

@Injectable()
export class GovernanceService {
  constructor(private readonly prisma: PrismaService) {}

  async ensureSeeded(): Promise<void> {
    for (const policy of SEEDED_POLICIES) {
      await this.prisma.governancePolicy.upsert({
        where: { slug: policy.slug },
        create: {
          slug: policy.slug,
          domain: policy.domain,
          name: policy.name,
          rules: policy.rules as Prisma.InputJsonValue,
        },
        update: {
          name: policy.name,
          rules: policy.rules as Prisma.InputJsonValue,
          active: true,
        },
      });
    }
  }

  async findAll(): Promise<GovernancePolicy[]> {
    const records = await this.prisma.governancePolicy.findMany({
      where: { deletedAt: null, active: true },
      orderBy: { domain: 'asc' },
    });

    return records.map((record) => ({
      id: record.id,
      slug: record.slug,
      domain: record.domain as PolicyDomain,
      name: record.name,
      rules: record.rules as Record<string, unknown>,
      version: record.version,
      active: record.active,
      createdAt: record.createdAt.toISOString(),
      updatedAt: record.updatedAt.toISOString(),
    }));
  }

  async getRulesMap(): Promise<Record<string, unknown>> {
    const policies = await this.findAll();
    const merged: Record<string, unknown> = {};
    for (const policy of policies) {
      Object.assign(merged, policy.rules);
    }
    return merged;
  }

  async updatePolicy(
    id: string,
    patch: { rules?: Record<string, unknown>; active?: boolean },
  ): Promise<GovernancePolicy | null> {
    const existing = await this.prisma.governancePolicy.findFirst({
      where: { id, deletedAt: null },
    });
    if (!existing) {
      return null;
    }

    const record = await this.prisma.governancePolicy.update({
      where: { id },
      data: {
        rules: (patch.rules ?? existing.rules) as Prisma.InputJsonValue,
        active: patch.active ?? existing.active,
        version: existing.version + (patch.rules ? 1 : 0),
      },
    });

    return {
      id: record.id,
      slug: record.slug,
      domain: record.domain as PolicyDomain,
      name: record.name,
      rules: record.rules as Record<string, unknown>,
      version: record.version,
      active: record.active,
      createdAt: record.createdAt.toISOString(),
      updatedAt: record.updatedAt.toISOString(),
    };
  }
}
