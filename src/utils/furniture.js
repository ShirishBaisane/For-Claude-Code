import * as THREE from 'three';

// Small reusable furniture primitives shared across zones, kept low-poly
// and dimensionally simple for this first prototype pass.

export function createOfficeChair(materials, seatHeight = 0.46) {
  const chair = new THREE.Group();

  const seatGeo = new THREE.CylinderGeometry(0.19, 0.19, 0.05, 16);
  const seat = new THREE.Mesh(seatGeo, materials.chairBlack);
  seat.position.y = seatHeight;
  seat.castShadow = true;
  chair.add(seat);

  const backGeo = new THREE.BoxGeometry(0.36, 0.4, 0.05);
  const back = new THREE.Mesh(backGeo, materials.chairBlack);
  back.position.set(0, seatHeight + 0.24, -0.17);
  back.castShadow = true;
  chair.add(back);

  const stemGeo = new THREE.CylinderGeometry(0.025, 0.03, seatHeight - 0.12, 8);
  const stem = new THREE.Mesh(stemGeo, materials.steelFrame);
  stem.position.y = (seatHeight - 0.12) / 2 + 0.06;
  chair.add(stem);

  const baseGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.03, 12);
  const base = new THREE.Mesh(baseGeo, materials.steelFrame);
  base.position.y = 0.05;
  chair.add(base);

  return chair;
}

export function createMonitor(materials, { width = 0.5, height = 0.32 } = {}) {
  const group = new THREE.Group();

  const standGeo = new THREE.CylinderGeometry(0.05, 0.07, 0.05, 12);
  const stand = new THREE.Mesh(standGeo, materials.monitor);
  stand.position.y = 0.025;
  group.add(stand);

  const neckGeo = new THREE.BoxGeometry(0.04, 0.18, 0.04);
  const neck = new THREE.Mesh(neckGeo, materials.monitor);
  neck.position.y = 0.05 + 0.09;
  group.add(neck);

  const bodyGeo = new THREE.BoxGeometry(width, height, 0.025);
  const body = new THREE.Mesh(bodyGeo, materials.monitor);
  body.position.y = 0.05 + 0.18 + height / 2;
  group.add(body);

  const screenGeo = new THREE.PlaneGeometry(width - 0.03, height - 0.03);
  const screen = new THREE.Mesh(screenGeo, materials.monitorScreen);
  screen.position.set(0, body.position.y, 0.014);
  group.add(screen);

  return group;
}

export function createDeskWithLegs(materials, { width, depth, height, topThickness = 0.04, topMaterial }) {
  const group = new THREE.Group();

  const topGeo = new THREE.BoxGeometry(width, topThickness, depth);
  const top = new THREE.Mesh(topGeo, topMaterial ?? materials.wood);
  top.position.y = height - topThickness / 2;
  top.castShadow = true;
  top.receiveShadow = true;
  group.add(top);

  const legInset = 0.06;
  const legGeo = new THREE.BoxGeometry(0.045, height - topThickness, 0.045);
  const positions = [
    [-width / 2 + legInset, depth / 2 - legInset],
    [width / 2 - legInset, depth / 2 - legInset],
    [-width / 2 + legInset, -depth / 2 + legInset],
    [width / 2 - legInset, -depth / 2 + legInset],
  ];
  positions.forEach(([lx, lz]) => {
    const leg = new THREE.Mesh(legGeo, materials.steelFrame);
    leg.position.set(lx, (height - topThickness) / 2, lz);
    leg.castShadow = true;
    group.add(leg);
  });

  // Simple cable tray under the rear edge.
  const trayGeo = new THREE.BoxGeometry(width - 0.15, 0.03, 0.06);
  const tray = new THREE.Mesh(trayGeo, materials.plasticDark);
  tray.position.set(0, height - topThickness - 0.08, depth / 2 - 0.05);
  group.add(tray);

  return group;
}

export function createStorageRack(materials, { width = 0.8, depth = 0.35, height = 1.6, shelves = 4 }) {
  const group = new THREE.Group();

  const frameGeo = new THREE.BoxGeometry(0.04, height, 0.04);
  [[-width / 2, -depth / 2], [width / 2, -depth / 2], [-width / 2, depth / 2], [width / 2, depth / 2]].forEach(([fx, fz]) => {
    const frame = new THREE.Mesh(frameGeo, materials.metalDark);
    frame.position.set(fx, height / 2, fz);
    group.add(frame);
  });

  for (let i = 0; i < shelves; i += 1) {
    const shelfGeo = new THREE.BoxGeometry(width, 0.025, depth);
    const shelf = new THREE.Mesh(shelfGeo, materials.metal);
    shelf.position.y = (height / (shelves - 1 || 1)) * i + 0.02;
    shelf.castShadow = true;
    shelf.receiveShadow = true;
    group.add(shelf);
  }

  return group;
}

export function createBeacon(materials, radius = 0.03) {
  const geo = new THREE.SphereGeometry(radius, 12, 12);
  const mesh = new THREE.Mesh(geo, materials.beacon);
  mesh.castShadow = true;
  return mesh;
}
