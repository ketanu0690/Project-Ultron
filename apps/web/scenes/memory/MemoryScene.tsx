'use client';

import { Html } from '@react-three/drei';
import { DISTRICT_COLORS } from '@ultron/shared';

import { EntityNode } from '@/components/world/EntityNode';

interface MemoryCard {
  readonly entityId: string;
  readonly label: string;
  readonly timestamp: string;
  readonly y: number;
}

const MEMORY_CARDS: readonly MemoryCard[] = [
  {
    entityId: 'memory-001',
    label: 'Initial planning session',
    timestamp: '2026-01-12',
    y: 35,
  },
  {
    entityId: 'memory-002',
    label: 'District allocation review',
    timestamp: '2026-02-03',
    y: 28,
  },
  {
    entityId: 'memory-003',
    label: 'Tower construction milestone',
    timestamp: '2026-03-18',
    y: 21,
  },
  {
    entityId: 'memory-004',
    label: 'Agent role assignment',
    timestamp: '2026-04-05',
    y: 14,
  },
  {
    entityId: 'memory-005',
    label: 'Simulation dry run',
    timestamp: '2026-05-22',
    y: 7,
  },
  {
    entityId: 'memory-006',
    label: 'Governance policy draft',
    timestamp: '2026-06-01',
    y: 0,
  },
];

const cardColor = DISTRICT_COLORS.memory.primary;

export default function MemoryScene(): React.JSX.Element {
  return (
    <group name="scale-memory">
      <mesh position={[-15, 17, -5]}>
        <boxGeometry args={[0.2, 40, 0.2]} />
        <meshStandardMaterial color={DISTRICT_COLORS.memory.secondary} />
      </mesh>

      {MEMORY_CARDS.map((card) => (
        <EntityNode
          key={card.entityId}
          entityId={card.entityId}
          nodeType="memory_node"
          parentId="agent-sigma-7"
          outlineSize={[12, 3, 0.5]}
        >
          <mesh position={[0, card.y, 0]}>
            <boxGeometry args={[12, 3, 0.5]} />
            <meshStandardMaterial
              color={cardColor}
              emissive={cardColor}
              emissiveIntensity={0.2}
            />
          </mesh>
          <Html position={[0, card.y, 0.5]} center distanceFactor={8}>
            <div className="border-signal-cyan/20 bg-void-black/90 w-40 rounded border px-2 py-1 text-left">
              <p className="text-text-secondary text-[10px]">
                {card.timestamp}
              </p>
              <p className="text-text-primary text-xs">{card.label}</p>
            </div>
          </Html>
        </EntityNode>
      ))}
    </group>
  );
}
