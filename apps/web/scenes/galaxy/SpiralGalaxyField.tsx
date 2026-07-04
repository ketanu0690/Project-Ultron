'use client';

import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useState } from 'react';

import {
  createSpiralGalaxyMaterial,
  DEFAULT_SPIRAL_GALAXY_PARAMS,
  generateSpiralGalaxy,
  SPIRAL_GALAXY_WORLD_SCALE,
  spiralGalaxyTimeUniform,
} from '@/scenes/galaxy/generate-spiral-galaxy';

const DESKTOP_PARTICLE_COUNT = 20_000;
const MOBILE_PARTICLE_COUNT = 5_000;

function useIsMobileViewport(): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(max-width: 768px)');
    const update = (): void => {
      setIsMobile(query.matches);
    };

    update();
    query.addEventListener('change', update);
    return () => {
      query.removeEventListener('change', update);
    };
  }, []);

  return isMobile;
}

export function SpiralGalaxyField(): React.JSX.Element {
  const isMobile = useIsMobileViewport();
  const particleCount = isMobile
    ? MOBILE_PARTICLE_COUNT
    : DESKTOP_PARTICLE_COUNT;
  const pixelRatio = useThree((state) => state.gl.getPixelRatio());

  const { geometry, material } = useMemo(() => {
    const { geometry: spiralGeometry } = generateSpiralGalaxy({
      ...DEFAULT_SPIRAL_GALAXY_PARAMS,
      count: particleCount,
    });
    const spiralMaterial = createSpiralGalaxyMaterial(pixelRatio);
    return { geometry: spiralGeometry, material: spiralMaterial };
  }, [particleCount, pixelRatio]);

  useFrame(({ clock }) => {
    spiralGalaxyTimeUniform.value = clock.getElapsedTime();
  });

  useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [geometry, material]);

  return (
    <group
      scale={[
        SPIRAL_GALAXY_WORLD_SCALE,
        SPIRAL_GALAXY_WORLD_SCALE,
        SPIRAL_GALAXY_WORLD_SCALE,
      ]}
    >
      <points geometry={geometry} material={material} frustumCulled={false} />
    </group>
  );
}
