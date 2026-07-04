export type DistrictId =
  'perception' | 'memory' | 'reasoning' | 'action' | 'self_improvement';

export const DISTRICT_IDS: readonly DistrictId[] = [
  'perception',
  'memory',
  'reasoning',
  'action',
  'self_improvement',
] as const;
