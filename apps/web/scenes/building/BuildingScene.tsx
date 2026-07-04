'use client';

import { Html } from '@react-three/drei';
import { DISTRICT_COLORS } from '@ultron/shared';
import { useState } from 'react';

import { EntityNode } from '@/components/world/EntityNode';
import { getScaleTransitionController } from '@/lib/scale-transition-instance';
import { useNavigationStore } from '@/stores/navigationStore';

const towerColor = DISTRICT_COLORS.reasoning.primary;
const windowColor = DISTRICT_COLORS.reasoning.accent;

const WINDOW_ROWS = 12;
const WINDOW_COLS = 4;
const TOWER_WIDTH = 50;
const TOWER_HEIGHT = 80;
const TOWER_DEPTH = 50;

export default function BuildingScene(): React.JSX.Element {
  const [hovered, setHovered] = useState(false);
  const focusEntityId = useNavigationStore((state) => state.focusEntityId);
  const isFocused = focusEntityId === 'building-planning-tower';

  const handleEnter = (): void => {
    getScaleTransitionController().transitionTo('room');
    useNavigationStore.getState().setFocusEntityId('room-strategy');
  };

  return (
    <group name="scale-building">
      <EntityNode
        entityId="building-planning-tower"
        nodeType="building_node"
        outlineSize={[TOWER_WIDTH, TOWER_HEIGHT, TOWER_DEPTH]}
        onSelect={handleEnter}
      >
        <mesh
          position={[0, TOWER_HEIGHT / 2, 0]}
          onPointerOver={(event) => {
            event.stopPropagation();
            setHovered(true);
          }}
          onPointerOut={(event) => {
            event.stopPropagation();
            setHovered(false);
          }}
        >
          <boxGeometry args={[TOWER_WIDTH, TOWER_HEIGHT, TOWER_DEPTH]} />
          <meshStandardMaterial
            color={towerColor}
            emissive={towerColor}
            emissiveIntensity={hovered ? 0.35 : 0.2}
            metalness={0.5}
            roughness={0.35}
          />
        </mesh>

        {Array.from({ length: WINDOW_ROWS }, (_, row) =>
          Array.from({ length: WINDOW_COLS }, (_, col) => {
            const x = (col - (WINDOW_COLS - 1) / 2) * 10;
            const y = 8 + row * 6;
            return (
              <mesh
                key={`${row}-${col}`}
                position={[x, y, TOWER_DEPTH / 2 + 0.1]}
              >
                <planeGeometry args={[6, 4]} />
                <meshStandardMaterial
                  color={windowColor}
                  emissive={windowColor}
                  emissiveIntensity={0.3 + (row % 3) * 0.15}
                />
              </mesh>
            );
          }),
        )}

        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
          <planeGeometry args={[200, 200]} />
          <meshStandardMaterial color="#1A2332" />
        </mesh>

        {hovered || isFocused ? (
          <Html
            center
            position={[0, TOWER_HEIGHT + 8, 0]}
            distanceFactor={60}
            style={{ pointerEvents: 'none' }}
          >
            <div className="border-signal-cyan/40 bg-void-black/90 whitespace-nowrap rounded border px-3 py-2 text-center backdrop-blur-md">
              <p className="text-text-primary text-sm font-medium">
                Planning Tower
              </p>
              <p className="text-signal-cyan text-xs">
                Click to enter Strategy Room
              </p>
            </div>
          </Html>
        ) : null}
      </EntityNode>
    </group>
  );
}
