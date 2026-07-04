import { describe, expect, it } from 'vitest';

import {
  buildNavigationQueryString,
  hasNavigationUrlParams,
  navigationQueryMatches,
  readNavigationFromUrl,
} from '@/lib/navigation-url';

describe('navigation-url', () => {
  it('builds scale and entity query string', () => {
    const query = buildNavigationQueryString('district', 'district-reasoning');
    expect(query).toBe('scale=district&entity=district-reasoning');
  });

  it('matches current navigation state against search string', () => {
    expect(navigationQueryMatches('galaxy', null, '?scale=galaxy')).toBe(true);
    expect(navigationQueryMatches('earth', null, '?scale=galaxy')).toBe(false);
  });

  it('reads scale and entity from search string', () => {
    expect(readNavigationFromUrl('?scale=earth')).toEqual({
      scale: 'earth',
      focusEntityId: null,
    });
    expect(
      readNavigationFromUrl('?scale=district&entity=district-reasoning'),
    ).toEqual({
      scale: 'district',
      focusEntityId: 'district-reasoning',
    });
    expect(readNavigationFromUrl('?scale=invalid')).toBeNull();
  });

  it('detects deep-link navigation params', () => {
    expect(hasNavigationUrlParams('?scale=earth')).toBe(true);
    expect(hasNavigationUrlParams('?entity=agent-sigma-7')).toBe(true);
    expect(hasNavigationUrlParams('?entry=brain-city')).toBe(false);
  });
});
