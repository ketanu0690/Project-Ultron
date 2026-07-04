import type { DistrictId } from '@ultron/shared';
import { DISTRICT_IDS } from '@ultron/shared';

export function districtFocusId(slug: DistrictId): string {
  return `district-${slug}`;
}

export function parseDistrictFocusId(focusId: string): DistrictId | null {
  if (!focusId.startsWith('district-')) {
    return null;
  }
  const slug = focusId.slice('district-'.length);
  if ((DISTRICT_IDS as readonly string[]).includes(slug)) {
    return slug as DistrictId;
  }
  return null;
}

export function isDistrictFocusId(focusId: string): boolean {
  return parseDistrictFocusId(focusId) !== null;
}
