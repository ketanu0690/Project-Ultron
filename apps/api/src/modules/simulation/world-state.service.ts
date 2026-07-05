import { Injectable } from '@nestjs/common';
import type { WorldStateVariables } from '@ultron/shared';
import type { Prisma } from '@prisma/client';

import { PrismaService } from '../../common/prisma/prisma.service';

const DEFAULT_WORLD_STATE: WorldStateVariables = {
  planetaryHealth: 78,
  cityProsperity: 94,
  agentMorale: 82,
  defenseReadiness: 71,
  knowledgeIndex: 88,
  innovationRate: 76,
};

@Injectable()
export class WorldStateService {
  constructor(private readonly prisma: PrismaService) {}

  async getVariables(): Promise<WorldStateVariables> {
    const record = await this.prisma.worldState.findUnique({
      where: { id: 'current' },
    });

    if (!record) {
      return { ...DEFAULT_WORLD_STATE };
    }

    const variables = record.variables as Partial<WorldStateVariables>;
    return {
      planetaryHealth:
        variables.planetaryHealth ?? DEFAULT_WORLD_STATE.planetaryHealth,
      cityProsperity:
        variables.cityProsperity ?? DEFAULT_WORLD_STATE.cityProsperity,
      agentMorale: variables.agentMorale ?? DEFAULT_WORLD_STATE.agentMorale,
      defenseReadiness:
        variables.defenseReadiness ?? DEFAULT_WORLD_STATE.defenseReadiness,
      knowledgeIndex:
        variables.knowledgeIndex ?? DEFAULT_WORLD_STATE.knowledgeIndex,
      innovationRate:
        variables.innovationRate ?? DEFAULT_WORLD_STATE.innovationRate,
    };
  }

  async updateVariables(
    patch: Partial<WorldStateVariables>,
  ): Promise<WorldStateVariables> {
    const current = await this.getVariables();
    const next = { ...current, ...patch };

    await this.prisma.worldState.upsert({
      where: { id: 'current' },
      create: {
        id: 'current',
        variables: next as unknown as Prisma.InputJsonValue,
        tickCount: 0,
      },
      update: {
        variables: next as unknown as Prisma.InputJsonValue,
      },
    });

    return next;
  }

  async incrementTick(): Promise<number> {
    const record = await this.prisma.worldState.upsert({
      where: { id: 'current' },
      create: {
        id: 'current',
        variables: DEFAULT_WORLD_STATE as unknown as Prisma.InputJsonValue,
        tickCount: 1,
      },
      update: {
        tickCount: { increment: 1 },
      },
    });

    return record.tickCount;
  }

  async getTickCount(): Promise<number> {
    const record = await this.prisma.worldState.findUnique({
      where: { id: 'current' },
      select: { tickCount: true },
    });
    return record?.tickCount ?? 0;
  }
}
