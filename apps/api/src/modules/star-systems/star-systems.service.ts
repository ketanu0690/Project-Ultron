import { Injectable, NotFoundException } from '@nestjs/common';
import type {
  ApiResponse,
  StarSystem,
  StarSystemsBundle,
} from '@ultron/shared';
import { buildStarSystemsBundle } from '@ultron/shared';

import { createApiResponse } from '../../common/utils/api-response.util';

@Injectable()
export class StarSystemsService {
  private readonly bundle: StarSystemsBundle = buildStarSystemsBundle();

  getStarSystems(): ApiResponse<StarSystemsBundle> {
    return createApiResponse(this.bundle, {
      total: this.bundle.systems.length,
    });
  }

  getStarSystemById(id: string): ApiResponse<StarSystem> {
    const system = this.bundle.systems.find((entry) => entry.id === id);
    if (!system) {
      throw new NotFoundException(`Star system '${id}' not found`);
    }
    return createApiResponse(system);
  }
}
