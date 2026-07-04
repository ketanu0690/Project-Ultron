'use client';

import { cn } from '@/lib/utils';

export type StatusVariant =
  'online' | 'offline' | 'thinking' | 'nominal' | 'degraded' | 'critical';

const VARIANT_STYLES: Record<StatusVariant, { dot: string; text: string }> = {
  online: { dot: 'bg-signal-green', text: 'text-signal-green' },
  offline: { dot: 'bg-text-tertiary', text: 'text-text-tertiary' },
  thinking: { dot: 'bg-signal-amber', text: 'text-signal-amber' },
  nominal: { dot: 'bg-signal-green', text: 'text-signal-green' },
  degraded: { dot: 'bg-signal-amber', text: 'text-signal-amber' },
  critical: { dot: 'bg-signal-red', text: 'text-signal-red' },
};

const VARIANT_LABELS: Record<StatusVariant, string> = {
  online: 'Online',
  offline: 'Offline',
  thinking: 'Thinking',
  nominal: 'Nominal',
  degraded: 'Degraded',
  critical: 'Critical',
};

interface StatusBadgeProps {
  readonly variant: StatusVariant;
  readonly label?: string;
  readonly className?: string;
}

export function StatusBadge({
  variant,
  label,
  className,
}: StatusBadgeProps): React.JSX.Element {
  const styles = VARIANT_STYLES[variant];
  const displayLabel = label ?? VARIANT_LABELS[variant];

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 text-xs font-medium',
        styles.text,
        className,
      )}
    >
      <span
        className={cn('h-1.5 w-1.5 rounded-full', styles.dot)}
        aria-hidden
      />
      {displayLabel}
    </span>
  );
}
