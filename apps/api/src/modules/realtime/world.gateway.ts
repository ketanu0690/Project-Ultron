import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import type { AgentDialogueClientPayload, AgentStatus } from '@ultron/shared';
import type { Server, WebSocket } from 'ws';

import { DialogueService } from './dialogue.service';
import {
  createWsMessage,
  parseWsMessage,
  serializeWsMessage,
} from './ws-message.util';

interface ClientMeta {
  id: string;
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
        const raw = Buffer.isBuffer(data)
          ? data.toString('utf8')
          : String(data);
        this.handleRawMessage(client, raw);
      });
    });
  }

  handleConnection(client: WebSocket): void {
    this.clientCounter += 1;
    this.clientMeta.set(client, { id: `client-${this.clientCounter}` });
    this.logger.debug(`WS client connected (${this.clientCounter})`);
  }

  handleDisconnect(client: WebSocket): void {
    this.clientMeta.delete(client);
    this.logger.debug('WS client disconnected');
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
      case 'agent:dialogue':
        void this.handleAgentDialogue(
          client,
          message.payload as AgentDialogueClientPayload,
        );
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

      this.send(client, 'agent:status', {
        agentId: payload.agentId,
        status: 'thinking' as AgentStatus,
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

      this.send(client, 'agent:status', {
        agentId: payload.agentId,
        status: 'idle' as AgentStatus,
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
      this.send(client, 'agent:status', {
        agentId: payload.agentId,
        status: 'idle' as AgentStatus,
      });
    }
  }

  private send<T>(
    client: WebSocket,
    event: string,
    payload: T,
    requestId?: string,
  ): void {
    if (client.readyState !== client.OPEN) {
      return;
    }
    client.send(serializeWsMessage(createWsMessage(event, payload, requestId)));
  }
}
