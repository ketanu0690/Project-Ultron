import { Injectable, NotFoundException } from '@nestjs/common';
import type { AgentMemory, ApiResponse } from '@ultron/shared';

import { toAgentMemory } from '../../common/mappers/entity.mappers';
import { createApiResponse } from '../../common/utils/api-response.util';
import { slugOrUuidWhere } from '../../common/utils/entity-ref.util';
import { PrismaService } from '../../common/prisma/prisma.service';

const NOT_DELETED = { deletedAt: null } as const;

@Injectable()
export class MemoryService {
  constructor(private readonly prisma: PrismaService) {}

  async findByAgent(agentId: string): Promise<ApiResponse<AgentMemory[]>> {
    const agent = await this.prisma.agent.findFirst({
      where: {
        ...slugOrUuidWhere(agentId),
        ...NOT_DELETED,
      },
      select: { id: true },
    });

    if (!agent) {
      throw new NotFoundException(`Agent '${agentId}' not found`);
    }

    const records = await this.prisma.agentMemory.findMany({
      where: { agentId: agent.id, ...NOT_DELETED },
      orderBy: { createdAt: 'desc' },
    });

    return createApiResponse(records.map(toAgentMemory));
  }
}
