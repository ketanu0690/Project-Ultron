'use client';

import { Suspense, useEffect } from 'react';

import { lazyScaleScenes } from '@/lib/scene-loaders';
import { getSceneGraphManager } from '@/lib/scene-graph-instance';
import { useNavigationStore } from '@/stores/navigationStore';

function SceneFallback(): null {
  return null;
}

export function SceneRouter(): React.JSX.Element {
  const currentScale = useNavigationStore((state) => state.currentScale);
  const ActiveScene = lazyScaleScenes[currentScale];

  useEffect(() => {
    getSceneGraphManager().setActiveScale(currentScale);
  }, [currentScale]);

  return (
    <Suspense fallback={<SceneFallback />}>
      <ActiveScene />
    </Suspense>
  );
}
