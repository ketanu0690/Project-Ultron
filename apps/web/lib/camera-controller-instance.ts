import { CameraController } from '@/controllers/CameraController';

let instance: CameraController | null = null;

export function getCameraController(): CameraController {
  if (!instance) {
    instance = new CameraController();
  }

  return instance;
}

export function resetCameraController(): void {
  instance = null;
}
