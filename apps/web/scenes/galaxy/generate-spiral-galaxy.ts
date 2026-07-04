import { COLORS } from '@ultron/shared';
import {
  BufferAttribute,
  BufferGeometry as ThreeBufferGeometry,
  Color,
  AdditiveBlending,
  ShaderMaterial,
  type BufferGeometry,
} from 'three';

import {
  GALAXY_SPIRAL_FRAGMENT_SHADER,
  GALAXY_SPIRAL_VERTEX_SHADER,
} from '@/shaders/galaxy-spiral';

export interface SpiralGalaxyParameters {
  readonly count: number;
  readonly size: number;
  readonly radius: number;
  readonly branches: number;
  readonly randomness: number;
  readonly randomnessPower: number;
  readonly insideColor: string;
  readonly outsideColor: string;
}

export interface SpiralGalaxyGeometry {
  readonly geometry: BufferGeometry;
  readonly count: number;
}

export const DEFAULT_SPIRAL_GALAXY_PARAMS: SpiralGalaxyParameters = {
  count: 20_000,
  size: 36,
  radius: 5.5,
  branches: 5,
  randomness: 0.3,
  randomnessPower: 4,
  insideColor: COLORS.signalAmber,
  outsideColor: COLORS.signalPurple,
};

export const SPIRAL_GALAXY_WORLD_SCALE = 1;

export function generateSpiralGalaxy(
  params: SpiralGalaxyParameters = DEFAULT_SPIRAL_GALAXY_PARAMS,
): SpiralGalaxyGeometry {
  const geometry = new ThreeBufferGeometry();
  const positions = new Float32Array(params.count * 3);
  const colors = new Float32Array(params.count * 3);
  const scales = new Float32Array(params.count);
  const randomness = new Float32Array(params.count * 3);

  const colorInside = new Color(params.insideColor);
  const colorOutside = new Color(params.outsideColor);

  for (let i = 0; i < params.count; i += 1) {
    const i3 = i * 3;
    const radius = Math.random() * params.radius;
    const branchAngle = ((i % params.branches) / params.branches) * Math.PI * 2;

    positions[i3] = Math.cos(branchAngle) * radius;
    positions[i3 + 1] = 0;
    positions[i3 + 2] = Math.sin(branchAngle) * radius;

    const randomX =
      Math.pow(Math.random(), params.randomnessPower) *
      (Math.random() < 0.5 ? 1 : -1) *
      params.randomness *
      radius;
    const randomY =
      Math.pow(Math.random(), params.randomnessPower) *
      (Math.random() < 0.5 ? 1 : -1) *
      params.randomness *
      radius;
    const randomZ =
      Math.pow(Math.random(), params.randomnessPower) *
      (Math.random() < 0.5 ? 1 : -1) *
      params.randomness *
      radius;

    randomness[i3] = randomX;
    randomness[i3 + 1] = randomY;
    randomness[i3 + 2] = randomZ;

    const mixedColor = colorInside.clone();
    mixedColor.lerp(colorOutside, radius / params.radius);

    colors[i3] = mixedColor.r;
    colors[i3 + 1] = mixedColor.g;
    colors[i3 + 2] = mixedColor.b;

    scales[i] = Math.random();
  }

  geometry.setAttribute('position', new BufferAttribute(positions, 3));
  geometry.setAttribute('color', new BufferAttribute(colors, 3));
  geometry.setAttribute('aScale', new BufferAttribute(scales, 1));
  geometry.setAttribute('aRandomness', new BufferAttribute(randomness, 3));

  return { geometry, count: params.count };
}

export const spiralGalaxyTimeUniform = { value: 0 };

export function createSpiralGalaxyMaterial(pixelRatio: number): ShaderMaterial {
  return new ShaderMaterial({
    depthWrite: false,
    blending: AdditiveBlending,
    vertexColors: true,
    vertexShader: GALAXY_SPIRAL_VERTEX_SHADER,
    fragmentShader: GALAXY_SPIRAL_FRAGMENT_SHADER,
    uniforms: {
      uTime: spiralGalaxyTimeUniform,
      uSize: { value: 30 * pixelRatio },
    },
  });
}
