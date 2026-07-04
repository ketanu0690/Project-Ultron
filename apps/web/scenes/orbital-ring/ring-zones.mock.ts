import type { DistrictId } from '@ultron/shared';

import type { RingSegmentStatus } from '@/scenes/orbital-ring/ring.constants';

export interface RingZone {
  readonly id: string;
  readonly name: string;
  readonly angleStart: number;
  readonly angleEnd: number;
  readonly status: RingSegmentStatus;
  readonly uplinkDistrict: DistrictId | null;
  readonly sensorCoverage: number;
}

export const MOCK_RING_ZONES: readonly RingZone[] = [
  {
    id: 'ring-zone-alpha',
    name: 'Alpha',
    angleStart: 0,
    angleEnd: 30,
    status: 'nominal',
    uplinkDistrict: 'perception',
    sensorCoverage: 98,
  },
  {
    id: 'ring-zone-beta',
    name: 'Beta',
    angleStart: 30,
    angleEnd: 60,
    status: 'nominal',
    uplinkDistrict: 'memory',
    sensorCoverage: 96,
  },
  {
    id: 'ring-zone-gamma',
    name: 'Gamma',
    angleStart: 60,
    angleEnd: 90,
    status: 'nominal',
    uplinkDistrict: 'reasoning',
    sensorCoverage: 99,
  },
  {
    id: 'ring-zone-delta',
    name: 'Delta',
    angleStart: 90,
    angleEnd: 120,
    status: 'degraded',
    uplinkDistrict: 'action',
    sensorCoverage: 72,
  },
  {
    id: 'ring-zone-epsilon',
    name: 'Epsilon',
    angleStart: 120,
    angleEnd: 150,
    status: 'nominal',
    uplinkDistrict: 'self_improvement',
    sensorCoverage: 94,
  },
  {
    id: 'ring-zone-zeta',
    name: 'Zeta',
    angleStart: 150,
    angleEnd: 185,
    status: 'nominal',
    uplinkDistrict: null,
    sensorCoverage: 88,
  },
  {
    id: 'ring-zone-eta',
    name: 'Eta',
    angleStart: 185,
    angleEnd: 220,
    status: 'offline',
    uplinkDistrict: null,
    sensorCoverage: 12,
  },
  {
    id: 'ring-zone-theta',
    name: 'Theta',
    angleStart: 220,
    angleEnd: 255,
    status: 'nominal',
    uplinkDistrict: null,
    sensorCoverage: 91,
  },
  {
    id: 'ring-zone-iota',
    name: 'Iota',
    angleStart: 255,
    angleEnd: 290,
    status: 'nominal',
    uplinkDistrict: null,
    sensorCoverage: 87,
  },
  {
    id: 'ring-zone-kappa',
    name: 'Kappa',
    angleStart: 290,
    angleEnd: 325,
    status: 'critical',
    uplinkDistrict: null,
    sensorCoverage: 45,
  },
  {
    id: 'ring-zone-lambda',
    name: 'Lambda',
    angleStart: 325,
    angleEnd: 350,
    status: 'nominal',
    uplinkDistrict: null,
    sensorCoverage: 90,
  },
  {
    id: 'ring-zone-omega',
    name: 'Omega',
    angleStart: 350,
    angleEnd: 360,
    status: 'offline',
    uplinkDistrict: null,
    sensorCoverage: 8,
  },
];

export const PRIMARY_UPLINK_ZONES = MOCK_RING_ZONES.filter(
  (zone): zone is RingZone & { uplinkDistrict: DistrictId } =>
    zone.uplinkDistrict !== null,
);
