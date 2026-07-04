import { Injectable } from '@nestjs/common';
import type { ApiResponse, HealthResponse } from '@ultron/shared';

import { createApiResponse } from '../../common/utils/api-response.util';
import { PrismaService } from '../../common/prisma/prisma.service';

export interface ReadyResponse {
  status: 'ready' | 'not_ready';
  checks: {
    database: 'ok' | 'error';
  };
  timestamp: string;
}

@Injectable()
export class HealthService {
  constructor(private readonly prisma: PrismaService) {}

  getHealth(): ApiResponse<HealthResponse> {
    return createApiResponse({
      status: 'ok',
      timestamp: new Date().toISOString(),
    });
  }

  async getReady(): Promise<ApiResponse<ReadyResponse>> {
    let database: 'ok' | 'error' = 'error';

    try {
      await this.prisma.$queryRaw`SELECT 1`;
      database = 'ok';
    } catch {
      database = 'error';
    }

    const status = database === 'ok' ? 'ready' : 'not_ready';

    return createApiResponse({
      status,
      checks: { database },
      timestamp: new Date().toISOString(),
    });
  }
}
