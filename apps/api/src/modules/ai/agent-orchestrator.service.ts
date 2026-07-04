import { Injectable } from '@nestjs/common';

import {
  ModelRouterService,
  type StreamCompletionInput,
} from './model-router.service';

export interface DialogueTurnInput {
  agentId: string;
  agentName: string;
  agentRole: string;
  message: string;
  sessionId: string;
}

export interface DialogueStreamChunk {
  sessionId: string;
  agentId: string;
  token?: string;
  done?: boolean;
  error?: string;
}

/**
 * LangGraph orchestrator stub — single-node graph (Receive → Respond).
 * Replace with real LangGraph checkpoint flow in v1.
 */
@Injectable()
export class AgentOrchestratorService {
  constructor(private readonly modelRouter: ModelRouterService) {}

  async *runDialogueTurn(
    input: DialogueTurnInput,
  ): AsyncGenerator<DialogueStreamChunk> {
    const completionInput: StreamCompletionInput = {
      agentId: input.agentId,
      agentName: input.agentName,
      agentRole: input.agentRole,
      message: input.message,
    };

    try {
      for await (const chunk of this.modelRouter.streamCompletion(
        completionInput,
      )) {
        yield {
          sessionId: input.sessionId,
          agentId: input.agentId,
          token: chunk.token,
          done: chunk.done,
        };

        if (chunk.done) {
          return;
        }
      }

      yield {
        sessionId: input.sessionId,
        agentId: input.agentId,
        done: true,
      };
    } catch (error) {
      yield {
        sessionId: input.sessionId,
        agentId: input.agentId,
        error: error instanceof Error ? error.message : 'Dialogue failed',
        done: true,
      };
    }
  }
}
