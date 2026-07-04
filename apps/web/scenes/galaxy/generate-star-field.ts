import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry as ThreeBufferGeometry,
  ShaderMaterial,
  type BufferGeometry,
} from 'three';

export interface StarFieldGeometry {
  readonly geometry: BufferGeometry;
  readonly count: number;
}

const STAR_TYPE_COLORS: Record<string, [number, number, number]> = {
  O: [0.6, 0.7, 1.0],
  B: [0.7, 0.8, 1.0],
  A: [0.85, 0.9, 1.0],
  F: [1.0, 0.95, 0.9],
  G: [1.0, 0.92, 0.7],
  K: [1.0, 0.75, 0.5],
  M: [1.0, 0.55, 0.4],
};

function mulberry32(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function sampleGalacticPosition(rand: () => number): [number, number, number] {
  const arm = Math.floor(rand() * 4);
  const baseAngle = (arm / 4) * Math.PI * 2;
  const spiralTightness = 3.5;
  const radiusLy = 50 + rand() ** 0.6 * 25_000;
  const angle = baseAngle + (radiusLy / 25_000) * spiralTightness * Math.PI * 2;
  const scatter = (rand() - 0.5) * radiusLy * 0.15;
  const xLy = Math.cos(angle) * radiusLy + scatter;
  const zLy = Math.sin(angle) * radiusLy + scatter;
  const yLy = (rand() - 0.5) * radiusLy * 0.04 * (1 - radiusLy / 30_000);

  const scale = 1e18;
  return [xLy * scale, yLy * scale, zLy * scale];
}

function pickStarType(rand: () => number): string {
  const roll = rand();
  if (roll < 0.76) return 'M';
  if (roll < 0.88) return 'K';
  if (roll < 0.94) return 'G';
  if (roll < 0.97) return 'F';
  if (roll < 0.99) return 'A';
  return 'B';
}

export function generateStarField(
  count: number,
  seed = 77_777,
): StarFieldGeometry {
  const rand = mulberry32(seed);
  const positions = new Float32Array(count * 3);
  const magnitudes = new Float32Array(count);
  const colors = new Float32Array(count * 3);
  const twinklePhases = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    const [x, y, z] = sampleGalacticPosition(rand);
    const i3 = i * 3;
    positions[i3] = x;
    positions[i3 + 1] = y;
    positions[i3 + 2] = z;

    const magnitude = 2 + rand() * 8;
    magnitudes[i] = magnitude;

    const starType = pickStarType(rand);
    const [r, g, b] = STAR_TYPE_COLORS[starType] ?? STAR_TYPE_COLORS.G;
    colors[i3] = r;
    colors[i3 + 1] = g;
    colors[i3 + 2] = b;

    twinklePhases[i] = rand() * Math.PI * 2;
  }

  const geometry = new ThreeBufferGeometry();
  geometry.setAttribute('position', new BufferAttribute(positions, 3));
  geometry.setAttribute('magnitude', new BufferAttribute(magnitudes, 1));
  geometry.setAttribute('color', new BufferAttribute(colors, 3));
  geometry.setAttribute('twinklePhase', new BufferAttribute(twinklePhases, 1));

  return { geometry, count };
}

export const STAR_FIELD_VERTEX_SHADER = /* glsl */ `
  attribute float magnitude;
  attribute float twinklePhase;
  attribute vec3 color;

  varying vec3 vColor;
  varying float vMagnitude;
  varying float vTwinklePhase;

  void main() {
    vColor = color;
    vMagnitude = magnitude;
    vTwinklePhase = twinklePhase;

    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    float brightness = 1.0 / (magnitude * 0.3 + 1.0);
    gl_PointSize = clamp(brightness * 400.0 / -mvPosition.z, 0.5, 6.0);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

export const STAR_FIELD_FRAGMENT_SHADER = /* glsl */ `
  uniform float uTime;
  uniform float uDustLaneIntensity;

  varying vec3 vColor;
  varying float vMagnitude;
  varying float vTwinklePhase;

  void main() {
    vec2 center = gl_PointCoord - vec2(0.5);
    float dist = length(center);
    if (dist > 0.5) discard;

    float softEdge = 1.0 - smoothstep(0.2, 0.5, dist);
    float twinkle = 0.85 + 0.15 * sin(uTime * 2.0 + vTwinklePhase);
    float brightness = (1.0 / (vMagnitude * 0.25 + 1.0)) * twinkle;

    vec3 coreTint = mix(vColor, vec3(0.55, 0.45, 0.95), uDustLaneIntensity * 0.3);
    vec3 finalColor = coreTint * brightness * softEdge;

    gl_FragColor = vec4(finalColor, softEdge * brightness);
  }
`;

export const starFieldTimeUniform = { value: 0 };
export const nebulaTimeUniform = { value: 0 };

export function createStarFieldMaterial(): ShaderMaterial {
  return new ShaderMaterial({
    uniforms: {
      uTime: starFieldTimeUniform,
      uDustLaneIntensity: { value: 0.4 },
    },
    vertexShader: STAR_FIELD_VERTEX_SHADER,
    fragmentShader: STAR_FIELD_FRAGMENT_SHADER,
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
  });
}
