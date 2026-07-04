import type { ScaleLevel } from '@ultron/shared';

import type { EntityDetail } from '@/lib/shell-data';

export interface EnterNavigationAction {
  readonly targetScale?: ScaleLevel;
  readonly focusId: string;
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

const MVP_ENTER_CHAIN: Readonly<
  Record<string, Partial<Record<ScaleLevel, EnterNavigationAction>>>
> = {
  'district-reasoning': {
    megacity: { targetScale: 'district', focusId: 'district-reasoning' },
    district: { focusId: 'building-planning-tower' },
  },
  'building-planning-tower': {
    district: { targetScale: 'building', focusId: 'building-planning-tower' },
    building: { targetScale: 'room', focusId: 'room-strategy' },
  },
  'room-strategy': {
    room: { targetScale: 'agent', focusId: 'agent-sigma-7' },
  },
};

export function getEnterNavigation(
  currentScale: ScaleLevel,
  entity: EntityDetail,
): EnterNavigationAction | null {
  if (!entity.canEnter) {
    return null;
  }

  const chainAction = MVP_ENTER_CHAIN[entity.id]?.[currentScale];
  if (chainAction) {
    return chainAction;
  }

  if (
    entity.enterScale &&
    scaleIndex(currentScale) < scaleIndex(entity.enterScale)
  ) {
    return { targetScale: entity.enterScale, focusId: entity.id };
  }

  return null;
}
