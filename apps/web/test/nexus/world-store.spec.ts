/**
 * Nexus QA — worldStore hydration and entity detail resolution.
 * @see docs/qa/nexus-scenarios.md
 */

import { beforeEach, describe, expect, it } from 'vitest';
import type { Agent, Building, District, Room } from '@ultron/shared';

import { useWorldStore } from '@/stores/worldStore';

const TIMESTAMP = '2026-07-04T12:00:00.000Z';

const MOCK_DISTRICT: District = {
  id: '11111111-1111-4111-8111-111111111111',
  slug: 'reasoning',
  name: 'Reasoning District',
  themeConfig: { primary: '#00E5FF', secondary: '#0088AA', accent: '#00E5FF' },
  agentCount: 50,
  metrics: { throughput: 1200 },
  createdAt: TIMESTAMP,
  updatedAt: TIMESTAMP,
};

const MOCK_BUILDING: Building = {
  id: '22222222-2222-4222-8222-222222222222',
  slug: 'building-planning-tower',
  districtId: MOCK_DISTRICT.id,
  buildingType: 'planning_tower',
  name: 'Planning Tower',
  state: 'active',
  detailLevel: 'full',
  position: { x: 0, y: 0, z: 0 },
  metrics: { utilization: 0.87 },
  createdAt: TIMESTAMP,
  updatedAt: TIMESTAMP,
};

const MOCK_ROOM: Room = {
  id: '44444444-4444-4444-8444-444444444444',
  slug: 'room-strategy',
  buildingId: MOCK_BUILDING.id,
  name: 'Strategy Room',
  roomType: 'strategy',
  floorIndex: 12,
  position: { x: 0, y: 0, z: 0 },
  createdAt: TIMESTAMP,
  updatedAt: TIMESTAMP,
};

const MOCK_AGENT: Agent = {
  id: '33333333-3333-4333-8333-333333333333',
  slug: 'agent-sigma-7',
  name: 'Analyst Sigma-7',
  role: 'planner',
  homeDistrictId: MOCK_DISTRICT.id,
  homeBuildingId: MOCK_BUILDING.id,
  homeRoomId: MOCK_ROOM.id,
  model: 'ultron-v1',
  version: '1.0.0',
  status: 'idle',
  position: { x: 0, y: 0, z: 0 },
  rotationY: 0,
  capabilities: [],
  createdAt: TIMESTAMP,
  updatedAt: TIMESTAMP,
};

describe('worldStore (Nexus QA)', () => {
  beforeEach(() => {
    useWorldStore.setState({
      districts: {},
      buildings: {},
      rooms: {},
      agents: {},
      agentUuidBySlug: {},
      memoriesByAgentSlug: {},
      hierarchy: [],
      aggregates: { districtCount: 0, totalAgents: 0, cityProsperity: 0 },
      simulationTickId: 0,
      worldStateVariables: null,
      governancePolicies: [],
      isHydrated: false,
      isLoading: false,
      error: null,
      version: 0,
    });
  });

  it('hydrates districts, buildings, rooms, and agents from API payload', () => {
    useWorldStore.getState().setHydrated({
      districts: [MOCK_DISTRICT],
      buildings: [MOCK_BUILDING],
      rooms: [MOCK_ROOM],
      agents: [MOCK_AGENT],
      hierarchy: [],
      aggregates: { districtCount: 1, totalAgents: 1, cityProsperity: 87 },
    });

    const state = useWorldStore.getState();
    expect(state.isHydrated).toBe(true);
    expect(state.districts['district-reasoning']).toBeDefined();
    expect(state.buildings['building-planning-tower']).toBeDefined();
    expect(state.rooms['room-strategy']).toBeDefined();
    expect(state.agents['agent-sigma-7']).toBeDefined();
    expect(state.aggregates.totalAgents).toBe(1);
  });

  it('resolves entity detail by slug from hydrated store', () => {
    useWorldStore.getState().setHydrated({
      districts: [MOCK_DISTRICT],
      buildings: [MOCK_BUILDING],
      rooms: [MOCK_ROOM],
      agents: [MOCK_AGENT],
      hierarchy: [],
      aggregates: { districtCount: 1, totalAgents: 1, cityProsperity: 87 },
    });

    const agentDetail = useWorldStore
      .getState()
      .getEntityDetail('agent-sigma-7');
    expect(agentDetail?.name).toBe('Analyst Sigma-7');
    expect(agentDetail?.canTalk).toBe(true);
    expect(agentDetail?.canViewMemory).toBe(true);
  });

  it('resolves agent detail by UUID via slug mapping', () => {
    useWorldStore.getState().setHydrated({
      districts: [MOCK_DISTRICT],
      buildings: [MOCK_BUILDING],
      rooms: [MOCK_ROOM],
      agents: [MOCK_AGENT],
      hierarchy: [],
      aggregates: { districtCount: 1, totalAgents: 1, cityProsperity: 87 },
    });

    const detail = useWorldStore.getState().getEntityDetail(MOCK_AGENT.id);
    expect(detail?.name).toBe('Analyst Sigma-7');
    expect(detail?.id).toBe('agent-sigma-7');
  });

  it('getAgentUuid returns UUID for slug', () => {
    useWorldStore.getState().setHydrated({
      districts: [MOCK_DISTRICT],
      buildings: [MOCK_BUILDING],
      rooms: [MOCK_ROOM],
      agents: [MOCK_AGENT],
      hierarchy: [],
      aggregates: { districtCount: 1, totalAgents: 1, cityProsperity: 87 },
    });

    expect(useWorldStore.getState().getAgentUuid('agent-sigma-7')).toBe(
      MOCK_AGENT.id,
    );
  });

  it('returns null for unknown entity when store is empty', () => {
    expect(
      useWorldStore.getState().getEntityDetail('agent-sigma-7'),
    ).toBeNull();
  });
});
