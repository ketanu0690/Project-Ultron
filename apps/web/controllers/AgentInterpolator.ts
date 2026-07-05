import type { AgentStatus } from '@ultron/shared';

export interface AgentRuntimeState {
  readonly agentId: string;
  readonly slug: string;
  readonly serverPosition: [number, number, number];
  readonly serverRotationY: number;
  readonly renderPosition: [number, number, number];
  readonly renderRotationY: number;
  readonly status: AgentStatus;
  readonly lastServerAt: number;
}

const LERP_SPEED = 4;

export class AgentInterpolator {
  private readonly states = new Map<string, AgentRuntimeState>();

  syncFromAgent(
    slug: string,
    agentId: string,
    position: { x: number; y: number; z: number },
    rotationY: number,
    status: AgentStatus,
  ): void {
    const serverPosition: [number, number, number] = [
      position.x,
      position.y,
      position.z,
    ];
    const existing = this.states.get(slug);
    if (!existing) {
      this.states.set(slug, {
        agentId,
        slug,
        serverPosition,
        serverRotationY: rotationY,
        renderPosition: serverPosition,
        renderRotationY: rotationY,
        status,
        lastServerAt: Date.now(),
      });
      return;
    }

    this.states.set(slug, {
      ...existing,
      agentId,
      serverPosition,
      serverRotationY: rotationY,
      status,
      lastServerAt: Date.now(),
    });
  }

  applyServerUpdate(
    agentId: string,
    slug: string | undefined,
    position: [number, number, number],
    rotationY: number,
    status: AgentStatus,
  ): void {
    const key =
      slug ??
      [...this.states.values()].find((state) => state.agentId === agentId)
        ?.slug;
    if (!key) {
      return;
    }

    const existing = this.states.get(key);
    this.states.set(key, {
      agentId,
      slug: key,
      serverPosition: position,
      serverRotationY: rotationY,
      renderPosition: existing?.renderPosition ?? position,
      renderRotationY: existing?.renderRotationY ?? rotationY,
      status,
      lastServerAt: Date.now(),
    });
  }

  update(deltaSeconds: number): void {
    const alpha = Math.min(1, deltaSeconds * LERP_SPEED);
    for (const [slug, state] of this.states.entries()) {
      const renderPosition: [number, number, number] = [
        state.renderPosition[0] +
          (state.serverPosition[0] - state.renderPosition[0]) * alpha,
        state.renderPosition[1] +
          (state.serverPosition[1] - state.renderPosition[1]) * alpha,
        state.renderPosition[2] +
          (state.serverPosition[2] - state.renderPosition[2]) * alpha,
      ];
      let rotationDelta = state.serverRotationY - state.renderRotationY;
      if (rotationDelta > Math.PI) {
        rotationDelta -= Math.PI * 2;
      }
      if (rotationDelta < -Math.PI) {
        rotationDelta += Math.PI * 2;
      }
      const renderRotationY = state.renderRotationY + rotationDelta * alpha;

      this.states.set(slug, {
        ...state,
        renderPosition,
        renderRotationY,
      });
    }
  }

  getRuntime(slug: string): AgentRuntimeState | undefined {
    return this.states.get(slug);
  }

  getAll(): ReadonlyArray<AgentRuntimeState> {
    return [...this.states.values()];
  }
}

let singleton: AgentInterpolator | null = null;

export function getAgentInterpolator(): AgentInterpolator {
  if (!singleton) {
    singleton = new AgentInterpolator();
  }
  return singleton;
}
