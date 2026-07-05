'use client';

import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useMemo, useRef, useState } from 'react';
import type { Group } from 'three';
import { Vector3 } from 'three';

import {
  BRAIN_CITY_TRAFFIC_ROUTES,
  type TrafficRoute,
} from '@/scenes/megacity/brain-city-config';

const VEHICLE_COLORS: Record<TrafficRoute['vehicleType'], string> = {
  taxi: '#00E5FF',
  shuttle: '#06D6A0',
  cargo: '#FFB300',
  luxury: '#E63946',
};

const VEHICLE_SIZES: Record<
  TrafficRoute['vehicleType'],
  [number, number, number]
> = {
  taxi: [8, 3, 14],
  shuttle: [12, 4, 20],
  cargo: [10, 6, 16],
  luxury: [9, 2.5, 18],
};

function TrafficVehicle({
  route,
}: {
  readonly route: TrafficRoute;
}): React.JSX.Element {
  const groupRef = useRef<Group>(null);
  const [hovered, setHovered] = useState(false);

  const pathPoints = useMemo(() => {
    const [fx, , fz] = route.from;
    const [tx, , tz] = route.to;
    const laneY = route.laneHeight;
    return [
      new Vector3(fx, laneY, fz),
      new Vector3((fx + tx) * 0.5, laneY + 60, (fz + tz) * 0.5),
      new Vector3(tx, laneY, tz),
    ];
  }, [route]);

  useFrame(({ clock }) => {
    if (!groupRef.current) {
      return;
    }

    const t = (clock.getElapsedTime() * route.speed + route.phase) % 1;
    const p0 = pathPoints[0];
    const p1 = pathPoints[1];
    const p2 = pathPoints[2];

    if (!p0 || !p1 || !p2) {
      return;
    }

    const oneMinusT = 1 - t;
    groupRef.current.position.set(
      oneMinusT * oneMinusT * p0.x + 2 * oneMinusT * t * p1.x + t * t * p2.x,
      oneMinusT * oneMinusT * p0.y + 2 * oneMinusT * t * p1.y + t * t * p2.y,
      oneMinusT * oneMinusT * p0.z + 2 * oneMinusT * t * p1.z + t * t * p2.z,
    );

    const nextT = Math.min(t + 0.02, 1);
    const nextOneMinusT = 1 - nextT;
    const lookX =
      nextOneMinusT * nextOneMinusT * p0.x +
      2 * nextOneMinusT * nextT * p1.x +
      nextT * nextT * p2.x;
    const lookY =
      nextOneMinusT * nextOneMinusT * p0.y +
      2 * nextOneMinusT * nextT * p1.y +
      nextT * nextT * p2.y;
    const lookZ =
      nextOneMinusT * nextOneMinusT * p0.z +
      2 * nextOneMinusT * nextT * p1.z +
      nextT * nextT * p2.z;

    groupRef.current.lookAt(lookX, lookY, lookZ);
  });

  const color = VEHICLE_COLORS[route.vehicleType];
  const [w, h, d] = VEHICLE_SIZES[route.vehicleType];

  return (
    <group
      ref={groupRef}
      raycast={() => null}
      onPointerOver={(event) => {
        event.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={(event) => {
        event.stopPropagation();
        setHovered(false);
      }}
    >
      <mesh>
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={hovered ? 0.8 : 0.4}
          metalness={0.7}
        />
      </mesh>
      {hovered ? (
        <Html
          center
          position={[0, h + 8, 0]}
          distanceFactor={400}
          style={{ pointerEvents: 'none' }}
        >
          <div className="border-signal-cyan/40 bg-void-black/90 rounded border px-2 py-1 text-[10px] whitespace-nowrap backdrop-blur-md">
            <span className="text-signal-cyan capitalize">
              {route.vehicleType}
            </span>
            <span className="text-text-secondary"> · en route</span>
          </div>
        </Html>
      ) : null}
    </group>
  );
}

export function FlyingTraffic(): React.JSX.Element {
  const routes = useMemo(() => BRAIN_CITY_TRAFFIC_ROUTES, []);

  return (
    <group name="flying-traffic">
      {routes.map((route) => (
        <TrafficVehicle key={route.id} route={route} />
      ))}
    </group>
  );
}
