import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import type {
  AgentDialogueClientPayload,
  NavSubscribePayload,
  ScaleLevel,
} from '@ultron/shared';
import type { Server, WebSocket } from 'ws';

import { DialogueService } from './dialogue.service';
import {
  createWsMessage,
  parseWsMessage,
  serializeWsMessage,
} from './ws-message.util';

interface ClientMeta {
  id: string;
  subscribedScale?: ScaleLevel;
}

@WebSocketGateway({ path: '/ws' })
export class WorldGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(WorldGateway.name);
  private readonly clientMeta = new WeakMap<WebSocket, ClientMeta>();
  private clientCounter = 0;

  @WebSocketServer()
  server!: Server;

  constructor(private readonly dialogueService: DialogueService) {}

  afterInit(server: Server): void {
    server.on('connection', (client: WebSocket) => {
      client.on('message', (data: Buffer | ArrayBuffer | Buffer[]) => {
        this.handleRawMessage(client, this.decodeWsMessage(data));
      });
    });
  }

  handleConnection(client: WebSocket): void {
    this.clientCounter += 1;
    this.clientMeta.set(client, { id: `client-${String(this.clientCounter)}` });
    this.logger.debug(`WS client connected (${String(this.clientCounter)})`);
  }

  handleDisconnect(client: WebSocket): void {
    this.clientMeta.delete(client);
    this.logger.debug('WS client disconnected');
  }

  broadcast(event: string, payload: unknown): void {
    if (!this.server) {
      return;
    }
    const message = serializeWsMessage(createWsMessage(event, payload));
    for (const client of this.server.clients) {
      if (client.readyState === client.OPEN) {
        client.send(message);
      }
    }
  }

  private handleRawMessage(client: WebSocket, raw: string): void {
    const message = parseWsMessage(raw);
    if (!message) {
      return;
    }

    switch (message.event) {
      case 'ping':
        this.send(client, 'pong', { serverTime: new Date().toISOString() });
        break;
      case 'nav:subscribe':
        if (this.isNavSubscribePayload(message.payload)) {
          const meta = this.clientMeta.get(client);
          if (meta) {
            meta.subscribedScale = message.payload.scale;
          }
          this.send(client, 'nav:ack', { tick: 0 });
        }
        break;
      case 'agent:dialogue':
        if (this.isDialoguePayload(message.payload)) {
          void this.handleAgentDialogue(client, message.payload);
        }
        break;
      default:
        break;
    }
  }

  private async handleAgentDialogue(
    client: WebSocket,
    payload: AgentDialogueClientPayload,
  ): Promise<void> {
    const meta = this.clientMeta.get(client);
    const clientKey = meta?.id ?? 'anonymous';

    try {
      this.dialogueService.checkWsRateLimit(clientKey);

      this.broadcast('agent:status', {
        agentId: payload.agentId,
        status: 'thinking',
      });

      await this.dialogueService.streamDialogue(
        {
          agentId: payload.agentId,
          message: payload.message,
          sessionId: payload.sessionId,
        },
        (chunk) => {
          this.send(client, 'agent:dialogue', chunk);
        },
      );

      this.broadcast('agent:status', {
        agentId: payload.agentId,
        status: 'idle',
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Dialogue failed';
      this.send(client, 'agent:dialogue', {
        sessionId: payload.sessionId ?? '',
        agentId: payload.agentId,
        error: message,
        done: true,
      });
      this.broadcast('agent:status', {
        agentId: payload.agentId,
        status: 'idle',
      });
    }
  }

  private decodeWsMessage(data: Buffer | ArrayBuffer | Buffer[]): string {
    if (Buffer.isBuffer(data)) {
      return data.toString('utf8');
    }
    if (Array.isArray(data)) {
      return Buffer.concat(data).toString('utf8');
    }
    return Buffer.from(data).toString('utf8');
  }

  private isDialoguePayload(
    payload: unknown,
  ): payload is AgentDialogueClientPayload {
    if (typeof payload !== 'object' || payload === null) {
      return false;
    }
    const candidate = payload as AgentDialogueClientPayload;
    return (
      typeof candidate.agentId === 'string' &&
      typeof candidate.message === 'string'
    );
  }

  private isNavSubscribePayload(
    payload: unknown,
  ): payload is NavSubscribePayload {
    if (typeof payload !== 'object' || payload === null) {
      return false;
    }
    const candidate = payload as NavSubscribePayload;
    return typeof candidate.scale === 'string';
  }

  private send(
    client: WebSocket,
    event: string,
    payload: unknown,
    requestId?: string,
  ): void {
    if (client.readyState !== client.OPEN) {
      return;
    }
    client.send(serializeWsMessage(createWsMessage(event, payload, requestId)));
  }
}
