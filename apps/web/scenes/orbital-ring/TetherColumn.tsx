'use client';

import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import type { Mesh } from 'three';

import {
  angleToRingPosition,
  EARTH_RADIUS,
  RING_RADIUS,
  zoneMidpointAngle,
} from '@/scenes/orbital-ring/ring.constants';
import type { RingZone } from '@/scenes/orbital-ring/ring-zones.mock';

interface TetherColumnProps {
  readonly zone: RingZone;
}

export function TetherColumn({ zone }: TetherColumnProps): React.JSX.Element {
  const beamRef = useRef<Mesh>(null);
  const midAngle = zoneMidpointAngle(zone.angleStart, zone.angleEnd);
  const [ringX, , ringZ] = angleToRingPosition(midAngle, RING_RADIUS);

  const ringPoint = { x: ringX, y: 0, z: ringZ };
  const surfacePoint = {
    x: (ringX / RING_RADIUS) * EARTH_RADIUS,
    y: 0,
    z: (ringZ / RING_RADIUS) * EARTH_RADIUS,
  };

  const midX = (ringPoint.x + surfacePoint.x) / 2;
  const midZ = (ringPoint.z + surfacePoint.z) / 2;
  const length = Math.hypot(
    ringPoint.x - surfacePoint.x,
    ringPoint.z - surfacePoint.z,
  );
  const yaw = Math.atan2(
    ringPoint.x - surfacePoint.x,
    ringPoint.z - surfacePoint.z,
  );

  useFrame(({ clock }) => {
    const mesh = beamRef.current;
    if (!mesh) {
      return;
    }

    const material = mesh.material;
    if (!material || Array.isArray(material) || !('opacity' in material)) {
      return;
    }

    material.opacity = 0.35 + Math.sin(clock.getElapsedTime() * 2) * 0.1;
  });

  return (
    <mesh
      ref={beamRef}
      position={[midX, 0, midZ]}
      rotation={[Math.PI / 2, yaw, 0]}
      name={`tether-${zone.id}`}
    >
      <cylinderGeometry args={[2, 4, length, 8, 1, true]} />
      <meshBasicMaterial
        color="#00E5FF"
        transparent
        opacity={0.4}
        depthWrite={false}
      />
    </mesh>
  );
}
