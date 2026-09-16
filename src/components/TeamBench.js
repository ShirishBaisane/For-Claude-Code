import * as THREE from 'three';
import { CONTAINER, ZONES, TEAM_BENCH, SERVICE_AREA } from '../config/dimensions.js';
import { createDeskWithLegs, createMonitor, createOfficeChair } from '../utils/furniture.js';

// Long shared team bench desk along the UPPER long wall of Zone 1, with
// 2-3 work positions, monitors, and keyboards. Zone 1 stays otherwise open.
export function createTeamBench(materials) {
  const group = new THREE.Group();
  group.name = 'TeamBench';

  const { width } = CONTAINER;
  const { xMin, xMax } = ZONES.zone1;

  const benchStartX = xMin + TEAM_BENCH.marginFromPartition;
  const benchEndX = xMax - SERVICE_AREA.width - TEAM_BENCH.marginFromService - 0.2;
  const benchLength = Math.max(benchEndX - benchStartX, TEAM_BENCH.seatPitch);
  const benchCenterX = (benchStartX + benchEndX) / 2;
  const benchCenterZ = width - TEAM_BENCH.depth / 2 - 0.08;

  const desk = createDeskWithLegs(materials, {
    width: benchLength,
    depth: TEAM_BENCH.depth,
    height: TEAM_BENCH.height,
    topThickness: TEAM_BENCH.topThickness,
    topMaterial: materials.wood,
  });
  desk.position.set(benchCenterX, 0, benchCenterZ);
  group.add(desk);

  const seats = Math.max(2, Math.min(TEAM_BENCH.seats, Math.floor(benchLength / TEAM_BENCH.seatPitch)));
  const usableSpan = benchLength - 0.3;
  for (let i = 0; i < seats; i += 1) {
    const t = seats === 1 ? 0.5 : i / (seats - 1);
    const seatX = benchCenterX - usableSpan / 2 + t * usableSpan;

    const monitor = createMonitor(materials, { width: 0.46, height: 0.3 });
    monitor.position.set(seatX, TEAM_BENCH.height, benchCenterZ - TEAM_BENCH.depth / 2 + 0.1);
    group.add(monitor);

    const keyboardGeo = new THREE.BoxGeometry(0.36, 0.015, 0.13);
    const keyboard = new THREE.Mesh(keyboardGeo, materials.plasticDark);
    keyboard.position.set(seatX, TEAM_BENCH.height + 0.007, benchCenterZ + 0.06);
    group.add(keyboard);

    const chair = createOfficeChair(materials);
    chair.position.set(seatX, 0, benchCenterZ - TEAM_BENCH.depth / 2 - 0.42);
    chair.rotation.y = Math.PI;
    group.add(chair);
  }

  return { group, bounds: { xMin: benchStartX, xMax: benchEndX } };
}
