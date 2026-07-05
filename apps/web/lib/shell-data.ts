import {
  DISTRICT_COLORS,
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

/** Client-only LOD placeholders — no API rows; kept as static fallback. */
const LOD_FOOTPRINT_DETAILS: Record<string, EntityDetail> = Object.fromEntries(
  Array.from({ length: 9 }, (_, index) => {
    const detail = createLodFootprintDetail(index + 1);
    return [detail.id, detail];
  }),
);

/**
 * Resolve entity detail for shell UI. Prefers API-hydrated worldStore;
 * falls back only to client-only LOD footprints when store is empty.
 */
export function getEntityDetail(entityId: string | null): EntityDetail | null {
  if (!entityId) {
    return null;
  }

  const fromWorld = useWorldStore.getState().getEntityDetail(entityId);
  if (fromWorld) {
    return fromWorld;
  }

  return LOD_FOOTPRINT_DETAILS[entityId] ?? null;
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
