'use client';

import { COLORS } from '@ultron/shared';

import { useNavigationStore } from '@/stores/navigationStore';

export function ScaleBackground(): React.JSX.Element {
  const currentScale = useNavigationStore((state) => state.currentScale);

  if (currentScale === 'megacity' || currentScale === 'district') {
    return <color attach="background" args={['#1a0828']} />;
  }

  if (currentScale === 'earth') {
    return <color attach="background" args={['#030510']} />;
  }

  return <color attach="background" args={[COLORS.voidBlack]} />;
}
