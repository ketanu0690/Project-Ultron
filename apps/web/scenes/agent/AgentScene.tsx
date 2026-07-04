'use client';

import { Html } from '@react-three/drei';
import type { Agent } from '@ultron/shared';
import { DISTRICT_COLORS } from '@ultron/shared';
import { useMemo, useState } from 'react';

import { EntityNode } from '@/components/world/EntityNode';
import { useWorldStore } from '@/stores/worldStore';
import { useNavigationStore } from '@/stores/navigationStore';

const agentAccent = DISTRICT_COLORS.reasoning.accent;
const GRID_SPACING = 2.8;

function computeAgentPositions(
  count: number,
): ReadonlyArray<readonly [number, number, number]> {
  if (count === 0) {
    return [];
  }

  const cols = Math.ceil(Math.sqrt(count));
  const rows = Math.ceil(count / cols);
  const positions: Array<readonly [number, number, number]> = [];

  for (let index = 0; index < count; index += 1) {
    const row = Math.floor(index / cols);
    const col = index % cols;
    positions.push([
      col * GRID_SPACING - ((cols - 1) * GRID_SPACING) / 2,
      0,
      row * GRID_SPACING - ((rows - 1) * GRID_SPACING) / 2,
    ]);
  }

  return positions;
}

interface AgentMarkerProps {
  readonly agent: Agent;
  readonly position: readonly [number, number, number];
}

function AgentMarker({ agent, position }: AgentMarkerProps): React.JSX.Element {
  const [hovered, setHovered] = useState(false);
  const focusEntityId = useNavigationStore((state) => state.focusEntityId);
  const isFocused = focusEntityId === agent.slug;

  return (
    <EntityNode
      entityId={agent.slug}
      nodeType="agent_node"
      parentId="room-strategy"
      position={position}
      outlineSize={[1, 2.2, 1]}
      onSelect={() => undefined}
    >
      <mesh
        position={[0, 1, 0]}
        onPointerOver={(event) => {
          event.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={(event) => {
          event.stopPropagation();
          setHovered(false);
        }}
      >
        <capsuleGeometry args={[0.35, 0.9, 6, 12]} />
        <meshStandardMaterial
          color={agentAccent}
          emissive={agentAccent}
          emissiveIntensity={hovered || isFocused ? 0.5 : 0.3}
          metalness={0.4}
          roughness={0.35}
        />
      </mesh>

      {hovered || isFocused ? (
        <Html
          center
          position={[0, 2.6, 0]}
          distanceFactor={10}
          style={{ pointerEvents: 'none' }}
        >
          <div className="border-signal-purple/40 bg-void-black/90 whitespace-nowrap rounded border px-3 py-2 text-center backdrop-blur-md">
            <p className="text-text-primary text-sm font-medium">
              {agent.name}
            </p>
            <p className="text-signal-purple text-xs capitalize">
              {agent.role}
            </p>
          </div>
        </Html>
      ) : null}
    </EntityNode>
  );
}

export default function AgentScene(): React.JSX.Element {
  const agentsRecord = useWorldStore((state) => state.agents);
  const agents = useMemo(
    () =>
      Object.values(agentsRecord).sort((left, right) =>
        left.slug.localeCompare(right.slug),
      ),
    [agentsRecord],
  );
  const positions = useMemo(
    () => computeAgentPositions(agents.length),
    [agents.length],
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
        <AgentMarker
          key={agent.slug}
          agent={agent}
          position={positions[index] ?? [0, 0, 0]}
        />
      ))}

      {agents.length === 0 ? (
        <Html
          center
          position={[0, 2, 0]}
          distanceFactor={8}
          style={{ pointerEvents: 'none' }}
        >
          <p className="bg-void-black/80 text-text-secondary rounded px-3 py-2 text-xs">
            Loading agents…
          </p>
        </Html>
      ) : null}
    </group>
  );
}
