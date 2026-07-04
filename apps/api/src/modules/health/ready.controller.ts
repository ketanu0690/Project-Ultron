import { Controller, Get, ServiceUnavailableException } from '@nestjs/common';
import type { ApiResponse } from '@ultron/shared';

import { HealthService, type ReadyResponse } from './health.service';

@Controller('ready')
export class ReadyController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  async getReady(): Promise<ApiResponse<ReadyResponse>> {
    const result = await this.healthService.getReady();

    if (result.data.status !== 'ready') {
      throw new ServiceUnavailableException(result.data);
    }

    return result;
  }
}
