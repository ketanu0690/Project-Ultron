'use client';

import { BottomHUD } from '@/components/hud/BottomHUD';
import { AgentMiniMap } from '@/components/hud/AgentMiniMap';
import { TopBar } from '@/components/hud/TopBar';
import { DialoguePanel } from '@/components/panels/DialoguePanel';
import { GovernancePanel } from '@/components/panels/GovernancePanel';
import { LeftSidebar } from '@/components/panels/LeftSidebar';
import { RightSidebar } from '@/components/panels/RightSidebar';
import { ShortcutsOverlay } from '@/components/panels/ShortcutsOverlay';
import { useBreadcrumbSync } from '@/hooks/useBreadcrumbSync';
import { useShellKeyboard } from '@/hooks/useShellKeyboard';
import { useShellSelection } from '@/hooks/useShellSelection';
import { cn } from '@/lib/utils';

interface WorldShellProps {
  readonly children: React.ReactNode;
  readonly className?: string;
}

export function WorldShell({
  children,
  className,
}: WorldShellProps): React.JSX.Element {
  useBreadcrumbSync();
  useShellKeyboard();
  useShellSelection();

  return (
    <div
      className={cn(
        'bg-void-black flex h-screen flex-col overflow-hidden',
        className,
      )}
    >
      <TopBar />

      <div className="relative flex min-h-0 flex-1">
        <LeftSidebar />

        <div className="relative min-w-0 flex-1">
          {children}
          <AgentMiniMap />
          <GovernancePanel />
          <DialoguePanel />
          <ShortcutsOverlay />
        </div>

        <RightSidebar />
      </div>

      <BottomHUD />
    </div>
  );
}
