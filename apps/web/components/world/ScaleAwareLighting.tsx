'use client';

import { useNavigationStore } from '@/stores/navigationStore';

export function ScaleAwareLighting(): React.JSX.Element | null {
  const currentScale = useNavigationStore((state) => state.currentScale);

  if (currentScale === 'galaxy') {
    return null;
  }

  if (currentScale === 'megacity' || currentScale === 'district') {
    return null;
  }

  if (currentScale === 'earth') {
    return (
      <>
        <ambientLight intensity={0.25} color="#8899CC" />
        <directionalLight
          position={[1e8, 5e7, 2e8]}
          intensity={1.2}
          color="#FFD4A0"
        />
      </>
    );
  }

  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight position={[400, 800, 200]} intensity={0.8} />
    </>
  );
}
