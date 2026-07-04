import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotImplementedException,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import type { Agent, AgentStatus, ApiResponse } from '@ultron/shared';

import { UuidParamDto } from '../../common/dto/params.dto';
import { AgentsQueryDto } from './dto/agents-query.dto';
import { AgentsService } from './agents.service';

@Controller('agents')
export class AgentsController {
  constructor(private readonly agentsService: AgentsService) {}

  @Get()
  findAll(@Query() query: AgentsQueryDto): Promise<ApiResponse<Agent[]>> {
    return this.agentsService.findAll(query);
  }

  @Get(':id')
  findById(@Param() params: UuidParamDto): Promise<ApiResponse<Agent>> {
    return this.agentsService.findById(params.id);
  }

  @Get(':id/status')
  getStatus(
    @Param() params: UuidParamDto,
  ): Promise<ApiResponse<{ agentId: string; status: AgentStatus }>> {
    return this.agentsService.getStatus(params.id);
  }

  @Post(':id/delegate')
  @HttpCode(HttpStatus.NOT_IMPLEMENTED)
  delegate(@Param() params: UuidParamDto, @Body() _body: unknown): never {
    void params;
    throw new NotImplementedException('Agent delegation not yet implemented');
  }
}
