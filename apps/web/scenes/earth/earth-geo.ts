import type { LatLng } from '@ultron/shared';

export const EARTH_RADIUS_M = 6_371_000;

/** Convert geographic coordinates to a position on a sphere (Y-up, standard equirectangular). */
export function latLngToSurfacePosition(
  lat: number,
  lng: number,
  radius: number,
): [number, number, number] {
  const phi = ((90 - lat) * Math.PI) / 180;
  const theta = ((lng + 180) * Math.PI) / 180;

  const x = -radius * Math.sin(phi) * Math.cos(theta);
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);

  return [x, y, z];
}

/** Normalized surface normal from lat/lng. */
export function latLngToNormal(
  lat: number,
  lng: number,
): [number, number, number] {
  const [x, y, z] = latLngToSurfacePosition(lat, lng, 1);
  return [x, y, z];
}

/** Sun position for directional light given sun angle in degrees (0 = noon at prime meridian). */
export function sunPositionFromAngle(
  angleDeg: number,
  distance: number,
): [number, number, number] {
  const rad = (angleDeg * Math.PI) / 180;
  const x = Math.cos(rad) * distance;
  const y = Math.sin(rad * 0.3) * distance * 0.2;
  const z = Math.sin(rad) * distance;
  return [x, y, z];
}

/** Normalized sun direction pointing from sun toward Earth origin. */
export function sunDirectionFromAngle(
  angleDeg: number,
): [number, number, number] {
  const [x, y, z] = sunPositionFromAngle(angleDeg, 1);
  const len = Math.sqrt(x * x + y * y + z * z);
  return [-x / len, -y / len, -z / len];
}

export function latLngFromConfig(coords: LatLng): LatLng {
  return coords;
}
