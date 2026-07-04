'use client';

import { Instances, Instance } from '@react-three/drei';
import { useMemo } from 'react';

import {
  BRAIN_CITY_BUILDINGS,
  type BuildingPlacement,
} from '@/scenes/megacity/brain-city-config';

function BuildingInstances({
  buildings,
}: {
  readonly buildings: readonly BuildingPlacement[];
}): React.JSX.Element {
  return (
    <Instances
      limit={buildings.length}
      range={buildings.length}
      raycast={() => null}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial metalness={0.65} roughness={0.35} />
      {buildings.map((building, index) => (
        <Instance
          key={`${building.districtId}-${index}`}
          position={[building.x, building.y, building.z]}
          scale={[building.width, building.height, building.depth]}
          color={building.color}
        />
      ))}
    </Instances>
  );
}

export function CityBuildings(): React.JSX.Element {
  const buildings = useMemo(() => BRAIN_CITY_BUILDINGS, []);

  return (
    <group name="city-buildings">
      <BuildingInstances buildings={buildings} />
    </group>
  );
}
