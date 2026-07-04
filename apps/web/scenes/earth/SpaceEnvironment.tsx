'use client';

import { useMemo } from 'react';
import {
  BackSide,
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  ShaderMaterial,
} from 'three';

import { EARTH_RADIUS_M } from '@/scenes/earth/earth.mock';

const STAR_COUNT = 4_000;
const STAR_SPHERE_RADIUS = EARTH_RADIUS_M * 8;

function mulberry32(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function createSpaceStarField(): {
  geometry: BufferGeometry;
  material: ShaderMaterial;
} {
  const rand = mulberry32(42);
  const positions = new Float32Array(STAR_COUNT * 3);
  const colors = new Float32Array(STAR_COUNT * 3);
  const sizes = new Float32Array(STAR_COUNT);

  for (let index = 0; index < STAR_COUNT; index += 1) {
    const theta = rand() * Math.PI * 2;
    const phi = Math.acos(2 * rand() - 1);
    const radius = STAR_SPHERE_RADIUS * (0.85 + rand() * 0.15);
    positions[index * 3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[index * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    positions[index * 3 + 2] = radius * Math.cos(phi);

    const warmth = 0.7 + rand() * 0.3;
    colors[index * 3] = warmth;
    colors[index * 3 + 1] = warmth * (0.85 + rand() * 0.1);
    colors[index * 3 + 2] = 0.95 + rand() * 0.05;
    sizes[index] = 0.5 + rand() * 2.5;
  }

  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new BufferAttribute(positions, 3));
  geometry.setAttribute('color', new BufferAttribute(colors, 3));
  geometry.setAttribute('size', new BufferAttribute(sizes, 1));

  const material = new ShaderMaterial({
    transparent: true,
    depthWrite: false,
    depthTest: true,
    blending: AdditiveBlending,
    vertexColors: true,
    uniforms: {
      uPixelRatio: {
        value: Math.min(
          typeof window !== 'undefined' ? window.devicePixelRatio : 1,
          2,
        ),
      },
    },
    vertexShader: /* glsl */ `
      attribute float size;
      varying vec3 vColor;
      uniform float uPixelRatio;

      void main() {
        vColor = color;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = size * uPixelRatio * (300.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: /* glsl */ `
      varying vec3 vColor;

      void main() {
        float dist = length(gl_PointCoord - vec2(0.5));
        if (dist > 0.5) discard;
        float alpha = smoothstep(0.5, 0.1, dist);
        gl_FragColor = vec4(vColor, alpha * 0.9);
      }
    `,
  });

  return { geometry, material };
}

const nebulaVertexShader = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vWorldPosition;

  void main() {
    vUv = uv;
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPosition.xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const nebulaFragmentShader = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vWorldPosition;

  void main() {
    float dist = length(vUv - 0.5) * 2.0;
    float alpha = smoothstep(1.0, 0.2, dist) * 0.18;
    vec3 magenta = vec3(0.55, 0.12, 0.45);
    vec3 orange = vec3(0.85, 0.35, 0.12);
    vec3 color = mix(magenta, orange, vUv.y);
    gl_FragColor = vec4(color, alpha);
  }
`;

export function SpaceEnvironment(): React.JSX.Element {
  const starField = useMemo(() => createSpaceStarField(), []);
  const nebulaMaterial = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader: nebulaVertexShader,
        fragmentShader: nebulaFragmentShader,
        transparent: true,
        depthWrite: false,
        side: BackSide,
      }),
    [],
  );

  return (
    <group name="space-environment">
      <points
        geometry={starField.geometry}
        material={starField.material}
        frustumCulled={false}
        raycast={() => null}
      />
      <mesh scale={STAR_SPHERE_RADIUS * 1.6} raycast={() => null}>
        <sphereGeometry args={[1, 32, 32]} />
        <primitive object={nebulaMaterial} attach="material" />
      </mesh>
    </group>
  );
}
