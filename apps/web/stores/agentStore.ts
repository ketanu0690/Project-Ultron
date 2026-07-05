/**
 * Agent dialogue state. Subscribe with narrow selectors:
 * useAgentStore(s => s.activeDialogueId)
 */
import { create } from 'zustand';

export interface DialogueMessage {
  id: string;
  role: 'user' | 'agent';
  content: string;
  streaming?: boolean;
}

interface AgentState {
  activeDialogueId: string | null;
  sessionId: string | null;
  messages: DialogueMessage[];
  isStreaming: boolean;
  connectionStatus: 'idle' | 'connecting' | 'connected' | 'error';
  thinkingAgentIds: string[];
  error: string | null;
}

interface AgentActions {
  setActiveDialogueId: (id: string | null) => void;
  setSessionId: (sessionId: string | null) => void;
  addUserMessage: (content: string) => string;
  beginAgentMessage: () => string;
  appendStreamChunk: (messageId: string, token: string) => void;
  finalizeAgentMessage: (messageId: string) => void;
  setStreaming: (isStreaming: boolean) => void;
  setConnectionStatus: (status: AgentState['connectionStatus']) => void;
  setError: (error: string | null) => void;
  setAgentThinking: (agentId: string) => void;
  clearDialogue: () => void;
}

export type AgentStore = AgentState & AgentActions;

let messageCounter = 0;

function nextMessageId(): string {
  messageCounter += 1;
  return `msg-${messageCounter}`;
}

export const useAgentStore = create<AgentStore>((set) => ({
  activeDialogueId: null,
  sessionId: null,
  messages: [],
  isStreaming: false,
  connectionStatus: 'idle',
  thinkingAgentIds: [],
  error: null,

  setActiveDialogueId: (id) => {
    set({ activeDialogueId: id });
  },

  setSessionId: (sessionId) => {
    set({ sessionId });
  },

  addUserMessage: (content) => {
    const id = nextMessageId();
    set((state) => ({
      messages: [...state.messages, { id, role: 'user', content }],
      error: null,
    }));
    return id;
  },

  beginAgentMessage: () => {
    const id = nextMessageId();
    set((state) => ({
      messages: [
        ...state.messages,
        { id, role: 'agent', content: '', streaming: true },
      ],
      isStreaming: true,
    }));
    return id;
  },

  appendStreamChunk: (messageId, token) => {
    set((state) => ({
      messages: state.messages.map((message) =>
        message.id === messageId
          ? { ...message, content: message.content + token }
          : message,
      ),
    }));
  },

  finalizeAgentMessage: (messageId) => {
    set((state) => ({
      messages: state.messages.map((message) =>
        message.id === messageId ? { ...message, streaming: false } : message,
      ),
      isStreaming: false,
    }));
  },

  setStreaming: (isStreaming) => {
    set({ isStreaming });
  },

  setConnectionStatus: (connectionStatus) => {
    set({ connectionStatus });
  },

  setError: (error) => {
    set({ error });
  },

  setAgentThinking: (agentId) => {
    set((state) => ({
      thinkingAgentIds: state.thinkingAgentIds.includes(agentId)
        ? state.thinkingAgentIds
        : [...state.thinkingAgentIds, agentId],
    }));
    setTimeout(() => {
      set((state) => ({
        thinkingAgentIds: state.thinkingAgentIds.filter((id) => id !== agentId),
      }));
    }, 4000);
  },

  clearDialogue: () => {
    set({
      sessionId: null,
      messages: [],
      isStreaming: false,
      error: null,
    });
  },
}));
