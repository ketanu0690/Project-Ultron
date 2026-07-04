/** Pure scroll-journey wheel gating — testable without R3F / store mocks. */

export type ScrollWheelJourneyAction =
  'delegate_dolly' | 'consume_idle' | 'consume_advance';

export function resolveScrollWheelJourneyAction(
  deltaY: number,
  isDollyAtMin: boolean,
  isDollyAtMax: boolean,
  scrollJourneyStepIndex: number,
): ScrollWheelJourneyAction {
  const zoomIn = deltaY > 0;
  const zoomOut = deltaY < 0;

  if (zoomIn && !isDollyAtMin) {
    return 'delegate_dolly';
  }

  if (zoomOut && !isDollyAtMax) {
    return 'delegate_dolly';
  }

  if (zoomOut && scrollJourneyStepIndex <= 0) {
    return 'consume_idle';
  }

  return 'consume_advance';
}

export function isAtDollyMin(
  distance: number,
  minDistance: number,
  epsilon = 0.08,
): boolean {
  return distance <= minDistance + epsilon;
}

export function isAtDollyMax(
  distance: number,
  maxDistance: number,
  epsilon = 0.08,
): boolean {
  return distance >= maxDistance - epsilon;
}
