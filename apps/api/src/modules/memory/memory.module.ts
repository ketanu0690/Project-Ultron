import { Module, forwardRef } from '@nestjs/common';

import { AiModule } from '../ai/ai.module';
import { MemoryController } from './memory.controller';
import { MemoryService } from './memory.service';

@Module({
  imports: [forwardRef(() => AiModule)],
  controllers: [MemoryController],
  providers: [MemoryService],
  exports: [MemoryService],
})
export class MemoryModule {}
