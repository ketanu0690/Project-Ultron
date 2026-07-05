/**
 * Phoenix QA — in-process WS + SSE dialogue integration.
 * @see docs/qa/phoenix-scenarios.md
 */

import WebSocket from 'ws';

import type { WsMessage } from '@ultron/shared';

import {
  closeTestApp,
  createTestApp,
  type TestAppContext,
} from '../support/create-test-app';
import { MOCK_AGENT_SIGMA_7 } from '../support/prisma-mock';

function pushWsMessage(messages: WsMessage[], raw: string): void {
  const message = JSON.parse(raw) as WsMessage;
  messages.push(message);
}

function collectWsMessages(
  socket: WebSocket,
  timeoutMs = 15_000,
): Promise<WsMessage[]> {
  return new Promise((resolve, reject) => {
    const messages: WsMessage[] = [];
    const timer = setTimeout(() => {
      socket.removeAllListeners();
      reject(new Error(`WS collect timed out after ${String(timeoutMs)}ms`));
    }, timeoutMs);

    socket.on('message', (data: WebSocket.RawData) => {
      const text =
        typeof data === 'string'
          ? data
          : Buffer.from(data as Buffer).toString('utf8');
      pushWsMessage(messages, text);

      const dialogueDone = messages.some(
        (msg) =>
          msg.event === 'agent:dialogue' &&
          (msg.payload as { done?: boolean }).done === true,
      );
      const idleAfterStream = dialogueDone
        ? messages.some(
            (msg) =>
              msg.event === 'agent:status' &&
              (msg.payload as { status?: string }).status === 'idle',
          )
        : false;

      if (dialogueDone && idleAfterStream) {
        clearTimeout(timer);
        socket.removeAllListeners();
        resolve(messages);
      }
    });

    socket.on('error', (error) => {
      clearTimeout(timer);
      reject(error);
    });
  });
}

describe('Phoenix dialogue integration', () => {
  let ctx: TestAppContext;

  beforeAll(async () => {
    delete process.env.OLLAMA_BASE_URL;
    ctx = await createTestApp();
  });

  afterAll(async () => {
    await closeTestApp(ctx);
  });

  it('responds to ping with pong', async () => {
    const socket = new WebSocket(`ws://127.0.0.1:${String(ctx.port)}/ws`);

    await new Promise<void>((resolve, reject) => {
      socket.on('open', () => {
        socket.send(
          JSON.stringify({
            event: 'ping',
            version: 1,
            payload: {},
            timestamp: new Date().toISOString(),
          }),
        );
      });

      socket.on('message', (data) => {
        const text =
          typeof data === 'string'
            ? data
            : Buffer.from(data as Buffer).toString('utf8');
        const message = JSON.parse(text) as WsMessage;
        if (message.event === 'pong') {
          expect(message.payload).toHaveProperty('serverTime');
          socket.close();
          resolve();
        }
      });

      socket.on('error', reject);
    });
  });

  it('streams dialogue over WebSocket with status lifecycle', async () => {
    const socket = new WebSocket(`ws://127.0.0.1:${String(ctx.port)}/ws`);

    await new Promise<void>((resolve, reject) => {
      socket.on('open', () => {
        const collectPromise = collectWsMessages(socket);

        socket.send(
          JSON.stringify({
            event: 'agent:dialogue',
            version: 1,
            payload: {
              agentId: MOCK_AGENT_SIGMA_7.slug,
              message: 'What is the current threat level?',
            },
            timestamp: new Date().toISOString(),
          }),
        );

        void collectPromise
          .then((messages) => {
            expect(
              messages.some(
                (msg) =>
                  msg.event === 'agent:status' &&
                  (msg.payload as { status?: string }).status === 'thinking',
              ),
            ).toBe(true);

            const dialogueMessages = messages.filter(
              (msg) => msg.event === 'agent:dialogue',
            );
            expect(dialogueMessages.length).toBeGreaterThan(0);
            expect(
              dialogueMessages.some(
                (msg) =>
                  (msg.payload as { token?: string }).token !== undefined,
              ),
            ).toBe(true);
            expect(
              dialogueMessages.some(
                (msg) => (msg.payload as { done?: boolean }).done === true,
              ),
            ).toBe(true);

            socket.close();
            resolve();
          })
          .catch(reject);
      });

      socket.on('error', reject);
    });
  });

  it('streams dialogue via SSE when Accept is text/event-stream', async () => {
    const response = await fetch(
      `${ctx.baseUrl}/api/v1/agents/${MOCK_AGENT_SIGMA_7.slug}/dialogue`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'text/event-stream',
        },
        body: JSON.stringify({ message: 'Hello via SSE' }),
      },
    );

    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toContain('text/event-stream');

    const body = await response.text();
    expect(body).toContain('event: token');
    expect(body).toContain('event: done');
  });

  it('returns 404 for unknown agent dialogue', async () => {
    const response = await fetch(
      `${ctx.baseUrl}/api/v1/agents/00000000-0000-0000-0000-000000000099/dialogue`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'Hello' }),
      },
    );

    expect(response.status).toBe(404);
    const body = (await response.json()) as {
      statusCode: number;
      message: string;
      timestamp: string;
    };
    expect(body.statusCode).toBe(404);
    expect(body.message).toContain('not found');
    expect(body.timestamp).toBeDefined();
  });
});
