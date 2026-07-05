'use client';

import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import type { Mesh } from 'three';

import { useIsMobileEarth } from '@/hooks/useIsMobileEarth';
import { EARTH_RADIUS_M } from '@/scenes/earth/earth.mock';
import { useEarthTextures } from '@/scenes/earth/useEarthTextures';
import { createEarthGlobeMaterial } from '@/shaders/earth-globe';

interface EarthGlobeProps {
  readonly sunDirection: readonly [number, number, number];
  readonly vitality?: number;
}

const DESKTOP_SEGMENTS = 96;
const MOBILE_SEGMENTS = 64;

export function EarthGlobe({
  sunDirection,
  vitality = 0.72,
}: EarthGlobeProps): React.JSX.Element {
  const meshRef = useRef<Mesh>(null);
  const isMobile = useIsMobileEarth();
  const textures = useEarthTextures();
  const segments = isMobile ? MOBILE_SEGMENTS : DESKTOP_SEGMENTS;

  const material = useMemo(
    () =>
      createEarthGlobeMaterial(
        textures.day,
        textures.night,
        textures.specular,
        sunDirection,
        vitality,
      ),
    [textures.day, textures.night, textures.specular, sunDirection, vitality],
  );

  useFrame(() => {
    const sunUniform = material.uniforms.sunDirection;
    if (sunUniform?.value) {
      sunUniform.value.set(...sunDirection);
    }
  });

  return (
    <mesh ref={meshRef} material={material} renderOrder={0}>
      <sphereGeometry args={[EARTH_RADIUS_M, segments, segments]} />
    </mesh>
  );
}
