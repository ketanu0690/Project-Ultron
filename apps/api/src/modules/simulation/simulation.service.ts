import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import type {
  SimulationEventPayload,
  SimulationTickPayload,
} from '@ultron/shared';

import { EventGeneratorService } from './event-generator.service';
import { GovernanceService } from './governance.service';
import { PolicyEvaluatorService } from './policy-evaluator.service';
import { WorldBroadcastService } from './world-broadcast.service';
import { WorldStateService } from './world-state.service';

@Injectable()
export class SimulationService implements OnModuleInit {
  private readonly logger = new Logger(SimulationService.name);

  constructor(
    private readonly worldState: WorldStateService,
    private readonly governance: GovernanceService,
    private readonly policyEvaluator: PolicyEvaluatorService,
    private readonly events: EventGeneratorService,
    private readonly broadcast: WorldBroadcastService,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.governance.ensureSeeded();
    await this.worldState.getVariables();
  }

  @Cron('*/60 * * * * *')
  async runMacroTick(): Promise<void> {
    const started = Date.now();
    const tickId = await this.worldState.incrementTick();
    const current = await this.worldState.getVariables();
    const evaluation = await this.policyEvaluator.evaluate();
    const patch = this.policyEvaluator.applyToWorldMetrics(current, evaluation);
    const next = await this.worldState.updateVariables(patch);

    const generated = this.events.maybeGenerate(tickId);
    if (generated) {
      await this.events.persist(generated, tickId);
      const eventPayload: SimulationEventPayload = {
        eventId: generated.id,
        type: generated.type,
        severity: generated.severity,
        data: generated.data,
        tickId,
      };
      this.broadcast.broadcast('simulation:event', eventPayload);

      if (generated.type === 'threat_detected') {
        const defensePolicy = (await this.governance.findAll()).find(
          (policy) => policy.slug === 'defense-posture',
        );
        if (defensePolicy) {
          await this.governance.updatePolicy(defensePolicy.id, {
            rules: {
              ...defensePolicy.rules,
              threatResponseLevel: 'auto',
              restrictCrossDistrictOnAlert: true,
              defenseLockdown: true,
            },
          });
        }
      }
    }

    const tickPayload: SimulationTickPayload = {
      tickId,
      worldState: next,
      changes: patch,
    };
    this.broadcast.broadcast('simulation:tick', tickPayload);

    this.logger.log(
      `Macro simulation tick ${tickId} completed in ${Date.now() - started}ms`,
    );
  }
}
