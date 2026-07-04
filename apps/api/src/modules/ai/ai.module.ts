import { Module } from '@nestjs/common';

import { AgentOrchestratorService } from './agent-orchestrator.service';
import { ModelRouterService } from './model-router.service';

@Module({
  providers: [ModelRouterService, AgentOrchestratorService],
  exports: [AgentOrchestratorService, ModelRouterService],
})
export class AiModule {}
