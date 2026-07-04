import { Injectable, NotFoundException } from '@nestjs/common';
import type {
  Agent,
  ApiResponse,
  Building,
  District,
  DistrictId,
} from '@ultron/shared';

import {
  toAgent,
  toBuilding,
  toDistrict,
  toNumericMetrics,
} from '../../common/mappers/entity.mappers';
import { createApiResponse } from '../../common/utils/api-response.util';
import { PrismaService } from '../../common/prisma/prisma.service';

const NOT_DELETED = { deletedAt: null } as const;

@Injectable()
export class DistrictsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<ApiResponse<District[]>> {
    const records = await this.prisma.district.findMany({
      where: NOT_DELETED,
      orderBy: { slug: 'asc' },
    });

    return createApiResponse(records.map(toDistrict));
  }

  async findById(id: DistrictId): Promise<ApiResponse<District>> {
    const record = await this.prisma.district.findFirst({
      where: { slug: id, ...NOT_DELETED },
    });

    if (!record) {
      throw new NotFoundException(`District '${id}' not found`);
    }

    return createApiResponse(toDistrict(record));
  }

  async findBuildings(id: DistrictId): Promise<ApiResponse<Building[]>> {
    const district = await this.prisma.district.findFirst({
      where: { slug: id, ...NOT_DELETED },
      select: { id: true },
    });

    if (!district) {
      throw new NotFoundException(`District '${id}' not found`);
    }

    const records = await this.prisma.building.findMany({
      where: { districtId: district.id, ...NOT_DELETED },
      orderBy: { slug: 'asc' },
    });

    return createApiResponse(records.map(toBuilding));
  }

  async findAgents(id: DistrictId): Promise<ApiResponse<Agent[]>> {
    const district = await this.prisma.district.findFirst({
      where: { slug: id, ...NOT_DELETED },
      select: { id: true },
    });

    if (!district) {
      throw new NotFoundException(`District '${id}' not found`);
    }

    const records = await this.prisma.agent.findMany({
      where: { homeDistrictId: district.id, ...NOT_DELETED },
      orderBy: { slug: 'asc' },
    });

    return createApiResponse(records.map(toAgent));
  }

  async findMetrics(
    id: DistrictId,
  ): Promise<ApiResponse<Record<string, number>>> {
    const district = await this.prisma.district.findFirst({
      where: { slug: id, ...NOT_DELETED },
    });

    if (!district) {
      throw new NotFoundException(`District '${id}' not found`);
    }

    const buildingCount = await this.prisma.building.count({
      where: { districtId: district.id, ...NOT_DELETED },
    });

    return createApiResponse({
      ...toNumericMetrics(district.metrics),
      agentCount: district.agentCount,
      buildingCount,
    });
  }
}
