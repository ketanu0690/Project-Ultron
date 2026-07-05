'use client';

import { CuboidCollider, Physics, RigidBody } from '@react-three/rapier';
import { useEffect, useRef } from 'react';
import type { Mesh } from 'three';

import { registerCollisionMesh } from '@/controllers/CameraCollision';

interface RoomPhysicsProps {
  readonly roomSize: readonly [number, number, number];
  readonly roomPosition: readonly [number, number, number];
}

export function RoomPhysics({
  roomSize,
  roomPosition,
}: RoomPhysicsProps): React.JSX.Element {
  const floorRef = useRef<Mesh>(null);
  const [width, height, depth] = roomSize;
  const [px, py, pz] = roomPosition;

  useEffect(() => {
    if (floorRef.current) {
      registerCollisionMesh(floorRef.current);
    }
  }, []);

  return (
    <Physics gravity={[0, -9.81, 0]} timeStep="vary">
      <RigidBody type="fixed" colliders={false} position={[px, py, pz]}>
        <mesh ref={floorRef} visible={false}>
          <boxGeometry args={[width, height, depth]} />
        </mesh>
        <CuboidCollider args={[width / 2, height / 2, depth / 2]} />
      </RigidBody>
      <RigidBody
        type="kinematicPosition"
        colliders="ball"
        position={[px, py + 1, pz]}
      >
        <mesh visible={false}>
          <sphereGeometry args={[0.35, 8, 8]} />
        </mesh>
      </RigidBody>
    </Physics>
  );
}
