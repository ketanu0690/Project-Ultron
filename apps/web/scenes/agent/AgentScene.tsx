'use client';

import { useMemo } from 'react';

import { useNavigationStore } from '@/stores/navigationStore';
import { useWorldStore } from '@/stores/worldStore';

import { HologramAvatar, type AgentRenderTier } from './HologramAvatar';

function resolveTier(
  agentSlug: string,
  focusEntityId: string | null,
  index: number,
): AgentRenderTier {
  if (focusEntityId === agentSlug || index < 20) {
    return 'T0';
  }
  if (index < 50) {
    return 'T1';
  }
  return 'T2';
}

export default function AgentScene(): React.JSX.Element {
  const agentsRecord = useWorldStore((state) => state.agents);
  const focusEntityId = useNavigationStore((state) => state.focusEntityId);
  const agents = useMemo(
    () =>
      Object.values(agentsRecord).sort((left, right) =>
        left.slug.localeCompare(right.slug),
      ),
    [agentsRecord],
  );

  return (
    <group name="scale-agent">
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#1A2332" />
      </mesh>

      <mesh position={[0, 4, -8]}>
        <boxGeometry args={[16, 8, 0.5]} />
        <meshStandardMaterial color="#2A3444" transparent opacity={0.6} />
      </mesh>

      {agents.map((agent, index) => (
        <HologramAvatar
          key={agent.slug}
          agent={agent}
          tier={resolveTier(agent.slug, focusEntityId, index)}
        />
      ))}
    </group>
  );
}
