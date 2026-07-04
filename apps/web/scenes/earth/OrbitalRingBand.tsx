'use client';

import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import type { Mesh } from 'three';
import { DoubleSide } from 'three';

import { EARTH_RADIUS_M } from '@/scenes/earth/earth.mock';

const RING_ALTITUDE = 200_000;
const RING_RADIUS = EARTH_RADIUS_M + RING_ALTITUDE;
const FADE_START = EARTH_RADIUS_M * 3;
const FADE_END = EARTH_RADIUS_M * 1.5;

export function OrbitalRingBand(): React.JSX.Element {
  const meshRef = useRef<Mesh>(null);
  const { camera } = useThree();

  useFrame(() => {
    if (!meshRef.current) {
      return;
    }

    const distance = camera.position.length();
    const opacity =
      distance > FADE_START
        ? 0.6
        : distance < FADE_END
          ? 0
          : ((distance - FADE_END) / (FADE_START - FADE_END)) * 0.6;

    const material = meshRef.current.material;
    if (Array.isArray(material)) {
      return;
    }
    material.opacity = opacity;
    material.transparent = true;
  });

  return (
    <mesh ref={meshRef} rotation={[Math.PI / 2, 0, 0]}>
      <ringGeometry args={[RING_RADIUS - 50000, RING_RADIUS + 50000, 128]} />
      <meshBasicMaterial
        color="#00E5FF"
        transparent
        opacity={0.4}
        side={DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
}
