import * as THREE from 'three';
import { createStorageRack } from '../utils/furniture.js';

// The open, flexible portion of Zone 1's floor. It is intentionally left
// clear by default. Two ghost/translucent furniture concepts can be toggled
// on for planning purposes (lounge seating, or extra storage) — neither is
// permanent, both read visibly as placeholders rather than real furniture.
export function createFlexibleArea(materials, rect) {
  const group = new THREE.Group();
  group.name = 'FlexibleArea';

  const { xMin, xMax, zMin, zMax } = rect;
  const cx = (xMin + xMax) / 2;
  const cz = (zMin + zMax) / 2;

  // Dashed outline marking the flexible footprint on the floor.
  const outlinePoints = [
    new THREE.Vector3(xMin, 0.012, zMin),
    new THREE.Vector3(xMax, 0.012, zMin),
    new THREE.Vector3(xMax, 0.012, zMax),
    new THREE.Vector3(xMin, 0.012, zMax),
    new THREE.Vector3(xMin, 0.012, zMin),
  ];
  const outlineGeo = new THREE.BufferGeometry().setFromPoints(outlinePoints);
  const outlineMat = new THREE.LineDashedMaterial({ color: 0x2ec4d6, dashSize: 0.08, gapSize: 0.06, transparent: true, opacity: 0.6 });
  const outline = new THREE.Line(outlineGeo, outlineMat);
  outline.computeLineDistances();
  group.add(outline);

  // Concept A — compact L-shaped lounge sofa + small coffee table.
  const loungeGroup = new THREE.Group();
  loungeGroup.name = 'FlexLounge';
  const sofaSeatGeo = new THREE.BoxGeometry(1.5, 0.36, 0.75);
  const sofaSeat = new THREE.Mesh(sofaSeatGeo, materials.ghost);
  sofaSeat.position.set(cx - 0.3, 0.18, zMin + 0.4);
  loungeGroup.add(sofaSeat);
  const sofaArmGeo = new THREE.BoxGeometry(0.75, 0.36, 0.75);
  const sofaArm = new THREE.Mesh(sofaArmGeo, materials.ghost);
  sofaArm.position.set(cx - 0.3 - 1.5 / 2 + 0.75 / 2, 0.18, zMin + 0.4 + 0.75);
  loungeGroup.add(sofaArm);
  const tableGeo = new THREE.BoxGeometry(0.6, 0.32, 0.4);
  const table = new THREE.Mesh(tableGeo, materials.ghost);
  table.position.set(cx + 0.5, 0.16, zMin + 0.5);
  loungeGroup.add(table);
  group.add(loungeGroup);

  // Concept B — additional inventory / storage racks.
  const storageGroup = new THREE.Group();
  storageGroup.name = 'FlexStorage';
  const rackA = createStorageRack(materials, { width: 0.8, depth: 0.4, height: 1.6, shelves: 4 });
  rackA.traverse((child) => { if (child.isMesh) child.material = materials.ghost; });
  rackA.position.set(cx - 0.5, 0, cz);
  storageGroup.add(rackA);
  const rackB = createStorageRack(materials, { width: 0.8, depth: 0.4, height: 1.6, shelves: 4 });
  rackB.traverse((child) => { if (child.isMesh) child.material = materials.ghost; });
  rackB.position.set(cx + 0.5, 0, cz);
  storageGroup.add(rackB);
  group.add(storageGroup);

  function setMode(mode) {
    loungeGroup.visible = mode === 'lounge';
    storageGroup.visible = mode === 'storage';
  }
  setMode('none');

  return { group, setMode };
}
