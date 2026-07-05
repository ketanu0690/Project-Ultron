import { CameraControlsImpl } from '@react-three/drei';
import {
  GROUND_PLANE_Y,
  MAX_CAMERA_FOV,
  MIN_CAMERA_FOV,
  type CameraSpecialMode,
  type CameraState,
  type ScaleLevel,
} from '@ultron/shared';
import {
  OrthographicCamera,
  PerspectiveCamera,
  Vector3,
  type Camera,
} from 'three';

import {
  applyScaleConstraints,
  clampFov,
  computeScaledSpeed,
  toVec3,
} from '@/lib/camera-constraints';
import {
  applyEasing,
  interpolateAlongPath,
  type TransitionPath,
} from '@/lib/transition-paths';
import {
  createDefaultCameraState,
  getCameraPreset,
  type CameraPreset,
} from '@/lib/camera-presets';

const _position = new Vector3();
const _target = new Vector3();

interface ActivePathAnimation {
  readonly path: TransitionPath;
  elapsedMs: number;
  readonly onComplete: () => void;
}

export interface CameraControllerOptions {
  readonly groundY?: number;
}

export class CameraController {
  private camera: Camera | null = null;
  private controls: CameraControlsImpl | null = null;
  private scale: ScaleLevel = 'galaxy';
  private specialMode: CameraSpecialMode = 'default';
  private groundY: number;
  private inputEnabled = true;
  private wheelDollyEnabled = true;
  private lastPersistedState: CameraState | null = null;
  private activePath: ActivePathAnimation | null = null;

  constructor(options: CameraControllerOptions = {}) {
    this.groundY = options.groundY ?? GROUND_PLANE_Y;
  }

  attach(camera: Camera, controls: CameraControlsImpl): void {
    this.camera = camera;
    this.controls = controls;
    this.configureForScale(this.getPreset());
  }

  detach(): void {
    this.controls = null;
    this.camera = null;
  }

  getScale(): ScaleLevel {
    return this.scale;
  }

  getPreset(): CameraPreset {
    return getCameraPreset(this.scale);
  }

  getSpecialMode(): CameraSpecialMode {
    return this.specialMode;
  }

  isInputEnabled(): boolean {
    return (
      this.inputEnabled &&
      this.specialMode !== 'cinematic' &&
      this.activePath === null
    );
  }

  isAnimatingPath(): boolean {
    return this.activePath !== null;
  }

  startPathAnimation(path: TransitionPath, onComplete: () => void): void {
    this.activePath = {
      path,
      elapsedMs: 0,
      onComplete,
    };
    this.setSpecialMode('cinematic');
  }

  skipPathAnimation(): void {
    if (!this.activePath) {
      return;
    }

    const { path, onComplete } = this.activePath;
    const lastFrame = path.controlPoints[path.controlPoints.length - 1];
    void this.controls?.setLookAt(
      lastFrame.position[0],
      lastFrame.position[1],
      lastFrame.position[2],
      lastFrame.lookAt[0],
      lastFrame.lookAt[1],
      lastFrame.lookAt[2],
      false,
    );
    this.finishPathAnimation();
    onComplete();
  }

  private finishPathAnimation(): void {
    this.activePath = null;
    this.setSpecialMode('default');
  }

  setScale(
    scale: ScaleLevel,
    options?: { restoreState?: CameraState; persistCurrent?: CameraState },
  ): CameraState {
    if (options?.persistCurrent) {
      this.lastPersistedState = options.persistCurrent;
    }

    this.scale = scale;
    const preset = this.getPreset();
    this.groundY = preset.groundY ?? GROUND_PLANE_Y;
    const nextState = options?.restoreState ?? createDefaultCameraState(scale);

    this.applyCameraProjection(preset);
    void this.setState(nextState);
    this.configureForScale(preset);

    return nextState;
  }

  setSpecialMode(mode: CameraSpecialMode): void {
    this.specialMode = mode;

    if (!this.controls) {
      return;
    }

    if (mode === 'cinematic') {
      this.controls.enabled = false;
      return;
    }

    this.controls.enabled = this.inputEnabled;
  }

  setInputEnabled(enabled: boolean): void {
    this.inputEnabled = enabled;

    if (this.controls && this.isInputEnabled()) {
      this.controls.enabled = true;
    } else if (this.controls) {
      this.controls.enabled = false;
    }
  }

  setWheelDollyEnabled(enabled: boolean): void {
    this.wheelDollyEnabled = enabled;
    this.applyWheelBinding();
  }

  getDollyDistance(): number {
    if (!this.controls) {
      return 0;
    }

    this.controls.getPosition(_position);
    this.controls.getTarget(_target);
    return _position.distanceTo(_target);
  }

  isDollyAtMin(epsilon = 0.08): boolean {
    if (!this.controls) {
      return false;
    }

    return this.getDollyDistance() <= this.controls.minDistance + epsilon;
  }

  isDollyAtMax(epsilon = 0.08): boolean {
    if (!this.controls) {
      return false;
    }

    return this.getDollyDistance() >= this.controls.maxDistance - epsilon;
  }

  private applyWheelBinding(): void {
    if (!this.controls) {
      return;
    }

    const controlsImpl = this.controlsImpl ?? CameraControlsImpl;
    const { ACTION } = controlsImpl;
    this.controls.mouseButtons.wheel = this.wheelDollyEnabled
      ? ACTION.DOLLY
      : ACTION.NONE;
  }

  private controlsImpl: typeof CameraControlsImpl | null = null;

  async reset(): Promise<void> {
    const state = createDefaultCameraState(this.scale);
    await this.setState(state, true);
  }

  async fitToView(): Promise<void> {
    await this.reset();
  }

  async dollyBy(multiplier: number): Promise<void> {
    if (!this.controls) {
      return;
    }

    const preset = this.getPreset();
    this.controls.getPosition(_position);
    this.controls.getTarget(_target);

    const offset = _position.clone().sub(_target);
    const distance = offset.length();
    if (distance <= 0) {
      return;
    }

    const nextDistance = Math.min(
      preset.maxDistance,
      Math.max(preset.minDistance, distance * multiplier),
    );
    offset.normalize().multiplyScalar(nextDistance);
    const nextPosition = _target.clone().add(offset);

    await this.controls.setLookAt(
      nextPosition.x,
      nextPosition.y,
      nextPosition.z,
      _target.x,
      _target.y,
      _target.z,
      true,
    );
    this.applyConstraints();
  }

  getState(): CameraState {
    if (this.controls) {
      return this.readStateFromControls();
    }

    return createDefaultCameraState(this.scale);
  }

  async setState(state: CameraState, animate = false): Promise<void> {
    const preset = this.getPreset();
    const constrainedPosition = applyScaleConstraints(
      state.position,
      preset.minAltitude,
      this.groundY,
    );
    const clampedFov = clampFov(state.fov, MIN_CAMERA_FOV, MAX_CAMERA_FOV);

    this.applyCameraProjection(preset, clampedFov, state.zoom);

    if (!this.controls) {
      return;
    }

    await this.controls.setLookAt(
      constrainedPosition.x,
      constrainedPosition.y,
      constrainedPosition.z,
      state.target.x,
      state.target.y,
      state.target.z,
      animate,
    );
  }

  syncFromControls(): CameraState {
    const state = this.readStateFromControls();
    this.lastPersistedState = state;
    return state;
  }

  nudgePosition(position: readonly [number, number, number]): void {
    if (!this.controls) {
      return;
    }
    const state = this.readStateFromControls();
    void this.controls.setLookAt(
      position[0],
      position[1],
      position[2],
      state.target.x,
      state.target.y,
      state.target.z,
      false,
    );
    this.lastPersistedState = this.readStateFromControls();
  }

  getScaledSpeed(altitude?: number): number {
    const preset = this.getPreset();
    const currentAltitude =
      altitude ?? this.readStateFromControls().position.y - this.groundY;

    return computeScaledSpeed(
      preset.baseSpeed,
      Math.max(currentAltitude, preset.referenceAltitude * 0.01),
      preset.referenceAltitude,
    );
  }

  applyConstraints(): CameraState {
    const state = this.readStateFromControls();
    const preset = this.getPreset();
    const constrained = applyScaleConstraints(
      state.position,
      preset.minAltitude,
      this.groundY,
    );

    if (
      constrained.x !== state.position.x ||
      constrained.y !== state.position.y ||
      constrained.z !== state.position.z
    ) {
      void this.controls?.setPosition(
        constrained.x,
        constrained.y,
        constrained.z,
        false,
      );
    }

    return { ...state, position: constrained };
  }

  update(delta: number): void {
    if (this.activePath && this.controls) {
      this.activePath.elapsedMs += delta * 1000;
      const { path, elapsedMs, onComplete } = this.activePath;
      const rawT = Math.min(elapsedMs / path.duration, 1);
      const easedT = applyEasing(rawT, path.easing);
      const frame = interpolateAlongPath(path.controlPoints, easedT);

      void this.controls.setLookAt(
        frame.position.x,
        frame.position.y,
        frame.position.z,
        frame.target.x,
        frame.target.y,
        frame.target.z,
        false,
      );

      if (rawT >= 1) {
        this.finishPathAnimation();
        onComplete();
      }
      return;
    }

    if (!this.controls || !this.isInputEnabled()) {
      return;
    }

    const preset = this.getPreset();
    if (preset.controlsProfile === 'city_overview' && this.controls) {
      this.controls.getPosition(_position);
      this.controls.getTarget(_target);
      const distance = _position.distanceTo(_target);
      const distanceFactor = Math.max(
        distance / Math.max(preset.referenceAltitude, 1),
        0.75,
      );
      const speed = this.getScaledSpeed(preset.referenceAltitude);
      const baseDolly = Math.max(speed * 0.002, 0.01);
      const baseTruck = Math.max(speed * 0.001, 0.01);
      this.controls.dollySpeed = baseDolly * distanceFactor;
      this.controls.truckSpeed = baseTruck * distanceFactor * 2.5;
    } else if (preset.controlMode === 'pan_log_zoom') {
      this.controls.getPosition(_position);
      this.controls.getTarget(_target);
      const distance = _position.distanceTo(_target);
      const logFactor = Math.max(
        Math.log10(distance / Math.max(preset.minDistance, 1)),
        0.1,
      );
      const speed = this.getScaledSpeed(preset.referenceAltitude);
      this.controls.dollySpeed = Math.max(speed * 0.002, 0.01) * logFactor;
    }

    this.applyConstraints();
  }

  configureControlsImpl(controlsImpl: typeof CameraControlsImpl): void {
    this.controlsImpl = controlsImpl;
    const preset = this.getPreset();
    this.applyControlsProfile(controlsImpl, preset);
    this.applyWheelBinding();
  }

  private readStateFromControls(): CameraState {
    const preset = this.getPreset();

    if (this.controls) {
      this.controls.getPosition(_position);
      this.controls.getTarget(_target);
    } else if (this.camera) {
      this.camera.getWorldPosition(_position);
      _target.copy(_position).add(new Vector3(0, 0, -1));
    } else {
      const defaults = createDefaultCameraState(this.scale);
      return defaults;
    }

    const fov =
      this.camera instanceof PerspectiveCamera
        ? clampFov(this.camera.fov, MIN_CAMERA_FOV, MAX_CAMERA_FOV)
        : preset.fov;

    const zoom =
      this.camera instanceof OrthographicCamera
        ? this.camera.zoom
        : preset.defaultZoom;

    return {
      position: toVec3(_position.x, _position.y, _position.z),
      target: toVec3(_target.x, _target.y, _target.z),
      fov,
      zoom,
      controlMode: preset.controlMode,
    };
  }

  private applyCameraProjection(
    preset: CameraPreset,
    fov = preset.fov,
    zoom = preset.defaultZoom,
  ): void {
    if (!this.camera) {
      return;
    }

    if (this.camera instanceof PerspectiveCamera) {
      this.camera.fov = clampFov(fov, MIN_CAMERA_FOV, MAX_CAMERA_FOV);
      this.camera.near = preset.near;
      this.camera.far = preset.far;
      this.camera.updateProjectionMatrix();
      return;
    }

    if (this.camera instanceof OrthographicCamera) {
      this.camera.near = preset.near;
      this.camera.far = preset.far;
      this.camera.zoom = zoom;
      this.camera.updateProjectionMatrix();
    }
  }

  private configureForScale(preset: CameraPreset): void {
    if (!this.controls) {
      return;
    }

    this.controls.minDistance = preset.minDistance;
    this.controls.maxDistance = preset.maxDistance;
    this.controls.minPolarAngle = 0;
    this.controls.maxPolarAngle = preset.maxPolarAngle ?? Math.PI;

    const speed = this.getScaledSpeed(preset.referenceAltitude);
    const baseDolly = Math.max(speed * 0.002, 0.01);
    const baseTruck = Math.max(speed * 0.001, 0.01);
    const isCityOverview = preset.controlsProfile === 'city_overview';

    if (isCityOverview && this.controls) {
      this.controls.getPosition(_position);
      this.controls.getTarget(_target);
      const distance = _position.distanceTo(_target);
      const distanceFactor = Math.max(
        distance / Math.max(preset.referenceAltitude, 1),
        0.75,
      );
      this.controls.dollySpeed = baseDolly * distanceFactor;
      this.controls.truckSpeed = baseTruck * distanceFactor * 2.5;
    } else if (preset.controlMode === 'pan_log_zoom' && this.controls) {
      this.controls.getPosition(_position);
      this.controls.getTarget(_target);
      const distance = _position.distanceTo(_target);
      const logFactor = Math.max(
        Math.log10(distance / Math.max(preset.minDistance, 1)),
        0.1,
      );
      this.controls.dollySpeed = baseDolly * logFactor;
      this.controls.truckSpeed = baseTruck * logFactor;
    } else {
      this.controls.dollySpeed = baseDolly;
      this.controls.truckSpeed = baseTruck;
    }
    this.controls.azimuthRotateSpeed =
      preset.controlsProfile === 'fixed' ? 0 : 1;
    this.controls.polarRotateSpeed = preset.controlsProfile === 'fixed' ? 0 : 1;

    this.applyControlsProfile(
      this.controls.constructor as typeof CameraControlsImpl,
      preset,
    );
    this.setInputEnabled(preset.controlsProfile !== 'fixed');
    this.applyWheelBinding();
  }

  private applyControlsProfile(
    controlsImpl: typeof CameraControlsImpl,
    preset: CameraPreset,
  ): void {
    if (!this.controls) {
      return;
    }

    const profile = preset.controlsProfile;
    const { ACTION } = controlsImpl;

    switch (profile) {
      case 'fly':
        this.controls.mouseButtons.left = ACTION.ROTATE;
        this.controls.mouseButtons.right = ACTION.TRUCK;
        this.controls.mouseButtons.middle = ACTION.DOLLY;
        this.controls.mouseButtons.wheel = ACTION.DOLLY;
        this.controls.touches.one = ACTION.TOUCH_ROTATE;
        this.controls.touches.two = ACTION.TOUCH_DOLLY_TRUCK;
        break;
      case 'orbit':
        this.controls.mouseButtons.left = ACTION.ROTATE;
        this.controls.mouseButtons.right = ACTION.TRUCK;
        this.controls.mouseButtons.middle = ACTION.DOLLY;
        this.controls.mouseButtons.wheel = ACTION.DOLLY;
        this.controls.touches.one = ACTION.TOUCH_ROTATE;
        this.controls.touches.two = ACTION.TOUCH_DOLLY;
        break;
      case 'map':
        this.controls.mouseButtons.left = ACTION.TRUCK;
        this.controls.mouseButtons.right = ACTION.ROTATE;
        this.controls.mouseButtons.middle = ACTION.DOLLY;
        this.controls.mouseButtons.wheel = ACTION.DOLLY;
        this.controls.touches.one = ACTION.TOUCH_TRUCK;
        this.controls.touches.two = ACTION.TOUCH_DOLLY_TRUCK;
        break;
      case 'city_overview':
        this.controls.mouseButtons.left = ACTION.TRUCK;
        this.controls.mouseButtons.right = ACTION.ROTATE;
        this.controls.mouseButtons.middle = ACTION.DOLLY;
        this.controls.mouseButtons.wheel = ACTION.DOLLY;
        this.controls.touches.one = ACTION.TOUCH_TRUCK;
        this.controls.touches.two = ACTION.TOUCH_DOLLY_TRUCK;
        break;
      case 'first_person':
        this.controls.mouseButtons.left = ACTION.ROTATE;
        this.controls.mouseButtons.right = ACTION.NONE;
        this.controls.mouseButtons.middle = ACTION.NONE;
        this.controls.mouseButtons.wheel = ACTION.NONE;
        this.controls.touches.one = ACTION.TOUCH_ROTATE;
        this.controls.touches.two = ACTION.TOUCH_DOLLY;
        this.controls.minDistance = preset.minDistance;
        this.controls.maxDistance = preset.maxDistance;
        break;
      case 'fixed':
        this.controls.enabled = false;
        break;
      default:
        break;
    }
  }
}
