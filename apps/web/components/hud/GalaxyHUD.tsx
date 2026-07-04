'use client';

import { useGalaxyHudVisibility } from '@/hooks/useGalaxyNavigation';
import { useGalaxyMetrics } from '@/hooks/useGalaxyMetrics';

export function GalaxyHUD(): React.JSX.Element | null {
  const isVisible = useGalaxyHudVisibility();
  const { metrics, isLoading, isMockData } = useGalaxyMetrics();

  if (!isVisible) {
    return null;
  }

  const { totalAgents, systemCount, defenseAlerts, explorationPercent } =
    metrics;

  return (
    <div className="pointer-events-none absolute inset-x-0 top-4 z-10 flex flex-col items-center gap-2 px-4">
      {isLoading ? (
        <GalaxyHudSkeleton />
      ) : (
        <div className="border-steel-blue/60 bg-space-dark/80 flex gap-6 rounded-lg border px-6 py-3 backdrop-blur-sm">
          <Metric
            label="Star Systems"
            value={systemCount.toLocaleString()}
            accent="text-signal-cyan"
          />
          <Metric
            label="Exploration"
            value={`${explorationPercent}%`}
            accent="text-signal-green"
          />
          <Metric
            label="Total Agents"
            value={totalAgents.toLocaleString()}
            accent="text-signal-green"
          />
          <Metric
            label="Defense Alerts"
            value={defenseAlerts.toLocaleString()}
            accent={
              defenseAlerts > 0 ? 'text-signal-red' : 'text-text-secondary'
            }
          />
        </div>
      )}
      {isMockData && !isLoading ? (
        <p className="border-signal-amber/30 bg-void-black/70 text-signal-amber rounded border px-2 py-0.5 text-[10px] uppercase tracking-wide">
          Simulated metrics · v2 API pending
        </p>
      ) : null}
    </div>
  );
}

interface MetricProps {
  readonly label: string;
  readonly value: string;
  readonly accent: string;
}

function Metric({ label, value, accent }: MetricProps): React.JSX.Element {
  return (
    <div className="text-center">
      <div className={`font-mono text-lg font-semibold ${accent}`}>{value}</div>
      <div className="text-text-secondary text-xs">{label}</div>
    </div>
  );
}

function GalaxyHudSkeleton(): React.JSX.Element {
  return (
    <div
      className="border-steel-blue/40 bg-space-dark/60 flex gap-6 rounded-lg border px-6 py-3 backdrop-blur-sm"
      aria-busy="true"
      aria-label="Loading galaxy metrics"
    >
      {[0, 1, 2, 3].map((index) => (
        <div key={index} className="text-center">
          <div className="bg-steel-blue/40 mx-auto h-6 w-10 animate-pulse rounded" />
          <div className="bg-steel-blue/30 mt-1 h-3 w-16 animate-pulse rounded" />
        </div>
      ))}
    </div>
  );
}
