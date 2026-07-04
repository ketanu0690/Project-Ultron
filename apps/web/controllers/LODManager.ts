export type LodLevel = 0 | 1 | 2 | 3;

export class LODManager {
  getLevel(distance: number): LodLevel {
    if (distance > 1000) {
      return 3;
    }
    if (distance > 500) {
      return 2;
    }
    if (distance > 100) {
      return 1;
    }
    return 0;
  }
}
