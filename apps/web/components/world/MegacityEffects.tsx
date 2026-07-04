'use client';

import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';

import { useNavigationStore } from '@/stores/navigationStore';

export function MegacityEffects(): React.JSX.Element | null {
  const currentScale = useNavigationStore((state) => state.currentScale);

  if (currentScale !== 'megacity' && currentScale !== 'district') {
    return null;
  }

  return (
    <EffectComposer multisampling={0}>
      <Bloom
        intensity={0.75}
        luminanceThreshold={0.35}
        luminanceSmoothing={0.9}
        mipmapBlur
      />
      <Vignette eskil offset={0.15} darkness={0.55} />
    </EffectComposer>
  );
}
