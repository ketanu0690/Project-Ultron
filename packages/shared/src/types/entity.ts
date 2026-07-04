export type EntityType =
  | 'district'
  | 'building'
  | 'room'
  | 'agent'
  | 'ring_segment'
  | 'threat'
  | 'star_system';

export const ENTITY_TYPES: readonly EntityType[] = [
  'district',
  'building',
  'room',
  'agent',
  'ring_segment',
  'threat',
  'star_system',
] as const;

export interface Entity {
  id: string;
  type: EntityType;
  name: string;
  position?: [number, number, number];
  metadata?: Record<string, unknown>;
}
