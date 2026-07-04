import type {
  AgentDialogueClientPayload,
  AgentDialogueServerPayload,
  AgentStatusPayload,
  PongPayload,
  WsMessage,
} from '@ultron/shared';

export function createWsMessage<T>(
  event: string,
  payload: T,
  requestId?: string,
): WsMessage<T> {
  return {
    event,
    version: 1,
    payload,
    timestamp: new Date().toISOString(),
    requestId,
  };
}

export function parseWsMessage(raw: string): WsMessage | null {
  try {
    const parsed = JSON.parse(raw) as WsMessage;
    if (
      typeof parsed.event !== 'string' ||
      parsed.version !== 1 ||
      parsed.payload === undefined
    ) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function serializeWsMessage(message: WsMessage): string {
  return JSON.stringify(message);
}

export type DialogueOutboundPayload = AgentDialogueServerPayload;
export type StatusOutboundPayload = AgentStatusPayload;
export type PongOutboundPayload = PongPayload;
export type DialogueInboundPayload = AgentDialogueClientPayload;
