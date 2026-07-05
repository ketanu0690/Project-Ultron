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
    const parsed: unknown = JSON.parse(raw);
    if (
      typeof parsed !== 'object' ||
      parsed === null ||
      !('event' in parsed) ||
      !('version' in parsed) ||
      !('payload' in parsed) ||
      typeof (parsed as { event: unknown }).event !== 'string' ||
      (parsed as { version: unknown }).version !== 1
    ) {
      return null;
    }
    return parsed as WsMessage;
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
