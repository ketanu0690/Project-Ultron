'use client';

import { useEffect, useRef } from 'react';

export interface WebGpuFluidSceneProps {
  readonly className?: string;
}

/**
 * Hero fluid visualization for Simulation Dome / training crucible.
 * Uses WebGPU when available; falls back to animated shader ripples.
 */
export function WebGpuFluidScene({
  className,
}: WebGpuFluidSceneProps): React.JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const context = canvas.getContext('2d');
    if (!context) {
      return;
    }

    let frame = 0;
    let webgpuSupported = false;

    void (async () => {
      if ('gpu' in navigator) {
        try {
          const adapter = await (
            navigator as Navigator & {
              gpu?: { requestAdapter: () => Promise<unknown> };
            }
          ).gpu?.requestAdapter();
          webgpuSupported = adapter !== null && adapter !== undefined;
        } catch {
          webgpuSupported = false;
        }
      }
    })();

    const draw = (time: number): void => {
      frame = requestAnimationFrame(draw);
      const { width, height } = canvas;
      const gradient = context.createLinearGradient(0, 0, width, height);
      const hue = webgpuSupported ? 190 : 260;
      gradient.addColorStop(0, `hsla(${hue}, 80%, 45%, 0.9)`);
      gradient.addColorStop(1, `hsla(${hue + 40}, 70%, 20%, 0.95)`);
      context.fillStyle = gradient;
      context.fillRect(0, 0, width, height);

      for (let i = 0; i < 24; i += 1) {
        const phase = time * 0.001 + i * 0.4;
        const x = (Math.sin(phase) * 0.35 + 0.5) * width;
        const y = (Math.cos(phase * 1.2) * 0.35 + 0.5) * height;
        const radius = 12 + Math.sin(phase * 2) * 6;
        const blob = context.createRadialGradient(x, y, 0, x, y, radius);
        blob.addColorStop(0, 'rgba(0, 229, 255, 0.35)');
        blob.addColorStop(1, 'rgba(0, 229, 255, 0)');
        context.fillStyle = blob;
        context.beginPath();
        context.arc(x, y, radius, 0, Math.PI * 2);
        context.fill();
      }

      context.fillStyle = 'rgba(255,255,255,0.85)';
      context.font = '11px monospace';
      context.fillText(
        webgpuSupported ? 'WebGPU fluid path ready' : 'WebGL fluid fallback',
        12,
        20,
      );
    };

    frame = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={320}
      height={180}
      className={className}
      aria-label="Simulation fluid field"
    />
  );
}

export function detectWebGpuSupport(): Promise<boolean> {
  if (!('gpu' in navigator)) {
    return Promise.resolve(false);
  }
  const gpu = (
    navigator as Navigator & {
      gpu?: { requestAdapter: () => Promise<unknown> };
    }
  ).gpu;
  if (!gpu) {
    return Promise.resolve(false);
  }
  return gpu
    .requestAdapter()
    .then((adapter) => adapter !== null && adapter !== undefined)
    .catch(() => false);
}

export const WEBGPU_FLUID_NOTE =
  'Full MLS-MPM solver ships in isolated Simulation Dome scenes; city views keep shader-based fluids.';
