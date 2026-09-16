import * as THREE from 'three';
import { CONTAINER, ZONES, OWNER_DESK } from '../config/dimensions.js';
import { createDeskWithLegs, createMonitor, createOfficeChair } from '../utils/furniture.js';

// Compact owner workstation in Zone 2 — desk, monitor, 1-2 seats, and a
// small confidential/lockable hardware storage cabinet underneath.
export function createOwnerWorkstation(materials) {
  const group = new THREE.Group();
  group.name = 'OwnerWorkstation';

  const { width } = CONTAINER;
  const { xMin } = ZONES.zone2;

  const deskCenterX = xMin + 0.2 + OWNER_DESK.width / 2;
  const deskCenterZ = width - OWNER_DESK.depth / 2 - 0.08;

  const desk = createDeskWithLegs(materials, {
    width: OWNER_DESK.width,
    depth: OWNER_DESK.depth,
    height: OWNER_DESK.height,
    topThickness: OWNER_DESK.topThickness,
    topMaterial: materials.wood,
  });
  desk.position.set(deskCenterX, 0, deskCenterZ);
  group.add(desk);

  const monitor = createMonitor(materials, { width: 0.5, height: 0.32 });
  monitor.position.set(deskCenterX, OWNER_DESK.height, deskCenterZ - OWNER_DESK.depth / 2 + 0.1);
  group.add(monitor);

  const keyboardGeo = new THREE.BoxGeometry(0.38, 0.015, 0.14);
  const keyboard = new THREE.Mesh(keyboardGeo, materials.plasticDark);
  keyboard.position.set(deskCenterX, OWNER_DESK.height + 0.007, deskCenterZ + 0.06);
  group.add(keyboard);

  const chair = createOfficeChair(materials);
  chair.position.set(deskCenterX, 0, deskCenterZ - OWNER_DESK.depth / 2 - 0.42);
  chair.rotation.y = Math.PI;
  group.add(chair);

  // Second, occasional seat for a visitor.
  const guestChair = createOfficeChair(materials, 0.44);
  guestChair.position.set(deskCenterX + OWNER_DESK.width / 2 + 0.35, 0, deskCenterZ - 0.1);
  guestChair.rotation.y = -Math.PI / 2;
  group.add(guestChair);

  // Confidential / lockable hardware storage cabinet, tucked under the desk.
  const cabinetGeo = new THREE.BoxGeometry(0.4, OWNER_DESK.height - OWNER_DESK.topThickness - 0.04, 0.4);
  const cabinet = new THREE.Mesh(cabinetGeo, materials.metalDark);
  cabinet.position.set(
    deskCenterX + OWNER_DESK.width / 2 - 0.24,
    (OWNER_DESK.height - OWNER_DESK.topThickness - 0.04) / 2,
    deskCenterZ + 0.02
  );
  cabinet.castShadow = true;
  group.add(cabinet);

  const lockGeo = new THREE.CylinderGeometry(0.018, 0.018, 0.02, 10);
  const lock = new THREE.Mesh(lockGeo, materials.lockBrass);
  lock.rotation.x = Math.PI / 2;
  lock.position.set(deskCenterX + OWNER_DESK.width / 2 - 0.24, 0.32, deskCenterZ + 0.22);
  group.add(lock);

  return { group };
}
