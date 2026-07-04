'use client';

import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef, useState } from 'react';
import type { Group, Mesh } from 'three';
import { AdditiveBlending } from 'three';

import { EntityNode } from '@/components/world/EntityNode';
import { enterBrainCity } from '@/lib/enter-brain-city';
import { EARTH_RADIUS_M } from '@/scenes/earth/earth.mock';

/** Orbital altitude — distant glowing structure, no city detail at Earth scale. */
const ORBIT_ALTITUDE = 680_000;
const ORBIT_RADIUS = EARTH_RADIUS_M + ORBIT_ALTITUDE;
const SILHOUETTE_POSITION: [number, number, number] = [
  ORBIT_RADIUS * 0.65,
  ORBIT_RADIUS * 0.35,
  ORBIT_RADIUS * 0.55,
];

export function BrainCitySilhouette(): React.JSX.Element {
  const groupRef = useRef<Group>(null);
  const glowRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const scale = EARTH_RADIUS_M * 0.00035;

  useFrame(({ clock }) => {
    if (!groupRef.current) {
      return;
    }
    const pulse = 1 + Math.sin(clock.getElapsedTime() * 1.2) * 0.06;
    groupRef.current.scale.setScalar(pulse);

    if (glowRef.current) {
      const material = glowRef.current.material;
      if (!Array.isArray(material) && 'opacity' in material) {
        material.opacity = 0.35 + Math.sin(clock.getElapsedTime() * 2) * 0.1;
      }
    }
  });

  const handleSelect = (): void => {
    enterBrainCity();
  };

  return (
    <EntityNode
      entityId="brain-city-silhouette"
      nodeType="earth_marker_node"
      outlineSize={[scale * 40, scale * 40, scale * 40]}
      onSelect={handleSelect}
    >
      <group
        ref={groupRef}
        position={SILHOUETTE_POSITION}
        onPointerOver={(event) => {
          event.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={(event) => {
          event.stopPropagation();
          setHovered(false);
        }}
      >
        {/* Distant city cluster — abstract towers, no readable detail */}
        {[0, 1, 2, 3, 4, 5].map((index) => (
          <mesh
            key={index}
            position={[
              (index - 2.5) * scale * 2.2,
              scale * (1.5 + (index % 3) * 1.8),
              (index % 2) * scale * 0.8,
            ]}
          >
            <boxGeometry
              args={[scale * 1.2, scale * (2 + (index % 4)), scale * 1.2]}
            />
            <meshBasicMaterial
              color="#FFB300"
              transparent
              opacity={0.55}
              blending={AdditiveBlending}
            />
          </mesh>
        ))}

        <mesh ref={glowRef}>
          <sphereGeometry args={[scale * 12, 16, 16]} />
          <meshBasicMaterial
            color="#FF6B35"
            transparent
            opacity={0.35}
            blending={AdditiveBlending}
          />
        </mesh>

        <Html
          center
          position={[0, scale * 22, 0]}
          distanceFactor={EARTH_RADIUS_M * 0.000012}
          style={{ pointerEvents: 'none' }}
        >
          <div
            className={`whitespace-nowrap rounded border px-3 py-2 backdrop-blur-md transition-colors ${
              hovered
                ? 'border-signal-amber/60 bg-void-black/95'
                : 'border-signal-amber/30 bg-void-black/80'
            }`}
          >
            <div className="font-display text-signal-amber text-sm tracking-wide">
              Brain City
            </div>
            <div className="text-text-secondary text-[10px]">
              {hovered
                ? 'Click to enter · Orbital megacity'
                : 'Distant orbital structure'}
            </div>
          </div>
        </Html>
      </group>
    </EntityNode>
  );
}
