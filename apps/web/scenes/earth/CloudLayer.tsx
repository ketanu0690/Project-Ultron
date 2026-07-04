'use client';

import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import { DoubleSide, SRGBColorSpace, type Mesh } from 'three';

import { EARTH_RADIUS_M } from '@/scenes/earth/earth.mock';
import { useEarthTextures } from '@/scenes/earth/useEarthTextures';

interface CloudLayerProps {
  readonly animate?: boolean;
}

const CLOUD_SCALE = 1.008;
const ROTATION_SPEED = 0.012;

export function CloudLayer({
  animate = true,
}: CloudLayerProps): React.JSX.Element {
  const meshRef = useRef<Mesh>(null);
  const { clouds } = useEarthTextures();

  useMemo(() => {
    clouds.colorSpace = SRGBColorSpace;
    clouds.needsUpdate = true;
  }, [clouds]);

  useFrame((_, delta) => {
    if (!animate || !meshRef.current) {
      return;
    }
    meshRef.current.rotation.y += ROTATION_SPEED * delta;
  });

  return (
    <mesh ref={meshRef} scale={CLOUD_SCALE} renderOrder={1}>
      <sphereGeometry args={[EARTH_RADIUS_M, 64, 64]} />
      <meshStandardMaterial
        map={clouds}
        transparent
        opacity={0.55}
        depthWrite={false}
        side={DoubleSide}
        color="#ffffff"
        emissive="#a8c8e8"
        emissiveIntensity={0.08}
      />
    </mesh>
  );
}
