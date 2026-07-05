'use client';

import { useEffect, useRef } from 'react';

import { getAgentInterpolator } from '@/controllers/AgentInterpolator';
import { useNavigationStore } from '@/stores/navigationStore';
import { useWorldStore } from '@/stores/worldStore';

export function AgentMiniMap(): React.JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const agents = useWorldStore((state) => state.agents);
  const focusEntityId = useNavigationStore((state) => state.focusEntityId);

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
    const draw = (): void => {
      frame = requestAnimationFrame(draw);
      const { width, height } = canvas;
      context.clearRect(0, 0, width, height);
      context.fillStyle = 'rgba(10, 14, 26, 0.85)';
      context.fillRect(0, 0, width, height);
      context.strokeStyle = 'rgba(0, 229, 255, 0.35)';
      context.strokeRect(0.5, 0.5, width - 1, height - 1);

      const interpolator = getAgentInterpolator();
      const agentList = Object.values(agents);
      for (const agent of agentList) {
        const runtime = interpolator.getRuntime(agent.slug);
        const position = runtime?.renderPosition ?? [
          agent.position.x,
          agent.position.y,
          agent.position.z,
        ];
        const x = ((position[0] + 10) / 20) * width;
        const y = ((position[2] + 10) / 20) * height;
        const isFocus = focusEntityId === agent.slug;
        context.beginPath();
        context.fillStyle = isFocus ? '#00E5FF' : '#A855F7';
        context.arc(x, y, isFocus ? 4 : 2.5, 0, Math.PI * 2);
        context.fill();
      }
    };

    draw();
    return () => {
      cancelAnimationFrame(frame);
    };
  }, [agents, focusEntityId]);

  return (
    <canvas
      ref={canvasRef}
      width={160}
      height={120}
      className="border-steel-blue/50 pointer-events-none absolute right-4 bottom-20 z-20 rounded border backdrop-blur-sm"
      aria-label="Agent positions mini-map"
    />
  );
}
