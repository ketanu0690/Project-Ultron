'use client';

import { BRAIN_CITY_DISTRICTS } from '@/scenes/megacity/brain-city-config';
import { CityBuildings } from '@/scenes/megacity/CityBuildings';
import { FloatingDistrictIsland } from '@/scenes/megacity/FloatingDistrictIsland';
import { FlyingTraffic } from '@/scenes/megacity/FlyingTraffic';
import { MegacityAtmosphere } from '@/scenes/megacity/MegacityAtmosphere';
import { SkyHighways } from '@/scenes/megacity/SkyHighways';
import { VolumetricCloudField } from '@/scenes/megacity/VolumetricCloudField';

export default function MegacityScene(): React.JSX.Element {
  return (
    <group name="scale-megacity">
      <MegacityAtmosphere />
      <VolumetricCloudField />
      <CityBuildings />
      <SkyHighways />
      <FlyingTraffic />
      {BRAIN_CITY_DISTRICTS.map((district) => (
        <FloatingDistrictIsland key={district.entityId} config={district} />
      ))}
    </group>
  );
}
