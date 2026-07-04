import type { Vec3 } from '@ultron/shared';

/** Scale-change and camera-only paths for the scroll journey (zoom-in drill-down). */
export type TransitionId =
  | 'galaxy-to-earth'
  | 'earth-to-galaxy'
  | 'earth-to-megacity'
  | 'megacity-to-earth'
  | 'megacity-to-district'
  | 'district-to-megacity'
  | 'district-dive-memory'
  | 'district-dive-reasoning'
  | 'district-dive-action'
  | 'district-dive-self-improvement'
  | 'district-rise-memory'
  | 'district-rise-reasoning'
  | 'district-rise-action'
  | 'district-rise-self-improvement'
  | 'earth-to-orbital_ring'
  | 'earth-to-solar_system';

export type EasingName = 'linear' | 'ease-in-out';

export interface CameraKeyframe {
  readonly position: readonly [number, number, number];
  readonly lookAt: readonly [number, number, number];
}

export interface TransitionPath {
  readonly id: TransitionId;
  readonly duration: number;
  readonly easing: EasingName;
  readonly controlPoints: readonly CameraKeyframe[];
  readonly preload: boolean;
}

const GALAXY_OVERVIEW: CameraKeyframe = {
  position: [8, 6.5, 8],
  lookAt: [0, 0, 0],
};
const GALAXY_CORE: CameraKeyframe = {
  position: [0.43, 0.35, 0.43],
  lookAt: [0, 0, 0],
};
const EARTH_ORBIT: CameraKeyframe = {
  position: [0, 1e7, 2e7],
  lookAt: [0, 0, 0],
};
const MEGACITY_OVERVIEW: CameraKeyframe = {
  position: [0, 2200, 5500],
  lookAt: [0, 800, 0],
};
const BRAIN_CITY_CORE: CameraKeyframe = {
  position: [0, 1400, 3200],
  lookAt: [0, 880, 0],
};
const DISTRICT_OVERVIEW: CameraKeyframe = {
  position: [0, 200, 500],
  lookAt: [0, 0, 0],
};

export const TRANSITION_PATHS: Readonly<Record<TransitionId, TransitionPath>> =
  {
    // Galaxy → Earth: dive into the galactic core (zoom IN), then scene swaps to Earth orbit
    'galaxy-to-earth': {
      id: 'galaxy-to-earth',
      duration: 2800,
      easing: 'ease-in-out',
      preload: true,
      controlPoints: [
        GALAXY_OVERVIEW,
        { position: [4.2, 3.2, 4.2], lookAt: [0, 0, 0] },
        { position: [1.8, 1.2, 1.8], lookAt: [0, 0, 0] },
        GALAXY_CORE,
      ],
    },
    // Earth → Galaxy: pull back from orbit, then scene swaps to galaxy overview
    'earth-to-galaxy': {
      id: 'earth-to-galaxy',
      duration: 2800,
      easing: 'ease-in-out',
      preload: true,
      controlPoints: [
        EARTH_ORBIT,
        { position: [0, 4e7, 7e7], lookAt: [0, 0, 0] },
        { position: [0, 1.5e8, 2.5e8], lookAt: [0, 0, 0] },
      ],
    },
    // Earth → Brain City: cinematic flight — Earth recedes, clouds, traffic, islands emerge
    'earth-to-megacity': {
      id: 'earth-to-megacity',
      duration: 4800,
      easing: 'ease-in-out',
      preload: true,
      controlPoints: [
        EARTH_ORBIT,
        { position: [0, 1.8e7, 3.2e7], lookAt: [0, 0, 0] },
        { position: [0, 4e6, 7e6], lookAt: [0, 5e5, 0] },
        { position: [0, 800_000, 1_600_000], lookAt: [0, 200_000, 0] },
        { position: [0, 80_000, 160_000], lookAt: [0, 40_000, 0] },
        { position: [0, 18_000, 36_000], lookAt: [0, 900, 0] },
        BRAIN_CITY_CORE,
        MEGACITY_OVERVIEW,
      ],
    },
    // Megacity → Earth: rise from city back to orbit
    'megacity-to-earth': {
      id: 'megacity-to-earth',
      duration: 2800,
      easing: 'ease-in-out',
      preload: true,
      controlPoints: [
        MEGACITY_OVERVIEW,
        { position: [0, 8000, 15000], lookAt: [0, 0, 0] },
        { position: [0, 3e6, 6e6], lookAt: [0, 0, 0] },
        EARTH_ORBIT,
      ],
    },
    // Megacity → District: descend from city overview into district scale
    'megacity-to-district': {
      id: 'megacity-to-district',
      duration: 2400,
      easing: 'ease-in-out',
      preload: true,
      controlPoints: [
        MEGACITY_OVERVIEW,
        { position: [0, 900, 2200], lookAt: [0, 0, 0] },
        { position: [0, 350, 800], lookAt: [0, 0, 0] },
        DISTRICT_OVERVIEW,
      ],
    },
    // District → Megacity: rise back to city overview
    'district-to-megacity': {
      id: 'district-to-megacity',
      duration: 2400,
      easing: 'ease-in-out',
      preload: true,
      controlPoints: [
        DISTRICT_OVERVIEW,
        { position: [0, 350, 800], lookAt: [0, 0, 0] },
        { position: [0, 900, 2200], lookAt: [0, 0, 0] },
        MEGACITY_OVERVIEW,
      ],
    },
    // District-to-district: progressive zoom-in at same scale
    'district-dive-memory': {
      id: 'district-dive-memory',
      duration: 1600,
      easing: 'ease-in-out',
      preload: false,
      controlPoints: [
        DISTRICT_OVERVIEW,
        { position: [0, 170, 420], lookAt: [0, 0, 0] },
      ],
    },
    'district-dive-reasoning': {
      id: 'district-dive-reasoning',
      duration: 1600,
      easing: 'ease-in-out',
      preload: false,
      controlPoints: [
        { position: [0, 170, 420], lookAt: [0, 0, 0] },
        { position: [0, 140, 350], lookAt: [0, 0, 0] },
      ],
    },
    'district-dive-action': {
      id: 'district-dive-action',
      duration: 1600,
      easing: 'ease-in-out',
      preload: false,
      controlPoints: [
        { position: [0, 140, 350], lookAt: [0, 0, 0] },
        { position: [0, 115, 290], lookAt: [0, 0, 0] },
      ],
    },
    'district-dive-self-improvement': {
      id: 'district-dive-self-improvement',
      duration: 1600,
      easing: 'ease-in-out',
      preload: false,
      controlPoints: [
        { position: [0, 115, 290], lookAt: [0, 0, 0] },
        { position: [0, 95, 240], lookAt: [0, 0, 0] },
      ],
    },
    'district-rise-memory': {
      id: 'district-rise-memory',
      duration: 1600,
      easing: 'ease-in-out',
      preload: false,
      controlPoints: [
        { position: [0, 170, 420], lookAt: [0, 0, 0] },
        DISTRICT_OVERVIEW,
      ],
    },
    'district-rise-reasoning': {
      id: 'district-rise-reasoning',
      duration: 1600,
      easing: 'ease-in-out',
      preload: false,
      controlPoints: [
        { position: [0, 140, 350], lookAt: [0, 0, 0] },
        { position: [0, 170, 420], lookAt: [0, 0, 0] },
      ],
    },
    'district-rise-action': {
      id: 'district-rise-action',
      duration: 1600,
      easing: 'ease-in-out',
      preload: false,
      controlPoints: [
        { position: [0, 115, 290], lookAt: [0, 0, 0] },
        { position: [0, 140, 350], lookAt: [0, 0, 0] },
      ],
    },
    'district-rise-self-improvement': {
      id: 'district-rise-self-improvement',
      duration: 1600,
      easing: 'ease-in-out',
      preload: false,
      controlPoints: [
        { position: [0, 95, 240], lookAt: [0, 0, 0] },
        { position: [0, 115, 290], lookAt: [0, 0, 0] },
      ],
    },
    'earth-to-orbital_ring': {
      id: 'earth-to-orbital_ring',
      duration: 2000,
      easing: 'linear',
      preload: true,
      controlPoints: [
        EARTH_ORBIT,
        { position: [0, 8e6, 1e7], lookAt: [0, 0, 0] },
        { position: [0, 50000, 100000], lookAt: [0, 0, 0] },
      ],
    },
    'earth-to-solar_system': {
      id: 'earth-to-solar_system',
      duration: 2000,
      easing: 'linear',
      preload: true,
      controlPoints: [
        EARTH_ORBIT,
        { position: [0, 5e11, 1e12], lookAt: [0, 0, 0] },
      ],
    },
  };

export function applyEasing(t: number, easing: EasingName): number {
  if (easing === 'ease-in-out') {
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  }
  return t;
}

export function interpolateAlongPath(
  controlPoints: readonly CameraKeyframe[],
  t: number,
): { position: Vec3; target: Vec3 } {
  if (controlPoints.length === 0) {
    return { position: { x: 0, y: 0, z: 0 }, target: { x: 0, y: 0, z: 0 } };
  }

  if (controlPoints.length === 1) {
    const [p] = controlPoints;
    return {
      position: { x: p.position[0], y: p.position[1], z: p.position[2] },
      target: { x: p.lookAt[0], y: p.lookAt[1], z: p.lookAt[2] },
    };
  }

  const segments = controlPoints.length - 1;
  const scaled = t * segments;
  const segmentIndex = Math.min(Math.floor(scaled), segments - 1);
  const localT = scaled - segmentIndex;

  const from = controlPoints[segmentIndex];
  const to = controlPoints[segmentIndex + 1];

  return {
    position: {
      x: from.position[0] + (to.position[0] - from.position[0]) * localT,
      y: from.position[1] + (to.position[1] - from.position[1]) * localT,
      z: from.position[2] + (to.position[2] - from.position[2]) * localT,
    },
    target: {
      x: from.lookAt[0] + (to.lookAt[0] - from.lookAt[0]) * localT,
      y: from.lookAt[1] + (to.lookAt[1] - from.lookAt[1]) * localT,
      z: from.lookAt[2] + (to.lookAt[2] - from.lookAt[2]) * localT,
    },
  };
}

export function getTransitionPath(id: TransitionId): TransitionPath {
  return TRANSITION_PATHS[id];
}

export function resolveTransitionId(
  from: import('@ultron/shared').ScaleLevel,
  to: import('@ultron/shared').ScaleLevel,
): TransitionId | null {
  const key = `${from}-to-${to}` as TransitionId;
  if (key in TRANSITION_PATHS) {
    return key;
  }
  return null;
}

export function cameraDistance(keyframe: CameraKeyframe): number {
  const [px, py, pz] = keyframe.position;
  const [tx, ty, tz] = keyframe.lookAt;
  const dx = px - tx;
  const dy = py - ty;
  const dz = pz - tz;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}
