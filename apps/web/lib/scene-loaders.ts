import type { ScaleLevel } from '@ultron/shared';
import { lazy, type ComponentType, type LazyExoticComponent } from 'react';

export type ScaleSceneComponent = ComponentType;

const sceneLoaders: Record<
  ScaleLevel,
  () => Promise<{ default: ScaleSceneComponent }>
> = {
  galaxy: () => import('@/scenes/galaxy/GalaxyScene'),
  solar_system: () => import('@/scenes/_shared/LockedScaleScene'),
  earth: () => import('@/scenes/earth/EarthScene'),
  orbital_ring: () => import('@/scenes/orbital-ring/OrbitalRingScene'),
  megacity: () => import('@/scenes/megacity/MegacityScene'),
  district: () => import('@/scenes/district/DistrictScene'),
  building: () => import('@/scenes/building/BuildingScene'),
  room: () => import('@/scenes/room/RoomScene'),
  agent: () => import('@/scenes/agent/AgentScene'),
  memory: () => import('@/scenes/memory/MemoryScene'),
};

export const lazyScaleScenes: Record<
  ScaleLevel,
  LazyExoticComponent<ScaleSceneComponent>
> = {
  galaxy: lazy(sceneLoaders.galaxy),
  solar_system: lazy(sceneLoaders.solar_system),
  earth: lazy(sceneLoaders.earth),
  orbital_ring: lazy(sceneLoaders.orbital_ring),
  megacity: lazy(sceneLoaders.megacity),
  district: lazy(sceneLoaders.district),
  building: lazy(sceneLoaders.building),
  room: lazy(sceneLoaders.room),
  agent: lazy(sceneLoaders.agent),
  memory: lazy(sceneLoaders.memory),
};

export function preloadScaleScene(scale: ScaleLevel): void {
  void sceneLoaders[scale]();
}
