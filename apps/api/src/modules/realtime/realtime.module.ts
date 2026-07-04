import { Module } from '@nestjs/common';

import { AiModule } from '../ai/ai.module';
import { AgentsDialogueController } from './agents-dialogue.controller';
import { DialogueService } from './dialogue.service';
import { WorldGateway } from './world.gateway';

@Module({
  imports: [AiModule],
  controllers: [AgentsDialogueController],
  providers: [DialogueService, WorldGateway],
  exports: [DialogueService, WorldGateway],
})
export class RealtimeModule {}
