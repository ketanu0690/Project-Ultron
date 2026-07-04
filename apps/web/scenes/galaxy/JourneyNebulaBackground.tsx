'use client';

import { useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { BackSide, ShaderMaterial } from 'three';

const JOURNEY_NEBULA_RADIUS = 20;

const journeyNebulaTimeUniform = { value: 0 };

const JOURNEY_NEBULA_VERTEX = /* glsl */ `
  varying vec3 vWorldPosition;

  void main() {
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPos.xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const JOURNEY_NEBULA_FRAGMENT = /* glsl */ `
  uniform float uTime;
  varying vec3 vWorldPosition;

  void main() {
    float dist = length(vWorldPosition) / ${JOURNEY_NEBULA_RADIUS}.0;
    float nebula = sin(vWorldPosition.x * 0.08 + uTime * 0.15) * 0.5 + 0.5;
    nebula *= sin(vWorldPosition.z * 0.06 + uTime * 0.1) * 0.5 + 0.5;

    vec3 voidColor = vec3(0.008, 0.016, 0.031);
    vec3 nebulaColor = vec3(0.35, 0.12, 0.55);
    vec3 color = mix(voidColor, nebulaColor, nebula * 0.45 * (1.0 - dist * 0.25));

    gl_FragColor = vec4(color, 1.0);
  }
`;

export function JourneyNebulaBackground(): React.JSX.Element {
  const material = useMemo(
    () =>
      new ShaderMaterial({
        uniforms: { uTime: journeyNebulaTimeUniform },
        vertexShader: JOURNEY_NEBULA_VERTEX,
        fragmentShader: JOURNEY_NEBULA_FRAGMENT,
        side: BackSide,
        depthWrite: false,
      }),
    [],
  );

  useFrame(({ clock }) => {
    journeyNebulaTimeUniform.value = clock.getElapsedTime();
  });

  useEffect(() => {
    return () => {
      material.dispose();
    };
  }, [material]);

  return (
    <mesh material={material} frustumCulled={false}>
      <sphereGeometry args={[JOURNEY_NEBULA_RADIUS, 32, 32]} />
    </mesh>
  );
}
