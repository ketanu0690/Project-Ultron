export type CameraControlMode =
  | 'pan_log_zoom'
  | 'orbital_rotation'
  | 'globe_rotation'
  | 'path_orbit'
  | 'free_flight'
  | 'hover_walk'
  | 'orbit_exterior'
  | 'walk_first_person'
  | 'fixed_focus'
  | 'graph_pan_zoom';

export type CameraSpecialMode =
  'default' | 'follow_agent' | 'orbit_selection' | 'cinematic';

export interface Vec3 {
  readonly x: number;
  readonly y: number;
  readonly z: number;
}

export interface CameraState {
  readonly position: Vec3;
  readonly target: Vec3;
  readonly fov: number;
  readonly zoom: number;
  readonly controlMode: CameraControlMode;
}

export const MIN_CAMERA_FOV = 30;
export const MAX_CAMERA_FOV = 80;

/** Interior sphere collision radius (m). */
export const CAMERA_COLLISION_RADIUS_INTERIOR = 0.3;

/** Minimum altitude above ground at city scale (m). */
export const MIN_ALTITUDE_CITY = 50;

/** Minimum distance from building exterior mesh (m). */
export const MIN_DISTANCE_BUILDING_EXTERIOR = 2;

/** Default ground plane Y coordinate (m). */
export const GROUND_PLANE_Y = 0;
