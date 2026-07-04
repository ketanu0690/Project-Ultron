import type { ScaleLevel } from '@ultron/shared';

import {
  MAX_SCENE_GRAPH_DEPTH,
  type RegisteredSceneNode,
  type SceneNodeType,
} from '@/types/scene';

export interface RegisterNodeOptions {
  readonly entityId: string;
  readonly nodeType: SceneNodeType;
  readonly scale: ScaleLevel;
  readonly parentId?: string;
  readonly depth?: number;
}

export class SceneGraphManager {
  private activeScale: ScaleLevel = 'galaxy';
  private registeredNodes = new Map<string, RegisteredSceneNode>();

  getActiveScale(): ScaleLevel {
    return this.activeScale;
  }

  setActiveScale(scale: ScaleLevel): void {
    this.activeScale = scale;
    this.purgeNodesForOtherScales(scale);
  }

  registerNode(options: RegisterNodeOptions): void {
    const depth = options.depth ?? this.resolveDepth(options.parentId);

    if (depth > MAX_SCENE_GRAPH_DEPTH) {
      throw new Error(
        `Scene graph depth ${depth} exceeds maximum ${MAX_SCENE_GRAPH_DEPTH} for entity ${options.entityId}`,
      );
    }

    this.registeredNodes.set(options.entityId, {
      entityId: options.entityId,
      nodeType: options.nodeType,
      scale: options.scale,
      parentId: options.parentId,
      depth,
    });
  }

  unregisterNode(entityId: string): void {
    this.registeredNodes.delete(entityId);
  }

  getNode(entityId: string): RegisteredSceneNode | undefined {
    return this.registeredNodes.get(entityId);
  }

  getRegisteredNodes(): readonly RegisteredSceneNode[] {
    return [...this.registeredNodes.values()];
  }

  getSelectableEntityIds(): string[] {
    return [...this.registeredNodes.values()]
      .filter((node) => node.scale === this.activeScale)
      .map((node) => node.entityId);
  }

  clear(): void {
    this.registeredNodes.clear();
  }

  private purgeNodesForOtherScales(scale: ScaleLevel): void {
    for (const [entityId, node] of this.registeredNodes) {
      if (node.scale !== scale) {
        this.registeredNodes.delete(entityId);
      }
    }
  }

  private resolveDepth(parentId?: string): number {
    if (!parentId) {
      return 1;
    }

    const parent = this.registeredNodes.get(parentId);
    return parent ? parent.depth + 1 : 1;
  }
}
