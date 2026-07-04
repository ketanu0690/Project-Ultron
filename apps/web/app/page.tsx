'use client';

import dynamic from 'next/dynamic';
import { Suspense, useRef } from 'react';

import { EarthHUD } from '@/components/hud/EarthHUD';
import { CameraZoomControls } from '@/components/hud/CameraZoomControls';
import { GalaxyHUD } from '@/components/hud/GalaxyHUD';
import { WorldShell } from '@/components/shell/WorldShell';
import { EarthStateProvider } from '@/hooks/useEarthState';
import { useGalaxyNavigation } from '@/hooks/useGalaxyNavigation';
import { useInitialNavigation } from '@/hooks/useInitialNavigation';
import { useNavigationUrlSync } from '@/hooks/useNavigationUrlSync';
import { useWorldSync } from '@/hooks/useWorldSync';
import { useScaleUrlParam } from '@/hooks/useScaleUrlParam';
import { useScrollJourney } from '@/hooks/useScrollJourney';

const WorldCanvas = dynamic(
  () => import('@/components/world/WorldCanvas').then((mod) => mod.WorldCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="bg-void-black flex h-full w-full items-center justify-center">
        <div className="text-center">
          <p className="font-display text-signal-cyan text-sm tracking-wide">
            ULTRON AI WORLD
          </p>
          <p className="text-text-secondary mt-1 text-xs">
            Loading world engine...
          </p>
        </div>
      </div>
    ),
  },
);

function ScaleUrlHandler(): null {
  useScaleUrlParam();
  return null;
}

function NavigationUrlHandler(): null {
  useNavigationUrlSync();
  return null;
}

export default function Home(): React.JSX.Element {
  const canvasHostRef = useRef<HTMLDivElement>(null);
  useInitialNavigation();
  useWorldSync();
  useGalaxyNavigation();
  useScrollJourney(canvasHostRef);

  return (
    <EarthStateProvider>
      <WorldShell>
        <Suspense fallback={null}>
          <ScaleUrlHandler />
          <NavigationUrlHandler />
        </Suspense>
        <div
          ref={canvasHostRef}
          data-testid="world-canvas-host"
          className="h-full w-full"
        >
          <WorldCanvas />
          <CameraZoomControls className="absolute bottom-4 left-4 z-20" />
          <GalaxyHUD />
          <EarthHUD />
        </div>
      </WorldShell>
    </EarthStateProvider>
  );
}
