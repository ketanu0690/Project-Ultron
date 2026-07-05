import { Injectable, NotFoundException } from '@nestjs/common';
import type { Agent, AgentStatus, ApiResponse } from '@ultron/shared';
import type { Prisma } from '@prisma/client';

import { toAgent } from '../../common/mappers/entity.mappers';
import { createApiResponse } from '../../common/utils/api-response.util';
import { PrismaService } from '../../common/prisma/prisma.service';
import { AgentsQueryDto } from './dto/agents-query.dto';

const NOT_DELETED = { deletedAt: null } as const;

@Injectable()
export class AgentsService {
  constructor(private readonly prisma: PrismaService) {}

  private async buildWhere(
    query: AgentsQueryDto,
  ): Promise<Prisma.AgentWhereInput> {
    const where: Prisma.AgentWhereInput = { ...NOT_DELETED };

    if (query.district !== undefined) {
      const district = await this.prisma.district.findFirst({
        where: { slug: query.district, ...NOT_DELETED },
        select: { id: true },
      });

      if (!district) {
        return { id: { in: [] } };
      }

      where.homeDistrictId = district.id;
    }

    if (query.status !== undefined) {
      where.status = query.status;
    }

    if (query.viewport !== undefined) {
      const parts = query.viewport.split(',').map((part) => Number(part));
      if (
        parts.length === 4 &&
        parts.every((value) => Number.isFinite(value))
      ) {
        const [minX, minZ, maxX, maxZ] = parts;
        where.positionX = { gte: minX, lte: maxX };
        where.positionZ = { gte: minZ, lte: maxZ };
      }
    }

    return where;
  }

  async findAll(query: AgentsQueryDto): Promise<ApiResponse<Agent[]>> {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 50;
    const where = await this.buildWhere(query);

    const [records, total] = await Promise.all([
      this.prisma.agent.findMany({
        where,
        orderBy: { slug: 'asc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prisma.agent.count({ where }),
    ]);

    return createApiResponse(records.map(toAgent), {
      page,
      pageSize,
      total,
    });
  }

  async findById(id: string): Promise<ApiResponse<Agent>> {
    const record = await this.prisma.agent.findFirst({
      where: { id, ...NOT_DELETED },
    });

    if (!record) {
      throw new NotFoundException(`Agent '${id}' not found`);
    }

    return createApiResponse(toAgent(record));
  }

  async getStatus(
    id: string,
  ): Promise<ApiResponse<{ agentId: string; status: AgentStatus }>> {
    const record = await this.prisma.agent.findFirst({
      where: { id, ...NOT_DELETED },
      select: { id: true, status: true },
    });

    if (!record) {
      throw new NotFoundException(`Agent '${id}' not found`);
    }

    return createApiResponse({
      agentId: record.id,
      status: record.status,
    });
  }
}
