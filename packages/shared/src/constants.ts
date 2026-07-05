export const MAX_AGENTS_MVP = 50;

/** OpenAI text-embedding-3-small; stored in agent_memories.embedding (vector 1536). */
export const EMBEDDING_DIMENSIONS = 1536;

export const WS_CHANNELS = {
  WORLD_STATE: 'world:state',
  WORLD_SNAPSHOT: 'world:snapshot',
  AGENT_STATUS: 'agent:status',
  AGENT_DIALOGUE: 'agent:dialogue',
  BUILDING_METRICS: 'building:metrics',
  NAV_SUBSCRIBE: 'nav:subscribe',
  NAV_UNSUBSCRIBE: 'nav:unsubscribe',
  NAV_ACK: 'nav:ack',
  SELECT_ENTITY: 'select:entity',
  PING: 'ping',
  PONG: 'pong',
} as const;

export const API_BASE_PATH = '/api/v1';
