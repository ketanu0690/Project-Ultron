/**
 * Nexus QA — breadcrumb builder with API-backed and empty-store fallbacks.
 * @see docs/qa/nexus-scenarios.md
 */

import { beforeEach, describe, expect, it } from 'vitest';
import type { Agent, Building, District, Room } from '@ultron/shared';

import { buildBreadcrumbs } from '@/lib/navigation-breadcrumbs';
import { getEntityDetail } from '@/lib/shell-data';
import { useWorldStore } from '@/stores/worldStore';

const TIMESTAMP = '2026-07-04T12:00:00.000Z';

const MOCK_DISTRICT: District = {
  id: '11111111-1111-4111-8111-111111111111',
  slug: 'reasoning',
  name: 'Reasoning District',
  themeConfig: { primary: '#00E5FF', secondary: '#0088AA', accent: '#00E5FF' },
  agentCount: 50,
  metrics: {},
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

function hydrateWorldStore(): void {
  useWorldStore.getState().setHydrated({
    districts: [MOCK_DISTRICT],
    buildings: [MOCK_BUILDING],
    rooms: [MOCK_ROOM],
    agents: [MOCK_AGENT],
    hierarchy: [],
    aggregates: { districtCount: 1, totalAgents: 1, cityProsperity: 87 },
  });
}

describe('buildBreadcrumbs (Nexus QA)', () => {
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

  it('returns galaxy crumb at galaxy scale', () => {
    const crumbs = buildBreadcrumbs('galaxy', null);
    expect(crumbs).toHaveLength(1);
    expect(crumbs[0]?.label).toBe('Galaxy');
  });

  it('builds agent path when worldStore is hydrated', () => {
    hydrateWorldStore();

    const crumbs = buildBreadcrumbs('agent', 'agent-sigma-7');
    const labels = crumbs.map((crumb) => crumb.label);

    expect(labels).toContain('AI Megacity');
    expect(labels).toContain('Reasoning District');
    expect(labels).toContain('Planning Tower');
    expect(labels).toContain('Strategy Room');
    expect(labels).toContain('Analyst Sigma-7');
  });

  it('appends Memory crumb at memory scale', () => {
    hydrateWorldStore();

    const crumbs = buildBreadcrumbs('memory', 'agent-sigma-7');
    const labels = crumbs.map((crumb) => crumb.label);

    expect(labels).toContain('Memory');
    expect(labels).toContain('Analyst Sigma-7');
  });

  it('falls back gracefully when store is empty — no static entity stubs', () => {
    expect(getEntityDetail('agent-sigma-7')).toBeNull();

    const crumbs = buildBreadcrumbs('agent', 'agent-sigma-7');
    expect(crumbs.length).toBeGreaterThanOrEqual(1);
    expect(crumbs[0]?.label).toBe('AI Megacity');
    expect(crumbs.some((crumb) => crumb.label === 'Analyst Sigma-7')).toBe(
      false,
    );
  });

  it('still resolves LOD footprint entities from client-only fallback', () => {
    const footprint = getEntityDetail('building-footprint-1');
    expect(footprint?.name).toBe('Building Footprint 1');
    expect(footprint?.canEnter).toBe(false);
  });
});
