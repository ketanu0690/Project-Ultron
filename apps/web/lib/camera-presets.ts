import type { ScaleLevel } from '@ultron/shared';
import type { CameraControlMode } from '@ultron/shared';

import { BRAIN_CITY_DECK_Y } from '@/scenes/megacity/brain-city-config';
export type CameraType = 'perspective' | 'orthographic';

export type ControlsProfile =
  'fly' | 'orbit' | 'map' | 'city_overview' | 'first_person' | 'fixed';

export interface CameraPreset {
  readonly scale: ScaleLevel;
  readonly cameraType: CameraType;
  readonly fov: number;
  readonly near: number;
  readonly far: number;
  readonly defaultPosition: readonly [number, number, number];
  readonly defaultTarget: readonly [number, number, number];
  readonly defaultZoom: number;
  readonly controlMode: CameraControlMode;
  readonly baseSpeed: number;
  readonly referenceAltitude: number;
  readonly controlsProfile: ControlsProfile;
  readonly minDistance: number;
  readonly maxDistance: number;
  readonly minAltitude: number;
  /** World Y treated as ground for altitude clamps (defaults to 0). */
  readonly groundY?: number;
  /** Max polar angle in radians (defaults to π). */
  readonly maxPolarAngle?: number;
}

const MVP_SCALES: ScaleLevel[] = [
  'megacity',
  'district',
  'building',
  'room',
  'agent',
  'memory',
];

/** Per-scale camera presets — see docs/design-system/camera.md */
export const CAMERA_PRESETS: Readonly<Record<ScaleLevel, CameraPreset>> = {
  galaxy: {
    scale: 'galaxy',
    cameraType: 'perspective',
    fov: 60,
    near: 0.1,
    far: 1000,
    defaultPosition: [8, 6.5, 8],
    defaultTarget: [0, 0, 0],
    defaultZoom: 1,
    controlMode: 'pan_log_zoom',
    baseSpeed: 2,
    referenceAltitude: 5,
    controlsProfile: 'map',
    minDistance: 0.75,
    maxDistance: 14,
    minAltitude: 0,
  },
  solar_system: {
    scale: 'solar_system',
    cameraType: 'perspective',
    fov: 60,
    near: 0.1,
    far: 1e15,
    defaultPosition: [0, 5e11, 1e12],
    defaultTarget: [0, 0, 0],
    defaultZoom: 1,
    controlMode: 'orbital_rotation',
    baseSpeed: 1e10,
    referenceAltitude: 1e11,
    controlsProfile: 'orbit',
    minDistance: 1e9,
    maxDistance: 1e13,
    minAltitude: 0,
  },
  earth: {
    scale: 'earth',
    cameraType: 'perspective',
    fov: 50,
    near: 0.1,
    far: 1e9,
    defaultPosition: [0, 1e7, 2e7],
    defaultTarget: [0, 0, 0],
    defaultZoom: 1,
    controlMode: 'globe_rotation',
    baseSpeed: 1e7,
    referenceAltitude: 6.371e6,
    controlsProfile: 'orbit',
    minDistance: 6.5e6,
    maxDistance: 5e8,
    minAltitude: 0,
  },
  orbital_ring: {
    scale: 'orbital_ring',
    cameraType: 'perspective',
    fov: 55,
    near: 1,
    far: 1e7,
    defaultPosition: [0, 50000, 100000],
    defaultTarget: [0, 0, 0],
    defaultZoom: 1,
    controlMode: 'path_orbit',
    baseSpeed: 5000,
    referenceAltitude: 10000,
    controlsProfile: 'orbit',
    minDistance: 1000,
    maxDistance: 500000,
    minAltitude: 0,
  },
  megacity: {
    scale: 'megacity',
    cameraType: 'perspective',
    fov: 65,
    near: 1,
    far: 50000,
    defaultPosition: [0, 2200, 5500],
    defaultTarget: [0, 800, 0],
    defaultZoom: 1,
    controlMode: 'free_flight',
    baseSpeed: 100,
    referenceAltitude: 2000,
    controlsProfile: 'city_overview',
    minDistance: 50,
    maxDistance: 25000,
    minAltitude: 50,
    groundY: BRAIN_CITY_DECK_Y,
    maxPolarAngle: 1.35,
  },
  district: {
    scale: 'district',
    cameraType: 'perspective',
    fov: 65,
    near: 0.5,
    far: 10000,
    defaultPosition: [0, 200, 500],
    defaultTarget: [0, 0, 0],
    defaultZoom: 1,
    controlMode: 'hover_walk',
    baseSpeed: 50,
    referenceAltitude: 200,
    controlsProfile: 'city_overview',
    minDistance: 10,
    maxDistance: 5000,
    minAltitude: 50,
  },
  building: {
    scale: 'building',
    cameraType: 'perspective',
    fov: 60,
    near: 0.5,
    far: 2000,
    defaultPosition: [30, 40, 60],
    defaultTarget: [0, 20, 0],
    defaultZoom: 1,
    controlMode: 'orbit_exterior',
    baseSpeed: 20,
    referenceAltitude: 50,
    controlsProfile: 'orbit',
    minDistance: 2,
    maxDistance: 500,
    minAltitude: 2,
  },
  room: {
    scale: 'room',
    cameraType: 'perspective',
    fov: 70,
    near: 0.1,
    far: 500,
    defaultPosition: [0, 1.7, 5],
    defaultTarget: [0, 1.7, 0],
    defaultZoom: 1,
    controlMode: 'walk_first_person',
    baseSpeed: 5,
    referenceAltitude: 1.7,
    controlsProfile: 'first_person',
    minDistance: 0.3,
    maxDistance: 50,
    minAltitude: 0.3,
  },
  agent: {
    scale: 'agent',
    cameraType: 'perspective',
    fov: 45,
    near: 0.1,
    far: 200,
    defaultPosition: [0, 2.5, 6],
    defaultTarget: [0, 1.5, 0],
    defaultZoom: 1,
    controlMode: 'fixed_focus',
    baseSpeed: 0,
    referenceAltitude: 1.5,
    controlsProfile: 'fixed',
    minDistance: 3,
    maxDistance: 20,
    minAltitude: 0.3,
  },
  memory: {
    scale: 'memory',
    cameraType: 'orthographic',
    fov: 45,
    near: 0.1,
    far: 1000,
    defaultPosition: [0, 100, 100],
    defaultTarget: [0, 0, 0],
    defaultZoom: 50,
    controlMode: 'graph_pan_zoom',
    baseSpeed: 10,
    referenceAltitude: 100,
    controlsProfile: 'map',
    minDistance: 1,
    maxDistance: 500,
    minAltitude: 0,
  },
};

export const MVP_CAMERA_SCALES = MVP_SCALES;

export function getCameraPreset(scale: ScaleLevel): CameraPreset {
  return CAMERA_PRESETS[scale];
}

export function createDefaultCameraState(scale: ScaleLevel) {
  const preset = getCameraPreset(scale);
  const [px, py, pz] = preset.defaultPosition;
  const [tx, ty, tz] = preset.defaultTarget;

  return {
    position: { x: px, y: py, z: pz },
    target: { x: tx, y: ty, z: tz },
    fov: preset.fov,
    zoom: preset.defaultZoom,
    controlMode: preset.controlMode,
  };
}
