'use client';

import type { GroundStation } from '@ultron/shared';

import { EntityNode } from '@/components/world/EntityNode';
import { getScaleTransitionController } from '@/lib/scale-transition-instance';
import { EARTH_RADIUS_M } from '@/scenes/earth/earth.mock';
import { latLngToSurfacePosition } from '@/scenes/earth/earth-geo';

const STATION_COLOR = '#FFB300';
const MARKER_ALTITUDE = EARTH_RADIUS_M * 0.003;

interface GroundStationProps {
  readonly stations: readonly GroundStation[];
}

interface StationMarkerProps {
  readonly station: GroundStation;
}

function StationMarker({ station }: StationMarkerProps): React.JSX.Element {
  const [x, y, z] = latLngToSurfacePosition(
    station.coordinates.lat,
    station.coordinates.lng,
    EARTH_RADIUS_M,
  );
  const scale = EARTH_RADIUS_M * 0.00006;
  const normal = [x, y, z].map((v) => v / EARTH_RADIUS_M) as [
    number,
    number,
    number,
  ];
  const pos: [number, number, number] = [
    x + normal[0] * MARKER_ALTITUDE,
    y + normal[1] * MARKER_ALTITUDE,
    z + normal[2] * MARKER_ALTITUDE,
  ];

  const handleSelect = (): void => {
    getScaleTransitionController().transitionTo(
      'orbital_ring',
      'earth-to-orbital_ring',
    );
  };

  return (
    <EntityNode
      entityId={station.id}
      nodeType="earth_marker_node"
      outlineSize={[scale * 8, scale * 8, scale * 8]}
      onSelect={handleSelect}
    >
      <mesh position={pos}>
        <sphereGeometry args={[scale, 8, 8]} />
        <meshBasicMaterial color={STATION_COLOR} />
      </mesh>
    </EntityNode>
  );
}

export function GroundStationMarkers({
  stations,
}: GroundStationProps): React.JSX.Element {
  return (
    <group name="earth-ground-stations">
      {stations.map((station) => (
        <StationMarker key={station.id} station={station} />
      ))}
    </group>
  );
}
