import type {
  Agent,
  AgentStatus,
  Building,
  District,
  DistrictId,
  Room,
} from '@ultron/shared';

import type { StatusVariant } from '@/components/ui/StatusBadge';
import { districtFocusId } from '@/lib/entity-ids';
import type { EntityDetail, ShellMetric } from '@/lib/shell-data';

function mapAgentStatus(status: AgentStatus): StatusVariant {
  switch (status) {
    case 'idle':
    case 'thinking':
    case 'acting':
    case 'learning':
      return 'online';
    case 'migrating':
      return 'nominal';
    case 'offline':
      return 'offline';
    case 'error':
      return 'critical';
    default:
      return 'nominal';
  }
}

function mapBuildingStatus(state: Building['state']): StatusVariant {
  switch (state) {
    case 'active':
      return 'online';
    case 'degraded':
      return 'degraded';
    case 'offline':
      return 'offline';
    case 'constructing':
      return 'nominal';
    default:
      return 'nominal';
  }
}

function formatMetricValue(value: unknown): string {
  if (typeof value === 'number' && Number.isFinite(value)) {
    if (value > 0 && value <= 1) {
      return `${Math.round(value * 100)}%`;
    }
    return value.toLocaleString();
  }
  return '—';
}

function metricsFromRecord(
  record: Record<string, unknown> | undefined,
  fallback: readonly ShellMetric[],
): readonly ShellMetric[] {
  if (!record) {
    return fallback;
  }

  const entries = Object.entries(record).filter(
    ([, value]) => typeof value === 'number' && Number.isFinite(value),
  );

  if (entries.length === 0) {
    return fallback;
  }

  return entries.slice(0, 3).map(([label, value]) => ({
    label: label
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (char) => char.toUpperCase()),
    value: formatMetricValue(value),
    accent: 'text-signal-cyan',
  }));
}

export function districtToEntityDetail(district: District): EntityDetail {
  return {
    id: districtFocusId(district.slug),
    name: district.name,
    type: 'district',
    scale: 'district',
    status: 'online',
    districtId: district.slug,
    subtitle: 'Cognitive district',
    description: `${district.name} — agent population and throughput from seed data.`,
    metrics: [
      {
        label: 'Agents',
        value: String(district.agentCount),
        accent: 'text-signal-cyan',
      },
      ...metricsFromRecord(district.metrics, [
        { label: 'Throughput', value: '—', accent: 'text-text-secondary' },
        { label: 'Health', value: '100%', accent: 'text-signal-green' },
      ]).slice(0, 2),
    ],
    canTalk: false,
    canEnter: true,
    canViewMemory: false,
    enterScale: 'district',
  };
}

export function buildingToEntityDetail(
  building: Building,
  districtId?: DistrictId,
): EntityDetail {
  const utilization = building.metrics?.utilization;
  return {
    id: building.slug,
    name: building.name,
    type: 'building',
    scale: 'building',
    status: mapBuildingStatus(building.state),
    districtId: districtId ?? 'reasoning',
    subtitle: 'Reasoning District',
    description: `${building.name} — ${building.buildingType.replace(/_/g, ' ')}.`,
    metrics: [
      {
        label: 'Utilization',
        value: formatMetricValue(utilization ?? 0.87),
        accent: 'text-signal-green',
      },
      {
        label: 'Detail',
        value: building.detailLevel === 'full' ? 'Full' : 'LOD',
        accent: 'text-signal-cyan',
      },
      { label: 'State', value: building.state, accent: 'text-text-secondary' },
    ],
    canTalk: false,
    canEnter: building.detailLevel === 'full',
    canViewMemory: false,
    enterScale: 'building',
  };
}

export function roomToEntityDetail(
  room: Room,
  districtId?: DistrictId,
): EntityDetail {
  return {
    id: room.slug,
    name: room.name,
    type: 'room',
    scale: 'room',
    status: 'nominal',
    districtId: districtId ?? 'reasoning',
    subtitle: `Planning Tower · Floor ${room.floorIndex}`,
    description: `${room.name} — ${room.roomType.replace(/_/g, ' ')}.`,
    metrics: [
      {
        label: 'Floor',
        value: String(room.floorIndex),
        accent: 'text-signal-cyan',
      },
      { label: 'Type', value: room.roomType, accent: 'text-text-secondary' },
      { label: 'Room', value: room.name, accent: 'text-text-secondary' },
    ],
    canTalk: false,
    canEnter: room.slug === 'room-strategy',
    canViewMemory: false,
    enterScale: 'room',
  };
}

export function agentToEntityDetail(
  agent: Agent,
  districtId?: DistrictId,
): EntityDetail {
  return {
    id: agent.slug,
    name: agent.name,
    type: 'agent',
    scale: 'agent',
    status: mapAgentStatus(agent.status),
    districtId: districtId ?? 'reasoning',
    subtitle: `${agent.role} · ${agent.model}`,
    description: `${agent.name} is a ${agent.role} agent in the Reasoning District.`,
    metrics: [
      { label: 'Model', value: agent.model, accent: 'text-signal-purple' },
      { label: 'Status', value: agent.status, accent: 'text-signal-cyan' },
      { label: 'Role', value: agent.role, accent: 'text-text-secondary' },
    ],
    canTalk: true,
    canEnter: false,
    canViewMemory: true,
    enterScale: 'agent',
  };
}
