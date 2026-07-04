'use client';

import { MAX_AGENTS_MVP, type ScaleLevel } from '@ultron/shared';

import { HudMetric } from '@/components/hud/HudMetric';
import { useEarthState } from '@/hooks/useEarthState';
import { useGalaxyMetrics } from '@/hooks/useGalaxyMetrics';
import {
  getEntityDetail,
  SCALE_LABELS,
  type ShellMetric,
} from '@/lib/shell-data';
import { useNavigationStore } from '@/stores/navigationStore';
import { useWorldStore } from '@/stores/worldStore';

function getMetricsForScale(
  scale: ScaleLevel,
  focusEntityId: string | null,
  aggregates: {
    districtCount: number;
    totalAgents: number;
    cityProsperity: number;
  },
  isHydrated: boolean,
  galaxyMetrics: {
    totalAgents: number;
    systemCount: number;
    explorationPercent: number;
  },
  earthHealth: {
    atmosphere: number;
    biosphere: number;
    infrastructure: number;
  },
): readonly ShellMetric[] {
  const entity = getEntityDetail(focusEntityId);

  switch (scale) {
    case 'galaxy': {
      const { totalAgents, systemCount, explorationPercent } = galaxyMetrics;
      return [
        {
          label: 'Star Systems',
          value: systemCount.toLocaleString(),
          accent: 'text-signal-cyan',
        },
        {
          label: 'Exploration',
          value: `${explorationPercent}%`,
          accent: 'text-signal-green',
        },
        {
          label: 'Total Agents',
          value: totalAgents.toLocaleString(),
          accent: 'text-signal-green',
        },
      ];
    }
    case 'earth': {
      return [
        {
          label: 'Atmosphere',
          value: String(earthHealth.atmosphere),
          accent: 'text-signal-green',
        },
        {
          label: 'Biosphere',
          value: String(earthHealth.biosphere),
          accent: 'text-signal-green',
        },
        {
          label: 'Infrastructure',
          value: String(earthHealth.infrastructure),
          accent: 'text-signal-cyan',
        },
      ];
    }
    case 'megacity':
      return isHydrated
        ? [
            {
              label: 'Districts',
              value: String(aggregates.districtCount),
              accent: 'text-signal-cyan',
            },
            {
              label: 'Total Agents',
              value: String(aggregates.totalAgents),
              accent: 'text-signal-green',
            },
            {
              label: 'City Prosperity',
              value: `${aggregates.cityProsperity.toFixed(1)}%`,
              accent: 'text-signal-amber',
            },
          ]
        : [
            { label: 'Districts', value: '5', accent: 'text-signal-cyan' },
            {
              label: 'Total Agents',
              value: String(MAX_AGENTS_MVP),
              accent: 'text-signal-green',
            },
            {
              label: 'City Prosperity',
              value: '94.2%',
              accent: 'text-signal-amber',
            },
          ];
    case 'district':
      return entity
        ? entity.metrics.map((metric) => ({
            label: metric.label,
            value: metric.value,
            accent: metric.accent,
          }))
        : [
            {
              label: 'District',
              value: SCALE_LABELS.district,
              accent: 'text-signal-cyan',
            },
            { label: 'Agents', value: '—', accent: 'text-text-secondary' },
            { label: 'Throughput', value: '—', accent: 'text-text-secondary' },
          ];
    case 'building':
      return entity
        ? entity.metrics
        : [
            { label: 'Building', value: '—', accent: 'text-signal-cyan' },
            { label: 'Utilization', value: '—', accent: 'text-text-secondary' },
            { label: 'Agents', value: '—', accent: 'text-text-secondary' },
          ];
    case 'room':
      return entity
        ? entity.metrics
        : [
            { label: 'Room', value: '—', accent: 'text-signal-cyan' },
            {
              label: 'Agents Present',
              value: '—',
              accent: 'text-text-secondary',
            },
          ];
    case 'agent':
      return entity
        ? entity.metrics
        : [
            { label: 'Agent', value: '—', accent: 'text-signal-cyan' },
            { label: 'Status', value: '—', accent: 'text-text-secondary' },
            { label: 'Model', value: '—', accent: 'text-text-secondary' },
          ];
    case 'memory': {
      const memoryCount =
        focusEntityId !== null
          ? (useWorldStore.getState().memoriesByAgentSlug[focusEntityId]
              ?.length ?? 0)
          : 0;
      return [
        {
          label: 'Memories',
          value: String(memoryCount || 12),
          accent: 'text-signal-cyan',
        },
        { label: 'Timeline Span', value: '48h', accent: 'text-signal-green' },
        { label: 'Links', value: '37', accent: 'text-signal-purple' },
      ];
    }
    default:
      return [
        {
          label: 'Scale',
          value: SCALE_LABELS[scale],
          accent: 'text-signal-cyan',
        },
        { label: 'Status', value: 'Active', accent: 'text-signal-green' },
        { label: 'Systems', value: 'Nominal', accent: 'text-text-secondary' },
      ];
  }
}

export function BottomHUD(): React.JSX.Element {
  const currentScale = useNavigationStore((state) => state.currentScale);
  const focusEntityId = useNavigationStore((state) => state.focusEntityId);
  const aggregates = useWorldStore((state) => state.aggregates);
  const isHydrated = useWorldStore((state) => state.isHydrated);
  const { metrics: galaxyMetrics, isMockData: isGalaxyMockData } =
    useGalaxyMetrics();
  const { state: earthState, isMockData: isEarthMockData } = useEarthState();

  const metrics = getMetricsForScale(
    currentScale,
    focusEntityId,
    aggregates,
    isHydrated,
    galaxyMetrics,
    {
      atmosphere: earthState.planetaryHealth.atmosphere.value,
      biosphere: earthState.planetaryHealth.biosphere.value,
      infrastructure: earthState.planetaryHealth.infrastructure.value,
    },
  );

  const showMockBadge =
    (currentScale === 'galaxy' && isGalaxyMockData) ||
    (currentScale === 'earth' && isEarthMockData);

  return (
    <footer className="border-steel-blue/60 bg-space-dark/90 relative flex h-16 shrink-0 items-center justify-center gap-8 border-t px-4 backdrop-blur-md">
      {showMockBadge ? (
        <span className="border-signal-amber/30 text-signal-amber absolute left-4 top-1/2 -translate-y-1/2 rounded border px-2 py-0.5 text-[10px] uppercase tracking-wide">
          Simulated
        </span>
      ) : null}

      {metrics.map((metric) => (
        <HudMetric
          key={metric.label}
          label={metric.label}
          value={metric.value}
          accent={metric.accent}
        />
      ))}
    </footer>
  );
}
