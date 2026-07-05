import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import type { AgentDialogueServerPayload } from '@ultron/shared';
import { randomUUID } from 'node:crypto';
import type { Response } from 'express';

import { PrismaService } from '../../common/prisma/prisma.service';
import { slugOrUuidWhere } from '../../common/utils/entity-ref.util';
import { AgentOrchestratorService } from '../ai/agent-orchestrator.service';
import {
  DIALOGUE_MESSAGE_MAX_LENGTH,
  DIALOGUE_WS_RATE_LIMIT_PER_MIN,
} from './dto/dialogue.dto';

export interface DialogueRequest {
  agentId: string;
  message: string;
  sessionId?: string;
}

export interface DialogueSessionResult {
  sessionId: string;
  agentId: string;
}

interface AgentRecord {
  id: string;
  name: string;
  role: string;
}

type StreamObserver = (payload: AgentDialogueServerPayload) => void;

@Injectable()
export class DialogueService {
  private readonly logger = new Logger(DialogueService.name);
  private readonly wsRateBuckets = new Map<string, number[]>();

  constructor(
    private readonly prisma: PrismaService,
    private readonly orchestrator: AgentOrchestratorService,
  ) {}

  async assertAgentExists(agentIdOrSlug: string): Promise<AgentRecord> {
    const record = await this.prisma.agent.findFirst({
      where: {
        deletedAt: null,
        ...slugOrUuidWhere(agentIdOrSlug),
      },
      select: { id: true, name: true, role: true },
    });

    if (!record) {
      throw new NotFoundException(`Agent '${agentIdOrSlug}' not found`);
    }

    return record;
  }

  validateMessage(message: string): void {
    const trimmed = message.trim();
    if (trimmed.length === 0) {
      throw new BadRequestException('Message must not be empty');
    }
    if (trimmed.length > DIALOGUE_MESSAGE_MAX_LENGTH) {
      throw new BadRequestException(
        `Message exceeds ${String(DIALOGUE_MESSAGE_MAX_LENGTH)} characters`,
      );
    }
  }

  checkWsRateLimit(clientKey: string): void {
    const now = Date.now();
    const windowStart = now - 60_000;
    const timestamps = (this.wsRateBuckets.get(clientKey) ?? []).filter(
      (ts) => ts > windowStart,
    );

    if (timestamps.length >= DIALOGUE_WS_RATE_LIMIT_PER_MIN) {
      throw new HttpException(
        'Dialogue rate limit exceeded',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    timestamps.push(now);
    this.wsRateBuckets.set(clientKey, timestamps);
  }

  createSession(agentId: string, sessionId?: string): DialogueSessionResult {
    return {
      sessionId: sessionId ?? randomUUID(),
      agentId,
    };
  }

  async streamDialogue(
    request: DialogueRequest,
    onChunk: StreamObserver,
  ): Promise<DialogueSessionResult> {
    this.validateMessage(request.message);
    const agent = await this.assertAgentExists(request.agentId);
    const session = this.createSession(agent.id, request.sessionId);

    for await (const chunk of this.orchestrator.runDialogueTurn({
      agentId: agent.id,
      agentName: agent.name,
      agentRole: agent.role,
      message: request.message.trim(),
      sessionId: session.sessionId,
    })) {
      onChunk({
        sessionId: chunk.sessionId,
        agentId: chunk.agentId,
        token: chunk.token,
        done: chunk.done,
        error: chunk.error,
      });

      if (chunk.done || chunk.error) {
        break;
      }
    }

    return session;
  }

  async streamDialogueSse(
    request: DialogueRequest,
    response: Response,
  ): Promise<void> {
    response.setHeader('Content-Type', 'text/event-stream');
    response.setHeader('Cache-Control', 'no-cache');
    response.setHeader('Connection', 'keep-alive');

    const writeEvent = (event: string, data: unknown): void => {
      response.write(`event: ${event}\n`);
      response.write(`data: ${JSON.stringify(data)}\n\n`);
    };

    try {
      await this.streamDialogue(request, (payload) => {
        if (payload.error) {
          writeEvent('error', {
            error: payload.error,
            sessionId: payload.sessionId,
          });
          return;
        }
        if (payload.token) {
          writeEvent('token', { token: payload.token });
        }
        if (payload.done) {
          writeEvent('done', {
            sessionId: payload.sessionId,
            agentId: payload.agentId,
          });
        }
      });
    } catch (error) {
      this.logger.error(
        `SSE dialogue error: ${error instanceof Error ? error.message : 'unknown'}`,
      );
      writeEvent('error', {
        error: error instanceof Error ? error.message : 'Dialogue failed',
      });
    } finally {
      response.end();
    }
  }
}
