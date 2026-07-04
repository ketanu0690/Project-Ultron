import type { Vec3Json } from './building';

export type RoomType =
  'strategy' | 'plan_vault' | 'observation_deck' | 'general';

export const ROOM_TYPES: readonly RoomType[] = [
  'strategy',
  'plan_vault',
  'observation_deck',
  'general',
] as const;

export interface Room {
  id: string;
  slug: string;
  buildingId: string;
  name: string;
  roomType: RoomType;
  floorIndex: number;
  position: Vec3Json;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}
