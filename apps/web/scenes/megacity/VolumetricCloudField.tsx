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

const CLOUD_COUNT = 120;

function createCloudField(): {
  geometry: BufferGeometry;
  material: ShaderMaterial;
} {
  const positions = new Float32Array(CLOUD_COUNT * 3);
  const scales = new Float32Array(CLOUD_COUNT);

  for (let index = 0; index < CLOUD_COUNT; index += 1) {
    positions[index * 3] = (Math.random() - 0.5) * 12000;
    positions[index * 3 + 1] = 200 + Math.random() * 900;
    positions[index * 3 + 2] = (Math.random() - 0.5) * 12000;
    scales[index] = 80 + Math.random() * 220;
  }

  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new BufferAttribute(positions, 3));
  geometry.setAttribute('aScale', new BufferAttribute(scales, 1));

  const material = new ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
    uniforms: {
      uTime: { value: 0 },
    },
    vertexShader: /* glsl */ `
      attribute float aScale;
      varying float vAlpha;
      uniform float uTime;

      void main() {
        vec3 pos = position;
        pos.x += sin(uTime * 0.08 + position.z * 0.001) * 40.0;
        pos.z += cos(uTime * 0.06 + position.x * 0.001) * 40.0;
        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_PointSize = aScale * (400.0 / -mvPosition.z);
        vAlpha = 0.15 + aScale * 0.0004;
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: /* glsl */ `
      varying float vAlpha;

      void main() {
        float dist = length(gl_PointCoord - vec2(0.5));
        if (dist > 0.5) discard;
        float alpha = smoothstep(0.5, 0.0, dist) * vAlpha;
        gl_FragColor = vec4(1.0, 0.85, 0.75, alpha);
      }
    `,
  });

  return { geometry, material };
}

export function VolumetricCloudField(): React.JSX.Element {
  const pointsRef = useRef<Points>(null);
  const cloudField = useMemo(() => createCloudField(), []);

  useFrame(({ clock }) => {
    // R3F per-frame uniform mutation — intentional Three.js imperative API.
    // eslint-disable-next-line react-hooks/immutability -- ShaderMaterial.uniforms
    cloudField.material.uniforms.uTime.value = clock.getElapsedTime();
  });

  return (
    <points
      ref={pointsRef}
      geometry={cloudField.geometry}
      material={cloudField.material}
      frustumCulled={false}
      raycast={() => null}
    />
  );
}
