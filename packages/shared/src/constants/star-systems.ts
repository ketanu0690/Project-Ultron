import type {
  CivilizationStatus,
  StarSystem,
  StarType,
} from '../types/star-system';

/** Maximum named star systems at v2 (see docs/world-bible/galaxy.md). */
export const GALAXY_NAMED_SYSTEM_COUNT = 100;

/** Galactic coordinate scale factor (light-years mapped to scene units). */
export const LY_TO_SCENE = 1e18;

export interface GalaxyHudMetrics {
  readonly totalAgents: number;
  readonly systemCount: number;
  readonly defenseAlerts: number;
  readonly explorationPercent: number;
}

export interface CuratedStarSystemSeed {
  readonly id: string;
  readonly name: string;
  readonly starType: StarType;
  readonly civilizationStatus: CivilizationStatus;
  readonly distanceFromSolLy: number;
  readonly galacticAngleRad: number;
  readonly galacticRadiusLy: number;
  readonly agentCount?: number;
}

export const CURATED_STAR_SYSTEM_SEEDS: readonly CuratedStarSystemSeed[] = [
  {
    id: 'star-sol',
    name: 'Sol',
    starType: 'G',
    civilizationStatus: 'active',
    distanceFromSolLy: 0,
    galacticAngleRad: 0,
    galacticRadiusLy: 0,
    agentCount: 50,
  },
  {
    id: 'star-alpha-centauri',
    name: 'Alpha Centauri',
    starType: 'G',
    civilizationStatus: 'scanned',
    distanceFromSolLy: 4.37,
    galacticAngleRad: 0.42,
    galacticRadiusLy: 4.37,
  },
  {
    id: 'star-sirius',
    name: 'Sirius',
    starType: 'A',
    civilizationStatus: 'none',
    distanceFromSolLy: 8.6,
    galacticAngleRad: 1.1,
    galacticRadiusLy: 8.6,
  },
  {
    id: 'star-tau-ceti',
    name: 'Tau Ceti',
    starType: 'G',
    civilizationStatus: 'scanned',
    distanceFromSolLy: 11.9,
    galacticAngleRad: 2.3,
    galacticRadiusLy: 11.9,
  },
  {
    id: 'star-proxima-centauri',
    name: 'Proxima Centauri',
    starType: 'M',
    civilizationStatus: 'scanned',
    distanceFromSolLy: 4.24,
    galacticAngleRad: 0.55,
    galacticRadiusLy: 4.5,
  },
  {
    id: 'star-vega',
    name: 'Vega',
    starType: 'A',
    civilizationStatus: 'none',
    distanceFromSolLy: 25.04,
    galacticAngleRad: 3.8,
    galacticRadiusLy: 25,
  },
  {
    id: 'star-arcturus',
    name: 'Arcturus',
    starType: 'K',
    civilizationStatus: 'none',
    distanceFromSolLy: 36.7,
    galacticAngleRad: 4.2,
    galacticRadiusLy: 36,
  },
  {
    id: 'star-barnards-star',
    name: "Barnard's Star",
    starType: 'M',
    civilizationStatus: 'scanned',
    distanceFromSolLy: 5.96,
    galacticAngleRad: 5.1,
    galacticRadiusLy: 6,
  },
  {
    id: 'star-epsilon-eridani',
    name: 'Epsilon Eridani',
    starType: 'K',
    civilizationStatus: 'scanned',
    distanceFromSolLy: 10.5,
    galacticAngleRad: 1.8,
    galacticRadiusLy: 10.5,
  },
  {
    id: 'star-61-cygni',
    name: '61 Cygni',
    starType: 'K',
    civilizationStatus: 'none',
    distanceFromSolLy: 11.4,
    galacticAngleRad: 2.9,
    galacticRadiusLy: 11.4,
  },
  {
    id: 'star-altair',
    name: 'Altair',
    starType: 'A',
    civilizationStatus: 'none',
    distanceFromSolLy: 16.73,
    galacticAngleRad: 0.9,
    galacticRadiusLy: 16.7,
  },
  {
    id: 'star-fomalhaut',
    name: 'Fomalhaut',
    starType: 'A',
    civilizationStatus: 'none',
    distanceFromSolLy: 25.13,
    galacticAngleRad: 5.6,
    galacticRadiusLy: 25,
  },
  {
    id: 'star-wolf-359',
    name: 'Wolf 359',
    starType: 'M',
    civilizationStatus: 'scanned',
    distanceFromSolLy: 7.86,
    galacticAngleRad: 3.2,
    galacticRadiusLy: 7.9,
  },
  {
    id: 'star-ross-248',
    name: 'Ross 248',
    starType: 'M',
    civilizationStatus: 'none',
    distanceFromSolLy: 10.3,
    galacticAngleRad: 4.7,
    galacticRadiusLy: 10.3,
  },
  {
    id: 'star-lalande-21185',
    name: 'Lalande 21185',
    starType: 'M',
    civilizationStatus: 'scanned',
    distanceFromSolLy: 8.31,
    galacticAngleRad: 2.1,
    galacticRadiusLy: 8.3,
  },
  {
    id: 'star-capella',
    name: 'Capella',
    starType: 'G',
    civilizationStatus: 'none',
    distanceFromSolLy: 42.9,
    galacticAngleRad: 1.4,
    galacticRadiusLy: 42,
  },
  {
    id: 'star-rigel',
    name: 'Rigel',
    starType: 'B',
    civilizationStatus: 'none',
    distanceFromSolLy: 860,
    galacticAngleRad: 0.3,
    galacticRadiusLy: 850,
  },
  {
    id: 'star-betelgeuse',
    name: 'Betelgeuse',
    starType: 'M',
    civilizationStatus: 'none',
    distanceFromSolLy: 642,
    galacticAngleRad: 0.7,
    galacticRadiusLy: 640,
  },
  {
    id: 'star-polaris',
    name: 'Polaris',
    starType: 'F',
    civilizationStatus: 'none',
    distanceFromSolLy: 433,
    galacticAngleRad: 6.0,
    galacticRadiusLy: 430,
  },
  {
    id: 'star-trappist-1',
    name: 'TRAPPIST-1',
    starType: 'M',
    civilizationStatus: 'scanned',
    distanceFromSolLy: 40.66,
    galacticAngleRad: 3.5,
    galacticRadiusLy: 40,
  },
];

const PROCEDURAL_NAMES = [
  'Kepler',
  'Gliese',
  'Ross',
  'Luyten',
  'Wolf',
  'Lalande',
  'Kapteyn',
  'Teegarden',
  'Groombridge',
  'Van Maanen',
  'YZ Ceti',
  'DX Cancri',
  'GJ',
  'HD',
  'HIP',
  'WISE',
  '2MASS',
  'LHS',
  'LP',
  'SCR',
] as const;

const STAR_TYPE_WEIGHTS: readonly StarType[] = [
  'M',
  'M',
  'M',
  'K',
  'K',
  'G',
  'F',
  'A',
  'B',
];

function galacticPosition(
  radiusLy: number,
  angleRad: number,
  yJitter = 0,
): { x: number; y: number; z: number } {
  const r = radiusLy * LY_TO_SCENE;
  const x = Math.cos(angleRad) * r;
  const z = Math.sin(angleRad) * r;
  const y = yJitter;
  return { x, y, z };
}

function curatedToStarSystem(system: CuratedStarSystemSeed): StarSystem {
  const position = galacticPosition(
    system.galacticRadiusLy,
    system.galacticAngleRad,
  );
  return {
    id: system.id,
    name: system.name,
    position,
    starType: system.starType,
    civilizationStatus: system.civilizationStatus,
    agentCount: system.agentCount,
    distanceFromSolLy: system.distanceFromSolLy,
  };
}

function generateProceduralSystems(count: number, seed: number): StarSystem[] {
  const systems: StarSystem[] = [];
  let rng = seed;

  const nextRandom = (): number => {
    rng = (rng * 16807 + 0) % 2147483647;
    return (rng - 1) / 2147483646;
  };

  for (let index = 0; index < count; index += 1) {
    const namePrefix = PROCEDURAL_NAMES[index % PROCEDURAL_NAMES.length];
    const catalogId = 1000 + index;
    const radiusLy = 15 + nextRandom() * 800;
    const angleRad = nextRandom() * Math.PI * 2;
    const starType =
      STAR_TYPE_WEIGHTS[Math.floor(nextRandom() * STAR_TYPE_WEIGHTS.length)];
    const statusRoll = nextRandom();
    const civilizationStatus: CivilizationStatus =
      statusRoll < 0.15 ? 'scanned' : 'none';
    const r = radiusLy * LY_TO_SCENE;
    const yJitter = (nextRandom() - 0.5) * r * 0.05;

    systems.push({
      id: `star-proc-${catalogId}`,
      name: `${namePrefix} ${catalogId}`,
      position: galacticPosition(radiusLy, angleRad, yJitter),
      starType,
      civilizationStatus,
      distanceFromSolLy: Math.round(radiusLy * 10) / 10,
    });
  }

  return systems;
}

export function buildGalaxyStarSystems(): readonly StarSystem[] {
  const curated = CURATED_STAR_SYSTEM_SEEDS.map(curatedToStarSystem);
  const procedural = generateProceduralSystems(
    GALAXY_NAMED_SYSTEM_COUNT - curated.length,
    42_001,
  );
  return [...curated, ...procedural];
}

export function computeGalaxyHudMetrics(
  systems: ReadonlyArray<Pick<StarSystem, 'civilizationStatus' | 'agentCount'>>,
): GalaxyHudMetrics {
  const exploredCount = systems.filter(
    (system) => system.civilizationStatus !== 'none',
  ).length;
  return {
    totalAgents: systems.reduce(
      (sum, system) => sum + (system.agentCount ?? 0),
      0,
    ),
    systemCount: systems.length,
    defenseAlerts: 0,
    explorationPercent:
      systems.length === 0
        ? 0
        : Math.round((exploredCount / systems.length) * 100),
  };
}

export function buildGalaxyHudMetrics(): GalaxyHudMetrics {
  return computeGalaxyHudMetrics(buildGalaxyStarSystems());
}

export interface StarSystemsBundle {
  readonly systems: readonly StarSystem[];
  readonly metrics: GalaxyHudMetrics;
}

export function buildStarSystemsBundle(): StarSystemsBundle {
  const systems = buildGalaxyStarSystems();
  return {
    systems,
    metrics: computeGalaxyHudMetrics(systems),
  };
}
