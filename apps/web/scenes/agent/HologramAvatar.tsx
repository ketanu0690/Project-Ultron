'use client';

import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import type { Agent, AgentStatus } from '@ultron/shared';
import { DISTRICT_COLORS } from '@ultron/shared';
import { useMemo, useRef, useState } from 'react';
import type { Group } from 'three';
import * as THREE from 'three';

import { EntityNode } from '@/components/world/EntityNode';
import { getAgentInterpolator } from '@/controllers/AgentInterpolator';
import {
  type HologramMaterialType,
  updateHologramMaterial,
} from '@/shaders/hologram';
import { useNavigationStore } from '@/stores/navigationStore';

const agentAccent = DISTRICT_COLORS.reasoning.accent;

function statusPulse(status: AgentStatus): number {
  switch (status) {
    case 'thinking':
      return 1;
    case 'acting':
      return 0.75;
    case 'learning':
      return 0.55;
    case 'error':
      return 0.9;
    default:
      return 0.25;
  }
}

export type AgentRenderTier = 'T0' | 'T1' | 'T2';

interface HologramAvatarProps {
  readonly agent: Agent;
  readonly tier?: AgentRenderTier;
}

export function HologramAvatar({
  agent,
  tier = 'T0',
}: HologramAvatarProps): React.JSX.Element {
  const [hovered, setHovered] = useState(false);
  const groupRef = useRef<Group>(null);
  const materialRef = useRef<HologramMaterialType>(null);
  const focusEntityId = useNavigationStore((state) => state.focusEntityId);
  const isFocused = focusEntityId === agent.slug;
  const color = useMemo(() => new THREE.Color(agentAccent), []);

  useFrame((_, delta) => {
    const interpolator = getAgentInterpolator();
    interpolator.update(delta);
    const runtime = interpolator.getRuntime(agent.slug);
    if (!runtime || !groupRef.current) {
      return;
    }

    groupRef.current.position.set(
      runtime.renderPosition[0],
      runtime.renderPosition[1],
      runtime.renderPosition[2],
    );
    groupRef.current.rotation.y = runtime.renderRotationY;

    updateHologramMaterial(materialRef.current, {
      uTime: performance.now() * 0.001,
      uPulse: statusPulse(runtime.status),
      uColor: color,
    });
  });

  const scale =
    tier === 'T2' ? 0.35 : tier === 'T1' ? 0.75 : isFocused ? 1.08 : 1;

  return (
    <EntityNode
      entityId={agent.slug}
      nodeType="agent_node"
      parentId="room-strategy"
      position={[0, 0, 0]}
      outlineSize={[1, 2.2, 1]}
      onSelect={() => undefined}
    >
      <group ref={groupRef} scale={scale}>
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
          {tier === 'T2' ? (
            <sphereGeometry args={[0.25, 8, 8]} />
          ) : (
            <capsuleGeometry args={[0.35, 0.9, 6, 12]} />
          )}
          {tier === 'T0' || tier === 'T1' ? (
            <hologramMaterial
              ref={materialRef}
              transparent
              depthWrite={false}
              side={THREE.DoubleSide}
            />
          ) : (
            <meshStandardMaterial
              color={agentAccent}
              emissive={agentAccent}
              emissiveIntensity={0.45}
            />
          )}
        </mesh>

        {hovered || isFocused ? (
          <Html
            center
            position={[0, 2.6, 0]}
            distanceFactor={10}
            style={{ pointerEvents: 'none' }}
          >
            <div className="border-signal-purple/40 bg-void-black/90 rounded border px-3 py-2 text-center whitespace-nowrap backdrop-blur-md">
              <p className="text-text-primary text-sm font-medium">
                {agent.name}
              </p>
              <p className="text-signal-purple text-xs capitalize">
                {agent.role} · {agent.status}
              </p>
            </div>
          </Html>
        ) : null}
      </group>
    </EntityNode>
  );
}
