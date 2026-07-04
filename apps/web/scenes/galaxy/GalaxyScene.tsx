'use client';

import { JourneyNebulaBackground } from '@/scenes/galaxy/JourneyNebulaBackground';
import { SpiralGalaxyField } from '@/scenes/galaxy/SpiralGalaxyField';
import { StarSystemMarker } from '@/scenes/galaxy/StarSystemMarker';
import { MOCK_STAR_SYSTEMS } from '@/scenes/galaxy/star-systems.mock';

const SOL_SYSTEM = MOCK_STAR_SYSTEMS.find((system) => system.id === 'star-sol');

export default function GalaxyScene(): React.JSX.Element {
  return (
    <group name="scale-galaxy">
      <JourneyNebulaBackground />
      <SpiralGalaxyField />
      {SOL_SYSTEM ? <StarSystemMarker system={SOL_SYSTEM} /> : null}
      <ambientLight color="#1A0A2E" intensity={0.4} />
      <pointLight
        position={[0, 0, 0]}
        color="#FFD700"
        intensity={1.5}
        distance={20}
      />
    </group>
  );
}
