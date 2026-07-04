'use client';

import { useMemo } from 'react';

import { useIsMobileEarth } from '@/hooks/useIsMobileEarth';
import { useEarthState } from '@/hooks/useEarthState';
import { sunDirectionFromAngle } from '@/scenes/earth/earth-geo';
import { AtmosphereShell } from '@/scenes/earth/AtmosphereShell';
import { BrainCitySilhouette } from '@/scenes/earth/BrainCitySilhouette';
import { CloudLayer } from '@/scenes/earth/CloudLayer';
import { EarthGlobe } from '@/scenes/earth/EarthGlobe';
import { OrbitalInfrastructure } from '@/scenes/earth/OrbitalInfrastructure';
import { OrbitalRingBand } from '@/scenes/earth/OrbitalRingBand';
import { SpaceEnvironment } from '@/scenes/earth/SpaceEnvironment';
import { SunLight } from '@/scenes/earth/SunLight';

export default function EarthScene(): React.JSX.Element {
  const { sunAngle } = useEarthState();
  const isMobile = useIsMobileEarth();

  const sunDirection = useMemo(
    () => sunDirectionFromAngle(sunAngle),
    [sunAngle],
  );

  const vitality = useMemo(() => 0.72, []);

  return (
    <group name="scale-earth">
      <SpaceEnvironment />
      <ambientLight color="#0a1428" intensity={0.12} />
      <hemisphereLight args={['#1a3050', '#020408', 0.35]} />
      <SunLight sunAngle={sunAngle} />
      <EarthGlobe sunDirection={sunDirection} vitality={vitality} />
      <AtmosphereShell sunDirection={sunDirection} enabled={!isMobile} />
      <CloudLayer animate={!isMobile} />
      <OrbitalRingBand />
      <OrbitalInfrastructure />
      <BrainCitySilhouette />
    </group>
  );
}
