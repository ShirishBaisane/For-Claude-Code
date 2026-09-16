import * as THREE from 'three';

/**
 * Generic lockable hinged door for an opening cut into a wall that spans
 * world Z (thickness along world X) — used by both the internal partition
 * door and the main entrance door.
 *
 * hingeSide: 'start' hinges at z0 (leaf swings from the low-Z edge),
 *            'end' hinges at z1 (leaf swings from the high-Z edge).
 * openSign: +1 or -1, sets which way (world +X / -X) the leaf swings open.
 */
export function createHingedDoorAlongZ({
  x,
  z0,
  z1,
  height,
  thickness = 0.045,
  hingeSide = 'end',
  openSign = 1,
  material,
  handleMaterial,
  lockMaterial,
  withLock = false,
}) {
  const width = z1 - z0;
  const hingeZ = hingeSide === 'end' ? z1 : z0;
  const leafZOffset = hingeSide === 'end' ? -width / 2 : width / 2;

  const pivot = new THREE.Group();
  pivot.position.set(x, 0, hingeZ);
  pivot.name = 'DoorPivot';

  const leaf = new THREE.Group();
  leaf.position.set(0, 0, leafZOffset);

  const leafGeo = new THREE.BoxGeometry(thickness, height, width - 0.02);
  const leafMesh = new THREE.Mesh(leafGeo, material);
  leafMesh.position.y = height / 2;
  leafMesh.castShadow = true;
  leafMesh.receiveShadow = true;
  leaf.add(leafMesh);

  // Handle, mounted on the free edge (opposite the hinge).
  const freeEdgeZ = hingeSide === 'end' ? -(width - 0.14) : (width - 0.14);
  const handleGeo = new THREE.CylinderGeometry(0.012, 0.012, 0.16, 8);
  const handle = new THREE.Mesh(handleGeo, handleMaterial);
  handle.rotation.x = Math.PI / 2;
  handle.position.set(thickness / 2 + 0.02, height * 0.45, freeEdgeZ);
  leaf.add(handle);

  if (withLock) {
    const lockGeo = new THREE.BoxGeometry(0.05, 0.06, 0.02);
    const lockPlate = new THREE.Mesh(lockGeo, lockMaterial ?? handleMaterial);
    lockPlate.position.set(thickness / 2 + 0.011, height * 0.45 + 0.14, freeEdgeZ);
    leaf.add(lockPlate);
  }

  pivot.add(leaf);
  pivot.userData.openSign = openSign;

  function setOpenFraction(t) {
    const clamped = Math.max(0, Math.min(1, t));
    const maxAngle = (Math.PI / 2) * 0.92;
    pivot.rotation.y = openSign * maxAngle * clamped;
  }

  setOpenFraction(0);

  return { group: pivot, setOpenFraction };
}
