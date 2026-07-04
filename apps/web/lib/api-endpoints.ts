import type {
  Agent,
  AgentMemory,
  ApiResponse,
  Building,
  District,
  DistrictId,
  EarthState,
  Room,
  ScaleLevel,
  StarSystemsBundle,
} from '@ultron/shared';
import { API_BASE_PATH } from '@ultron/shared';

import type { NavigationHierarchyNode } from '@/stores/worldStore';

import { apiFetch } from './api-client';

export interface NavigationBreadcrumb {
  scale: ScaleLevel;
  label: string;
  entityId?: string;
}

export interface NavigationBundle {
  scale: ScaleLevel;
  focus: string | null;
  breadcrumbs: NavigationBreadcrumb[];
  hierarchy: NavigationHierarchyNode[];
  entities: {
    districts: District[];
    buildings: Building[];
    rooms: Room[];
    agents: Agent[];
    metrics: { entityCount: number; activeAgents: number };
  };
  transitions: Array<{ to: ScaleLevel; label: string }>;
}

export async function fetchHealth(): Promise<
  ApiResponse<{ status: string; timestamp: string }>
> {
  return apiFetch(`${API_BASE_PATH}/health`);
}

export async function fetchReady(): Promise<
  ApiResponse<{
    status: string;
    checks: { database: string };
    timestamp: string;
  }>
> {
  return apiFetch(`${API_BASE_PATH}/ready`);
}

export async function fetchDistricts(): Promise<ApiResponse<District[]>> {
  return apiFetch(`${API_BASE_PATH}/districts`);
}

export async function fetchDistrict(
  id: DistrictId,
): Promise<ApiResponse<District>> {
  return apiFetch(`${API_BASE_PATH}/districts/${id}`);
}

export async function fetchDistrictBuildings(
  id: DistrictId,
): Promise<ApiResponse<Building[]>> {
  return apiFetch(`${API_BASE_PATH}/districts/${id}/buildings`);
}

export async function fetchDistrictAgents(
  id: DistrictId,
): Promise<ApiResponse<Agent[]>> {
  return apiFetch(`${API_BASE_PATH}/districts/${id}/agents`);
}

export async function fetchNavigation(
  scale: ScaleLevel,
  focus?: string | null,
): Promise<ApiResponse<NavigationBundle>> {
  const params = new URLSearchParams();
  if (focus) {
    params.set('focus', focus);
  }
  const query = params.toString();
  const suffix = query ? `?${query}` : '';
  return apiFetch(`${API_BASE_PATH}/navigation/${scale}${suffix}`);
}

export async function fetchAgentMemories(
  agentId: string,
): Promise<ApiResponse<AgentMemory[]>> {
  return apiFetch(`${API_BASE_PATH}/agents/${agentId}/memory`);
}

export async function fetchEarthState(): Promise<ApiResponse<EarthState>> {
  return apiFetch(`${API_BASE_PATH}/earth/state`);
}

export async function fetchStarSystems(): Promise<
  ApiResponse<StarSystemsBundle>
> {
  return apiFetch(`${API_BASE_PATH}/star-systems`);
}
