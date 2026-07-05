import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
} from '@nestjs/common';
import type { ApiResponse, GovernancePolicy } from '@ultron/shared';

import { createApiResponse } from '../../common/utils/api-response.util';
import { EventGeneratorService } from './event-generator.service';
import { GovernanceService } from './governance.service';
import { WorldBroadcastService } from './world-broadcast.service';
import { WorldStateService } from './world-state.service';

@Controller('governance')
export class GovernanceController {
  constructor(
    private readonly governance: GovernanceService,
    private readonly events: EventGeneratorService,
    private readonly worldState: WorldStateService,
    private readonly broadcast: WorldBroadcastService,
  ) {}

  @Get('policies')
  async listPolicies(): Promise<ApiResponse<GovernancePolicy[]>> {
    return createApiResponse(await this.governance.findAll());
  }

  @Patch('policies/:id')
  async updatePolicy(
    @Param('id') id: string,
    @Body() body: { rules?: Record<string, unknown>; active?: boolean },
  ): Promise<ApiResponse<GovernancePolicy>> {
    const updated = await this.governance.updatePolicy(id, {
      rules: body.rules,
      active: body.active,
    });
    if (!updated) {
      throw new NotFoundException(`Policy '${id}' not found`);
    }

    this.broadcast.broadcast('governance:policy', {
      policyId: updated.id,
      slug: updated.slug,
      domain: updated.domain,
      change: 'updated',
      policy: {
        name: updated.name,
        rules: updated.rules,
        version: updated.version,
        active: updated.active,
      },
    });

    return createApiResponse(updated);
  }

  @Get('simulation/state')
  async simulationState(): Promise<
    ApiResponse<{
      tickCount: number;
      variables: Awaited<ReturnType<WorldStateService['getVariables']>>;
    }>
  > {
    const [tickCount, variables] = await Promise.all([
      this.worldState.getTickCount(),
      this.worldState.getVariables(),
    ]);
    return createApiResponse({ tickCount, variables });
  }

  @Get('simulation/events')
  async simulationEvents(): Promise<
    ApiResponse<Awaited<ReturnType<EventGeneratorService['recent']>>>
  > {
    return createApiResponse(await this.events.recent(50));
  }
}
