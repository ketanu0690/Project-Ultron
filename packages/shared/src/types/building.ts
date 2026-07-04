export type BuildingState =
  'planned' | 'constructing' | 'active' | 'degraded' | 'offline';

export const BUILDING_STATES: readonly BuildingState[] = [
  'planned',
  'constructing',
  'active',
  'degraded',
  'offline',
] as const;

export type BuildingDetailLevel = 'full' | 'lod_footprint';

export const BUILDING_DETAIL_LEVELS: readonly BuildingDetailLevel[] = [
  'full',
  'lod_footprint',
] as const;

/** Reasoning District building catalog slugs (MVP seed). */
export type ReasoningBuildingType =
  | 'planning_tower'
  | 'simulation_dome'
  | 'debate_amphitheater'
  | 'proof_workshop'
  | 'model_council_hall'
  | 'reasoning_annex';

export const REASONING_BUILDING_TYPES: readonly ReasoningBuildingType[] = [
  'planning_tower',
  'simulation_dome',
  'debate_amphitheater',
  'proof_workshop',
  'model_council_hall',
  'reasoning_annex',
] as const;

export interface Vec3Json {
  x: number;
  y: number;
  z: number;
}

export interface Building {
  id: string;
  slug: string;
  districtId: string;
  buildingType: string;
  name: string;
  state: BuildingState;
  detailLevel: BuildingDetailLevel;
  position: Vec3Json;
  capacity?: Record<string, unknown>;
  metrics?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}
