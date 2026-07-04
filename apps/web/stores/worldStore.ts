/**
 * Server-synced entity data. Subscribe with narrow selectors:
 * useWorldStore(s => s.entities[id])
 */
import type {
  Agent,
  AgentMemory,
  Building,
  District,
  Room,
} from '@ultron/shared';
import { create } from 'zustand';

import {
  agentToEntityDetail,
  buildingToEntityDetail,
  districtToEntityDetail,
  roomToEntityDetail,
} from '@/lib/entity-detail';
import type { EntityDetail, HierarchyNode } from '@/lib/shell-data';

export interface NavigationHierarchyNode {
  id: string;
  label: string;
  scale: HierarchyNode['scale'];
  entityId?: string;
  children?: NavigationHierarchyNode[];
}

export interface WorldAggregateMetrics {
  districtCount: number;
  totalAgents: number;
  cityProsperity: number;
}

interface WorldState {
  districts: Record<string, District>;
  buildings: Record<string, Building>;
  rooms: Record<string, Room>;
  agents: Record<string, Agent>;
  agentUuidBySlug: Record<string, string>;
  memoriesByAgentSlug: Record<string, AgentMemory[]>;
  hierarchy: HierarchyNode[];
  aggregates: WorldAggregateMetrics;
  isHydrated: boolean;
  isLoading: boolean;
  error: string | null;
  version: number;
}

interface WorldActions {
  setHydrated: (payload: {
    districts: District[];
    buildings: Building[];
    rooms: Room[];
    agents: Agent[];
    hierarchy: NavigationHierarchyNode[];
    aggregates: WorldAggregateMetrics;
  }) => void;
  setAgentMemories: (agentSlug: string, memories: AgentMemory[]) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  getEntityDetail: (focusId: string | null) => EntityDetail | null;
  getAgentUuid: (agentSlug: string) => string | null;
}

export type WorldStore = WorldState & WorldActions;

function toHierarchyNode(node: NavigationHierarchyNode): HierarchyNode {
  return {
    id: node.id,
    label: node.label,
    scale: node.scale,
    entityId: node.entityId,
    children: node.children?.map(toHierarchyNode),
  };
}

const EMPTY_AGGREGATES: WorldAggregateMetrics = {
  districtCount: 0,
  totalAgents: 0,
  cityProsperity: 0,
};

export const useWorldStore = create<WorldStore>((set, get) => ({
  districts: {},
  buildings: {},
  rooms: {},
  agents: {},
  agentUuidBySlug: {},
  memoriesByAgentSlug: {},
  hierarchy: [],
  aggregates: EMPTY_AGGREGATES,
  isHydrated: false,
  isLoading: false,
  error: null,
  version: 0,
  setHydrated: (payload) => {
    const districts: Record<string, District> = {};
    const buildings: Record<string, Building> = {};
    const rooms: Record<string, Room> = {};
    const agents: Record<string, Agent> = {};
    const agentUuidBySlug: Record<string, string> = {};

    for (const district of payload.districts) {
      districts[districtToEntityDetail(district).id] = district;
    }
    for (const building of payload.buildings) {
      buildings[building.slug] = building;
    }
    for (const room of payload.rooms) {
      rooms[room.slug] = room;
    }
    for (const agent of payload.agents) {
      agents[agent.slug] = agent;
      agentUuidBySlug[agent.slug] = agent.id;
    }

    set({
      districts,
      buildings,
      rooms,
      agents,
      agentUuidBySlug,
      hierarchy: payload.hierarchy.map(toHierarchyNode),
      aggregates: payload.aggregates,
      isHydrated: true,
      isLoading: false,
      error: null,
      version: get().version + 1,
    });
  },
  setAgentMemories: (agentSlug, memories) => {
    set((state) => ({
      memoriesByAgentSlug: {
        ...state.memoriesByAgentSlug,
        [agentSlug]: memories,
      },
      version: state.version + 1,
    }));
  },
  setLoading: (isLoading) => {
    set({ isLoading });
  },
  setError: (error) => {
    set({ error, isLoading: false });
  },
  getEntityDetail: (focusId) => {
    if (!focusId) {
      return null;
    }

    const state = get();
    const district = state.districts[focusId];
    if (district) {
      return districtToEntityDetail(district);
    }

    const building = state.buildings[focusId];
    if (building) {
      return buildingToEntityDetail(building);
    }

    const room = state.rooms[focusId];
    if (room) {
      return roomToEntityDetail(room);
    }

    const agent = state.agents[focusId];
    if (agent) {
      return agentToEntityDetail(agent);
    }

    const slugFromUuid = Object.entries(state.agentUuidBySlug).find(
      ([, uuid]) => uuid === focusId,
    )?.[0];
    if (slugFromUuid) {
      const agentByUuid = state.agents[slugFromUuid];
      if (agentByUuid) {
        return agentToEntityDetail(agentByUuid);
      }
    }

    return null;
  },
  getAgentUuid: (agentSlug) => {
    return get().agentUuidBySlug[agentSlug] ?? null;
  },
}));
