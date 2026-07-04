'use client';

import { useCallback, useEffect, useRef } from 'react';

import { AgentDialogueSocket } from '@/lib/agent-dialogue-socket';
import { getApiBaseUrl } from '@/lib/api-client';
import { useAgentStore } from '@/stores/agentStore';
import { useUiStore } from '@/stores/uiStore';

const DIALOGUE_MESSAGE_MAX_LENGTH = 10_000;

interface UseAgentDialogueResult {
  sendMessage: (message: string) => Promise<void>;
  isStreaming: boolean;
  connectionStatus: ReturnType<
    typeof useAgentStore.getState
  >['connectionStatus'];
  error: string | null;
}

async function streamViaSse(
  agentId: string,
  message: string,
  sessionId: string | null,
  onToken: (token: string) => void,
): Promise<string> {
  const response = await fetch(
    `${getApiBaseUrl()}/api/v1/agents/${agentId}/dialogue`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'text/event-stream',
      },
      body: JSON.stringify({ message, sessionId: sessionId ?? undefined }),
    },
  );

  if (!response.ok || !response.body) {
    throw new Error(`Dialogue request failed (${response.status})`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let resolvedSessionId = sessionId ?? '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }

    buffer += decoder.decode(value, { stream: true });
    const blocks = buffer.split('\n\n');
    buffer = blocks.pop() ?? '';

    for (const block of blocks) {
      const lines = block.split('\n');
      let eventName = 'message';
      let dataLine = '';

      for (const line of lines) {
        if (line.startsWith('event:')) {
          eventName = line.slice(6).trim();
        } else if (line.startsWith('data:')) {
          dataLine = line.slice(5).trim();
        }
      }

      if (!dataLine) {
        continue;
      }

      const data = JSON.parse(dataLine) as Record<string, unknown>;
      if (eventName === 'token' && typeof data.token === 'string') {
        onToken(data.token);
      }
      if (eventName === 'done' && typeof data.sessionId === 'string') {
        resolvedSessionId = data.sessionId;
      }
      if (eventName === 'error' && typeof data.error === 'string') {
        throw new Error(data.error);
      }
    }
  }

  return resolvedSessionId;
}

export function useAgentDialogue(): UseAgentDialogueResult {
  const dialogueAgentId = useUiStore((state) => state.dialogueAgentId);
  const isOpen = useUiStore((state) => state.isPanelOpen('dialogue'));
  const sessionId = useAgentStore((state) => state.sessionId);
  const isStreaming = useAgentStore((state) => state.isStreaming);
  const connectionStatus = useAgentStore((state) => state.connectionStatus);
  const error = useAgentStore((state) => state.error);

  const socketRef = useRef<AgentDialogueSocket | null>(null);
  const activeAgentMessageRef = useRef<string | null>(null);

  useEffect(() => {
    if (!isOpen || !dialogueAgentId) {
      socketRef.current?.disconnect();
      socketRef.current = null;
      useAgentStore.getState().setConnectionStatus('idle');
      if (!isOpen) {
        useAgentStore.getState().clearDialogue();
      }
      return;
    }

    useAgentStore.getState().setActiveDialogueId(dialogueAgentId);

    const socket = new AgentDialogueSocket({
      onConnectionChange: (state) => {
        useAgentStore.getState().setConnectionStatus(state);
      },
      onDialogueChunk: (payload) => {
        if (payload.sessionId) {
          useAgentStore.getState().setSessionId(payload.sessionId);
        }

        if (payload.error) {
          useAgentStore.getState().setError(payload.error);
          if (activeAgentMessageRef.current) {
            useAgentStore
              .getState()
              .finalizeAgentMessage(activeAgentMessageRef.current);
            activeAgentMessageRef.current = null;
          }
          return;
        }

        if (!activeAgentMessageRef.current) {
          activeAgentMessageRef.current = useAgentStore
            .getState()
            .beginAgentMessage();
        }

        if (payload.token) {
          useAgentStore
            .getState()
            .appendStreamChunk(activeAgentMessageRef.current, payload.token);
        }

        if (payload.done && activeAgentMessageRef.current) {
          useAgentStore
            .getState()
            .finalizeAgentMessage(activeAgentMessageRef.current);
          activeAgentMessageRef.current = null;
        }
      },
      onError: (message) => {
        useAgentStore.getState().setError(message);
      },
    });

    socket.connect();
    socketRef.current = socket;

    return () => {
      socket.disconnect();
      socketRef.current = null;
      activeAgentMessageRef.current = null;
    };
  }, [dialogueAgentId, isOpen]);

  const sendMessage = useCallback(
    async (message: string): Promise<void> => {
      const agentId = dialogueAgentId;
      if (!agentId) {
        return;
      }

      const trimmed = message.trim();
      if (
        trimmed.length === 0 ||
        trimmed.length > DIALOGUE_MESSAGE_MAX_LENGTH
      ) {
        useAgentStore.getState().setError('Message is empty or too long');
        return;
      }

      useAgentStore.getState().addUserMessage(trimmed);
      useAgentStore.getState().setError(null);
      activeAgentMessageRef.current = null;

      const socket = socketRef.current;
      if (socket && connectionStatus === 'connected') {
        socket.sendDialogue({
          agentId,
          message: trimmed,
          sessionId: sessionId ?? undefined,
        });
        return;
      }

      try {
        useAgentStore.getState().setStreaming(true);
        const agentMessageId = useAgentStore.getState().beginAgentMessage();
        activeAgentMessageRef.current = agentMessageId;

        const nextSessionId = await streamViaSse(
          agentId,
          trimmed,
          sessionId,
          (token) => {
            useAgentStore.getState().appendStreamChunk(agentMessageId, token);
          },
        );

        useAgentStore.getState().setSessionId(nextSessionId);
        useAgentStore.getState().finalizeAgentMessage(agentMessageId);
        activeAgentMessageRef.current = null;
      } catch (streamError) {
        useAgentStore
          .getState()
          .setError(
            streamError instanceof Error
              ? streamError.message
              : 'Dialogue failed',
          );
        if (activeAgentMessageRef.current) {
          useAgentStore
            .getState()
            .finalizeAgentMessage(activeAgentMessageRef.current);
          activeAgentMessageRef.current = null;
        }
      }
    },
    [connectionStatus, dialogueAgentId, sessionId],
  );

  return {
    sendMessage,
    isStreaming,
    connectionStatus,
    error,
  };
}
