import { Controller, Get, Param } from '@nestjs/common';
import type { AgentMemory, ApiResponse } from '@ultron/shared';

import { AgentIdParamDto } from '../../common/dto/params.dto';
import { MemoryService } from './memory.service';

@Controller('agents/:agentId/memory')
export class MemoryController {
  constructor(private readonly memoryService: MemoryService) {}

  @Get()
  findByAgent(
    @Param() params: AgentIdParamDto,
  ): Promise<ApiResponse<AgentMemory[]>> {
    return this.memoryService.findByAgent(params.agentId);
  }
}
