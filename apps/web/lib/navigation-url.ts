import { SCALE_LEVELS, type ScaleLevel } from '@ultron/shared';

export const NAVIGATION_URL_PARAMS = {
  scale: 'scale',
  entity: 'entity',
  entry: 'entry',
} as const;

export function buildNavigationQueryString(
  scale: ScaleLevel,
  focusEntityId: string | null,
  preserveParams?: URLSearchParams,
): string {
  const params = new URLSearchParams();

  params.set(NAVIGATION_URL_PARAMS.scale, scale);
  if (focusEntityId) {
    params.set(NAVIGATION_URL_PARAMS.entity, focusEntityId);
  }

  if (preserveParams) {
    const entry = preserveParams.get(NAVIGATION_URL_PARAMS.entry);
    if (entry) {
      params.set(NAVIGATION_URL_PARAMS.entry, entry);
    }
  }

  return params.toString();
}

export function navigationQueryMatches(
  scale: ScaleLevel,
  focusEntityId: string | null,
  search: string,
): boolean {
  const params = new URLSearchParams(
    search.startsWith('?') ? search.slice(1) : search,
  );
  const scaleParam = params.get(NAVIGATION_URL_PARAMS.scale);
  const entityParam = params.get(NAVIGATION_URL_PARAMS.entity);

  if (scaleParam !== scale) {
    return false;
  }

  if (focusEntityId) {
    return entityParam === focusEntityId;
  }

  return entityParam === null || entityParam === '';
}

function isScaleLevel(value: string): value is ScaleLevel {
  return (SCALE_LEVELS as readonly string[]).includes(value);
}

export interface NavigationUrlState {
  readonly scale: ScaleLevel;
  readonly focusEntityId: string | null;
}

/** Parses `?scale=` and `?entity=` from the current or provided search string. */
export function readNavigationFromUrl(
  search?: string,
): NavigationUrlState | null {
  const raw =
    search ?? (typeof window !== 'undefined' ? window.location.search : '');
  const params = new URLSearchParams(raw.startsWith('?') ? raw.slice(1) : raw);
  const scaleParam = params.get(NAVIGATION_URL_PARAMS.scale);

  if (!scaleParam || !isScaleLevel(scaleParam)) {
    return null;
  }

  return {
    scale: scaleParam,
    focusEntityId: params.get(NAVIGATION_URL_PARAMS.entity),
  };
}

/** True when the URL already specifies navigation params (deep link). */
export function hasNavigationUrlParams(search?: string): boolean {
  const raw =
    search ?? (typeof window !== 'undefined' ? window.location.search : '');
  const params = new URLSearchParams(raw.startsWith('?') ? raw.slice(1) : raw);
  const scaleParam = params.get(NAVIGATION_URL_PARAMS.scale);
  const entityParam = params.get(NAVIGATION_URL_PARAMS.entity);

  return (
    (scaleParam !== null && isScaleLevel(scaleParam)) || entityParam !== null
  );
}
