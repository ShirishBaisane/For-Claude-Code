import * as THREE from 'three';
import { ZONES, IOT_BENCH } from '../config/dimensions.js';
import { createDeskWithLegs, createBeacon } from '../utils/furniture.js';

// Narrow dedicated IoT / electronics engineering bench in Zone 2, along the
// wall opposite the owner desk: telematics devices, BLE beacons/sensors,
// wiring & testing gear, small tools, and component storage bins.
export function createIoTBench(materials) {
  const group = new THREE.Group();
  group.name = 'IoTBench';

  const { xMin } = ZONES.zone2;

  const benchCenterX = xMin + 0.2 + IOT_BENCH.width / 2;
  const benchCenterZ = IOT_BENCH.depth / 2 + 0.08;

  const bench = createDeskWithLegs(materials, {
    width: IOT_BENCH.width,
    depth: IOT_BENCH.depth,
    height: IOT_BENCH.height,
    topThickness: IOT_BENCH.topThickness,
    topMaterial: materials.woodDark,
  });
  bench.position.set(benchCenterX, 0, benchCenterZ);
  group.add(bench);

  const topY = IOT_BENCH.height;

  // Pegboard / shelf above the bench for component storage and small tools.
  const pegboardGeo = new THREE.BoxGeometry(IOT_BENCH.width - 0.1, 0.55, 0.02);
  const pegboard = new THREE.Mesh(pegboardGeo, materials.plastic);
  pegboard.position.set(benchCenterX, topY + 0.55, 0.02);
  group.add(pegboard);

  const shelfGeo = new THREE.BoxGeometry(IOT_BENCH.width - 0.15, 0.03, 0.16);
  const shelf = new THREE.Mesh(shelfGeo, materials.metal);
  shelf.position.set(benchCenterX, topY + 0.85, 0.05);
  group.add(shelf);

  // Small component storage bins on the shelf.
  for (let i = -2; i <= 2; i += 1) {
    const binGeo = new THREE.BoxGeometry(0.1, 0.07, 0.12);
    const bin = new THREE.Mesh(binGeo, i % 2 === 0 ? materials.plastic : materials.cyan);
    bin.position.set(benchCenterX + i * 0.16, topY + 0.85 + 0.05, 0.05);
    group.add(bin);
  }

  // Telematics device units on the bench top.
  for (let i = 0; i < 2; i += 1) {
    const deviceGeo = new THREE.BoxGeometry(0.14, 0.05, 0.09);
    const device = new THREE.Mesh(deviceGeo, materials.plasticDark);
    device.position.set(benchCenterX - 0.3 + i * 0.25, topY + 0.025, benchCenterZ + 0.05);
    device.castShadow = true;
    group.add(device);

    const ledGeo = new THREE.BoxGeometry(0.02, 0.005, 0.02);
    const led = new THREE.Mesh(ledGeo, materials.cyanEmissive);
    led.position.set(device.position.x + 0.04, topY + 0.055, device.position.z);
    group.add(led);
  }

  // BLE beacons / sensors scattered near the far end of the bench.
  for (let i = 0; i < 3; i += 1) {
    const beacon = createBeacon(materials, 0.025);
    beacon.position.set(benchCenterX + 0.35 + i * 0.09, topY + 0.03, benchCenterZ - 0.05);
    group.add(beacon);
  }

  // Wiring / testing equipment: a small cable reel and a multimeter box.
  const reelGeo = new THREE.TorusGeometry(0.06, 0.02, 8, 16);
  const reel = new THREE.Mesh(reelGeo, materials.plasticDark);
  reel.rotation.x = Math.PI / 2;
  reel.position.set(benchCenterX + 0.55, topY + 0.03, benchCenterZ - 0.1);
  group.add(reel);

  const multimeterGeo = new THREE.BoxGeometry(0.09, 0.03, 0.15);
  const multimeter = new THREE.Mesh(multimeterGeo, materials.plastic);
  multimeter.position.set(benchCenterX - 0.55, topY + 0.02, benchCenterZ - 0.05);
  group.add(multimeter);

  // Small tools tray.
  const trayGeo = new THREE.BoxGeometry(0.22, 0.02, 0.1);
  const tray = new THREE.Mesh(trayGeo, materials.metal);
  tray.position.set(benchCenterX, topY + 0.02, benchCenterZ + 0.15);
  group.add(tray);

  // Component storage bins underneath the bench.
  const underBinGeo = new THREE.BoxGeometry(0.5, 0.28, 0.32);
  const underBin = new THREE.Mesh(underBinGeo, materials.metalDark);
  underBin.position.set(benchCenterX - IOT_BENCH.width / 2 + 0.3, 0.14, benchCenterZ);
  underBin.castShadow = true;
  group.add(underBin);

  return { group };
}
