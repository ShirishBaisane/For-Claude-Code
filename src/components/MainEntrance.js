import * as THREE from 'three';
import { CONTAINER, ENTRANCE } from '../config/dimensions.js';
import { createHingedDoorAlongZ } from '../utils/hingedDoor.js';

// Main entrance on the far-RIGHT end wall. Plain and unbranded from the
// outside — an ordinary industrial door, no signage.
export function createMainEntrance(materials) {
  const group = new THREE.Group();
  group.name = 'MainEntrance';

  const { length } = CONTAINER;
  const doorStart = ENTRANCE.centerZ - ENTRANCE.width / 2;
  const doorEnd = ENTRANCE.centerZ + ENTRANCE.width / 2;

  const { group: doorGroup, setOpenFraction } = createHingedDoorAlongZ({
    x: length,
    z0: doorStart,
    z1: doorEnd,
    height: ENTRANCE.height,
    hingeSide: 'start',
    openSign: 1, // swings inward, into the multipurpose area
    material: materials.exteriorTrim,
    handleMaterial: materials.metal,
    withLock: false,
  });
  group.add(doorGroup);

  // Plain steel frame around the opening — no branding, no signage.
  const frameThickness = CONTAINER.wallThickness + 0.02;
  const frameDepth = 0.05;
  const sideGeo = new THREE.BoxGeometry(frameThickness, ENTRANCE.height + frameDepth, frameDepth);
  const left = new THREE.Mesh(sideGeo, materials.doorFrame);
  left.position.set(length, ENTRANCE.height / 2, doorStart);
  group.add(left);
  const right = new THREE.Mesh(sideGeo, materials.doorFrame);
  right.position.set(length, ENTRANCE.height / 2, doorEnd);
  group.add(right);
  const topGeo = new THREE.BoxGeometry(frameThickness, frameDepth, ENTRANCE.width + frameDepth * 2);
  const top = new THREE.Mesh(topGeo, materials.doorFrame);
  top.position.set(length, ENTRANCE.height, ENTRANCE.centerZ);
  group.add(top);

  // Small entry step outside, purely functional.
  const stepGeo = new THREE.BoxGeometry(0.35, 0.12, ENTRANCE.width + 0.2);
  const step = new THREE.Mesh(stepGeo, materials.exteriorTrim);
  step.position.set(length + 0.18, -0.06, ENTRANCE.centerZ);
  step.receiveShadow = true;
  group.add(step);

  return { group, setOpenFraction, doorStart, doorEnd };
}
