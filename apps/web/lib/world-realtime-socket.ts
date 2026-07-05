import type { ServerWsEvent, WsMessage } from '@ultron/shared';

import { getWsBaseUrl } from '@/lib/open-dialogue';

export type WorldRealtimeHandlers = {
  onEvent?: (event: ServerWsEvent) => void;
  onConnectionChange?: (connected: boolean) => void;
  onError?: (message: string) => void;
};

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

function createEnvelope(event: string, payload: unknown): string {
  const message: WsMessage = {
    event,
    version: 1,
    payload,
    timestamp: new Date().toISOString(),
  };
  return JSON.stringify(message);
}

export class WorldRealtimeSocket {
  private socket: WebSocket | null = null;
  private reconnectAttempt = 0;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private intentionalClose = false;

  constructor(private readonly handlers: WorldRealtimeHandlers) {}

  connect(): void {
    if (this.socket?.readyState === WebSocket.OPEN) {
      return;
    }

    this.intentionalClose = false;
    const socket = new WebSocket(getWsBaseUrl());
    this.socket = socket;

    socket.addEventListener('open', () => {
      this.reconnectAttempt = 0;
      this.handlers.onConnectionChange?.(true);
      socket.send(createEnvelope('nav:subscribe', { scale: 'agent' }));
    });

    socket.addEventListener('message', (event) => {
      const parsed = parseServerEvent(String(event.data));
      if (parsed) {
        this.handlers.onEvent?.(parsed);
      }
    });

    socket.addEventListener('close', () => {
      this.handlers.onConnectionChange?.(false);
      if (!this.intentionalClose) {
        this.scheduleReconnect();
      }
    });

    socket.addEventListener('error', () => {
      this.handlers.onError?.('World realtime connection failed');
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
    this.handlers.onConnectionChange?.(false);
  }

  private scheduleReconnect(): void {
    const delay = Math.min(1000 * 2 ** this.reconnectAttempt, 30_000);
    this.reconnectAttempt += 1;
    this.reconnectTimer = setTimeout(() => {
      this.connect();
    }, delay);
  }
}
