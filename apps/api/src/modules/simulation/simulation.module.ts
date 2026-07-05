import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { RealtimeModule } from '../realtime/realtime.module';
import { AgentBehaviorService } from './agent-behavior.service';
import { EventGeneratorService } from './event-generator.service';
import { GovernanceController } from './governance.controller';
import { GovernanceService } from './governance.service';
import { PolicyEvaluatorService } from './policy-evaluator.service';
import { SimulationService } from './simulation.service';
import { WorldBroadcastService } from './world-broadcast.service';
import { WorldStateService } from './world-state.service';

@Module({
  imports: [ScheduleModule.forRoot(), RealtimeModule],
  controllers: [GovernanceController],
  providers: [
    WorldStateService,
    GovernanceService,
    PolicyEvaluatorService,
    EventGeneratorService,
    WorldBroadcastService,
    AgentBehaviorService,
    SimulationService,
  ],
  exports: [
    WorldStateService,
    GovernanceService,
    WorldBroadcastService,
    SimulationService,
  ],
})
export class SimulationModule {}
