import type { ScaleLevel } from '../types/scale';
import type { CameraControlMode } from '../types/camera';

export interface ScaleCameraDefaults {
  readonly controlMode: CameraControlMode;
  readonly baseSpeed: number;
  readonly referenceAltitude: number;
}

/** Speed-scaling defaults per scale — see docs/design-system/camera.md */
export const SCALE_CAMERA_DEFAULTS: Readonly<
  Record<ScaleLevel, ScaleCameraDefaults>
> = {
  galaxy: {
    controlMode: 'pan_log_zoom',
    baseSpeed: 2e20,
    referenceAltitude: 1e21,
  },
  solar_system: {
    controlMode: 'orbital_rotation',
    baseSpeed: 1e10,
    referenceAltitude: 1e11,
  },
  earth: {
    controlMode: 'globe_rotation',
    baseSpeed: 1e7,
    referenceAltitude: 6.371e6,
  },
  orbital_ring: {
    controlMode: 'path_orbit',
    baseSpeed: 5000,
    referenceAltitude: 10000,
  },
  megacity: {
    controlMode: 'free_flight',
    baseSpeed: 100,
    referenceAltitude: 2000,
  },
  district: {
    controlMode: 'hover_walk',
    baseSpeed: 50,
    referenceAltitude: 200,
  },
  building: {
    controlMode: 'orbit_exterior',
    baseSpeed: 20,
    referenceAltitude: 50,
  },
  room: {
    controlMode: 'walk_first_person',
    baseSpeed: 5,
    referenceAltitude: 1.7,
  },
  agent: {
    controlMode: 'fixed_focus',
    baseSpeed: 0,
    referenceAltitude: 1.5,
  },
  memory: {
    controlMode: 'graph_pan_zoom',
    baseSpeed: 10,
    referenceAltitude: 100,
  },
};
