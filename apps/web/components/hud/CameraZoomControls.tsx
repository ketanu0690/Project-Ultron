'use client';

import { Expand, Minus, Plus } from 'lucide-react';

import { getCameraController } from '@/lib/camera-controller-instance';
import { cn } from '@/lib/utils';

const ZOOM_IN_FACTOR = 0.8;
const ZOOM_OUT_FACTOR = 1.25;

interface CameraZoomControlsProps {
  readonly className?: string;
}

export function CameraZoomControls({
  className,
}: CameraZoomControlsProps): React.JSX.Element {
  const handleZoomIn = (): void => {
    void getCameraController().dollyBy(ZOOM_IN_FACTOR);
  };

  const handleZoomOut = (): void => {
    void getCameraController().dollyBy(ZOOM_OUT_FACTOR);
  };

  const handleFit = (): void => {
    void getCameraController().fitToView();
  };

  return (
    <div
      className={cn(
        'border-steel-blue/60 bg-space-dark/90 flex flex-col overflow-hidden rounded-lg border shadow-lg backdrop-blur-md',
        className,
      )}
      role="toolbar"
      aria-label="Camera zoom controls"
    >
      <button
        type="button"
        aria-label="Zoom in"
        title="Zoom in"
        onClick={handleZoomIn}
        className="text-text-secondary hover:bg-steel-blue/50 hover:text-signal-cyan flex h-9 w-9 items-center justify-center transition-colors"
      >
        <Plus className="h-4 w-4" />
      </button>
      <div className="bg-steel-blue/50 h-px" aria-hidden />
      <button
        type="button"
        aria-label="Zoom out"
        title="Zoom out"
        onClick={handleZoomOut}
        className="text-text-secondary hover:bg-steel-blue/50 hover:text-signal-cyan flex h-9 w-9 items-center justify-center transition-colors"
      >
        <Minus className="h-4 w-4" />
      </button>
      <div className="bg-steel-blue/50 h-px" aria-hidden />
      <button
        type="button"
        aria-label="Fit to screen"
        title="Fit to screen"
        onClick={handleFit}
        className="text-text-secondary hover:bg-steel-blue/50 hover:text-signal-cyan flex h-9 w-9 items-center justify-center transition-colors"
      >
        <Expand className="h-4 w-4" />
      </button>
    </div>
  );
}
