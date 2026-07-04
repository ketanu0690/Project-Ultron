import {
  createWsMessage,
  parseWsMessage,
  serializeWsMessage,
} from '../../src/modules/realtime/ws-message.util';

describe('phoenix ws-message.util', () => {
  it('creates a versioned envelope', () => {
    const message = createWsMessage('agent:dialogue', {
      agentId: 'agent-1',
      message: 'hello',
    });

    expect(message.event).toBe('agent:dialogue');
    expect(message.version).toBe(1);
    expect(message.payload).toEqual({ agentId: 'agent-1', message: 'hello' });
    expect(message.timestamp).toBeDefined();
  });

  it('round-trips serialize and parse', () => {
    const original = createWsMessage('pong', {
      serverTime: '2026-06-16T00:00:00.000Z',
    });
    const parsed = parseWsMessage(serializeWsMessage(original));

    expect(parsed).toEqual(original);
  });

  it('returns null for invalid payloads', () => {
    expect(parseWsMessage('not-json')).toBeNull();
    expect(parseWsMessage(JSON.stringify({ event: 'ping' }))).toBeNull();
  });
});
