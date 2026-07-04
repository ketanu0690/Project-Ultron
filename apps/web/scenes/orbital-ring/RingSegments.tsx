'use client';

import { useFrame } from '@react-three/fiber';
import { useLayoutEffect, useMemo, useRef } from 'react';
import {
  Color,
  Euler,
  InstancedMesh,
  Matrix4,
  Object3D,
  Quaternion,
  Vector3,
} from 'three';

import {
  RING_HULL_COLOR,
  RING_RADIUS,
  RING_STATUS_COLORS,
  RING_STATUS_EMISSIVE,
  SEGMENT_SIZE,
  SEGMENTS_PER_ZONE,
  type RingSegmentStatus,
} from '@/scenes/orbital-ring/ring.constants';
import type { RingZone } from '@/scenes/orbital-ring/ring-zones.mock';

interface RingSegmentsProps {
  readonly zones: readonly RingZone[];
}

const _matrix = new Matrix4();
const _position = new Vector3();
const _quaternion = new Quaternion();
const _euler = new Euler();
const _scale = new Vector3(1, 1, 1);
const _object = new Object3D();

function computeSegmentMatrices(zone: RingZone): Matrix4[] {
  const arcSpan = zone.angleEnd - zone.angleStart;
  const matrices: Matrix4[] = [];

  for (let i = 0; i < SEGMENTS_PER_ZONE; i += 1) {
    const t = (i + 0.5) / SEGMENTS_PER_ZONE;
    const angleDeg = zone.angleStart + arcSpan * t;
    const angleRad = (angleDeg * Math.PI) / 180;

    _position.set(
      Math.sin(angleRad) * RING_RADIUS,
      0,
      Math.cos(angleRad) * RING_RADIUS,
    );

    _euler.set(0, angleRad, 0);
    _quaternion.setFromEuler(_euler);

    _object.position.copy(_position);
    _object.quaternion.copy(_quaternion);
    _object.scale.copy(_scale);
    _object.updateMatrix();

    matrices.push(_matrix.copy(_object.matrix));
  }

  return matrices;
}

interface ZoneInstanceGroup {
  readonly zone: RingZone;
  readonly count: number;
  readonly color: Color;
  readonly emissive: Color;
  readonly baseIntensity: number;
  readonly pulse: boolean;
}

function RingZoneInstances({
  group,
}: {
  group: ZoneInstanceGroup;
}): React.JSX.Element {
  const meshRef = useRef<InstancedMesh>(null);
  const matrices = useMemo(
    () => computeSegmentMatrices(group.zone),
    [group.zone],
  );

  useLayoutEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) {
      return;
    }

    matrices.forEach((matrix, index) => {
      mesh.setMatrixAt(index, matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  }, [matrices]);

  useFrame(({ clock }) => {
    const mesh = meshRef.current;
    if (!mesh || !group.pulse) {
      return;
    }

    const material = mesh.material;
    if (
      !material ||
      Array.isArray(material) ||
      !('emissiveIntensity' in material)
    ) {
      return;
    }

    const pulse =
      group.baseIntensity + Math.sin(clock.getElapsedTime() * 3) * 0.15;
    material.emissiveIntensity = pulse;
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, group.count]}
      frustumCulled={false}
    >
      <boxGeometry
        args={[SEGMENT_SIZE.width, SEGMENT_SIZE.height, SEGMENT_SIZE.depth]}
      />
      <meshStandardMaterial
        color={RING_HULL_COLOR}
        emissive={group.emissive}
        emissiveIntensity={group.baseIntensity}
        metalness={0.7}
        roughness={0.35}
      />
    </instancedMesh>
  );
}

function shouldPulse(status: RingSegmentStatus): boolean {
  return status === 'degraded' || status === 'critical';
}

export function RingSegments({ zones }: RingSegmentsProps): React.JSX.Element {
  const groups = useMemo(
    () =>
      zones.map((zone) => {
        const statusColor = RING_STATUS_COLORS[zone.status];
        return {
          zone,
          count: SEGMENTS_PER_ZONE,
          color: new Color(statusColor),
          emissive: new Color(statusColor),
          baseIntensity: RING_STATUS_EMISSIVE[zone.status],
          pulse: shouldPulse(zone.status),
        };
      }),
    [zones],
  );

  return (
    <group name="ring-segments">
      {groups.map((group) => (
        <RingZoneInstances key={group.zone.id} group={group} />
      ))}
    </group>
  );
}
