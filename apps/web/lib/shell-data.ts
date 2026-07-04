import {
  DISTRICT_COLORS,
  MAX_AGENTS_MVP,
  type DistrictId,
  type ScaleLevel,
} from '@ultron/shared';

import type { StatusVariant } from '@/components/ui/StatusBadge';
import { useWorldStore } from '@/stores/worldStore';

export interface ShellMetric {
  readonly label: string;
  readonly value: string;
  readonly accent?: string;
}

export interface EntityDetail {
  readonly id: string;
  readonly name: string;
  readonly type: 'district' | 'building' | 'room' | 'agent';
  readonly scale: ScaleLevel;
  readonly status: StatusVariant;
  readonly districtId?: DistrictId;
  readonly subtitle: string;
  readonly description: string;
  readonly metrics: readonly ShellMetric[];
  readonly canTalk: boolean;
  readonly canEnter: boolean;
  readonly canViewMemory: boolean;
  readonly enterScale?: ScaleLevel;
}

export interface HierarchyNode {
  readonly id: string;
  readonly label: string;
  readonly scale: ScaleLevel;
  readonly entityId?: string;
  readonly children?: readonly HierarchyNode[];
}

const DISTRICT_LABELS: Record<DistrictId, string> = {
  perception: 'Perception',
  memory: 'Memory',
  reasoning: 'Reasoning',
  action: 'Action',
  self_improvement: 'Self Improvement',
};

export const DISTRICT_ENTITY_IDS: Record<DistrictId, string> = {
  perception: 'district-perception',
  memory: 'district-memory',
  reasoning: 'district-reasoning',
  action: 'district-action',
  self_improvement: 'district-self-improvement',
};

export const SCALE_LABELS: Record<ScaleLevel, string> = {
  galaxy: 'Galaxy',
  solar_system: 'Solar System',
  earth: 'Earth',
  orbital_ring: 'Orbital Defense Ring',
  megacity: 'AI Megacity',
  district: 'District',
  building: 'Building',
  room: 'Room',
  agent: 'Agent',
  memory: 'Memory',
};

export const COSMIC_NAV_NODES: readonly HierarchyNode[] = [
  { id: 'galaxy', label: 'Galaxy', scale: 'galaxy' },
  { id: 'earth', label: 'Earth', scale: 'earth' },
];

export const NAV_HIERARCHY: readonly HierarchyNode[] = [
  ...COSMIC_NAV_NODES,
  {
    id: 'megacity',
    label: 'AI Megacity',
    scale: 'megacity',
    children: (
      [
        'perception',
        'memory',
        'reasoning',
        'action',
        'self_improvement',
      ] as const
    ).map((districtId) => ({
      id: DISTRICT_ENTITY_IDS[districtId],
      label: `${DISTRICT_LABELS[districtId]} District`,
      scale: 'district' as const,
      entityId: DISTRICT_ENTITY_IDS[districtId],
      children:
        districtId === 'reasoning'
          ? [
              {
                id: 'building-planning-tower',
                label: 'Planning Tower',
                scale: 'building' as const,
                entityId: 'building-planning-tower',
                children: [
                  {
                    id: 'room-strategy',
                    label: 'Strategy Room',
                    scale: 'room' as const,
                    entityId: 'room-strategy',
                    children: [
                      {
                        id: 'agent-sigma-7',
                        label: 'Analyst Sigma-7',
                        scale: 'agent' as const,
                        entityId: 'agent-sigma-7',
                      },
                    ],
                  },
                ],
              },
            ]
          : undefined,
    })),
  },
];

function createLodFootprintDetail(index: number): EntityDetail {
  return {
    id: `building-footprint-${index}`,
    name: `Building Footprint ${index}`,
    type: 'building',
    scale: 'district',
    status: 'nominal',
    districtId: 'reasoning',
    subtitle: 'LOD footprint',
    description:
      'Low-detail placeholder. Enter Planning Tower to explore this district.',
    metrics: [
      { label: 'Detail', value: 'LOD', accent: 'text-text-secondary' },
      { label: 'Agents', value: '—', accent: 'text-text-secondary' },
      { label: 'Status', value: 'Placeholder', accent: 'text-text-tertiary' },
    ],
    canTalk: false,
    canEnter: false,
    canViewMemory: false,
  };
}

const LOD_FOOTPRINT_DETAILS: Record<string, EntityDetail> = Object.fromEntries(
  Array.from({ length: 9 }, (_, index) => {
    const detail = createLodFootprintDetail(index + 1);
    return [detail.id, detail];
  }),
);

const ENTITY_DETAILS: Record<string, EntityDetail> = {
  'district-perception': {
    id: 'district-perception',
    name: 'Perception District',
    type: 'district',
    scale: 'district',
    status: 'nominal',
    districtId: 'perception',
    subtitle: 'The Eyes and Ears',
    description:
      'Gather and observe — internet nexus, sensor arrays, and signal intake.',
    metrics: [
      { label: 'Agents', value: '0', accent: 'text-signal-cyan' },
      { label: 'Throughput', value: '—', accent: 'text-text-secondary' },
      { label: 'Coverage', value: '12%', accent: 'text-signal-amber' },
    ],
    canTalk: false,
    canEnter: true,
    canViewMemory: false,
    enterScale: 'district',
  },
  'district-memory': {
    id: 'district-memory',
    name: 'Memory District',
    type: 'district',
    scale: 'district',
    status: 'nominal',
    districtId: 'memory',
    subtitle: 'The Vault of Knowledge',
    description:
      'Store and learn — archives, embeddings, and world-model retention.',
    metrics: [
      { label: 'Agents', value: '0', accent: 'text-signal-cyan' },
      { label: 'Throughput', value: '—', accent: 'text-text-secondary' },
      { label: 'Archives', value: '2.4 PB', accent: 'text-signal-green' },
    ],
    canTalk: false,
    canEnter: true,
    canViewMemory: false,
    enterScale: 'district',
  },
  'district-reasoning': {
    id: 'district-reasoning',
    name: 'Reasoning District',
    type: 'district',
    scale: 'district',
    status: 'online',
    districtId: 'reasoning',
    subtitle: 'The Mind and Intellect',
    description:
      'Analyze and predict — logic engines, simulation chambers, planning systems.',
    metrics: [
      {
        label: 'Agents',
        value: String(MAX_AGENTS_MVP),
        accent: 'text-signal-cyan',
      },
      { label: 'Throughput', value: '1.2k/s', accent: 'text-signal-green' },
      { label: 'Simulations', value: '8 active', accent: 'text-signal-amber' },
    ],
    canTalk: false,
    canEnter: true,
    canViewMemory: false,
    enterScale: 'district',
  },
  'district-action': {
    id: 'district-action',
    name: 'Action District',
    type: 'district',
    scale: 'district',
    status: 'nominal',
    districtId: 'action',
    subtitle: 'The Hands and Execution',
    description:
      'Execute and control — robotics foundries and infrastructure controllers.',
    metrics: [
      { label: 'Agents', value: '0', accent: 'text-signal-cyan' },
      { label: 'Throughput', value: '—', accent: 'text-text-secondary' },
      { label: 'Tasks', value: '0 queued', accent: 'text-text-secondary' },
    ],
    canTalk: false,
    canEnter: true,
    canViewMemory: false,
    enterScale: 'district',
  },
  'district-self-improvement': {
    id: 'district-self-improvement',
    name: 'Self Improvement District',
    type: 'district',
    scale: 'district',
    status: 'nominal',
    districtId: 'self_improvement',
    subtitle: 'The Path to Perfection',
    description:
      'Evolve and upgrade — model refinement labs and meta-learning engines.',
    metrics: [
      { label: 'Agents', value: '0', accent: 'text-signal-cyan' },
      { label: 'Throughput', value: '—', accent: 'text-text-secondary' },
      { label: 'Models', value: '3 in review', accent: 'text-signal-purple' },
    ],
    canTalk: false,
    canEnter: true,
    canViewMemory: false,
    enterScale: 'district',
  },
  'building-planning-tower': {
    id: 'building-planning-tower',
    name: 'Planning Tower',
    type: 'building',
    scale: 'building',
    status: 'online',
    districtId: 'reasoning',
    subtitle: 'Reasoning District',
    description:
      'Central planning and simulation hub for strategic intelligence.',
    metrics: [
      { label: 'Utilization', value: '87%', accent: 'text-signal-green' },
      { label: 'Agents', value: '12', accent: 'text-signal-cyan' },
      { label: 'Rooms', value: '3', accent: 'text-text-secondary' },
    ],
    canTalk: false,
    canEnter: true,
    canViewMemory: false,
    enterScale: 'building',
  },
  'room-strategy': {
    id: 'room-strategy',
    name: 'Strategy Room',
    type: 'room',
    scale: 'room',
    status: 'nominal',
    districtId: 'reasoning',
    subtitle: 'Planning Tower · Floor 12',
    description: 'Collaborative strategy space for planners and simulators.',
    metrics: [
      { label: 'Agents Present', value: '1', accent: 'text-signal-cyan' },
      { label: 'Occupancy', value: '33%', accent: 'text-signal-green' },
      { label: 'Sessions', value: '2 today', accent: 'text-text-secondary' },
    ],
    canTalk: false,
    canEnter: true,
    canViewMemory: false,
    enterScale: 'room',
  },
  'room-plan-vault': {
    id: 'room-plan-vault',
    name: 'Plan Vault',
    type: 'room',
    scale: 'room',
    status: 'nominal',
    districtId: 'reasoning',
    subtitle: 'Planning Tower · Floor 8',
    description: 'Secure archive for strategic plans and simulation outputs.',
    metrics: [
      { label: 'Agents Present', value: '0', accent: 'text-text-secondary' },
      { label: 'Occupancy', value: '0%', accent: 'text-text-secondary' },
      { label: 'Archives', value: '24 plans', accent: 'text-signal-green' },
    ],
    canTalk: false,
    canEnter: false,
    canViewMemory: false,
  },
  'room-observation-deck': {
    id: 'room-observation-deck',
    name: 'Observation Deck',
    type: 'room',
    scale: 'room',
    status: 'nominal',
    districtId: 'reasoning',
    subtitle: 'Planning Tower · Floor 16',
    description:
      'Panoramic overview of district operations and simulation feeds.',
    metrics: [
      { label: 'Agents Present', value: '0', accent: 'text-text-secondary' },
      { label: 'Occupancy', value: '0%', accent: 'text-text-secondary' },
      { label: 'Feeds', value: '12 active', accent: 'text-signal-cyan' },
    ],
    canTalk: false,
    canEnter: false,
    canViewMemory: false,
  },
  'agent-sigma-7': {
    id: 'agent-sigma-7',
    name: 'Analyst Sigma-7',
    type: 'agent',
    scale: 'agent',
    status: 'online',
    districtId: 'reasoning',
    subtitle: 'Strategy Room · Planner',
    description:
      'Strategic planning agent specializing in threat analysis and resource allocation.',
    metrics: [
      { label: 'Model', value: 'ultron-v1', accent: 'text-signal-purple' },
      { label: 'Uptime', value: '99.7%', accent: 'text-signal-green' },
      { label: 'Tasks', value: '4 active', accent: 'text-signal-cyan' },
    ],
    canTalk: true,
    canEnter: false,
    canViewMemory: true,
    enterScale: 'agent',
  },
  ...LOD_FOOTPRINT_DETAILS,
};

export function getEntityDetail(entityId: string | null): EntityDetail | null {
  if (!entityId) {
    return null;
  }

  const fromWorld = useWorldStore.getState().getEntityDetail(entityId);
  if (fromWorld) {
    return fromWorld;
  }

  return ENTITY_DETAILS[entityId] ?? null;
}

export function getDistrictAccent(districtId?: DistrictId): string {
  if (!districtId) {
    return 'text-signal-cyan';
  }
  const color = DISTRICT_COLORS[districtId].accent;
  return `text-[${color}]`;
}

export function getDistrictColorHex(districtId?: DistrictId): string {
  if (!districtId) {
    return '#00E5FF';
  }
  return DISTRICT_COLORS[districtId].primary;
}

export function getScaleBadgeLabel(
  scale: ScaleLevel,
  focusEntityId: string | null,
): string {
  const entity = getEntityDetail(focusEntityId);
  if (entity) {
    return entity.name.toUpperCase();
  }
  return SCALE_LABELS[scale].toUpperCase();
}
