import { Injectable } from '@nestjs/common';
import type {
  Agent,
  ApiResponse,
  Building,
  District,
  DistrictId,
  Room,
  ScaleLevel,
  ScaleMetrics,
} from '@ultron/shared';
import { DISTRICT_IDS, MAX_AGENTS_MVP } from '@ultron/shared';

import {
  toAgent,
  toBuilding,
  toDistrict,
  toNumericMetrics,
  toRoom,
} from '../../common/mappers/entity.mappers';
import { createApiResponse } from '../../common/utils/api-response.util';
import { slugOrUuidWhere } from '../../common/utils/entity-ref.util';
import { PrismaService } from '../../common/prisma/prisma.service';

const NOT_DELETED = { deletedAt: null } as const;

export interface NavigationBreadcrumb {
  scale: ScaleLevel;
  label: string;
  entityId?: string;
}

export interface NavigationHierarchyNode {
  id: string;
  label: string;
  scale: ScaleLevel;
  entityId?: string;
  children?: NavigationHierarchyNode[];
}

export interface NavigationBundle {
  scale: ScaleLevel;
  focus: string | null;
  breadcrumbs: NavigationBreadcrumb[];
  hierarchy: NavigationHierarchyNode[];
  entities: {
    districts: District[];
    buildings: Building[];
    rooms: Room[];
    agents: Agent[];
    metrics: ScaleMetrics;
  };
  transitions: Array<{ to: ScaleLevel; label: string }>;
}

type FocusEntity =
  | { kind: 'district'; focusId: string; district: District }
  | { kind: 'building'; focusId: string; building: Building }
  | { kind: 'room'; focusId: string; room: Room }
  | { kind: 'agent'; focusId: string; agent: Agent };

function districtFocusId(slug: DistrictId): string {
  return `district-${slug}`;
}

function parseDistrictFocusId(focus: string): DistrictId | null {
  if (!focus.startsWith('district-')) {
    return null;
  }
  const slug = focus.slice('district-'.length);
  if ((DISTRICT_IDS as readonly string[]).includes(slug)) {
    return slug as DistrictId;
  }
  return null;
}

@Injectable()
export class NavigationService {
  constructor(private readonly prisma: PrismaService) {}

  async getNavigation(
    scale: ScaleLevel,
    focus?: string,
  ): Promise<ApiResponse<NavigationBundle>> {
    const focusEntity = focus ? await this.resolveFocus(focus) : null;
    const [districts, hierarchy] = await Promise.all([
      this.loadDistricts(scale),
      this.buildHierarchy(),
    ]);

    const entities = await this.loadEntitiesForScale(
      scale,
      focusEntity,
      districts,
    );
    const breadcrumbs = this.buildBreadcrumbs(scale, focusEntity);
    const transitions = this.getTransitions(scale);

    return createApiResponse(
      {
        scale,
        focus: focus ?? null,
        breadcrumbs,
        hierarchy,
        entities,
        transitions,
      },
      { scale },
    );
  }

  async search(
    query: string,
    type?: string,
    limit = 20,
  ): Promise<ApiResponse<Array<{ id: string; type: string; name: string }>>> {
    const q = query.trim();
    if (!q) {
      return createApiResponse([], { page: 1, pageSize: limit, total: 0 });
    }

    const results: Array<{ id: string; type: string; name: string }> = [];

    if (!type || type === 'district') {
      const districts = await this.prisma.district.findMany({
        where: { name: { contains: q, mode: 'insensitive' }, ...NOT_DELETED },
        take: limit,
      });
      for (const district of districts) {
        results.push({
          id: districtFocusId(district.slug as DistrictId),
          type: 'district',
          name: district.name,
        });
      }
    }

    if (!type || type === 'agent') {
      const agents = await this.prisma.agent.findMany({
        where: { name: { contains: q, mode: 'insensitive' }, ...NOT_DELETED },
        take: limit,
      });
      for (const agent of agents) {
        results.push({ id: agent.slug, type: 'agent', name: agent.name });
      }
    }

    return createApiResponse(results.slice(0, limit), {
      page: 1,
      pageSize: limit,
      total: results.length,
    });
  }

  private async resolveFocus(focus: string): Promise<FocusEntity | null> {
    const districtSlug = parseDistrictFocusId(focus);
    if (districtSlug) {
      const record = await this.prisma.district.findFirst({
        where: { slug: districtSlug, ...NOT_DELETED },
      });
      if (!record) {
        return null;
      }
      return {
        kind: 'district',
        focusId: focus,
        district: toDistrict(record),
      };
    }

    const agent = await this.prisma.agent.findFirst({
      where: {
        ...slugOrUuidWhere(focus),
        ...NOT_DELETED,
      },
    });
    if (agent) {
      return { kind: 'agent', focusId: agent.slug, agent: toAgent(agent) };
    }

    const building = await this.prisma.building.findFirst({
      where: {
        ...slugOrUuidWhere(focus),
        ...NOT_DELETED,
      },
    });
    if (building) {
      return {
        kind: 'building',
        focusId: building.slug,
        building: toBuilding(building),
      };
    }

    const room = await this.prisma.room.findFirst({
      where: {
        ...slugOrUuidWhere(focus),
        ...NOT_DELETED,
      },
    });
    if (room) {
      return { kind: 'room', focusId: room.slug, room: toRoom(room) };
    }

    return null;
  }

  private async loadDistricts(scale: ScaleLevel): Promise<District[]> {
    if (scale !== 'megacity' && scale !== 'district') {
      return [];
    }

    const records = await this.prisma.district.findMany({
      where: NOT_DELETED,
      orderBy: { slug: 'asc' },
    });

    return records.map(toDistrict);
  }

  private async loadMetrics(
    scale: ScaleLevel,
    focusEntity: FocusEntity | null,
  ): Promise<ScaleMetrics> {
    const [districtCount, agentCount] = await Promise.all([
      this.prisma.district.count({ where: NOT_DELETED }),
      this.prisma.agent.count({ where: NOT_DELETED }),
    ]);

    if (focusEntity?.kind === 'district') {
      const activeAgents = await this.prisma.agent.count({
        where: { homeDistrictId: focusEntity.district.id, ...NOT_DELETED },
      });
      return { entityCount: focusEntity.district.agentCount, activeAgents };
    }

    if (focusEntity?.kind === 'building') {
      const activeAgents = await this.prisma.agent.count({
        where: { homeBuildingId: focusEntity.building.id, ...NOT_DELETED },
      });
      return { entityCount: 1, activeAgents };
    }

    if (scale === 'megacity') {
      return { entityCount: districtCount, activeAgents: agentCount };
    }

    if (scale === 'agent' && focusEntity?.kind === 'agent') {
      return { entityCount: 1, activeAgents: 1 };
    }

    return { entityCount: districtCount, activeAgents: agentCount };
  }

  private async loadEntitiesForScale(
    scale: ScaleLevel,
    focusEntity: FocusEntity | null,
    districts: District[],
  ): Promise<NavigationBundle['entities']> {
    const metrics = await this.loadMetrics(scale, focusEntity);
    const empty = {
      districts,
      buildings: [] as Building[],
      rooms: [] as Room[],
      agents: [] as Agent[],
      metrics,
    };

    if (scale === 'megacity') {
      return empty;
    }

    if (focusEntity?.kind === 'district' || scale === 'district') {
      const district =
        focusEntity?.kind === 'district'
          ? focusEntity.district
          : districts.find((item) => item.slug === 'reasoning');

      if (!district) {
        return empty;
      }

      const [buildings, agents] = await Promise.all([
        this.prisma.building.findMany({
          where: { districtId: district.id, ...NOT_DELETED },
          orderBy: { slug: 'asc' },
        }),
        this.prisma.agent.findMany({
          where: { homeDistrictId: district.id, ...NOT_DELETED },
          orderBy: { slug: 'asc' },
          take: 50,
        }),
      ]);

      return {
        districts: [district],
        buildings: buildings.map(toBuilding),
        rooms: [],
        agents: agents.map(toAgent),
        metrics,
      };
    }

    if (focusEntity?.kind === 'building' || scale === 'building') {
      const buildingId =
        focusEntity?.kind === 'building'
          ? focusEntity.building.id
          : (
              await this.prisma.building.findFirst({
                where: { slug: 'building-planning-tower', ...NOT_DELETED },
              })
            )?.id;

      if (!buildingId) {
        return empty;
      }

      const [building, rooms, agents] = await Promise.all([
        this.prisma.building.findFirst({
          where: { id: buildingId, ...NOT_DELETED },
        }),
        this.prisma.room.findMany({
          where: { buildingId, ...NOT_DELETED },
          orderBy: [{ floorIndex: 'asc' }, { slug: 'asc' }],
        }),
        this.prisma.agent.findMany({
          where: { homeBuildingId: buildingId, ...NOT_DELETED },
          orderBy: { slug: 'asc' },
        }),
      ]);

      return {
        districts: [],
        buildings: building ? [toBuilding(building)] : [],
        rooms: rooms.map(toRoom),
        agents: agents.map(toAgent),
        metrics,
      };
    }

    if (focusEntity?.kind === 'room' || scale === 'room') {
      const roomId =
        focusEntity?.kind === 'room'
          ? focusEntity.room.id
          : (
              await this.prisma.room.findFirst({
                where: { slug: 'room-strategy', ...NOT_DELETED },
              })
            )?.id;

      if (!roomId) {
        return empty;
      }

      const [room, agents] = await Promise.all([
        this.prisma.room.findFirst({ where: { id: roomId, ...NOT_DELETED } }),
        this.prisma.agent.findMany({
          where: { homeRoomId: roomId, ...NOT_DELETED },
          orderBy: { slug: 'asc' },
        }),
      ]);

      return {
        districts: [],
        buildings: [],
        rooms: room ? [toRoom(room)] : [],
        agents: agents.map(toAgent),
        metrics,
      };
    }

    if (
      focusEntity?.kind === 'agent' ||
      scale === 'agent' ||
      scale === 'memory'
    ) {
      if (focusEntity?.kind === 'agent') {
        return {
          districts: [],
          buildings: [],
          rooms: [],
          agents: [focusEntity.agent],
          metrics,
        };
      }

      const agentRecord = await this.prisma.agent.findFirst({
        where: { slug: 'agent-sigma-7', ...NOT_DELETED },
      });

      if (!agentRecord) {
        return empty;
      }

      return {
        districts: [],
        buildings: [],
        rooms: [],
        agents: [toAgent(agentRecord)],
        metrics,
      };
    }

    return empty;
  }

  private buildBreadcrumbs(
    scale: ScaleLevel,
    focusEntity: FocusEntity | null,
  ): NavigationBreadcrumb[] {
    const crumbs: NavigationBreadcrumb[] = [
      { scale: 'megacity', label: 'AI Megacity' },
    ];

    if (scale === 'megacity' && !focusEntity) {
      return crumbs;
    }

    if (focusEntity?.kind === 'district') {
      crumbs.push({
        scale: 'district',
        label: focusEntity.district.name,
        entityId: focusEntity.focusId,
      });
      return crumbs;
    }

    const reasoningDistrict: NavigationBreadcrumb = {
      scale: 'district',
      label: 'Reasoning District',
      entityId: districtFocusId('reasoning'),
    };

    if (focusEntity?.kind === 'building') {
      crumbs.push(reasoningDistrict);
      crumbs.push({
        scale: 'building',
        label: focusEntity.building.name,
        entityId: focusEntity.focusId,
      });
      return crumbs;
    }

    if (focusEntity?.kind === 'room' || focusEntity?.kind === 'agent') {
      crumbs.push(reasoningDistrict);
      crumbs.push({
        scale: 'building',
        label: 'Planning Tower',
        entityId: 'building-planning-tower',
      });
    }

    if (focusEntity?.kind === 'room') {
      crumbs.push({
        scale: 'room',
        label: focusEntity.room.name,
        entityId: focusEntity.focusId,
      });
      return crumbs;
    }

    if (focusEntity?.kind === 'agent') {
      crumbs.push({
        scale: 'room',
        label: 'Strategy Room',
        entityId: 'room-strategy',
      });
      crumbs.push({
        scale: 'agent',
        label: focusEntity.agent.name,
        entityId: focusEntity.focusId,
      });
      if (scale === 'memory') {
        crumbs.push({ scale: 'memory', label: 'Memory' });
      }
      return crumbs;
    }

    if (scale !== 'megacity') {
      crumbs.push({ scale, label: scale.replace('_', ' ') });
    }

    return crumbs;
  }

  private async buildHierarchy(): Promise<NavigationHierarchyNode[]> {
    const planningTower = await this.prisma.building.findFirst({
      where: { slug: 'building-planning-tower', ...NOT_DELETED },
    });
    const strategyRoom = await this.prisma.room.findFirst({
      where: { slug: 'room-strategy', ...NOT_DELETED },
    });
    const sigma7 = await this.prisma.agent.findFirst({
      where: { slug: 'agent-sigma-7', ...NOT_DELETED },
    });

    const districts = await this.prisma.district.findMany({
      where: NOT_DELETED,
      orderBy: { slug: 'asc' },
    });

    return [
      {
        id: 'megacity',
        label: 'AI Megacity',
        scale: 'megacity',
        children: districts.map((district) => ({
          id: districtFocusId(district.slug as DistrictId),
          label: district.name,
          scale: 'district' as const,
          entityId: districtFocusId(district.slug as DistrictId),
          children:
            district.slug === 'reasoning' && planningTower
              ? [
                  {
                    id: planningTower.slug,
                    label: planningTower.name,
                    scale: 'building' as const,
                    entityId: planningTower.slug,
                    children:
                      strategyRoom && sigma7
                        ? [
                            {
                              id: strategyRoom.slug,
                              label: strategyRoom.name,
                              scale: 'room' as const,
                              entityId: strategyRoom.slug,
                              children: [
                                {
                                  id: sigma7.slug,
                                  label: sigma7.name,
                                  scale: 'agent' as const,
                                  entityId: sigma7.slug,
                                },
                              ],
                            },
                          ]
                        : undefined,
                  },
                ]
              : undefined,
        })),
      },
    ];
  }

  private getTransitions(
    scale: ScaleLevel,
  ): Array<{ to: ScaleLevel; label: string }> {
    const transitions: Partial<
      Record<ScaleLevel, Array<{ to: ScaleLevel; label: string }>>
    > = {
      megacity: [{ to: 'district', label: 'Enter district' }],
      district: [
        { to: 'megacity', label: 'Return to megacity' },
        { to: 'building', label: 'Enter building' },
      ],
      building: [
        { to: 'district', label: 'Return to district' },
        { to: 'room', label: 'Enter room' },
      ],
      room: [
        { to: 'building', label: 'Return to building' },
        { to: 'agent', label: 'Focus agent' },
      ],
      agent: [
        { to: 'room', label: 'Return to room' },
        { to: 'memory', label: 'View memory' },
      ],
      memory: [{ to: 'agent', label: 'Return to agent' }],
    };

    return transitions[scale] ?? [];
  }

  async getMegacityAggregateMetrics(): Promise<Record<string, number>> {
    const [districtCount, agentCount] = await Promise.all([
      this.prisma.district.count({ where: NOT_DELETED }),
      this.prisma.agent.count({ where: NOT_DELETED }),
    ]);

    return {
      districtCount,
      totalAgents: agentCount,
      cityProsperity: 94.2,
      maxAgents: MAX_AGENTS_MVP,
    };
  }

  async getDistrictAggregateMetrics(
    districtSlug: DistrictId,
  ): Promise<Record<string, number>> {
    const district = await this.prisma.district.findFirst({
      where: { slug: districtSlug, ...NOT_DELETED },
    });

    if (!district) {
      return {};
    }

    return {
      ...toNumericMetrics(district.metrics),
      agentCount: district.agentCount,
    };
  }
}
