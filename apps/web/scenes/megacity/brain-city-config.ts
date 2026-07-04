export interface DistrictPalette {
  readonly primary: string;
  readonly accent: string;
  readonly glow: string;
  readonly emissive: string;
}

export interface BrainCityDistrictConfig {
  readonly entityId: string;
  readonly label: string;
  readonly subtitle: string;
  readonly palette: DistrictPalette;
  /** Island center [x, altitude y, z]. */
  readonly position: readonly [number, number, number];
  readonly islandRadius: number;
  readonly buildingCount: number;
  readonly highlighted?: boolean;
}

/** Floating Brain City districts — visual labels map to canonical entity IDs. */
export const BRAIN_CITY_DISTRICTS: readonly BrainCityDistrictConfig[] = [
  {
    entityId: 'district-memory',
    label: 'Memory District',
    subtitle: 'Archive towers · memory crystals',
    palette: {
      primary: '#8B5CF6',
      accent: '#C4B5FD',
      glow: '#A78BFA',
      emissive: '#6D28D9',
    },
    position: [-3200, 820, -2600],
    islandRadius: 520,
    buildingCount: 85,
  },
  {
    entityId: 'district-reasoning',
    label: 'Process District',
    subtitle: 'AI processing hubs · data streams',
    palette: {
      primary: '#00E5FF',
      accent: '#67E8F9',
      glow: '#22D3EE',
      emissive: '#0891B2',
    },
    position: [0, 880, 0],
    islandRadius: 620,
    buildingCount: 110,
    highlighted: true,
  },
  {
    entityId: 'district-perception',
    label: 'Data District',
    subtitle: 'Research facilities · data farms',
    palette: {
      primary: '#06D6A0',
      accent: '#6EE7B7',
      glow: '#34D399',
      emissive: '#059669',
    },
    position: [3400, 790, -2400],
    islandRadius: 500,
    buildingCount: 80,
  },
  {
    entityId: 'district-action',
    label: 'Network District',
    subtitle: 'Signal beams · sky routers',
    palette: {
      primary: '#FFB300',
      accent: '#FCD34D',
      glow: '#F59E0B',
      emissive: '#D97706',
    },
    position: [-3000, 760, 2800],
    islandRadius: 480,
    buildingCount: 75,
  },
  {
    entityId: 'district-self_improvement',
    label: 'Storage District',
    subtitle: 'Vault towers · energy storage',
    palette: {
      primary: '#E63946',
      accent: '#FCA5A5',
      glow: '#EF4444',
      emissive: '#B91C1C',
    },
    position: [3100, 800, 2700],
    islandRadius: 510,
    buildingCount: 78,
  },
];

/** Lowest floating island underside Y (district center minus base mesh drop). */
const ISLAND_UNDERDROP = 60;

export const BRAIN_CITY_DECK_Y =
  Math.min(...BRAIN_CITY_DISTRICTS.map((d) => d.position[1])) -
  ISLAND_UNDERDROP;

export interface BuildingPlacement {
  readonly districtId: string;
  readonly x: number;
  readonly y: number;
  readonly z: number;
  readonly width: number;
  readonly height: number;
  readonly depth: number;
  readonly color: string;
}

export interface TrafficRoute {
  readonly id: string;
  readonly from: readonly [number, number, number];
  readonly to: readonly [number, number, number];
  readonly laneHeight: number;
  readonly speed: number;
  readonly phase: number;
  readonly vehicleType: 'taxi' | 'shuttle' | 'cargo' | 'luxury';
}

function mulberry32(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function generateDistrictBuildings(
  districts: readonly BrainCityDistrictConfig[],
): readonly BuildingPlacement[] {
  const buildings: BuildingPlacement[] = [];

  districts.forEach((district, districtIndex) => {
    const rand = mulberry32(districtIndex * 997 + 13);
    const [cx, cy, cz] = district.position;

    for (let index = 0; index < district.buildingCount; index += 1) {
      const angle = rand() * Math.PI * 2;
      const radius = rand() ** 0.55 * district.islandRadius * 0.92;
      const height = 25 + rand() ** 0.6 * 180;
      const width = 12 + rand() * 28;
      const depth = 12 + rand() * 28;

      buildings.push({
        districtId: district.entityId,
        x: cx + Math.cos(angle) * radius,
        y: cy + height * 0.5 + 8,
        z: cz + Math.sin(angle) * radius,
        width,
        height,
        depth,
        color:
          rand() > 0.7 ? district.palette.accent : district.palette.primary,
      });
    }
  });

  return buildings;
}

function districtCenter(
  id: string,
  districts: readonly BrainCityDistrictConfig[],
): [number, number, number] {
  const district = districts.find((entry) => entry.entityId === id);
  if (!district) {
    return [0, 800, 0];
  }
  return [...district.position];
}

export function generateTrafficRoutes(
  districts: readonly BrainCityDistrictConfig[],
): readonly TrafficRoute[] {
  const pairs: Array<[string, string]> = [
    ['district-reasoning', 'district-memory'],
    ['district-reasoning', 'district-perception'],
    ['district-reasoning', 'district-action'],
    ['district-reasoning', 'district-self_improvement'],
    ['district-memory', 'district-perception'],
    ['district-memory', 'district-action'],
    ['district-perception', 'district-self_improvement'],
    ['district-action', 'district-self_improvement'],
    ['district-memory', 'district-self_improvement'],
    ['district-perception', 'district-action'],
  ];

  const vehicleTypes: TrafficRoute['vehicleType'][] = [
    'taxi',
    'shuttle',
    'cargo',
    'luxury',
  ];

  return pairs.flatMap(([fromId, toId], index) => {
    const from = districtCenter(fromId, districts);
    const to = districtCenter(toId, districts);
    const laneHeight = Math.max(from[1], to[1]) + 120 + (index % 3) * 40;

    return Array.from({ length: 3 }, (_, vehicleIndex) => ({
      id: `${fromId}-${toId}-${vehicleIndex}`,
      from,
      to,
      laneHeight,
      speed: 0.06 + (index % 4) * 0.015,
      phase: vehicleIndex * 0.33 + index * 0.11,
      vehicleType:
        vehicleTypes[(index + vehicleIndex) % vehicleTypes.length] ?? 'taxi',
    }));
  });
}

export const BRAIN_CITY_BUILDINGS =
  generateDistrictBuildings(BRAIN_CITY_DISTRICTS);
export const BRAIN_CITY_TRAFFIC_ROUTES =
  generateTrafficRoutes(BRAIN_CITY_DISTRICTS);

export interface HighwaySegment {
  readonly from: readonly [number, number, number];
  readonly to: readonly [number, number, number];
  readonly laneHeight: number;
}

export function generateHighwayNetwork(
  districts: readonly BrainCityDistrictConfig[],
): readonly HighwaySegment[] {
  const core = districts.find((d) => d.highlighted) ?? districts[0];
  const segments: HighwaySegment[] = [];

  districts.forEach((district) => {
    if (district.entityId === core.entityId) {
      return;
    }
    const laneHeight = (core.position[1] + district.position[1]) * 0.5 + 80;
    segments.push({
      from: core.position,
      to: district.position,
      laneHeight,
    });
  });

  // Ring connections between outer districts
  const outer = districts.filter((d) => !d.highlighted);
  for (let index = 0; index < outer.length; index += 1) {
    const current = outer[index];
    const next = outer[(index + 1) % outer.length];
    if (!current || !next) {
      continue;
    }
    segments.push({
      from: current.position,
      to: next.position,
      laneHeight: Math.max(current.position[1], next.position[1]) + 60,
    });
  }

  return segments;
}

export const BRAIN_CITY_HIGHWAYS = generateHighwayNetwork(BRAIN_CITY_DISTRICTS);
