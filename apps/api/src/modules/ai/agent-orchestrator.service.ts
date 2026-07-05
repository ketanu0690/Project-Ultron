import { Injectable, Inject, forwardRef } from '@nestjs/common';

import {
  ModelRouterService,
  type StreamCompletionInput,
} from './model-router.service';
import {
  MemoryRetrieverService,
  type RetrievedMemory,
} from './memory-retriever.service';
import { GraphCheckpointerService } from './graph-checkpointer.service';
import {
  createDialogueGraph,
  toGraphInput,
  type DialogueGraphInput,
} from './graphs/dialogue.graph';
import { MemoryService } from '../memory/memory.service';

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
 * LangGraph dialogue orchestrator — RetrieveMemory → Respond (streamed) → StoreMemory.
 * Respond streams outside the graph; retrieve + store run through LangGraph with checkpoints.
 */
@Injectable()
export class AgentOrchestratorService {
  constructor(
    private readonly modelRouter: ModelRouterService,
    private readonly memoryRetriever: MemoryRetrieverService,
    private readonly graphCheckpointer: GraphCheckpointerService,
    @Inject(forwardRef(() => MemoryService))
    private readonly memoryService: MemoryService,
  ) {}

  async *runDialogueTurn(
    input: DialogueTurnInput,
  ): AsyncGenerator<DialogueStreamChunk> {
    const graphInput: DialogueGraphInput = {
      agentId: input.agentId,
      agentName: input.agentName,
      agentRole: input.agentRole,
      sessionId: input.sessionId,
      message: input.message.trim(),
    };

    let retrievedMemories: RetrievedMemory[] = [];
    try {
      retrievedMemories = await this.memoryRetriever.retrieve(
        input.agentId,
        graphInput.message,
      );
    } catch (error) {
      yield {
        sessionId: input.sessionId,
        agentId: input.agentId,
        error:
          error instanceof Error ? error.message : 'Memory retrieval failed',
        done: true,
      };
      return;
    }

    const completionInput: StreamCompletionInput = {
      agentId: input.agentId,
      agentName: input.agentName,
      agentRole: input.agentRole,
      message: graphInput.message,
      memories: retrievedMemories,
    };

    let fullResponse = '';

    try {
      for await (const chunk of this.modelRouter.streamCompletion(
        completionInput,
      )) {
        if (chunk.token) {
          fullResponse += chunk.token;
        }

        yield {
          sessionId: input.sessionId,
          agentId: input.agentId,
          token: chunk.token,
          done: chunk.done,
        };

        if (chunk.done) {
          break;
        }
      }

      if (!fullResponse.trim()) {
        yield {
          sessionId: input.sessionId,
          agentId: input.agentId,
          done: true,
        };
        return;
      }

      const checkpointer = await this.graphCheckpointer.getSaver();
      const graph = createDialogueGraph(
        {
          memoryRetriever: this.memoryRetriever,
          storeDialogueTurn: (storeInput) =>
            this.memoryService.storeDialogueTurn(storeInput),
        },
        checkpointer,
      );

      await graph.invoke(
        toGraphInput({
          ...graphInput,
          response: fullResponse,
          retrievedMemories,
        }),
        {
          configurable: { thread_id: input.sessionId },
        },
      );
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
