'use client';

import { useTexture } from '@react-three/drei';
import { useMemo } from 'react';
import { LinearFilter, SRGBColorSpace, type Texture } from 'three';

import {
  createProceduralCloudTexture,
  createProceduralDayTexture,
  createProceduralNightTexture,
  createProceduralSpecularTexture,
} from '@/scenes/earth/procedural-textures';

export interface EarthTextureSet {
  readonly day: Texture;
  readonly night: Texture;
  readonly clouds: Texture;
  readonly specular: Texture;
  readonly isProcedural: boolean;
}

function configureColorTexture(texture: Texture): void {
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 8;
  texture.minFilter = LinearFilter;
  texture.magFilter = LinearFilter;
  texture.needsUpdate = true;
}

const EARTH_TEXTURE_URLS = {
  day: '/textures/earth/day.jpg',
  night: '/textures/earth/night.png',
  clouds: '/textures/earth/clouds.jpg',
  specular: '/textures/earth/specular.jpg',
} as const;

/** Satellite imagery with procedural fallback when assets are missing. */
export function useEarthTextures(): EarthTextureSet {
  const loaded = useTexture(EARTH_TEXTURE_URLS);

  return useMemo(() => {
    configureColorTexture(loaded.day);
    configureColorTexture(loaded.night);
    configureColorTexture(loaded.clouds);
    configureColorTexture(loaded.specular);

    return {
      day: loaded.day,
      night: loaded.night,
      clouds: loaded.clouds,
      specular: loaded.specular,
      isProcedural: false,
    };
  }, [loaded]);
}

/** Offline / texture-missing fallback — no network fetch. */
export function useProceduralEarthTextures(): EarthTextureSet {
  return useMemo(
    () => ({
      day: createProceduralDayTexture(),
      night: createProceduralNightTexture(),
      clouds: createProceduralCloudTexture(),
      specular: createProceduralSpecularTexture(),
      isProcedural: true,
    }),
    [],
  );
}
