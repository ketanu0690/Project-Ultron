'use client';

import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import type { Group } from 'three';

import { EarthGlobe } from '@/scenes/orbital-ring/EarthGlobe';
import { RingSegments } from '@/scenes/orbital-ring/RingSegments';
import { RingZoneMarker } from '@/scenes/orbital-ring/RingZoneMarker';
import { TetherColumn } from '@/scenes/orbital-ring/TetherColumn';
import { RING_ROTATION_SPEED } from '@/scenes/orbital-ring/ring.constants';
import {
  MOCK_RING_ZONES,
  PRIMARY_UPLINK_ZONES,
} from '@/scenes/orbital-ring/ring-zones.mock';

export default function OrbitalRingScene(): React.JSX.Element {
  const ringGroupRef = useRef<Group>(null);

  useFrame((_state, delta) => {
    const ringGroup = ringGroupRef.current;
    if (!ringGroup) {
      return;
    }

    ringGroup.rotation.y += RING_ROTATION_SPEED * delta;
  });

  return (
    <group name="scale-orbital_ring">
      <EarthGlobe />
      <group ref={ringGroupRef}>
        <RingSegments zones={MOCK_RING_ZONES} />
        {PRIMARY_UPLINK_ZONES.map((zone) => (
          <TetherColumn key={zone.id} zone={zone} />
        ))}
        {MOCK_RING_ZONES.map((zone) => (
          <RingZoneMarker key={zone.id} zone={zone} />
        ))}
      </group>
      <ambientLight intensity={0.25} />
      <pointLight
        position={[0, 0, 0]}
        intensity={1.2}
        color="#4A90D9"
        distance={2000}
      />
      <directionalLight
        position={[400, 600, 200]}
        intensity={0.5}
        color="#00E5FF"
      />
    </group>
  );
}
