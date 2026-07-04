import { ShaderMaterial, Vector3, type IUniform } from 'three';

export interface AtmosphereUniforms {
  sunDirection: IUniform<Vector3>;
  atmosphereDensity: IUniform<number>;
  glowColor: IUniform<Vector3>;
}

export function createAtmosphereUniforms(): AtmosphereUniforms {
  return {
    sunDirection: { value: new Vector3(1, 0, 0) },
    atmosphereDensity: { value: 1.0 },
    glowColor: { value: new Vector3(0.27, 0.53, 1.0) },
  };
}

export const atmosphereVertexShader = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vViewPosition;

  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vViewPosition = -mvPosition.xyz;
    gl_Position = projectionMatrix * mvPosition;
  }
`;

export const atmosphereFragmentShader = /* glsl */ `
  uniform vec3 sunDirection;
  uniform float atmosphereDensity;
  uniform vec3 glowColor;

  varying vec3 vNormal;
  varying vec3 vViewPosition;

  void main() {
    vec3 viewDir = normalize(vViewPosition);
    vec3 normal = normalize(vNormal);
    float sunDot = dot(normal, sunDirection);
    float rim = 1.0 - max(dot(viewDir, normal), 0.0);
    rim = pow(rim, 2.8);

    float daySide = smoothstep(-0.2, 0.35, sunDot);
    float scatter = rim * (0.35 + (1.0 - daySide) * 0.65) * atmosphereDensity;

    vec3 dayGlow = vec3(0.25, 0.55, 1.0);
    vec3 sunsetGlow = vec3(1.0, 0.45, 0.12);
    float sunsetBand = smoothstep(-0.08, 0.12, sunDot) * (1.0 - smoothstep(0.12, 0.38, sunDot));

    vec3 color = mix(dayGlow, sunsetGlow, sunsetBand * 0.75) * scatter;
    color += glowColor * scatter * 0.35;
    float alpha = scatter * 0.92;

    gl_FragColor = vec4(color, alpha);
  }
`;

export function createAtmosphereMaterial(
  uniforms: AtmosphereUniforms,
): ShaderMaterial {
  return new ShaderMaterial({
    uniforms: uniforms as unknown as { [uniform: string]: IUniform<unknown> },
    vertexShader: atmosphereVertexShader,
    fragmentShader: atmosphereFragmentShader,
    transparent: true,
    depthWrite: false,
    side: 2,
  });
}
