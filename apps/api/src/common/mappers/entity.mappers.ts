import type {
  Agent,
  AgentMemory,
  AgentMemoryMetadata,
  Building,
  District,
  DistrictId,
  DistrictThemeConfig,
  Room,
  RoomType,
  Vec3Json,
} from '@ultron/shared';
import { DISTRICT_IDS, ROOM_TYPES } from '@ultron/shared';
import type {
  Agent as PrismaAgent,
  AgentMemory as PrismaAgentMemory,
  Building as PrismaBuilding,
  District as PrismaDistrict,
  Room as PrismaRoom,
} from '@prisma/client';

function asDistrictId(slug: string): DistrictId {
  if ((DISTRICT_IDS as readonly string[]).includes(slug)) {
    return slug as DistrictId;
  }
  throw new Error(`Invalid district slug: ${slug}`);
}

function mapThemeConfig(value: unknown): DistrictThemeConfig {
  if (typeof value !== 'object' || value === null) {
    return { primary: '#ffffff', secondary: '#cccccc', accent: '#999999' };
  }

  const obj = value as Record<string, unknown>;
  const config: DistrictThemeConfig = {
    primary: typeof obj.primary === 'string' ? obj.primary : '#ffffff',
    secondary: typeof obj.secondary === 'string' ? obj.secondary : '#cccccc',
    accent: typeof obj.accent === 'string' ? obj.accent : '#999999',
  };

  if (typeof obj.background === 'string') {
    config.background = obj.background;
  }

  return config;
}

function mapVec3Json(value: unknown): Vec3Json {
  if (typeof value !== 'object' || value === null) {
    return { x: 0, y: 0, z: 0 };
  }

  const obj = value as Record<string, unknown>;
  return {
    x: typeof obj.x === 'number' ? obj.x : 0,
    y: typeof obj.y === 'number' ? obj.y : 0,
    z: typeof obj.z === 'number' ? obj.z : 0,
  };
}

function mapJsonRecord(value: unknown): Record<string, unknown> | undefined {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return undefined;
  }
  return value as Record<string, unknown>;
}

function mapCapabilities(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.filter((item): item is string => typeof item === 'string');
}

function mapMemoryMetadata(value: unknown): AgentMemoryMetadata {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return {};
  }

  const obj = value as Record<string, unknown>;
  const metadata: AgentMemoryMetadata = {};

  if (typeof obj.source === 'string') {
    metadata.source = obj.source;
  }
  if (typeof obj.confidence === 'number') {
    metadata.confidence = obj.confidence;
  }
  if (Array.isArray(obj.relatedEntities)) {
    metadata.relatedEntities = obj.relatedEntities.filter(
      (item): item is string => typeof item === 'string',
    );
  }
  if (Array.isArray(obj.tags)) {
    metadata.tags = obj.tags.filter(
      (item): item is string => typeof item === 'string',
    );
  }

  return metadata;
}

function asRoomType(value: string): RoomType {
  if ((ROOM_TYPES as readonly string[]).includes(value)) {
    return value as RoomType;
  }
  return 'general';
}

export function toDistrict(record: PrismaDistrict): District {
  return {
    id: record.id,
    slug: asDistrictId(record.slug),
    name: record.name,
    themeConfig: mapThemeConfig(record.themeConfig),
    agentCount: record.agentCount,
    metrics: mapJsonRecord(record.metrics),
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
    deletedAt: record.deletedAt?.toISOString() ?? null,
  };
}

export function toBuilding(record: PrismaBuilding): Building {
  return {
    id: record.id,
    slug: record.slug,
    districtId: record.districtId,
    buildingType: record.buildingType,
    name: record.name,
    state: record.state,
    detailLevel: record.detailLevel,
    position: mapVec3Json(record.position),
    capacity: mapJsonRecord(record.capacity),
    metrics: mapJsonRecord(record.metrics),
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
    deletedAt: record.deletedAt?.toISOString() ?? null,
  };
}

export function toRoom(record: PrismaRoom): Room {
  return {
    id: record.id,
    slug: record.slug,
    buildingId: record.buildingId,
    name: record.name,
    roomType: asRoomType(record.roomType),
    floorIndex: record.floorIndex,
    position: mapVec3Json(record.position),
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
    deletedAt: record.deletedAt?.toISOString() ?? null,
  };
}

export function toAgent(record: PrismaAgent): Agent {
  return {
    id: record.id,
    slug: record.slug,
    name: record.name,
    role: record.role,
    homeDistrictId: record.homeDistrictId,
    homeBuildingId: record.homeBuildingId,
    homeRoomId: record.homeRoomId,
    model: record.model,
    version: record.version,
    status: record.status,
    position: {
      x: record.positionX,
      y: record.positionY,
      z: record.positionZ,
    },
    rotationY: record.rotationY,
    capabilities: mapCapabilities(record.capabilities),
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
    deletedAt: record.deletedAt?.toISOString() ?? null,
  };
}

export function toAgentMemory(record: PrismaAgentMemory): AgentMemory {
  return {
    id: record.id,
    agentId: record.agentId,
    type: record.type,
    content: record.content,
    metadata: mapMemoryMetadata(record.metadata),
    createdAt: record.createdAt.toISOString(),
    expiresAt: record.expiresAt?.toISOString() ?? null,
    deletedAt: record.deletedAt?.toISOString() ?? null,
  };
}

export function toNumericMetrics(value: unknown): Record<string, number> {
  const record = mapJsonRecord(value);
  if (!record) {
    return {};
  }

  const metrics: Record<string, number> = {};
  for (const [key, metricValue] of Object.entries(record)) {
    if (typeof metricValue === 'number' && Number.isFinite(metricValue)) {
      metrics[key] = metricValue;
    }
  }
  return metrics;
}

export interface BuildingFloor {
  id: string;
  level: number;
  rooms: Room[];
}

export function groupRoomsIntoFloors(
  buildingId: string,
  rooms: Room[],
): BuildingFloor[] {
  const byLevel = new Map<number, Room[]>();

  for (const room of rooms) {
    const floorRooms = byLevel.get(room.floorIndex) ?? [];
    floorRooms.push(room);
    byLevel.set(room.floorIndex, floorRooms);
  }

  return [...byLevel.entries()]
    .sort(([levelA], [levelB]) => levelA - levelB)
    .map(([level, floorRooms]) => ({
      id: `${buildingId}-floor-${String(level)}`,
      level,
      rooms: floorRooms,
    }));
}
