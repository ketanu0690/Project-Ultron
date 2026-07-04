import type { EarthState, GroundStation } from '@ultron/shared';

export { EARTH_RADIUS_M } from './earth-geo';

/** Default megacity hub — coastal megaregion (Tokyo Bay area). */
export const MEGACITY_COORDINATES = {
  lat: 35.68,
  lng: 139.69,
} as const;

export const MOCK_GROUND_STATIONS: readonly GroundStation[] = [
  {
    id: 'gs-pacific',
    name: 'Pacific Tether',
    coordinates: { lat: 0, lng: -150 },
  },
  {
    id: 'gs-atlantic',
    name: 'Atlantic Tether',
    coordinates: { lat: 0, lng: -30 },
  },
  { id: 'gs-africa', name: 'Africa Tether', coordinates: { lat: 0, lng: 20 } },
  {
    id: 'gs-indian',
    name: 'Indian Ocean Tether',
    coordinates: { lat: 0, lng: 80 },
  },
  {
    id: 'gs-pacific-east',
    name: 'Eastern Pacific Tether',
    coordinates: { lat: 0, lng: -90 },
  },
  {
    id: 'gs-mariana',
    name: 'Mariana Tether',
    coordinates: { lat: 0, lng: 145 },
  },
] as const;

export const MOCK_EARTH_STATE: EarthState = {
  timestamp: new Date().toISOString(),
  rotation: 0,
  cloudCoverage: 0.45,
  megacityCoordinates: MEGACITY_COORDINATES,
  planetaryHealth: {
    atmosphere: { value: 72, trend: 'up' },
    biosphere: { value: 65, trend: 'up' },
    oceanHealth: { value: 58, trend: 'stable' },
    infrastructure: { value: 89, trend: 'up' },
  },
  groundStations: MOCK_GROUND_STATIONS,
};

export function getAggregatePlanetaryHealth(
  health: EarthState['planetaryHealth'],
): number {
  const { atmosphere, biosphere, oceanHealth, infrastructure } = health;
  return Math.round(
    (atmosphere.value +
      biosphere.value +
      oceanHealth.value +
      infrastructure.value) /
      4,
  );
}
