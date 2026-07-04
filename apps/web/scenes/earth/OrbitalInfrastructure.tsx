'use client';

import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useMemo, useRef, useState } from 'react';
import type { Group, Mesh } from 'three';

import { EARTH_RADIUS_M } from '@/scenes/earth/earth.mock';

interface OrbitalAsset {
  readonly id: string;
  readonly name: string;
  readonly role: string;
  readonly altitude: number;
  readonly inclination: number;
  readonly phase: number;
  readonly orbitSpeed: number;
  readonly scale: number;
}

const ORBITAL_ASSETS: readonly OrbitalAsset[] = [
  {
    id: 'iss-alpha',
    name: 'Relay Station Alpha',
    role: 'Deep-space comms relay',
    altitude: 420_000,
    inclination: 0.35,
    phase: 0,
    orbitSpeed: 0.08,
    scale: 1.2,
  },
  {
    id: 'iss-beta',
    name: 'Orbital Lab Beta',
    role: 'Atmospheric research',
    altitude: 380_000,
    inclination: -0.25,
    phase: 1.8,
    orbitSpeed: 0.1,
    scale: 0.9,
  },
  {
    id: 'iss-gamma',
    name: 'Defense Grid Gamma',
    role: 'Planetary monitoring',
    altitude: 520_000,
    inclination: 0.55,
    phase: 3.2,
    orbitSpeed: 0.07,
    scale: 1.4,
  },
  {
    id: 'iss-delta',
    name: 'Transit Hub Delta',
    role: 'Brain City supply corridor',
    altitude: 450_000,
    inclination: -0.45,
    phase: 4.5,
    orbitSpeed: 0.09,
    scale: 1.0,
  },
];

function OrbitalAssetNode({
  asset,
}: {
  readonly asset: OrbitalAsset;
}): React.JSX.Element {
  const groupRef = useRef<Group>(null);
  const meshRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const orbitRadius = EARTH_RADIUS_M + asset.altitude;
  const baseScale = EARTH_RADIUS_M * 0.00008 * asset.scale;

  useFrame(({ clock }) => {
    if (!groupRef.current) {
      return;
    }
    const angle = asset.phase + clock.getElapsedTime() * asset.orbitSpeed;
    groupRef.current.position.set(
      Math.cos(angle) * orbitRadius,
      Math.sin(asset.inclination) * orbitRadius * 0.3 +
        Math.sin(angle * 0.5) * 200_000,
      Math.sin(angle) * orbitRadius,
    );
    groupRef.current.lookAt(0, 0, 0);
  });

  return (
    <group ref={groupRef}>
      <mesh
        ref={meshRef}
        scale={baseScale}
        onPointerOver={(event) => {
          event.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={(event) => {
          event.stopPropagation();
          setHovered(false);
        }}
      >
        <boxGeometry args={[3, 1.2, 1.5]} />
        <meshStandardMaterial
          color="#8899AA"
          emissive="#00E5FF"
          emissiveIntensity={hovered ? 0.6 : 0.25}
          metalness={0.8}
          roughness={0.3}
        />
      </mesh>
      <mesh scale={baseScale * 1.8} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.5, 3.2, 24]} />
        <meshBasicMaterial color="#00E5FF" transparent opacity={0.25} />
      </mesh>
      {hovered ? (
        <Html
          center
          position={[0, baseScale * 8, 0]}
          distanceFactor={EARTH_RADIUS_M * 0.000015}
          style={{ pointerEvents: 'none' }}
        >
          <div className="border-signal-cyan/40 bg-void-black/90 whitespace-nowrap rounded border px-3 py-2 backdrop-blur-md">
            <p className="text-text-primary text-sm font-medium">
              {asset.name}
            </p>
            <p className="text-signal-cyan text-xs">{asset.role}</p>
          </div>
        </Html>
      ) : null}
    </group>
  );
}

export function OrbitalInfrastructure(): React.JSX.Element {
  const assets = useMemo(() => ORBITAL_ASSETS, []);

  return (
    <group name="orbital-infrastructure">
      {assets.map((asset) => (
        <OrbitalAssetNode key={asset.id} asset={asset} />
      ))}
    </group>
  );
}
