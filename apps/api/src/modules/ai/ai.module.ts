import { Module, forwardRef } from '@nestjs/common';

import { MemoryModule } from '../memory/memory.module';
import { AgentOrchestratorService } from './agent-orchestrator.service';
import { EmbeddingService } from './embedding.service';
import { GraphCheckpointerService } from './graph-checkpointer.service';
import { MemoryRetrieverService } from './memory-retriever.service';
import { ModelRouterService } from './model-router.service';

@Module({
  imports: [forwardRef(() => MemoryModule)],
  providers: [
    ModelRouterService,
    EmbeddingService,
    MemoryRetrieverService,
    GraphCheckpointerService,
    AgentOrchestratorService,
  ],
  exports: [
    AgentOrchestratorService,
    ModelRouterService,
    EmbeddingService,
    MemoryRetrieverService,
  ],
})
export class AiModule {}
