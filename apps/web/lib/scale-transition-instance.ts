import { ScaleTransitionController } from '@/controllers/ScaleTransitionController';

let instance: ScaleTransitionController | null = null;

export function getScaleTransitionController(): ScaleTransitionController {
  if (!instance) {
    instance = new ScaleTransitionController();
  }

  return instance;
}

export function resetScaleTransitionController(): void {
  instance = null;
}
