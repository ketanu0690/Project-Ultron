'use client';

import { GlassPanel } from '@/components/ui/GlassPanel';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { HudMetric } from '@/components/hud/HudMetric';
import { getDistrictColorHex, type EntityDetail } from '@/lib/shell-data';

interface EntityCardProps {
  readonly entity: EntityDetail;
}

export function EntityCard({ entity }: EntityCardProps): React.JSX.Element {
  const accentColor = getDistrictColorHex(entity.districtId);

  return (
    <GlassPanel className="overflow-hidden">
      <div
        className="h-1"
        style={{ backgroundColor: accentColor }}
        aria-hidden
      />
      <div className="space-y-3 p-4">
        <div className="space-y-1">
          <div className="flex items-start justify-between gap-2">
            <h2 className="font-display text-text-primary text-sm font-semibold">
              {entity.name}
            </h2>
            <StatusBadge variant={entity.status} />
          </div>
          <p className="text-signal-cyan text-xs">{entity.subtitle}</p>
          <p className="text-text-secondary text-xs leading-relaxed">
            {entity.description}
          </p>
        </div>

        <div className="border-steel-blue/40 grid grid-cols-3 gap-2 border-t pt-3">
          {entity.metrics.map((metric) => (
            <HudMetric
              key={metric.label}
              label={metric.label}
              value={metric.value}
              accent={metric.accent}
            />
          ))}
        </div>
      </div>
    </GlassPanel>
  );
}
