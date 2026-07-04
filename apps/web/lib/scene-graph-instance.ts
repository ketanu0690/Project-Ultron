import { SceneGraphManager } from '@/controllers/SceneGraphManager';

let instance: SceneGraphManager | null = null;

export function getSceneGraphManager(): SceneGraphManager {
  if (!instance) {
    instance = new SceneGraphManager();
  }

  return instance;
}

export function resetSceneGraphManager(): void {
  instance = null;
}
