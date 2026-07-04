'use client';

import {
  CameraControls,
  CameraControlsImpl,
  OrthographicCamera,
  PerspectiveCamera,
} from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useRef } from 'react';

import { cameraStatesEqual } from '@/lib/camera-constraints';
import { hasWheelDollyControl } from '@/lib/camera-interaction';
import { getCameraController } from '@/lib/camera-controller-instance';
import { getCameraPreset } from '@/lib/camera-presets';
import { useNavigationStore } from '@/stores/navigationStore';

type CameraControlsRef = InstanceType<typeof CameraControlsImpl>;

export function CameraRig(): React.JSX.Element {
  const controlsRef = useRef<CameraControlsRef>(null);
  const previousScaleRef = useRef(useNavigationStore.getState().currentScale);
  const controller = getCameraController();

  const currentScale = useNavigationStore((state) => state.currentScale);
  const setCameraState = useNavigationStore((state) => state.setCameraState);
  const saveCameraStateForScale = useNavigationStore(
    (state) => state.saveCameraStateForScale,
  );
  const getCameraStateForScale = useNavigationStore(
    (state) => state.getCameraStateForScale,
  );
  const isTransitioning = useNavigationStore((state) => state.isTransitioning);
  const isScrollJourneyComplete = useNavigationStore(
    (state) => state.isScrollJourneyComplete,
  );

  const preset = getCameraPreset(currentScale);
  const isOrthographic = preset.cameraType === 'orthographic';
  const [px, py, pz] = preset.defaultPosition;

  const invalidate = useThree((state) => state.invalidate);

  useEffect(() => {
    controller.configureControlsImpl(CameraControlsImpl);
  }, [controller]);

  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls) {
      return;
    }

    const previousScale = previousScaleRef.current;

    if (previousScale !== currentScale) {
      controller.attach(controls.camera, controls);
      const persisted = controller.syncFromControls();
      saveCameraStateForScale(previousScale, persisted);
    } else {
      controller.attach(controls.camera, controls);
    }

    const restoredState = getCameraStateForScale(currentScale);
    const nextState = controller.setScale(currentScale, {
      restoreState: restoredState,
    });
    setCameraState(nextState);
    controller.setInputEnabled(!isTransitioning);
    previousScaleRef.current = currentScale;
    invalidate();
  }, [
    controller,
    currentScale,
    getCameraStateForScale,
    invalidate,
    isTransitioning,
    saveCameraStateForScale,
    setCameraState,
  ]);

  useEffect(() => {
    const wheelDolly =
      hasWheelDollyControl(currentScale, isScrollJourneyComplete) &&
      !isTransitioning;
    controller.setInputEnabled(!isTransitioning);
    controller.setWheelDollyEnabled(wheelDolly);
  }, [controller, currentScale, isScrollJourneyComplete, isTransitioning]);

  useFrame((_state, delta) => {
    controller.update(delta);
  });

  const handleControlEnd = (): void => {
    const controls = controlsRef.current;
    if (!controls) {
      return;
    }

    controller.attach(controls.camera, controls);
    const nextState = controller.syncFromControls();
    const currentStored = useNavigationStore.getState().cameraState;

    if (!cameraStatesEqual(currentStored, nextState)) {
      setCameraState(nextState);
      saveCameraStateForScale(currentScale, nextState);
    }
  };

  return (
    <>
      {isOrthographic ? (
        <OrthographicCamera
          makeDefault
          position={[px, py, pz]}
          near={preset.near}
          far={preset.far}
          zoom={preset.defaultZoom}
        />
      ) : (
        <PerspectiveCamera
          makeDefault
          position={[px, py, pz]}
          fov={preset.fov}
          near={preset.near}
          far={preset.far}
        />
      )}
      <CameraControls
        ref={controlsRef}
        makeDefault
        onEnd={handleControlEnd}
        minPolarAngle={0}
        maxPolarAngle={Math.PI}
      />
    </>
  );
}
