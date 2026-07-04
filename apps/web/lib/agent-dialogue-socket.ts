import type {
  AgentDialogueClientPayload,
  AgentDialogueServerPayload,
  ServerWsEvent,
  WsMessage,
} from '@ultron/shared';

import { getWsBaseUrl } from '@/lib/open-dialogue';

export type WsConnectionState = 'idle' | 'connecting' | 'connected' | 'error';

export interface AgentDialogueSocketHandlers {
  onConnectionChange?: (state: WsConnectionState) => void;
  onDialogueChunk?: (payload: AgentDialogueServerPayload) => void;
  onError?: (message: string) => void;
}

function createWsEnvelope<T>(event: string, payload: T): string {
  const message: WsMessage<T> = {
    event,
    version: 1,
    payload,
    timestamp: new Date().toISOString(),
  };
  return JSON.stringify(message);
}

function parseServerEvent(raw: string): ServerWsEvent | null {
  try {
    const message = JSON.parse(raw) as WsMessage;
    if (typeof message.event !== 'string' || message.version !== 1) {
      return null;
    }
    return { event: message.event, payload: message.payload } as ServerWsEvent;
  } catch {
    return null;
  }
}

export class AgentDialogueSocket {
  private socket: WebSocket | null = null;
  private reconnectAttempt = 0;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private intentionalClose = false;

  constructor(private readonly handlers: AgentDialogueSocketHandlers) {}

  connect(): void {
    if (this.socket?.readyState === WebSocket.OPEN) {
      return;
    }

    this.intentionalClose = false;
    this.handlers.onConnectionChange?.('connecting');

    const socket = new WebSocket(getWsBaseUrl());
    this.socket = socket;

    socket.addEventListener('open', () => {
      this.reconnectAttempt = 0;
      this.handlers.onConnectionChange?.('connected');
    });

    socket.addEventListener('message', (event) => {
      const parsed = parseServerEvent(String(event.data));
      if (!parsed) {
        return;
      }

      if (parsed.event === 'agent:dialogue') {
        this.handlers.onDialogueChunk?.(parsed.payload);
      }
    });

    socket.addEventListener('close', () => {
      this.handlers.onConnectionChange?.('idle');
      if (!this.intentionalClose) {
        this.scheduleReconnect();
      }
    });

    socket.addEventListener('error', () => {
      this.handlers.onConnectionChange?.('error');
      this.handlers.onError?.('WebSocket connection failed');
    });
  }

  disconnect(): void {
    this.intentionalClose = true;
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    this.socket?.close();
    this.socket = null;
    this.handlers.onConnectionChange?.('idle');
  }

  sendDialogue(payload: AgentDialogueClientPayload): void {
    if (this.socket?.readyState !== WebSocket.OPEN) {
      this.handlers.onError?.('Not connected to dialogue stream');
      return;
    }
    this.socket.send(createWsEnvelope('agent:dialogue', payload));
  }

  ping(): void {
    if (this.socket?.readyState !== WebSocket.OPEN) {
      return;
    }
    this.socket.send(createWsEnvelope('ping', {}));
  }

  private scheduleReconnect(): void {
    const delay = Math.min(1000 * 2 ** this.reconnectAttempt, 30_000);
    this.reconnectAttempt += 1;
    this.reconnectTimer = setTimeout(() => {
      this.connect();
    }, delay);
  }
}
