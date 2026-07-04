'use client';

import { Html } from '@react-three/drei';
import { DISTRICT_COLORS } from '@ultron/shared';
import { useState } from 'react';

import { EntityNode } from '@/components/world/EntityNode';
import { getScaleTransitionController } from '@/lib/scale-transition-instance';
import { useNavigationStore } from '@/stores/navigationStore';

interface RoomConfig {
  readonly entityId: string;
  readonly label: string;
  readonly position: readonly [number, number, number];
  readonly size: readonly [number, number, number];
  readonly enterable?: boolean;
}

const ROOMS: readonly RoomConfig[] = [
  {
    entityId: 'room-strategy',
    label: 'Strategy Room',
    position: [-25, 4, 0],
    size: [20, 8, 20],
    enterable: true,
  },
  {
    entityId: 'room-plan-vault',
    label: 'Plan Vault',
    position: [0, 4, 0],
    size: [20, 8, 20],
  },
  {
    entityId: 'room-observation-deck',
    label: 'Observation Deck',
    position: [25, 4, 0],
    size: [20, 8, 20],
  },
];

const roomColor = DISTRICT_COLORS.reasoning.secondary;

interface RoomZoneProps {
  readonly room: RoomConfig;
}

function RoomZone({ room }: RoomZoneProps): React.JSX.Element {
  const [hovered, setHovered] = useState(false);
  const focusEntityId = useNavigationStore((state) => state.focusEntityId);
  const isFocused = focusEntityId === room.entityId;
  const isEnterable = room.enterable === true;

  const handleSelect = (): void => {
    if (isEnterable) {
      getScaleTransitionController().transitionTo('agent');
      useNavigationStore.getState().setFocusEntityId('agent-sigma-7');
    } else {
      useNavigationStore.getState().setFocusEntityId(room.entityId);
    }
  };

  return (
    <EntityNode
      entityId={room.entityId}
      nodeType="room_node"
      parentId="building-planning-tower"
      outlineSize={room.size}
      onSelect={handleSelect}
    >
      <mesh
        position={room.position}
        onPointerOver={(event) => {
          event.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={(event) => {
          event.stopPropagation();
          setHovered(false);
        }}
      >
        <boxGeometry args={room.size} />
        <meshStandardMaterial
          color={roomColor}
          emissive={roomColor}
          emissiveIntensity={hovered ? 0.3 : 0.15}
          transparent
          opacity={0.85}
        />
      </mesh>
      <Html
        position={[
          room.position[0],
          room.position[1] + room.size[1] / 2 + 2,
          room.position[2],
        ]}
        center
        distanceFactor={12}
        style={{ pointerEvents: 'none' }}
      >
        <span className="bg-void-black/80 text-text-primary whitespace-nowrap rounded px-2 py-1 text-xs">
          {room.label}
        </span>
      </Html>

      {isEnterable && (hovered || isFocused) ? (
        <Html
          position={[
            room.position[0],
            room.position[1] + room.size[1] / 2 + 6,
            room.position[2],
          ]}
          center
          distanceFactor={12}
          style={{ pointerEvents: 'none' }}
        >
          <div className="border-signal-cyan/40 bg-void-black/90 whitespace-nowrap rounded border px-3 py-2 text-center backdrop-blur-md">
            <p className="text-signal-cyan text-xs">
              Click to meet Analyst Sigma-7
            </p>
          </div>
        </Html>
      ) : null}
    </EntityNode>
  );
}

export default function RoomScene(): React.JSX.Element {
  return (
    <group name="scale-room">
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[100, 60]} />
        <meshStandardMaterial color="#1A2332" />
      </mesh>

      {ROOMS.map((room) => (
        <RoomZone key={room.entityId} room={room} />
      ))}
    </group>
  );
}
