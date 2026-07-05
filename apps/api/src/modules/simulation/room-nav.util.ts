/** Room-local navigation bounds (half-extents on XZ plane, meters). */
export interface RoomBounds {
  readonly minX: number;
  readonly maxX: number;
  readonly minZ: number;
  readonly maxZ: number;
}

const DEFAULT_BOUNDS: RoomBounds = {
  minX: -8,
  maxX: 8,
  minZ: -8,
  maxZ: 8,
};

const ROOM_BOUNDS: Readonly<Record<string, RoomBounds>> = {
  'room-strategy': { minX: -9, maxX: 9, minZ: -9, maxZ: 9 },
  'room-plan-vault': { minX: -9, maxX: 9, minZ: -9, maxZ: 9 },
  'room-observation-deck': { minX: -9, maxX: 9, minZ: -9, maxZ: 9 },
};

export function getRoomBoundsBySlug(roomSlug: string | null): RoomBounds {
  if (roomSlug && roomSlug in ROOM_BOUNDS) {
    return ROOM_BOUNDS[roomSlug] ?? DEFAULT_BOUNDS;
  }
  return DEFAULT_BOUNDS;
}

export function clampToBounds(
  x: number,
  z: number,
  bounds: RoomBounds,
): { x: number; z: number } {
  return {
    x: Math.min(bounds.maxX, Math.max(bounds.minX, x)),
    z: Math.min(bounds.maxZ, Math.max(bounds.minZ, z)),
  };
}

export function randomPointInBounds(bounds: RoomBounds): {
  x: number;
  z: number;
} {
  return {
    x: bounds.minX + Math.random() * (bounds.maxX - bounds.minX),
    z: bounds.minZ + Math.random() * (bounds.maxZ - bounds.minZ),
  };
}

export function initialGridPosition(
  index: number,
  count: number,
): {
  x: number;
  y: number;
  z: number;
} {
  const spacing = 2.8;
  const cols = Math.ceil(Math.sqrt(count));
  const row = Math.floor(index / cols);
  const col = index % cols;
  const rows = Math.ceil(count / cols);
  return {
    x: col * spacing - ((cols - 1) * spacing) / 2,
    y: 0,
    z: row * spacing - ((rows - 1) * spacing) / 2,
  };
}
