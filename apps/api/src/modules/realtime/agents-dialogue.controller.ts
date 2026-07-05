import {
  Body,
  Controller,
  Headers,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import type { ApiResponse } from '@ultron/shared';
import type { Response } from 'express';

import { AgentRefParamDto } from '../../common/dto/agent-ref.dto';
import { createApiResponse } from '../../common/utils/api-response.util';
import { AgentDialogueBodyDto } from './dto/dialogue.dto';
import { DialogueService } from './dialogue.service';

@Controller('agents')
export class AgentsDialogueController {
  constructor(private readonly dialogueService: DialogueService) {}

  @Post(':id/dialogue')
  @HttpCode(HttpStatus.OK)
  async dialogue(
    @Param() params: AgentRefParamDto,
    @Body() body: AgentDialogueBodyDto,
    @Headers('accept') accept: string | undefined,
    @Res({ passthrough: true }) response: Response,
  ): Promise<ApiResponse<{ sessionId: string; agentId: string }> | undefined> {
    const request = {
      agentId: params.id,
      message: body.message,
      sessionId: body.sessionId,
    };

    if (accept?.includes('text/event-stream')) {
      await this.dialogueService.streamDialogueSse(request, response);
      return;
    }

    const agent = await this.dialogueService.assertAgentExists(params.id);
    this.dialogueService.validateMessage(body.message);
    const session = this.dialogueService.createSession(
      agent.id,
      body.sessionId,
    );

    return createApiResponse({
      sessionId: session.sessionId,
      agentId: session.agentId,
    });
  }
}
