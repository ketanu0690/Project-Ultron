import { describe, expect, it } from 'vitest';

import {
  isAtDollyMax,
  isAtDollyMin,
  resolveScrollWheelJourneyAction,
} from '@/lib/scroll-journey-wheel';

describe('scroll-journey-wheel', () => {
  describe('resolveScrollWheelJourneyAction', () => {
    it('delegates zoom-in to camera when not at min dolly', () => {
      expect(resolveScrollWheelJourneyAction(120, false, false, 0)).toBe(
        'delegate_dolly',
      );
    });

    it('delegates zoom-out to camera when not at max dolly', () => {
      expect(resolveScrollWheelJourneyAction(-120, true, false, 1)).toBe(
        'delegate_dolly',
      );
    });

    it('consumes idle scroll-up at galaxy overview without advancing', () => {
      expect(resolveScrollWheelJourneyAction(-120, false, true, 0)).toBe(
        'consume_idle',
      );
    });

    it('advances when zoomed in at min on galaxy', () => {
      expect(resolveScrollWheelJourneyAction(120, true, false, 0)).toBe(
        'consume_advance',
      );
    });

    it('advances when zoomed out at max on earth', () => {
      expect(resolveScrollWheelJourneyAction(-120, false, true, 1)).toBe(
        'consume_advance',
      );
    });
  });

  describe('dolly limit helpers', () => {
    it('detects min and max within epsilon', () => {
      expect(isAtDollyMin(0.8, 0.75)).toBe(true);
      expect(isAtDollyMin(1.0, 0.75)).toBe(false);
      expect(isAtDollyMax(13.95, 14)).toBe(true);
      expect(isAtDollyMax(12, 14)).toBe(false);
    });
  });
});
