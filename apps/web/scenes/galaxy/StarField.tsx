'use client';

import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useState } from 'react';

import {
  createStarFieldMaterial,
  generateStarField,
  starFieldTimeUniform,
} from '@/scenes/galaxy/generate-star-field';

const DESKTOP_STAR_COUNT = 5_000;
const MOBILE_STAR_COUNT = 2_000;

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

export function StarField(): React.JSX.Element {
  const isMobile = useIsMobileViewport();
  const starCount = isMobile ? MOBILE_STAR_COUNT : DESKTOP_STAR_COUNT;

  const { geometry, material } = useMemo(() => {
    const { geometry: starGeometry } = generateStarField(starCount);
    const starMaterial = createStarFieldMaterial();
    return { geometry: starGeometry, material: starMaterial };
  }, [starCount]);

  useFrame(({ clock }) => {
    starFieldTimeUniform.value = clock.getElapsedTime();
  });

  useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [geometry, material]);

  return (
    <points geometry={geometry} material={material} frustumCulled={false} />
  );
}
