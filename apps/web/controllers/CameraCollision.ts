import type { Camera, Object3D } from 'three';
import { Mesh, Raycaster, Vector3 } from 'three';
import {
  acceleratedRaycast,
  computeBoundsTree,
  disposeBoundsTree,
} from 'three-mesh-bvh';

import type { CameraController } from './CameraController';

const _origin = new Vector3();
const _direction = new Vector3();
const _target = new Vector3();
const _raycaster = new Raycaster();

let patched = false;

export function ensureBvhRaycast(): void {
  if (patched) {
    return;
  }
  patched = true;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- three-mesh-bvh monkey patch
  (Mesh.prototype as any).raycast = acceleratedRaycast;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (Mesh.prototype as any).computeBoundsTree = computeBoundsTree;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (Mesh.prototype as any).disposeBoundsTree = disposeBoundsTree;
}

export function registerCollisionMesh(mesh: Mesh): void {
  ensureBvhRaycast();
  mesh.geometry.computeBoundsTree?.();
}

export function resolveCameraCollision(
  camera: Camera,
  controller: CameraController,
  sceneRoot: Object3D,
  radius = 0.6,
): void {
  ensureBvhRaycast();
  const state = controller.syncFromControls();
  _target.set(state.target.x, state.target.y, state.target.z);
  _origin.set(state.position.x, state.position.y, state.position.z);

  _direction.copy(_origin).sub(_target);
  const distance = _direction.length();
  if (distance < 0.001) {
    return;
  }
  _direction.normalize();

  _raycaster.set(_target, _direction);
  _raycaster.far = distance;
  const hits = _raycaster.intersectObject(sceneRoot, true);
  const hit = hits.find((entry) => entry.object.type === 'Mesh');
  if (!hit || hit.distance >= distance - radius) {
    return;
  }

  const safeDistance = Math.max(radius, hit.distance - radius);
  _origin.copy(_target).addScaledVector(_direction, safeDistance);
  controller.nudgePosition([_origin.x, _origin.y, _origin.z]);
}
