import {
  GROUND_PLANE_Y,
  MAX_CAMERA_FOV,
  MIN_CAMERA_FOV,
  MIN_ALTITUDE_CITY,
  type CameraState,
  type Vec3,
} from '@ultron/shared';

export function clampFov(
  fov: number,
  min = MIN_CAMERA_FOV,
  max = MAX_CAMERA_FOV,
): number {
  return Math.min(max, Math.max(min, fov));
}

/** speed = baseSpeed × (altitude / referenceAltitude)^0.5 */
export function computeScaledSpeed(
  baseSpeed: number,
  currentAltitude: number,
  referenceAltitude: number,
): number {
  if (referenceAltitude <= 0 || baseSpeed <= 0) {
    return baseSpeed;
  }

  const altitude = Math.max(currentAltitude, 0);
  return baseSpeed * Math.sqrt(altitude / referenceAltitude);
}

export function enforceGroundPlane(
  position: Vec3,
  groundY = GROUND_PLANE_Y,
): Vec3 {
  if (position.y >= groundY) {
    return position;
  }

  return { ...position, y: groundY };
}

export function enforceMinAltitude(
  position: Vec3,
  minAltitude: number,
  groundY = GROUND_PLANE_Y,
): Vec3 {
  const minY = groundY + minAltitude;
  if (position.y >= minY) {
    return position;
  }

  return { ...position, y: minY };
}

export function applyScaleConstraints(
  position: Vec3,
  minAltitude: number,
  groundY = GROUND_PLANE_Y,
): Vec3 {
  return enforceMinAltitude(
    enforceGroundPlane(position, groundY),
    minAltitude,
    groundY,
  );
}

export function isCityScaleMinAltitude(minAltitude: number): boolean {
  return minAltitude >= MIN_ALTITUDE_CITY;
}

export function toVec3(x: number, y: number, z: number): Vec3 {
  return { x, y, z };
}

export function vec3Equals(a: Vec3, b: Vec3, epsilon = 0.001): boolean {
  return (
    Math.abs(a.x - b.x) < epsilon &&
    Math.abs(a.y - b.y) < epsilon &&
    Math.abs(a.z - b.z) < epsilon
  );
}

export function cameraStatesEqual(
  a: CameraState,
  b: CameraState,
  epsilon = 0.001,
): boolean {
  return (
    vec3Equals(a.position, b.position, epsilon) &&
    vec3Equals(a.target, b.target, epsilon) &&
    Math.abs(a.fov - b.fov) < epsilon &&
    Math.abs(a.zoom - b.zoom) < epsilon &&
    a.controlMode === b.controlMode
  );
}
