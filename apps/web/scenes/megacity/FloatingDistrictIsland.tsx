'use client';

import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef, useState } from 'react';
import type { Mesh } from 'three';

import { EntityNode } from '@/components/world/EntityNode';
import { getCameraController } from '@/lib/camera-controller-instance';
import { getScaleTransitionController } from '@/lib/scale-transition-instance';
import { useNavigationStore } from '@/stores/navigationStore';
import type { BrainCityDistrictConfig } from '@/scenes/megacity/brain-city-config';

interface FloatingDistrictIslandProps {
  readonly config: BrainCityDistrictConfig;
}

export function FloatingDistrictIsland({
  config,
}: FloatingDistrictIslandProps): React.JSX.Element {
  const [hovered, setHovered] = useState(false);
  const waterfallRef = useRef<Mesh>(null);
  const focusEntityId = useNavigationStore((state) => state.focusEntityId);
  const isFocused = focusEntityId === config.entityId;
  const [cx, cy, cz] = config.position;
  const { palette } = config;

  useFrame(({ clock }) => {
    if (waterfallRef.current) {
      waterfallRef.current.position.y =
        cy - 40 + Math.sin(clock.getElapsedTime() * 2) * 2;
    }
  });

  const handleEnter = (): void => {
    const store = useNavigationStore.getState();
    store.setScrollJourneyComplete(true);
    getCameraController().setWheelDollyEnabled(true);
    getScaleTransitionController().transitionTo(
      'district',
      'megacity-to-district',
    );
    store.setFocusEntityId(config.entityId);
  };

  return (
    <EntityNode
      entityId={config.entityId}
      nodeType="district_node"
      position={[cx, cy, cz]}
      outlineSize={[config.islandRadius * 2, 80, config.islandRadius * 2]}
      onSelect={handleEnter}
    >
      {/* Island base — floating landmass */}
      <mesh
        position={[0, -30, 0]}
        onClick={(event) => {
          event.stopPropagation();
          handleEnter();
        }}
        onPointerOver={(event) => {
          event.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={(event) => {
          event.stopPropagation();
          setHovered(false);
        }}
      >
        <cylinderGeometry
          args={[config.islandRadius, config.islandRadius * 0.75, 60, 48]}
        />
        <meshStandardMaterial
          color="#2a3a2a"
          emissive={palette.emissive}
          emissiveIntensity={hovered || isFocused ? 0.15 : 0.05}
          roughness={0.85}
          metalness={0.1}
        />
      </mesh>

      {/* Terraced green crown */}
      <mesh position={[0, 10, 0]}>
        <cylinderGeometry
          args={[config.islandRadius * 0.95, config.islandRadius, 20, 48]}
        />
        <meshStandardMaterial
          color="#1a4a2a"
          emissive="#06D6A0"
          emissiveIntensity={0.08}
          roughness={0.9}
        />
      </mesh>

      {/* Core district glow pillar */}
      <mesh position={[0, 80, 0]}>
        <cylinderGeometry
          args={[
            config.islandRadius * 0.08,
            config.islandRadius * 0.15,
            160,
            16,
          ]}
        />
        <meshStandardMaterial
          color={palette.primary}
          emissive={palette.glow}
          emissiveIntensity={config.highlighted ? 0.8 : 0.45}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* Landmark crystals / antennas per district type */}
      {config.entityId === 'district-memory'
        ? [0, 1, 2].map((index) => (
            <mesh
              key={index}
              position={[(index - 1) * 80, 120, (index - 1) * 40]}
              rotation={[0, index, 0]}
            >
              <octahedronGeometry args={[35, 0]} />
              <meshStandardMaterial
                color={palette.accent}
                emissive={palette.glow}
                emissiveIntensity={0.7}
                transparent
                opacity={0.8}
              />
            </mesh>
          ))
        : null}

      {config.entityId === 'district-action'
        ? [0, 1].map((index) => (
            <mesh key={index} position={[(index - 0.5) * 120, 140, 0]}>
              <cylinderGeometry args={[4, 8, 200, 8]} />
              <meshStandardMaterial
                color={palette.primary}
                emissive={palette.glow}
                emissiveIntensity={0.6}
              />
            </mesh>
          ))
        : null}

      {/* Cascading waterfall off island edge */}
      <mesh
        ref={waterfallRef}
        position={[config.islandRadius * 0.6, -40, 0]}
        rotation={[0, 0, 0.15]}
      >
        <planeGeometry args={[40, 120]} />
        <meshBasicMaterial color="#67E8F9" transparent opacity={0.35} />
      </mesh>

      {/* Transit ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 50, 0]}>
        <torusGeometry args={[config.islandRadius * 0.85, 6, 8, 64]} />
        <meshStandardMaterial
          color={palette.accent}
          emissive={palette.glow}
          emissiveIntensity={0.5}
        />
      </mesh>

      {(hovered || isFocused) && (
        <Html
          center
          position={[0, 220, 0]}
          distanceFactor={800}
          style={{ pointerEvents: 'none' }}
        >
          <div className="border-signal-cyan/40 bg-void-black/90 whitespace-nowrap rounded border px-3 py-2 text-center backdrop-blur-md">
            <p className="text-text-primary text-sm font-medium">
              {config.label}
            </p>
            <p className="text-signal-cyan text-xs">{config.subtitle}</p>
            <p className="text-text-secondary mt-1 text-[10px]">
              Click to explore district
            </p>
          </div>
        </Html>
      )}
    </EntityNode>
  );
}
