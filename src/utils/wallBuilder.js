import * as THREE from 'three';

/**
 * Builds a wall that spans along world X, with its thickness along world Z.
 * Optionally cuts a rectangular doorway opening (relative to x0).
 */
export function buildWallAlongX({ x0, x1, z, y0 = 0, height, thickness, material, opening }) {
  const group = new THREE.Group();
  const span = x1 - x0;

  const addSegment = (segX0, segX1, segY0, segY1) => {
    const w = segX1 - segX0;
    const h = segY1 - segY0;
    if (w <= 0.001 || h <= 0.001) return;
    const geo = new THREE.BoxGeometry(w, h, thickness);
    const mesh = new THREE.Mesh(geo, material);
    mesh.position.set(x0 + segX0 + w / 2, y0 + segY0 + h / 2, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    group.add(mesh);
  };

  if (!opening) {
    addSegment(0, span, 0, height);
    return group;
  }

  const { start, end, openHeight } = opening;
  addSegment(0, start, 0, height);
  addSegment(end, span, 0, height);
  addSegment(start, end, openHeight, height);
  return group;
}

/**
 * Builds a wall that spans along world Z, with its thickness along world X.
 * Optionally cuts a rectangular doorway opening (relative to z0).
 */
export function buildWallAlongZ({ z0, z1, x, y0 = 0, height, thickness, material, opening }) {
  const group = new THREE.Group();
  const span = z1 - z0;

  const addSegment = (segZ0, segZ1, segY0, segY1) => {
    const d = segZ1 - segZ0;
    const h = segY1 - segY0;
    if (d <= 0.001 || h <= 0.001) return;
    const geo = new THREE.BoxGeometry(thickness, h, d);
    const mesh = new THREE.Mesh(geo, material);
    mesh.position.set(x, y0 + segY0 + h / 2, z0 + segZ0 + d / 2);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    group.add(mesh);
  };

  if (!opening) {
    addSegment(0, span, 0, height);
    return group;
  }

  const { start, end, openHeight } = opening;
  addSegment(0, start, 0, height);
  addSegment(end, span, 0, height);
  addSegment(start, end, openHeight, height);
  return group;
}
