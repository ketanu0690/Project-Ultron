'use client';

import { Html } from '@react-three/drei';
import { useState } from 'react';

import { EntityNode } from '@/components/world/EntityNode';
import { getScaleTransitionController } from '@/lib/scale-transition-instance';
import { useNavigationStore } from '@/stores/navigationStore';
import {
  angleToRingPosition,
  RING_RADIUS,
  RING_STATUS_COLORS,
  zoneMidpointAngle,
} from '@/scenes/orbital-ring/ring.constants';
import type { RingZone } from '@/scenes/orbital-ring/ring-zones.mock';

interface RingZoneMarkerProps {
  readonly zone: RingZone;
}

const STATUS_LABELS = {
  nominal: 'Nominal',
  degraded: 'Degraded',
  critical: 'Critical',
  offline: 'Offline',
} as const;

export function RingZoneMarker({
  zone,
}: RingZoneMarkerProps): React.JSX.Element {
  const [hovered, setHovered] = useState(false);
  const focusEntityId = useNavigationStore((state) => state.focusEntityId);
  const setFocusEntityId = useNavigationStore(
    (state) => state.setFocusEntityId,
  );

  const midAngle = zoneMidpointAngle(zone.angleStart, zone.angleEnd);
  const [x, , z] = angleToRingPosition(midAngle, RING_RADIUS);
  const arcSpan = zone.angleEnd - zone.angleStart;
  const hitWidth = Math.max(40, (arcSpan / 360) * RING_RADIUS * Math.PI * 0.5);
  const isFocused = focusEntityId === zone.id;

  const handleDoubleClick = (): void => {
    if (!zone.uplinkDistrict) {
      return;
    }

    getScaleTransitionController().transitionTo('district');
    setFocusEntityId(`district-${zone.uplinkDistrict}`);
  };

  return (
    <EntityNode
      entityId={zone.id}
      nodeType="ring_segment_node"
      outlineSize={[hitWidth, 20, 40]}
      onDoubleClick={handleDoubleClick}
    >
      <group
        position={[x, 0, z]}
        onPointerOver={(event) => {
          event.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={(event) => {
          event.stopPropagation();
          setHovered(false);
        }}
      >
        <mesh visible={false}>
          <boxGeometry args={[hitWidth, 20, 40]} />
          <meshBasicMaterial transparent opacity={0} />
        </mesh>

        {hovered || isFocused ? (
          <Html center position={[0, 24, 0]} distanceFactor={600}>
            <div className="border-signal-cyan/30 bg-void-black/90 whitespace-nowrap rounded border px-3 py-2 text-left backdrop-blur-md">
              <p className="text-text-primary text-sm font-medium">
                Zone {zone.name}
              </p>
              <p
                className="text-xs"
                style={{ color: RING_STATUS_COLORS[zone.status] }}
              >
                {STATUS_LABELS[zone.status]} · {zone.sensorCoverage}% coverage
              </p>
              {zone.uplinkDistrict ? (
                <p className="text-text-secondary mt-1 text-[10px]">
                  Double-click to uplink → {zone.uplinkDistrict}
                </p>
              ) : (
                <p className="text-text-tertiary mt-1 text-[10px]">
                  Redundancy zone
                </p>
              )}
            </div>
          </Html>
        ) : null}
      </group>
    </EntityNode>
  );
}
