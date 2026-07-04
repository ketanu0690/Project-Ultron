'use client';

import type { HTMLAttributes, ReactNode } from 'react';

import { cn } from '@/lib/utils';

interface GlassPanelProps extends HTMLAttributes<HTMLDivElement> {
  readonly as?: 'div' | 'aside' | 'section' | 'article';
  readonly children: ReactNode;
}

export function GlassPanel({
  as: Component = 'div',
  className,
  children,
  ...props
}: GlassPanelProps): React.JSX.Element {
  return (
    <Component
      className={cn(
        'border-steel-blue/50 bg-space-dark/80 rounded-lg border backdrop-blur-md',
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
