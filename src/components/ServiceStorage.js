import * as THREE from 'three';
import { CONTAINER, ZONES, SERVICE_AREA } from '../config/dimensions.js';
import { createStorageRack } from '../utils/furniture.js';

// Service / storage nook near the entrance-side end of Zone 1: storage
// racks, a coffee machine, a vending/storage cabinet, and a reserved
// footprint for a compact fridge later.
export function createServiceStorage(materials) {
  const group = new THREE.Group();
  group.name = 'ServiceStorage';

  const { xMax } = ZONES.zone1;
  const nookXMax = xMax - 0.12;
  const nookXMin = nookXMax - SERVICE_AREA.width;
  const nookCenterX = (nookXMin + nookXMax) / 2;
  const nookCenterZ = SERVICE_AREA.depth / 2 + 0.1;

  // Storage rack, back against the lower wall.
  const rack = createStorageRack(materials, { width: 0.7, depth: 0.32, height: 1.7, shelves: 4 });
  rack.position.set(nookXMin + 0.38, 0, 0.19);
  group.add(rack);

  // Vending / storage cabinet.
  const cabinetGeo = new THREE.BoxGeometry(0.55, 0.95, 0.42);
  const cabinet = new THREE.Mesh(cabinetGeo, materials.plastic);
  cabinet.position.set(nookCenterX + 0.35, 0.475, 0.24);
  cabinet.castShadow = true;
  group.add(cabinet);
  const cabinetDoorGeo = new THREE.BoxGeometry(0.02, 0.85, 0.38);
  const cabinetDoor = new THREE.Mesh(cabinetDoorGeo, materials.navy);
  cabinetDoor.position.set(nookCenterX + 0.35 + 0.28, 0.475, 0.24);
  group.add(cabinetDoor);

  // Small counter for the coffee machine.
  const counterGeo = new THREE.BoxGeometry(0.5, 0.04, 0.4);
  const counter = new THREE.Mesh(counterGeo, materials.woodDark);
  counter.position.set(nookXMax - 0.28, 0.85, 0.24);
  counter.castShadow = true;
  group.add(counter);
  const counterLegGeo = new THREE.BoxGeometry(0.5, 0.83, 0.02);
  const counterBack = new THREE.Mesh(counterLegGeo, materials.plasticDark);
  counterBack.position.set(nookXMax - 0.28, 0.415, 0.04);
  group.add(counterBack);

  const machineBodyGeo = new THREE.BoxGeometry(0.22, 0.32, 0.28);
  const machineBody = new THREE.Mesh(machineBodyGeo, materials.plasticDark);
  machineBody.position.set(nookXMax - 0.28, 0.87 + 0.16, 0.24);
  machineBody.castShadow = true;
  group.add(machineBody);
  const machineAccentGeo = new THREE.BoxGeometry(0.22, 0.03, 0.02);
  const machineAccent = new THREE.Mesh(machineAccentGeo, materials.cyanEmissive);
  machineAccent.position.set(nookXMax - 0.28, 0.87 + 0.28, 0.24 + 0.14);
  group.add(machineAccent);

  // Reserved outline for a compact fridge, added later.
  const fridgeOutlineGeo = new THREE.BoxGeometry(0.48, 0.85, 0.5);
  const fridgeOutline = new THREE.Mesh(fridgeOutlineGeo, materials.ghost);
  fridgeOutline.position.set(nookCenterX + 0.05, 0.425, SERVICE_AREA.depth + 0.35);
  group.add(fridgeOutline);

  return { group, bounds: { xMin: nookXMin, xMax: nookXMax } };
}
