export interface LatLng {
  readonly lat: number;
  readonly lng: number;
}

export type HealthTrend = 'up' | 'stable' | 'down';

export interface PlanetaryHealthMetric {
  readonly value: number;
  readonly trend: HealthTrend;
}

export interface PlanetaryHealth {
  readonly atmosphere: PlanetaryHealthMetric;
  readonly biosphere: PlanetaryHealthMetric;
  readonly oceanHealth: PlanetaryHealthMetric;
  readonly infrastructure: PlanetaryHealthMetric;
}

export interface GroundStation {
  readonly id: string;
  readonly name: string;
  readonly coordinates: LatLng;
}

export interface EarthState {
  readonly timestamp: string;
  readonly rotation: number;
  readonly cloudCoverage: number;
  readonly megacityCoordinates: LatLng;
  readonly planetaryHealth: PlanetaryHealth;
  readonly groundStations: readonly GroundStation[];
}
