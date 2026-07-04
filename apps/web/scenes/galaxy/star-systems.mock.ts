import {
  buildGalaxyHudMetrics,
  buildGalaxyStarSystems,
  type GalaxyHudMetrics,
  LY_TO_SCENE,
} from '@ultron/shared';

export { LY_TO_SCENE };
export type { GalaxyHudMetrics };

export const MOCK_STAR_SYSTEMS = buildGalaxyStarSystems();
export const GALAXY_HUD_METRICS: GalaxyHudMetrics = buildGalaxyHudMetrics();
