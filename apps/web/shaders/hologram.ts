import { shaderMaterial } from '@react-three/drei';
import { extend } from '@react-three/fiber';
import type { Material, ShaderMaterial } from 'three';
import * as THREE from 'three';

export interface HologramShaderUniforms {
  uTime: number;
  uColor: THREE.Color;
  uPulse: number;
  uScanDensity: number;
  uOpacity: number;
}

const HologramMaterialImpl = shaderMaterial(
  {
    uTime: 0,
    uColor: new THREE.Color('#A855F7'),
    uPulse: 0,
    uScanDensity: 40,
    uOpacity: 0.85,
  },
  /* glsl */ `
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    varying vec2 vUv;

    void main() {
      vNormal = normalize(normalMatrix * normal);
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      vViewPosition = -mvPosition.xyz;
      vUv = uv;
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  /* glsl */ `
    uniform float uTime;
    uniform vec3 uColor;
    uniform float uPulse;
    uniform float uScanDensity;
    uniform float uOpacity;

    varying vec3 vNormal;
    varying vec3 vViewPosition;
    varying vec2 vUv;

    void main() {
      vec3 viewDir = normalize(vViewPosition);
      float fresnel = pow(1.0 - max(dot(viewDir, vNormal), 0.0), 2.5);
      float scan = sin((vUv.y + uTime * 0.35) * uScanDensity) * 0.5 + 0.5;
      float pulse = 0.65 + uPulse * 0.35;
      vec3 color = uColor * (0.45 + fresnel * 0.9 + scan * 0.15) * pulse;
      float alpha = uOpacity * (0.35 + fresnel * 0.65);
      gl_FragColor = vec4(color, alpha);
    }
  `,
);

export const HologramMaterial = HologramMaterialImpl;
export type HologramMaterialType = ShaderMaterial & HologramShaderUniforms;

extend({ HologramMaterial });

declare module '@react-three/fiber' {
  interface ThreeElements {
    hologramMaterial: THREE.ShaderMaterialParameters & {
      ref?: React.Ref<HologramMaterialType>;
      uTime?: number;
      uColor?: THREE.Color;
      uPulse?: number;
      uScanDensity?: number;
      uOpacity?: number;
    };
  }
}

export function updateHologramMaterial(
  material: Material | null | undefined,
  uniforms: Partial<HologramShaderUniforms>,
): void {
  if (!material || !(material instanceof THREE.ShaderMaterial)) {
    return;
  }
  const shader = material as HologramMaterialType;
  if (uniforms.uTime !== undefined) {
    shader.uniforms.uTime!.value = uniforms.uTime;
  }
  if (uniforms.uColor !== undefined) {
    shader.uniforms.uColor!.value = uniforms.uColor;
  }
  if (uniforms.uPulse !== undefined) {
    shader.uniforms.uPulse!.value = uniforms.uPulse;
  }
  if (uniforms.uScanDensity !== undefined) {
    shader.uniforms.uScanDensity!.value = uniforms.uScanDensity;
  }
  if (uniforms.uOpacity !== undefined) {
    shader.uniforms.uOpacity!.value = uniforms.uOpacity;
  }
}
