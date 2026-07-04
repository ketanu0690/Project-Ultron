'use client';

import { useMemo } from 'react';
import { AdditiveBlending, Vector3 } from 'three';

import { EARTH_RADIUS_M } from '@/scenes/earth/earth.mock';
import { sunPositionFromAngle } from '@/scenes/earth/earth-geo';

interface SunLightProps {
  readonly sunAngle: number;
}

const SUN_DISTANCE = EARTH_RADIUS_M * 5;
const SUN_RADIUS = EARTH_RADIUS_M * 0.12;

export function SunLight({ sunAngle }: SunLightProps): React.JSX.Element {
  const position = useMemo(() => {
    const [x, y, z] = sunPositionFromAngle(sunAngle, SUN_DISTANCE);
    return new Vector3(x, y, z);
  }, [sunAngle]);

  return (
    <group>
      <directionalLight
        position={[position.x, position.y, position.z]}
        color="#FFF4E0"
        intensity={2.2}
        castShadow={false}
      />
      <mesh
        position={[position.x, position.y, position.z]}
        raycast={() => null}
      >
        <sphereGeometry args={[SUN_RADIUS, 32, 32]} />
        <meshBasicMaterial color="#FFF8E7" />
      </mesh>
      <mesh
        position={[position.x, position.y, position.z]}
        raycast={() => null}
      >
        <sphereGeometry args={[SUN_RADIUS * 1.8, 32, 32]} />
        <meshBasicMaterial
          color="#FFD080"
          transparent
          opacity={0.18}
          blending={AdditiveBlending}
        />
      </mesh>
    </group>
  );
}
