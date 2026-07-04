import { Injectable, NotFoundException } from '@nestjs/common';
import type { Agent, ApiResponse, Building, Room } from '@ultron/shared';

import {
  groupRoomsIntoFloors,
  toAgent,
  toBuilding,
  toNumericMetrics,
  toRoom,
  type BuildingFloor,
} from '../../common/mappers/entity.mappers';
import { createApiResponse } from '../../common/utils/api-response.util';
import { PrismaService } from '../../common/prisma/prisma.service';

const NOT_DELETED = { deletedAt: null } as const;

@Injectable()
export class BuildingsService {
  constructor(private readonly prisma: PrismaService) {}

  private async findActiveBuilding(id: string) {
    return this.prisma.building.findFirst({
      where: { id, ...NOT_DELETED },
    });
  }

  async findById(id: string): Promise<ApiResponse<Building>> {
    const record = await this.findActiveBuilding(id);

    if (!record) {
      throw new NotFoundException(`Building '${id}' not found`);
    }

    return createApiResponse(toBuilding(record));
  }

  async findFloors(id: string): Promise<ApiResponse<BuildingFloor[]>> {
    const building = await this.findActiveBuilding(id);

    if (!building) {
      throw new NotFoundException(`Building '${id}' not found`);
    }

    const rooms = await this.prisma.room.findMany({
      where: { buildingId: id, ...NOT_DELETED },
      orderBy: [{ floorIndex: 'asc' }, { slug: 'asc' }],
    });

    return createApiResponse(groupRoomsIntoFloors(id, rooms.map(toRoom)));
  }

  async findRooms(id: string): Promise<ApiResponse<Room[]>> {
    const building = await this.findActiveBuilding(id);

    if (!building) {
      throw new NotFoundException(`Building '${id}' not found`);
    }

    const records = await this.prisma.room.findMany({
      where: { buildingId: id, ...NOT_DELETED },
      orderBy: [{ floorIndex: 'asc' }, { slug: 'asc' }],
    });

    return createApiResponse(records.map(toRoom));
  }

  async findAgents(id: string): Promise<ApiResponse<Agent[]>> {
    const building = await this.findActiveBuilding(id);

    if (!building) {
      throw new NotFoundException(`Building '${id}' not found`);
    }

    const records = await this.prisma.agent.findMany({
      where: { homeBuildingId: id, ...NOT_DELETED },
      orderBy: { slug: 'asc' },
    });

    return createApiResponse(records.map(toAgent));
  }

  async findMetrics(id: string): Promise<ApiResponse<Record<string, number>>> {
    const building = await this.findActiveBuilding(id);

    if (!building) {
      throw new NotFoundException(`Building '${id}' not found`);
    }

    const agentCount = await this.prisma.agent.count({
      where: { homeBuildingId: id, ...NOT_DELETED },
    });

    return createApiResponse({
      ...toNumericMetrics(building.metrics),
      agentCount,
    });
  }
}
