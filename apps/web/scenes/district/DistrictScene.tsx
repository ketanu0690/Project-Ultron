'use client';

import { Html } from '@react-three/drei';
import { DISTRICT_COLORS } from '@ultron/shared';
import { useState } from 'react';

import { EntityNode } from '@/components/world/EntityNode';
import { getScaleTransitionController } from '@/lib/scale-transition-instance';
import { useNavigationStore } from '@/stores/navigationStore';

interface BuildingFootprint {
  readonly entityId: string;
  readonly position: readonly [number, number, number];
  readonly size: readonly [number, number, number];
  readonly isTower?: boolean;
}

const BUILDING_FOOTPRINTS: readonly BuildingFootprint[] = [
  {
    entityId: 'building-footprint-1',
    position: [-120, 2, -80],
    size: [40, 4, 30],
  },
  {
    entityId: 'building-footprint-2',
    position: [60, 2, -100],
    size: [35, 4, 35],
  },
  {
    entityId: 'building-footprint-3',
    position: [140, 2, -40],
    size: [30, 4, 28],
  },
  {
    entityId: 'building-footprint-4',
    position: [-80, 2, 40],
    size: [32, 4, 32],
  },
  {
    entityId: 'building-footprint-5',
    position: [20, 2, 60],
    size: [38, 4, 26],
  },
  {
    entityId: 'building-footprint-6',
    position: [100, 2, 90],
    size: [28, 4, 34],
  },
  {
    entityId: 'building-footprint-7',
    position: [-140, 2, 100],
    size: [36, 4, 30],
  },
  {
    entityId: 'building-footprint-8',
    position: [-40, 2, -140],
    size: [30, 4, 30],
  },
  {
    entityId: 'building-footprint-9',
    position: [160, 2, -120],
    size: [34, 4, 28],
  },
  {
    entityId: 'building-planning-tower',
    position: [0, 40, 0],
    size: [50, 80, 50],
    isTower: true,
  },
];

const reasoningColor = DISTRICT_COLORS.reasoning.primary;
const reasoningAccent = DISTRICT_COLORS.reasoning.accent;

interface BuildingMarkerProps {
  readonly building: BuildingFootprint;
}

function BuildingMarker({ building }: BuildingMarkerProps): React.JSX.Element {
  const [hovered, setHovered] = useState(false);
  const focusEntityId = useNavigationStore((state) => state.focusEntityId);
  const isFocused = focusEntityId === building.entityId;
  const isTower = building.isTower === true;

  const handleSelect = (): void => {
    if (isTower) {
      getScaleTransitionController().transitionTo('building');
      useNavigationStore.getState().setFocusEntityId(building.entityId);
    } else {
      useNavigationStore.getState().setFocusEntityId(building.entityId);
    }
  };

  const baseEmissive = isTower ? 0.4 : 0.2;
  const hoverEmissive = isTower ? 0.55 : 0.3;

  return (
    <EntityNode
      entityId={building.entityId}
      nodeType="building_node"
      parentId="district-reasoning"
      outlineSize={building.size}
      onSelect={handleSelect}
    >
      <mesh
        position={building.position}
        onPointerOver={(event) => {
          event.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={(event) => {
          event.stopPropagation();
          setHovered(false);
        }}
      >
        <boxGeometry args={building.size} />
        <meshStandardMaterial
          color={isTower ? reasoningAccent : reasoningColor}
          emissive={isTower ? reasoningAccent : reasoningColor}
          emissiveIntensity={hovered ? hoverEmissive : baseEmissive}
          metalness={isTower ? 0.6 : 0.2}
          roughness={0.4}
        />
      </mesh>

      {hovered || isFocused ? (
        <Html
          center
          position={[
            building.position[0],
            building.position[1] + building.size[1] / 2 + 4,
            building.position[2],
          ]}
          distanceFactor={80}
          style={{ pointerEvents: 'none' }}
        >
          <div className="border-signal-cyan/40 bg-void-black/90 whitespace-nowrap rounded border px-3 py-2 text-center backdrop-blur-md">
            <p className="text-text-primary text-sm font-medium">
              {isTower ? 'Planning Tower' : 'LOD Footprint'}
            </p>
            {isTower ? (
              <p className="text-signal-cyan text-xs">
                Click to enter Planning Tower
              </p>
            ) : (
              <p className="text-text-secondary text-xs">
                Enter Planning Tower to explore
              </p>
            )}
          </div>
        </Html>
      ) : null}
    </EntityNode>
  );
}

export default function DistrictScene(): React.JSX.Element {
  return (
    <group name="scale-district">
      <EntityNode
        entityId="district-reasoning"
        nodeType="district_node"
        outlineSize={[400, 2, 400]}
      >
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
          <planeGeometry args={[400, 400]} />
          <meshStandardMaterial
            color={reasoningColor}
            emissive={reasoningColor}
            emissiveIntensity={0.15}
          />
        </mesh>
      </EntityNode>

      {BUILDING_FOOTPRINTS.map((building) => (
        <BuildingMarker key={building.entityId} building={building} />
      ))}
    </group>
  );
}
