'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import type { LatLng } from '@ultron/shared';
import type { Mesh } from 'three';
import { DoubleSide } from 'three';

import { EntityNode } from '@/components/world/EntityNode';
import { getScaleTransitionController } from '@/lib/scale-transition-instance';
import { EARTH_RADIUS_M } from '@/scenes/earth/earth.mock';
import { latLngToSurfacePosition } from '@/scenes/earth/earth-geo';

const BEACON_COLOR = '#00E5FF';
const MARKER_ALTITUDE = EARTH_RADIUS_M * 0.004;

interface MegacityBeaconProps {
  readonly coordinates: LatLng;
}

export function MegacityBeacon({
  coordinates,
}: MegacityBeaconProps): React.JSX.Element {
  const ringRef = useRef<Mesh>(null);
  const [x, y, z] = latLngToSurfacePosition(
    coordinates.lat,
    coordinates.lng,
    EARTH_RADIUS_M,
  );
  const scale = EARTH_RADIUS_M * 0.00015;
  const normal = [x, y, z].map((v) => v / EARTH_RADIUS_M) as [
    number,
    number,
    number,
  ];
  const pos: [number, number, number] = [
    x + normal[0] * MARKER_ALTITUDE,
    y + normal[1] * MARKER_ALTITUDE,
    z + normal[2] * MARKER_ALTITUDE,
  ];

  useFrame(({ clock }) => {
    if (!ringRef.current) {
      return;
    }
    const pulse = 1 + Math.sin(clock.getElapsedTime() * 2.5) * 0.2;
    ringRef.current.scale.setScalar(pulse);
  });

  const handleSelect = (): void => {
    getScaleTransitionController().transitionTo(
      'megacity',
      'earth-to-megacity',
    );
  };

  return (
    <EntityNode
      entityId="earth-megacity-beacon"
      nodeType="earth_marker_node"
      outlineSize={[scale * 6, scale * 6, scale * 6]}
      onSelect={handleSelect}
    >
      <group position={pos}>
        <mesh>
          <sphereGeometry args={[scale, 16, 16]} />
          <meshBasicMaterial color={BEACON_COLOR} transparent opacity={0.95} />
        </mesh>
        <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[scale * 1.8, scale * 2.5, 32]} />
          <meshBasicMaterial
            color={BEACON_COLOR}
            transparent
            opacity={0.5}
            side={DoubleSide}
          />
        </mesh>
        <Html
          center
          position={[0, scale * 5, 0]}
          distanceFactor={EARTH_RADIUS_M * 0.00002}
          style={{ pointerEvents: 'none' }}
        >
          <div className="border-signal-cyan/40 bg-void-black/85 text-signal-cyan whitespace-nowrap rounded border px-2 py-1 text-xs">
            <div className="font-medium">AI Megacity</div>
            <div className="text-text-secondary text-[10px]">
              Scroll down to enter
            </div>
          </div>
        </Html>
      </group>
    </EntityNode>
  );
}
