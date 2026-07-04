'use client';

import { EARTH_RADIUS } from '@/scenes/orbital-ring/ring.constants';

const ATMOSPHERE_RADIUS = EARTH_RADIUS * 1.08;

export function EarthGlobe(): React.JSX.Element {
  return (
    <group name="earth-globe">
      <mesh>
        <sphereGeometry args={[EARTH_RADIUS, 64, 64]} />
        <meshStandardMaterial
          color="#1a4a6e"
          emissive="#0a2030"
          emissiveIntensity={0.15}
          metalness={0.1}
          roughness={0.85}
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[ATMOSPHERE_RADIUS, 48, 48]} />
        <meshBasicMaterial
          color="#4A90D9"
          transparent
          opacity={0.12}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}
