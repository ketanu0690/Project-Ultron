import { Annotation, END, START, StateGraph } from '@langchain/langgraph';
import type { BaseCheckpointSaver } from '@langchain/langgraph';

import type {
  MemoryRetrieverService,
  RetrievedMemory,
} from '../memory-retriever.service';

export interface DialogueGraphInput {
  agentId: string;
  agentName: string;
  agentRole: string;
  sessionId: string;
  message: string;
  response?: string;
  retrievedMemories?: RetrievedMemory[];
}

export interface DialogueGraphDeps {
  memoryRetriever: MemoryRetrieverService;
  storeDialogueTurn: (input: {
    agentId: string;
    sessionId: string;
    userMessage: string;
    agentResponse: string;
  }) => Promise<void>;
}

const DialogueState = Annotation.Root({
  agentId: Annotation<string>,
  agentName: Annotation<string>,
  agentRole: Annotation<string>,
  sessionId: Annotation<string>,
  message: Annotation<string>,
  response: Annotation<string>,
  retrievedMemories: Annotation<RetrievedMemory[]>,
});

export type DialogueGraphState = typeof DialogueState.State;

export function createDialogueGraph(
  deps: DialogueGraphDeps,
  checkpointer?: BaseCheckpointSaver,
) {
  const graph = new StateGraph(DialogueState)
    .addNode('retrieveMemory', async (state) => {
      if (state.retrievedMemories.length > 0) {
        return {};
      }

      const retrievedMemories = await deps.memoryRetriever.retrieve(
        state.agentId,
        state.message,
      );

      return { retrievedMemories };
    })
    .addNode('storeMemory', async (state) => {
      if (!state.response.trim()) {
        return {};
      }

      await deps.storeDialogueTurn({
        agentId: state.agentId,
        sessionId: state.sessionId,
        userMessage: state.message,
        agentResponse: state.response,
      });

      return {};
    })
    .addEdge(START, 'retrieveMemory')
    .addEdge('retrieveMemory', 'storeMemory')
    .addEdge('storeMemory', END);

  return graph.compile({ checkpointer });
}

export function toGraphInput(input: DialogueGraphInput): DialogueGraphState {
  return {
    agentId: input.agentId,
    agentName: input.agentName,
    agentRole: input.agentRole,
    sessionId: input.sessionId,
    message: input.message,
    response: input.response ?? '',
    retrievedMemories: input.retrievedMemories ?? [],
  };
}
