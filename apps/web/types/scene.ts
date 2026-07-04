import type { ScaleLevel } from '@ultron/shared';

export type SceneNodeType =
  | 'world_root'
  | 'scale_node'
  | 'district_node'
  | 'building_node'
  | 'floor_node'
  | 'room_node'
  | 'agent_node'
  | 'memory_node'
  | 'star_system_node'
  | 'earth_marker_node'
  | 'ring_segment_node'
  | 'effect_node'
  | 'label_node';

export interface RegisteredSceneNode {
  readonly entityId: string;
  readonly nodeType: SceneNodeType;
  readonly scale: ScaleLevel;
  readonly parentId?: string;
  readonly depth: number;
}

export interface SceneNodeProps {
  readonly entityId: string;
  readonly nodeType: SceneNodeType;
  readonly selected?: boolean;
  readonly lod?: number;
  readonly parentId?: string;
  readonly depth?: number;
  readonly position?: readonly [number, number, number];
  readonly outlineSize?: readonly [number, number, number];
  readonly outlineOffset?: readonly [number, number, number];
  readonly onSelect?: (entityId: string) => void;
  readonly onDoubleClick?: (entityId: string) => void;
  readonly children: React.ReactNode;
}

/** Maximum scene graph depth — Root to memory node. */
export const MAX_SCENE_GRAPH_DEPTH = 10;
