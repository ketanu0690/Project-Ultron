import { COLORS } from '@ultron/shared';

export const RING_RADIUS = 800;
export const EARTH_RADIUS = 200;
export const SEGMENTS_PER_ZONE = 30;
export const TOTAL_SEGMENTS = 360;

export const RING_ROTATION_SPEED = 0.02;

export const SEGMENT_SIZE = {
  width: 6,
  height: 12,
  depth: 4,
} as const;

export type RingSegmentStatus = 'nominal' | 'degraded' | 'critical' | 'offline';

export const RING_STATUS_COLORS: Record<RingSegmentStatus, string> = {
  nominal: COLORS.signalCyan,
  degraded: COLORS.signalAmber,
  critical: COLORS.signalRed,
  offline: COLORS.fogGray,
};

export const RING_HULL_COLOR = COLORS.steelBlue;

export const RING_STATUS_EMISSIVE: Record<RingSegmentStatus, number> = {
  nominal: 0.35,
  degraded: 0.55,
  critical: 0.75,
  offline: 0.05,
};

/** Primary uplink zones (Alpha–Epsilon) receive tether columns. */
export const PRIMARY_UPLINK_ZONE_IDS = [
  'ring-zone-alpha',
  'ring-zone-beta',
  'ring-zone-gamma',
  'ring-zone-delta',
  'ring-zone-epsilon',
] as const;

export function zoneMidpointAngle(
  angleStart: number,
  angleEnd: number,
): number {
  return (angleStart + angleEnd) / 2;
}

export function angleToRingPosition(
  angleDeg: number,
  radius = RING_RADIUS,
): readonly [number, number, number] {
  const rad = (angleDeg * Math.PI) / 180;
  return [Math.sin(rad) * radius, 0, Math.cos(rad) * radius];
}
