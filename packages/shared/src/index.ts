export type { ScaleLevel } from './types/scale';
export { SCALE_LEVELS } from './types/scale';

export type {
  CameraControlMode,
  CameraSpecialMode,
  Vec3,
  CameraState,
} from './types/camera';
export {
  MIN_CAMERA_FOV,
  MAX_CAMERA_FOV,
  CAMERA_COLLISION_RADIUS_INTERIOR,
  MIN_ALTITUDE_CITY,
  MIN_DISTANCE_BUILDING_EXTERIOR,
  GROUND_PLANE_Y,
} from './types/camera';
export { SCALE_CAMERA_DEFAULTS } from './constants/camera';
export type { ScaleCameraDefaults } from './constants/camera';

export type { DistrictId } from './types/district';
export { DISTRICT_IDS } from './types/district';

export type { AgentStatus, AgentRole, Agent } from './types/agent';
export {
  AGENT_STATUSES,
  MVP_AGENT_ROLES,
  REASONING_AGENT_ROLE_COUNTS,
} from './types/agent';

export type {
  PolicyDomain,
  GovernancePolicy,
  SimulationEventRecord,
} from './types/governance';
export { POLICY_DOMAINS } from './types/governance';

export type {
  BuildingState,
  BuildingDetailLevel,
  ReasoningBuildingType,
  Vec3Json,
  Building,
} from './types/building';
export {
  BUILDING_STATES,
  BUILDING_DETAIL_LEVELS,
  REASONING_BUILDING_TYPES,
} from './types/building';

export type { RoomType, Room } from './types/room';
export { ROOM_TYPES } from './types/room';

export type {
  MemoryType,
  AgentMemoryMetadata,
  AgentMemory,
  MemorySearchRequest,
  MemorySearchResult,
} from './types/memory';
export { MEMORY_TYPES } from './types/memory';

export type { DistrictThemeConfig, District } from './types/district-dto';

export type { EntityType, Entity } from './types/entity';
export { ENTITY_TYPES } from './types/entity';

export type {
  StarType,
  CivilizationStatus,
  StarSystem,
} from './types/star-system';
export { STAR_TYPES, CIVILIZATION_STATUSES } from './types/star-system';

export type {
  ApiResponse,
  ApiError,
  HealthResponse,
  WorldStateVariables,
  ScaleMetrics,
} from './types/api';

export type {
  LatLng,
  HealthTrend,
  PlanetaryHealthMetric,
  PlanetaryHealth,
  GroundStation,
  EarthState,
} from './types/earth';

export type {
  WsMessage,
  NavSubscribePayload,
  NavUnsubscribePayload,
  NavAckPayload,
  AgentDialogueClientPayload,
  SelectEntityPayload,
  PingPayload,
  WorldStatePayload,
  WorldSnapshotPayload,
  AgentStatusPayload,
  AgentConversationPayload,
  AgentDialogueServerPayload,
  BuildingMetricsPayload,
  SimulationTickPayload,
  SimulationEventPayload,
  GovernancePolicyPayload,
  PongPayload,
  ClientWsEvent,
  ServerWsEvent,
} from './events';

export { COLORS, DISTRICT_COLORS } from './colors';
export {
  MAX_AGENTS_MVP,
  EMBEDDING_DIMENSIONS,
  WS_CHANNELS,
  API_BASE_PATH,
} from './constants';
export {
  GALAXY_NAMED_SYSTEM_COUNT,
  LY_TO_SCENE,
  CURATED_STAR_SYSTEM_SEEDS,
  buildGalaxyStarSystems,
  buildGalaxyHudMetrics,
  buildStarSystemsBundle,
  computeGalaxyHudMetrics,
} from './constants/star-systems';
export type {
  GalaxyHudMetrics,
  CuratedStarSystemSeed,
  StarSystemsBundle,
} from './constants/star-systems';
