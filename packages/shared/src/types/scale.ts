export type ScaleLevel =
  | 'galaxy'
  | 'solar_system'
  | 'earth'
  | 'orbital_ring'
  | 'megacity'
  | 'district'
  | 'building'
  | 'room'
  | 'agent'
  | 'memory';

export const SCALE_LEVELS: readonly ScaleLevel[] = [
  'galaxy',
  'solar_system',
  'earth',
  'orbital_ring',
  'megacity',
  'district',
  'building',
  'room',
  'agent',
  'memory',
] as const;
