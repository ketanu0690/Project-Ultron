'use client';

import { useEffect, useState } from 'react';

import { getScaleTransitionController } from '@/lib/scale-transition-instance';
import { useEarthHudVisibility, useEarthState } from '@/hooks/useEarthState';
import { useNavigationStore } from '@/stores/navigationStore';

export function EarthHUD(): React.JSX.Element | null {
  const isVisible = useEarthHudVisibility();
  const { state, isLoading, isMockData } = useEarthState();
  const isTransitioning = useNavigationStore((s) => s.isTransitioning);
  const [skipReady, setSkipReady] = useState(false);

  useEffect(() => {
    if (!isTransitioning) {
      return;
    }

    const timer = window.setTimeout(() => {
      setSkipReady(true);
    }, 500);

    return () => {
      window.clearTimeout(timer);
      setSkipReady(false);
    };
  }, [isTransitioning]);

  const showSkip = isTransitioning && skipReady;

  if (!isVisible) {
    return null;
  }

  return (
    <>
      <div className="pointer-events-none absolute inset-x-0 top-4 z-10 flex flex-col items-center gap-2 px-4">
        {isLoading ? (
          <EarthHudSkeleton />
        ) : (
          <>
            <div className="border-steel-blue/60 bg-space-dark/80 flex gap-5 rounded-lg border px-5 py-3 backdrop-blur-sm">
              <HealthMetric
                label="Atmosphere"
                value={state.planetaryHealth.atmosphere.value}
              />
              <HealthMetric
                label="Biosphere"
                value={state.planetaryHealth.biosphere.value}
              />
              <HealthMetric
                label="Infrastructure"
                value={state.planetaryHealth.infrastructure.value}
              />
            </div>
            {isMockData ? (
              <p className="border-signal-amber/30 bg-void-black/70 text-signal-amber rounded border px-2 py-0.5 text-[10px] uppercase tracking-wide">
                Simulated planetary data · v1 API pending
              </p>
            ) : null}
          </>
        )}
      </div>

      {showSkip && isTransitioning ? (
        <div className="pointer-events-none absolute inset-x-0 bottom-24 z-10 flex justify-center">
          <button
            type="button"
            className="border-signal-cyan/50 bg-void-black/80 text-signal-cyan hover:bg-signal-cyan/10 pointer-events-auto rounded border px-4 py-2 text-sm"
            onClick={() => getScaleTransitionController().skipTransition()}
          >
            Skip transition
          </button>
        </div>
      ) : null}
    </>
  );
}

function HealthMetric({
  label,
  value,
}: {
  readonly label: string;
  readonly value: number;
}): React.JSX.Element {
  return (
    <div className="text-center">
      <div className="text-signal-green font-mono text-lg font-semibold">
        {value}
      </div>
      <div className="text-text-secondary text-xs">{label}</div>
    </div>
  );
}

function EarthHudSkeleton(): React.JSX.Element {
  return (
    <div
      className="border-steel-blue/40 bg-space-dark/60 flex gap-5 rounded-lg border px-5 py-3 backdrop-blur-sm"
      aria-busy="true"
      aria-label="Loading planetary data"
    >
      {[0, 1, 2].map((index) => (
        <div key={index} className="text-center">
          <div className="bg-steel-blue/40 mx-auto h-6 w-10 animate-pulse rounded" />
          <div className="bg-steel-blue/30 mt-1 h-3 w-16 animate-pulse rounded" />
        </div>
      ))}
    </div>
  );
}
