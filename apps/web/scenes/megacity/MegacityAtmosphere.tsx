'use client';

import { useMemo } from 'react';
import { BackSide, ShaderMaterial } from 'three';

const skyVertexShader = /* glsl */ `
  varying vec3 vWorldPosition;

  void main() {
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPosition.xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const skyFragmentShader = /* glsl */ `
  varying vec3 vWorldPosition;

  void main() {
    float h = normalize(vWorldPosition).y * 0.5 + 0.5;
    vec3 horizon = vec3(0.95, 0.45, 0.15);
    vec3 mid = vec3(0.85, 0.25, 0.45);
    vec3 zenith = vec3(0.25, 0.08, 0.35);
    vec3 color = mix(horizon, mid, smoothstep(0.0, 0.45, h));
    color = mix(color, zenith, smoothstep(0.35, 1.0, h));
    gl_FragColor = vec4(color, 1.0);
  }
`;

export function MegacityAtmosphere(): React.JSX.Element {
  const skyMaterial = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader: skyVertexShader,
        fragmentShader: skyFragmentShader,
        side: BackSide,
        depthWrite: false,
      }),
    [],
  );

  return (
    <group name="megacity-atmosphere">
      <fog attach="fog" args={['#c45a2a', 600, 14000]} />
      <mesh scale={25000} raycast={() => null}>
        <sphereGeometry args={[1, 48, 32]} />
        <primitive object={skyMaterial} attach="material" />
      </mesh>
      <directionalLight
        position={[4000, 6000, 2000]}
        intensity={1.4}
        color="#FFD4A0"
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
      <directionalLight
        position={[-3000, 2000, -4000]}
        intensity={0.35}
        color="#8B5CF6"
      />
      <ambientLight intensity={0.45} color="#FFB088" />
      <hemisphereLight args={['#FF8C42', '#1a0a2e', 0.6]} />
    </group>
  );
}
