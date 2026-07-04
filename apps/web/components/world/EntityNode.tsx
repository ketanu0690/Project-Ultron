'use client';

import { Edges, useCursor } from '@react-three/drei';
import { useEffect, useRef, useState } from 'react';
import type { Group } from 'three';

import { getSceneGraphManager } from '@/lib/scene-graph-instance';
import { useNavigationStore } from '@/stores/navigationStore';
import type { SceneNodeProps } from '@/types/scene';

export function EntityNode({
  entityId,
  nodeType,
  selected = false,
  parentId,
  depth,
  position,
  outlineSize,
  outlineOffset,
  onSelect,
  onDoubleClick,
  children,
}: SceneNodeProps): React.JSX.Element {
  const groupRef = useRef<Group>(null);
  const [hovered, setHovered] = useState(false);
  const currentScale = useNavigationStore((state) => state.currentScale);
  const focusEntityId = useNavigationStore((state) => state.focusEntityId);
  const setFocusEntityId = useNavigationStore(
    (state) => state.setFocusEntityId,
  );
  const isInteractive = onSelect !== undefined || onDoubleClick !== undefined;

  useCursor(hovered && isInteractive);

  const isSelected = selected || focusEntityId === entityId;

  useEffect(() => {
    const manager = getSceneGraphManager();
    manager.registerNode({
      entityId,
      nodeType,
      scale: currentScale,
      parentId,
      depth,
    });

    return () => {
      manager.unregisterNode(entityId);
    };
  }, [currentScale, depth, entityId, nodeType, parentId]);

  const handleClick = (event: { stopPropagation: () => void }): void => {
    event.stopPropagation();
    setFocusEntityId(entityId);
    onSelect?.(entityId);
  };

  const handleDoubleClick = (event: { stopPropagation: () => void }): void => {
    event.stopPropagation();
    onDoubleClick?.(entityId);
  };

  return (
    <group
      ref={groupRef}
      name={entityId}
      position={position}
      onPointerDown={(event) => {
        if (isInteractive) {
          event.stopPropagation();
        }
      }}
      onPointerOver={(event) => {
        if (!isInteractive) {
          return;
        }
        event.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={(event) => {
        if (!isInteractive) {
          return;
        }
        event.stopPropagation();
        setHovered(false);
      }}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
    >
      {children}
      {isSelected && outlineSize ? (
        <mesh position={outlineOffset}>
          <boxGeometry args={outlineSize} />
          <meshBasicMaterial visible={false} />
          <Edges color="#00E5FF" threshold={15} />
        </mesh>
      ) : null}
    </group>
  );
}
