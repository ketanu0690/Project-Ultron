'use client';

import { useEffect, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { BackSide, ShaderMaterial } from 'three';

import { nebulaTimeUniform } from '@/scenes/galaxy/generate-star-field';

const NEBULA_VERTEX_SHADER = /* glsl */ `
  varying vec3 vWorldPosition;

  void main() {
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPos.xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const NEBULA_FRAGMENT_SHADER = /* glsl */ `
  uniform float uTime;

  varying vec3 vWorldPosition;

  void main() {
    float dist = length(vWorldPosition) / 5e22;
    float nebula = sin(vWorldPosition.x * 1e-20 + uTime * 0.05) * 0.5 + 0.5;
    nebula *= sin(vWorldPosition.z * 8e-21 + uTime * 0.03) * 0.5 + 0.5;

    vec3 voidColor = vec3(0.008, 0.016, 0.031);
    vec3 nebulaColor = vec3(0.102, 0.039, 0.180);
    vec3 color = mix(voidColor, nebulaColor, nebula * 0.35 * (1.0 - dist * 0.3));

    gl_FragColor = vec4(color, 1.0);
  }
`;

function useIsMobileViewport(): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(max-width: 768px)');
    const update = (): void => {
      setIsMobile(query.matches);
    };

    update();
    query.addEventListener('change', update);
    return () => {
      query.removeEventListener('change', update);
    };
  }, []);

  return isMobile;
}

export function NebulaBackground(): React.JSX.Element | null {
  const isMobile = useIsMobileViewport();
  const material = useMemo(
    () =>
      new ShaderMaterial({
        uniforms: { uTime: nebulaTimeUniform },
        vertexShader: NEBULA_VERTEX_SHADER,
        fragmentShader: NEBULA_FRAGMENT_SHADER,
        side: BackSide,
        depthWrite: false,
      }),
    [],
  );

  useEffect(() => {
    return () => {
      material.dispose();
    };
  }, [material]);

  useFrame(({ clock }) => {
    nebulaTimeUniform.value = clock.getElapsedTime();
  });

  if (isMobile) {
    return null;
  }

  return (
    <mesh material={material} frustumCulled={false}>
      <sphereGeometry args={[5e22, 32, 32]} />
    </mesh>
  );
}
