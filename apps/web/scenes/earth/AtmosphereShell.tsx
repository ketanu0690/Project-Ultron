'use client';

import { useMemo } from 'react';
import { useFrame } from '@react-three/fiber';

import { EARTH_RADIUS_M } from '@/scenes/earth/earth.mock';
import {
  createAtmosphereMaterial,
  createAtmosphereUniforms,
} from '@/shaders/atmosphere';

interface AtmosphereShellProps {
  readonly sunDirection: readonly [number, number, number];
  readonly enabled?: boolean;
}

const ATMOSPHERE_SCALE = 1.02;

export function AtmosphereShell({
  sunDirection,
  enabled = true,
}: AtmosphereShellProps): React.JSX.Element | null {
  const uniforms = useMemo(() => createAtmosphereUniforms(), []);
  const material = useMemo(
    () => createAtmosphereMaterial(uniforms),
    [uniforms],
  );

  useFrame(() => {
    uniforms.sunDirection.value.set(...sunDirection);
  });

  if (!enabled) {
    return null;
  }

  return (
    <mesh
      material={material}
      scale={ATMOSPHERE_SCALE}
      renderOrder={2}
      raycast={() => null}
    >
      <sphereGeometry args={[EARTH_RADIUS_M, 64, 64]} />
    </mesh>
  );
}
