import { CanvasTexture } from 'three';

function createCanvas(width: number, height: number): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  return canvas;
}

function hash2D(x: number, y: number): number {
  const value = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return value - Math.floor(value);
}

function smoothNoise(x: number, y: number): number {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const fx = x - ix;
  const fy = y - iy;
  const ux = fx * fx * (3 - 2 * fx);
  const uy = fy * fy * (3 - 2 * fy);

  const a = hash2D(ix, iy);
  const b = hash2D(ix + 1, iy);
  const c = hash2D(ix, iy + 1);
  const d = hash2D(ix + 1, iy + 1);

  return a + (b - a) * ux + (c - a) * uy + (a - b - c + d) * ux * uy;
}

function fbm(x: number, y: number, octaves: number): number {
  let value = 0;
  let amplitude = 0.5;
  let frequency = 1;
  for (let index = 0; index < octaves; index += 1) {
    value += amplitude * smoothNoise(x * frequency, y * frequency);
    amplitude *= 0.5;
    frequency *= 2;
  }
  return value;
}

/** Procedural day texture — noise-based continents (offline fallback). */
export function createProceduralDayTexture(): CanvasTexture {
  const canvas = createCanvas(2048, 1024);
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return new CanvasTexture(canvas);
  }

  const imageData = ctx.createImageData(canvas.width, canvas.height);
  const data = imageData.data;

  for (let y = 0; y < canvas.height; y += 1) {
    for (let x = 0; x < canvas.width; x += 1) {
      const u = x / canvas.width;
      const v = y / canvas.height;
      const nx = u * 6;
      const ny = v * 3;
      const elevation = fbm(nx, ny, 5);
      const isLand = elevation > 0.52;
      const isMountain = elevation > 0.68;

      let r: number;
      let g: number;
      let b: number;

      if (isLand) {
        r = isMountain ? 90 : 45;
        g = isMountain ? 80 : 110;
        b = isMountain ? 55 : 40;
      } else {
        const depth = 1 - elevation;
        r = 15 + depth * 25;
        g = 45 + depth * 55;
        b = 95 + depth * 80;
      }

      const polar = Math.abs(v - 0.5) * 2;
      if (polar > 0.82) {
        r = 220;
        g = 230;
        b = 240;
      }

      const index = (y * canvas.width + x) * 4;
      data[index] = r;
      data[index + 1] = g;
      data[index + 2] = b;
      data[index + 3] = 255;
    }
  }

  ctx.putImageData(imageData, 0, 0);

  const texture = new CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

/** Procedural night lights — emissive clusters on dark side. */
export function createProceduralNightTexture(): CanvasTexture {
  const canvas = createCanvas(2048, 1024);
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return new CanvasTexture(canvas);
  }

  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#ffe4b5';
  const clusters: Array<{ x: number; y: number; r: number }> = [
    { x: 380, y: 420, r: 40 },
    { x: 580, y: 350, r: 30 },
    { x: 1050, y: 400, r: 55 },
    { x: 1250, y: 320, r: 35 },
    { x: 1750, y: 450, r: 25 },
    { x: 920, y: 520, r: 20 },
    { x: 1380, y: 580, r: 18 },
  ];

  for (const cluster of clusters) {
    const gradient = ctx.createRadialGradient(
      cluster.x,
      cluster.y,
      0,
      cluster.x,
      cluster.y,
      cluster.r,
    );
    gradient.addColorStop(0, 'rgba(255, 228, 181, 0.95)');
    gradient.addColorStop(0.5, 'rgba(255, 228, 181, 0.4)');
    gradient.addColorStop(1, 'rgba(255, 228, 181, 0)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(cluster.x, cluster.y, cluster.r, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

/** Procedural cloud alpha map. */
export function createProceduralCloudTexture(): CanvasTexture {
  const canvas = createCanvas(2048, 1024);
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return new CanvasTexture(canvas);
  }

  ctx.fillStyle = 'rgba(0,0,0,0)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let index = 0; index < 180; index += 1) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const radius = 30 + Math.random() * 90;
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.65)');
    gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.25)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

/** Ocean mask — bright oceans, dark land (for specular highlights). */
export function createProceduralSpecularTexture(): CanvasTexture {
  const day = createProceduralDayTexture();
  const canvas = createCanvas(2048, 1024);
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return new CanvasTexture(canvas);
  }

  ctx.drawImage(day.image as CanvasImageSource, 0, 0);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  for (let index = 0; index < data.length; index += 4) {
    const r = data[index] ?? 0;
    const g = data[index + 1] ?? 0;
    const b = data[index + 2] ?? 0;
    const isOcean = b > r && b > g;
    const shade = isOcean ? 255 : 0;
    data[index] = shade;
    data[index + 1] = shade;
    data[index + 2] = shade;
  }

  ctx.putImageData(imageData, 0, 0);
  day.dispose();

  const texture = new CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}
