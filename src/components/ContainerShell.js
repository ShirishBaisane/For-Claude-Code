import * as THREE from 'three';
import { CONTAINER, ENTRANCE } from '../config/dimensions.js';
import { buildWallAlongX, buildWallAlongZ } from '../utils/wallBuilder.js';

// The exterior shell of the shipping container: floor, four walls, roof.
// Deliberately plain and unbranded — an ordinary clean industrial container.
export function createContainerShell(materials) {
  const group = new THREE.Group();
  group.name = 'ContainerShell';

  const { length, width, exteriorHeight, wallThickness, roofThickness, roofOverhang, floorThickness, linerThickness, linerGap } = CONTAINER;

  // Floor slab
  const floorGeo = new THREE.BoxGeometry(length, floorThickness, width);
  const floor = new THREE.Mesh(floorGeo, materials.floor);
  floor.position.set(length / 2, -floorThickness / 2, width / 2);
  floor.receiveShadow = true;
  group.add(floor);

  // Rear wall (x = 0) — solid, private room end, no openings.
  group.add(buildWallAlongZ({
    z0: 0, z1: width, x: 0, height: exteriorHeight, thickness: wallThickness, material: materials.exterior,
  }));

  // Front wall (x = length) — contains the main entrance opening.
  const entranceStart = ENTRANCE.centerZ - ENTRANCE.width / 2;
  const entranceEnd = ENTRANCE.centerZ + ENTRANCE.width / 2;
  group.add(buildWallAlongZ({
    z0: 0, z1: width, x: length, height: exteriorHeight, thickness: wallThickness, material: materials.exterior,
    opening: { start: entranceStart, end: entranceEnd, openHeight: ENTRANCE.height },
  }));

  // Lower long wall (z = 0) — solid.
  group.add(buildWallAlongX({
    x0: 0, x1: length, z: 0, height: exteriorHeight, thickness: wallThickness, material: materials.exterior,
  }));

  // Upper long wall (z = width) — solid; team bench sits against its inner face.
  group.add(buildWallAlongX({
    x0: 0, x1: length, z: width, height: exteriorHeight, thickness: wallThickness, material: materials.exterior,
  }));

  // Corner posts (typical container styling, purely cosmetic).
  const postGeo = new THREE.BoxGeometry(0.08, exteriorHeight, 0.08);
  [[0, 0], [0, width], [length, 0], [length, width]].forEach(([px, pz]) => {
    const post = new THREE.Mesh(postGeo, materials.exteriorTrim);
    post.position.set(px, exteriorHeight / 2, pz);
    group.add(post);
  });

  // Roof
  const roofGeo = new THREE.BoxGeometry(length + roofOverhang * 2, roofThickness, width + roofOverhang * 2);
  const roof = new THREE.Mesh(roofGeo, materials.roof);
  roof.position.set(length / 2, exteriorHeight + roofThickness / 2, width / 2);
  roof.castShadow = true;
  roof.name = 'Roof';
  group.add(roof);

  // Light insulated interior liner panels on the two long walls and rear wall
  // (kept off the entrance wall opening automatically since the door fills that face).
  const linerX = wallThickness / 2 + linerGap + linerThickness / 2;
  group.add(buildWallAlongZ({
    z0: 0.02, z1: width - 0.02, x: linerX, height: exteriorHeight - 0.05, thickness: linerThickness, material: materials.interiorPanel,
  }));
  group.add(buildWallAlongX({
    x0: 0.02, x1: length - 0.02, z: linerThickness / 2 + linerGap, height: exteriorHeight - 0.05, thickness: linerThickness, material: materials.interiorPanel,
  }));
  group.add(buildWallAlongX({
    x0: 0.02, x1: length - 0.02, z: width - linerThickness / 2 - linerGap, height: exteriorHeight - 0.05, thickness: linerThickness, material: materials.interiorPanelAccent,
  }));

  return group;
}
