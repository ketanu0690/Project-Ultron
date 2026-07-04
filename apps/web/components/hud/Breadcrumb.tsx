'use client';

import { ChevronRight } from 'lucide-react';

import { getScaleTransitionController } from '@/lib/scale-transition-instance';
import type { Breadcrumb } from '@/lib/navigation-breadcrumbs';
import { useNavigationStore } from '@/stores/navigationStore';
import { cn } from '@/lib/utils';

interface BreadcrumbNavProps {
  readonly crumbs: readonly Breadcrumb[];
  readonly className?: string;
}

export function BreadcrumbNav({
  crumbs,
  className,
}: BreadcrumbNavProps): React.JSX.Element {
  const setFocusEntityId = useNavigationStore(
    (state) => state.setFocusEntityId,
  );

  const handleNavigate = (crumb: Breadcrumb): void => {
    getScaleTransitionController().transitionTo(crumb.scale);
    setFocusEntityId(crumb.entityId ?? null);
  };

  if (crumbs.length === 0) {
    return (
      <nav
        aria-label="Breadcrumb"
        className={cn('text-text-secondary text-sm', className)}
      >
        AI Megacity
      </nav>
    );
  }

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn('flex min-w-0 items-center gap-1', className)}
    >
      {crumbs.map((crumb, index) => {
        const isLast = index === crumbs.length - 1;
        return (
          <span
            key={`${crumb.scale}-${crumb.entityId ?? 'root'}`}
            className="flex items-center gap-1"
          >
            {index > 0 ? (
              <ChevronRight
                className="text-text-tertiary h-3 w-3 shrink-0"
                aria-hidden
              />
            ) : null}
            {isLast ? (
              <span className="text-text-primary truncate text-sm">
                {crumb.label}
              </span>
            ) : (
              <button
                type="button"
                onClick={() => handleNavigate(crumb)}
                className="text-text-secondary hover:text-signal-cyan truncate text-sm transition-colors"
              >
                {crumb.label}
              </button>
            )}
          </span>
        );
      })}
    </nav>
  );
}

export function useBreadcrumbCrumbs(): readonly Breadcrumb[] {
  return useNavigationStore((state) => state.breadcrumbs);
}

export type { Breadcrumb };
