'use client';

import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import type { StarSystem } from '@ultron/shared';
import { useRef, useState } from 'react';
import type { Mesh } from 'three';
import { DoubleSide } from 'three';

import { EntityNode } from '@/components/world/EntityNode';
import { getScaleTransitionController } from '@/lib/scale-transition-instance';

const STATUS_COLORS = {
  active: '#FFD700',
  scanned: '#00E5FF',
  none: '#8899AA',
} as const;

const STATUS_LABELS = {
  active: 'Active civilization',
  scanned: 'Scanned',
  none: 'Unexplored',
} as const;

const MARKER_SIZES = {
  active: 8e18,
  scanned: 5e18,
  none: 3e18,
} as const;

interface StarSystemMarkerProps {
  readonly system: StarSystem;
}

export function StarSystemMarker({
  system,
}: StarSystemMarkerProps): React.JSX.Element {
  const meshRef = useRef<Mesh>(null);
  const ringRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const isSol = system.id === 'star-sol';
  const isActive = system.civilizationStatus === 'active';
  const color = STATUS_COLORS[system.civilizationStatus];
  const markerSize = isSol ? 12e18 : MARKER_SIZES[system.civilizationStatus];
  const { x, y, z } = system.position;

  useFrame(({ clock }) => {
    if (!isActive || !ringRef.current) {
      return;
    }

    const pulse = 1 + Math.sin(clock.getElapsedTime() * 2) * 0.15;
    ringRef.current.scale.setScalar(pulse);
  });

  return (
    <EntityNode
      entityId={system.id}
      nodeType="star_system_node"
      outlineSize={[markerSize * 2, markerSize * 2, markerSize * 2]}
      onDoubleClick={() => {
        if (isSol) {
          getScaleTransitionController().transitionTo('solar_system');
        }
      }}
    >
      <group
        position={[x, y, z]}
        onPointerOver={(event) => {
          event.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={(event) => {
          event.stopPropagation();
          setHovered(false);
        }}
      >
        <mesh ref={meshRef}>
          <sphereGeometry args={[markerSize, 16, 16]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={isSol ? 1 : 0.85}
          />
        </mesh>

        {isActive ? (
          <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[markerSize * 1.5, markerSize * 2, 32]} />
            <meshBasicMaterial
              color="#FFD700"
              transparent
              opacity={0.5}
              side={DoubleSide}
            />
          </mesh>
        ) : null}

        {isSol || hovered ? (
          <Html
            center
            position={[0, markerSize * 2, 0]}
            distanceFactor={markerSize * 0.0000000001}
            style={{ pointerEvents: 'none' }}
          >
            <div className="border-signal-cyan/30 bg-void-black/85 text-text-primary whitespace-nowrap rounded border px-2 py-1 text-xs">
              <div className="font-medium">{system.name}</div>
              {!isSol && system.distanceFromSolLy !== undefined ? (
                <div className="text-text-secondary">
                  {system.distanceFromSolLy.toFixed(1)} ly ·{' '}
                  {STATUS_LABELS[system.civilizationStatus]}
                </div>
              ) : (
                <div className="text-signal-amber">
                  {STATUS_LABELS[system.civilizationStatus]}
                </div>
              )}
            </div>
          </Html>
        ) : null}
      </group>
    </EntityNode>
  );
}
