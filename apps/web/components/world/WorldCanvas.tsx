'use client';

import { Canvas } from '@react-three/fiber';
import { ACESFilmicToneMapping, SRGBColorSpace } from 'three';

import { CameraRig } from '@/components/world/CameraRig';
import { EarthCoreTransitionWatcher } from '@/components/world/EarthCoreTransitionWatcher';
import { GalaxyCoreTransitionWatcher } from '@/components/world/GalaxyCoreTransitionWatcher';
import { MegacityEffects } from '@/components/world/MegacityEffects';
import { ScaleAwareLighting } from '@/components/world/ScaleAwareLighting';
import { ScaleBackground } from '@/components/world/ScaleBackground';
import { SceneRouter } from '@/components/world/SceneRouter';
import { TransitionFlightEffects } from '@/components/world/TransitionFlightEffects';

export function WorldCanvas(): React.JSX.Element {
  return (
    <Canvas
      className="h-full w-full"
      gl={{
        powerPreference: 'high-performance',
        antialias: true,
        toneMapping: ACESFilmicToneMapping,
        outputColorSpace: SRGBColorSpace,
      }}
      dpr={[1, 2]}
      shadows
      onCreated={({ gl }) => {
        gl.toneMappingExposure = 1.25;
      }}
    >
      <ScaleBackground />
      <ScaleAwareLighting />
      <SceneRouter />
      <TransitionFlightEffects />
      <MegacityEffects />
      <CameraRig />
      <GalaxyCoreTransitionWatcher />
      <EarthCoreTransitionWatcher />
    </Canvas>
  );
}
