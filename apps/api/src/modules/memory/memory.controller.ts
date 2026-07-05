import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import type {
  AgentMemory,
  ApiResponse,
  MemorySearchResult,
} from '@ultron/shared';

import { AgentIdParamDto } from '../../common/dto/params.dto';
import { MemorySearchBodyDto } from './dto/memory-search.dto';
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

  @Post('search')
  search(
    @Param() params: AgentIdParamDto,
    @Body() body: MemorySearchBodyDto,
  ): Promise<ApiResponse<MemorySearchResult[]>> {
    return this.memoryService.search(params.agentId, body);
  }
}
