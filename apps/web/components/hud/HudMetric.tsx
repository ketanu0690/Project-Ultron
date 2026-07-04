'use client';

import { cn } from '@/lib/utils';

interface HudMetricProps {
  readonly label: string;
  readonly value: string;
  readonly accent?: string;
  readonly className?: string;
}

export function HudMetric({
  label,
  value,
  accent = 'text-signal-cyan',
  className,
}: HudMetricProps): React.JSX.Element {
  return (
    <div className={cn('min-w-0 text-center', className)}>
      <div
        className={cn('font-mono text-sm font-semibold tabular-nums', accent)}
      >
        {value}
      </div>
      <div className="text-text-secondary truncate text-[10px] uppercase tracking-wide">
        {label}
      </div>
    </div>
  );
}
