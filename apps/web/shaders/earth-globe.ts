import { ShaderMaterial, Vector3, type IUniform, type Texture } from 'three';

export interface EarthGlobeUniforms {
  dayMap: IUniform<Texture>;
  nightMap: IUniform<Texture>;
  specularMap: IUniform<Texture>;
  sunDirection: IUniform<Vector3>;
  vitality: IUniform<number>;
}

export const earthGlobeVertexShader = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vWorldPosition;

  void main() {
    vUv = uv;
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPosition.xyz;
    vNormal = normalize((modelMatrix * vec4(normal, 0.0)).xyz);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const earthGlobeFragmentShader = /* glsl */ `
  uniform sampler2D dayMap;
  uniform sampler2D nightMap;
  uniform sampler2D specularMap;
  uniform vec3 sunDirection;
  uniform float vitality;

  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vWorldPosition;

  void main() {
    vec3 normal = normalize(vNormal);
    vec3 sunDir = normalize(sunDirection);
    vec3 viewDir = normalize(cameraPosition - vWorldPosition);

    vec3 dayColor = texture2D(dayMap, vUv).rgb;
    vec3 nightColor = texture2D(nightMap, vUv).rgb;
    float oceanMask = texture2D(specularMap, vUv).r;

    float sunDot = dot(normal, sunDir);
    float dayMix = smoothstep(-0.22, 0.45, sunDot);

    vec3 litDay = dayColor * (0.55 + vitality * 0.45);
    vec3 nightGlow = nightColor * (1.2 + length(nightColor) * 1.8);
    nightGlow = max(nightGlow, vec3(0.1));
    vec3 color = mix(nightGlow, litDay, dayMix);

    // Ocean specular glint
    vec3 reflectDir = reflect(-sunDir, normal);
    float specular = pow(max(dot(reflectDir, viewDir), 0.0), 42.0);
    color += vec3(0.45, 0.55, 0.7) * specular * oceanMask * dayMix;

    // Terminator twilight band
    float twilight = smoothstep(-0.35, -0.05, sunDot) * (1.0 - smoothstep(-0.05, 0.25, sunDot));
    color += vec3(0.22, 0.08, 0.02) * twilight;

    // Limb darkening on day side
    float limb = pow(max(dot(normal, viewDir), 0.0), 0.35);
    color *= mix(0.82, 1.0, limb);

    gl_FragColor = vec4(color, 1.0);
  }
`;

export function createEarthGlobeMaterial(
  dayMap: Texture,
  nightMap: Texture,
  specularMap: Texture,
  sunDirection: readonly [number, number, number],
  vitality: number,
): ShaderMaterial {
  const uniforms: EarthGlobeUniforms = {
    dayMap: { value: dayMap },
    nightMap: { value: nightMap },
    specularMap: { value: specularMap },
    sunDirection: { value: new Vector3(...sunDirection) },
    vitality: { value: vitality },
  };

  return new ShaderMaterial({
    uniforms: uniforms as unknown as { [uniform: string]: IUniform<unknown> },
    vertexShader: earthGlobeVertexShader,
    fragmentShader: earthGlobeFragmentShader,
    transparent: false,
    depthWrite: true,
    depthTest: true,
  });
}
