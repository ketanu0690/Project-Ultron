'use client';

import { useMemo } from 'react';
import { CatmullRomCurve3, TubeGeometry, Vector3 } from 'three';

import {
  BRAIN_CITY_HIGHWAYS,
  type HighwaySegment,
} from '@/scenes/megacity/brain-city-config';

function HighwayTube({
  segment,
}: {
  readonly segment: HighwaySegment;
}): React.JSX.Element {
  const geometry = useMemo(() => {
    const [fx, , fz] = segment.from;
    const [tx, , tz] = segment.to;
    const laneY = segment.laneHeight;

    const curve = new CatmullRomCurve3([
      new Vector3(fx, laneY, fz),
      new Vector3((fx + tx) * 0.5, laneY + 80, (fz + tz) * 0.5),
      new Vector3(tx, laneY, tz),
    ]);

    return new TubeGeometry(curve, 64, 8, 8, false);
  }, [segment]);

  return (
    <mesh geometry={geometry} raycast={() => null}>
      <meshStandardMaterial
        color="#00E5FF"
        emissive="#00E5FF"
        emissiveIntensity={0.55}
        transparent
        opacity={0.75}
        metalness={0.6}
        roughness={0.25}
      />
    </mesh>
  );
}

export function SkyHighways(): React.JSX.Element {
  return (
    <group name="sky-highways">
      {BRAIN_CITY_HIGHWAYS.map((segment, index) => (
        <HighwayTube
          key={`${segment.from.join('-')}-${segment.to.join('-')}-${index}`}
          segment={segment}
        />
      ))}
    </group>
  );
}
