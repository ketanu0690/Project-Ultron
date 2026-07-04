import type { Vec3 } from './camera';

export type StarType = 'G' | 'K' | 'M' | 'F' | 'A' | 'B';

export type CivilizationStatus = 'none' | 'scanned' | 'active';

export const STAR_TYPES: readonly StarType[] = ['G', 'K', 'M', 'F', 'A', 'B'];

export const CIVILIZATION_STATUSES: readonly CivilizationStatus[] = [
  'none',
  'scanned',
  'active',
];

export interface StarSystem {
  readonly id: string;
  readonly name: string;
  readonly position: Vec3;
  readonly starType: StarType;
  readonly civilizationStatus: CivilizationStatus;
  readonly agentCount?: number;
  readonly distanceFromSolLy?: number;
}
