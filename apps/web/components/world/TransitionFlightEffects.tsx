'use client';

import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import type { Points } from 'three';
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  ShaderMaterial,
} from 'three';

import { useNavigationStore } from '@/stores/navigationStore';

const PARTICLE_COUNT = 200;

function createFlightParticles(): {
  geometry: BufferGeometry;
  material: ShaderMaterial;
} {
  const positions = new Float32Array(PARTICLE_COUNT * 3);
  for (let index = 0; index < PARTICLE_COUNT; index += 1) {
    positions[index * 3] = (Math.random() - 0.5) * 400;
    positions[index * 3 + 1] = (Math.random() - 0.5) * 400;
    positions[index * 3 + 2] = (Math.random() - 0.5) * 400;
  }

  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new BufferAttribute(positions, 3));

  const material = new ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
    uniforms: { uOpacity: { value: 0 } },
    vertexShader: /* glsl */ `
      void main() {
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = 6.0 * (300.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform float uOpacity;
      void main() {
        float dist = length(gl_PointCoord - vec2(0.5));
        if (dist > 0.5) discard;
        gl_FragColor = vec4(0.9, 0.95, 1.0, smoothstep(0.5, 0.0, dist) * uOpacity);
      }
    `,
  });

  return { geometry, material };
}

/** Speed-line particles during Earth → Brain City cinematic flight. */
export function TransitionFlightEffects(): React.JSX.Element | null {
  const isTransitioning = useNavigationStore((state) => state.isTransitioning);
  const currentScale = useNavigationStore((state) => state.currentScale);
  const pointsRef = useRef<Points>(null);
  const particles = useMemo(() => createFlightParticles(), []);

  useFrame((_, delta) => {
    const material = particles.material;
    const targetOpacity =
      isTransitioning && currentScale === 'earth' ? 0.65 : 0;
    material.uniforms.uOpacity.value +=
      (targetOpacity - material.uniforms.uOpacity.value) * delta * 4;

    if (pointsRef.current && material.uniforms.uOpacity.value > 0.01) {
      pointsRef.current.rotation.z += delta * 0.4;
    }
  });

  if (!isTransitioning) {
    return null;
  }

  return (
    <points
      ref={pointsRef}
      geometry={particles.geometry}
      material={particles.material}
      frustumCulled={false}
    />
  );
}
