import type { ScaleLevel } from '@ultron/shared';

/** Scales where the camera uses free orbit/fly controls instead of scroll-journey stepping. */
const FREE_CAMERA_SCALES: ReadonlySet<ScaleLevel> = new Set([
  'megacity',
  'district',
  'building',
  'room',
  'agent',
  'memory',
]);

/** Cosmic journey scales where scroll wheel dollies the camera until zoom limits. */
const JOURNEY_ZOOM_SCALES: ReadonlySet<ScaleLevel> = new Set([
  'galaxy',
  'earth',
]);

export function hasFreeCameraControl(scale: ScaleLevel): boolean {
  return FREE_CAMERA_SCALES.has(scale);
}

export function hasJourneyZoomControl(scale: ScaleLevel): boolean {
  return JOURNEY_ZOOM_SCALES.has(scale);
}

export function hasWheelDollyControl(
  scale: ScaleLevel,
  isScrollJourneyComplete: boolean,
): boolean {
  return (
    isScrollJourneyComplete ||
    hasFreeCameraControl(scale) ||
    hasJourneyZoomControl(scale)
  );
}
