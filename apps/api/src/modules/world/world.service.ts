import { Injectable } from '@nestjs/common';
import type {
  ApiResponse,
  EarthState,
  WorldStateVariables,
} from '@ultron/shared';

import { createApiResponse } from '../../common/utils/api-response.util';
import { PrismaService } from '../../common/prisma/prisma.service';

const WORLD_STATE_STUB: WorldStateVariables = {
  planetaryHealth: 85,
  cityProsperity: 72,
  agentMorale: 88,
  defenseReadiness: 90,
  knowledgeIndex: 76,
  innovationRate: 64,
};

const EARTH_STATE_STUB: EarthState = {
  timestamp: '2026-06-14T12:00:00.000Z',
  rotation: 0,
  cloudCoverage: 0.42,
  megacityCoordinates: { lat: 35.6762, lng: 139.6503 },
  planetaryHealth: {
    atmosphere: { value: 85, trend: 'stable' },
    biosphere: { value: 78, trend: 'up' },
    oceanHealth: { value: 72, trend: 'stable' },
    infrastructure: { value: 88, trend: 'up' },
  },
  groundStations: [],
};

@Injectable()
export class WorldService {
  constructor(private readonly prisma: PrismaService) {}

  getWorldState(): ApiResponse<WorldStateVariables> {
    void this.prisma;
    return createApiResponse(WORLD_STATE_STUB);
  }

  getEarthState(): ApiResponse<EarthState> {
    void this.prisma;
    return createApiResponse(EARTH_STATE_STUB);
  }

  getGroundStations(): ApiResponse<EarthState['groundStations']> {
    void this.prisma;
    return createApiResponse(EARTH_STATE_STUB.groundStations);
  }

  getRingSegments(): ApiResponse<unknown[]> {
    void this.prisma;
    return createApiResponse([]);
  }

  getRingSegment(id: string): ApiResponse<unknown> {
    void this.prisma;
    void id;
    return createApiResponse({ id, status: 'nominal' });
  }
}
