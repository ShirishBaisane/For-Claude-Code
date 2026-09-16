import * as THREE from 'three';
import { CONTAINER, PARTITION } from '../config/dimensions.js';
import { buildWallAlongZ } from '../utils/wallBuilder.js';
import { createInternalDoor } from './InternalDoor.js';

// The single partition separating Zone 1 (multipurpose) from Zone 2
// (private owner room + IoT lab). Its door opening is offset toward the
// lower side of the plan (low Z) — clearly not centered on the wall.
export function createPartition(materials) {
  const group = new THREE.Group();
  group.name = 'Partition';

  const { width, exteriorHeight } = CONTAINER;
  const { thickness, centerX, doorCenterZ, doorWidth, doorHeight } = PARTITION;

  const doorStart = doorCenterZ - doorWidth / 2;
  const doorEnd = doorCenterZ + doorWidth / 2;

  const wall = buildWallAlongZ({
    z0: 0,
    z1: width,
    x: centerX,
    height: exteriorHeight,
    thickness,
    material: materials.interiorPanel,
    opening: { start: doorStart, end: doorEnd, openHeight: doorHeight },
  });
  group.add(wall);

  // Navy accent trim around the doorway (restrained interior accent).
  const trimThickness = thickness + 0.01;
  const trimDepth = 0.06;
  const sideTrimGeo = new THREE.BoxGeometry(trimThickness, doorHeight + trimDepth, trimDepth);
  const leftTrim = new THREE.Mesh(sideTrimGeo, materials.navy);
  leftTrim.position.set(centerX, doorHeight / 2, doorStart);
  group.add(leftTrim);
  const rightTrim = new THREE.Mesh(sideTrimGeo, materials.navy);
  rightTrim.position.set(centerX, doorHeight / 2, doorEnd);
  group.add(rightTrim);
  const topTrimGeo = new THREE.BoxGeometry(trimThickness, trimDepth, doorWidth + trimDepth * 2);
  const topTrim = new THREE.Mesh(topTrimGeo, materials.navy);
  topTrim.position.set(centerX, doorHeight, doorCenterZ);
  group.add(topTrim);

  const internalDoor = createInternalDoor(materials);
  group.add(internalDoor.group);

  return { group, door: internalDoor };
}
