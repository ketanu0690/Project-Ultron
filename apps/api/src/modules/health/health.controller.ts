import { Controller, Get } from '@nestjs/common';
import type { ApiResponse, HealthResponse } from '@ultron/shared';

import { HealthService } from './health.service';

@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  getHealth(): ApiResponse<HealthResponse> {
    return this.healthService.getHealth();
  }
}
