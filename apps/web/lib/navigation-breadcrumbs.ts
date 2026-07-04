import type { ScaleLevel } from '@ultron/shared';

import {
  getEntityDetail,
  SCALE_LABELS,
  DISTRICT_ENTITY_IDS,
  type EntityDetail,
} from '@/lib/shell-data';

export interface Breadcrumb {
  readonly scale: ScaleLevel;
  readonly label: string;
  readonly entityId?: string;
}

const SCALE_ORDER: readonly ScaleLevel[] = [
  'galaxy',
  'solar_system',
  'earth',
  'orbital_ring',
  'megacity',
  'district',
  'building',
  'room',
  'agent',
  'memory',
];

function scaleIndex(scale: ScaleLevel): number {
  return SCALE_ORDER.indexOf(scale);
}

function districtCrumbForEntity(entity: EntityDetail): Breadcrumb | null {
  if (!entity.districtId) {
    return null;
  }
  const districtEntity = getEntityDetail(
    DISTRICT_ENTITY_IDS[entity.districtId],
  );
  if (!districtEntity) {
    return null;
  }
  return {
    scale: 'district',
    label: districtEntity.name,
    entityId: districtEntity.id,
  };
}

export function buildBreadcrumbs(
  currentScale: ScaleLevel,
  focusEntityId: string | null,
): readonly Breadcrumb[] {
  if (currentScale === 'galaxy') {
    return [{ scale: 'galaxy', label: SCALE_LABELS.galaxy }];
  }

  if (currentScale === 'earth') {
    return [
      { scale: 'galaxy', label: SCALE_LABELS.galaxy },
      { scale: 'earth', label: SCALE_LABELS.earth },
    ];
  }

  if (scaleIndex(currentScale) < scaleIndex('megacity')) {
    return [{ scale: currentScale, label: SCALE_LABELS[currentScale] }];
  }

  const crumbs: Breadcrumb[] = [
    { scale: 'megacity', label: SCALE_LABELS.megacity },
  ];
  const entity = getEntityDetail(focusEntityId);

  if (!entity && currentScale === 'megacity') {
    return crumbs;
  }

  if (!entity) {
    if (currentScale !== 'megacity') {
      crumbs.push({ scale: currentScale, label: SCALE_LABELS[currentScale] });
    }
    return crumbs;
  }

  if (entity.type === 'district') {
    crumbs.push({ scale: 'district', label: entity.name, entityId: entity.id });
    return crumbs;
  }

  const districtCrumb = districtCrumbForEntity(entity);
  if (districtCrumb) {
    crumbs.push(districtCrumb);
  }

  if (entity.type === 'building') {
    crumbs.push({ scale: 'building', label: entity.name, entityId: entity.id });
    return crumbs;
  }

  if (entity.type === 'room' || entity.type === 'agent') {
    const building = getEntityDetail('building-planning-tower');
    if (building) {
      crumbs.push({
        scale: 'building',
        label: building.name,
        entityId: building.id,
      });
    }
  }

  if (entity.type === 'room') {
    crumbs.push({ scale: 'room', label: entity.name, entityId: entity.id });
    return crumbs;
  }

  if (entity.type === 'agent') {
    const room = getEntityDetail('room-strategy');
    if (room) {
      crumbs.push({ scale: 'room', label: room.name, entityId: room.id });
    }
    crumbs.push({ scale: 'agent', label: entity.name, entityId: entity.id });
    if (currentScale === 'memory') {
      crumbs.push({ scale: 'memory', label: SCALE_LABELS.memory });
    }
    return crumbs;
  }

  if (currentScale === 'memory') {
    crumbs.push({ scale: 'memory', label: SCALE_LABELS.memory });
  }

  return crumbs;
}
