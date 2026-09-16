import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import { CONTAINER, ZONES, TEAM_BENCH, SERVICE_AREA, CAMERA } from './config/dimensions.js';
import { createMaterials } from './materials/materials.js';
import { createContainerShell } from './components/ContainerShell.js';
import { createPartition } from './components/Partition.js';
import { createMainEntrance } from './components/MainEntrance.js';
import { createTeamBench } from './components/TeamBench.js';
import { createServiceStorage } from './components/ServiceStorage.js';
import { createFlexibleArea } from './components/FlexibleArea.js';
import { createOwnerWorkstation } from './components/OwnerWorkstation.js';
import { createIoTBench } from './components/IoTBench.js';
import { createLighting } from './components/Lighting.js';
import { createBranding } from './components/Branding.js';
import { getStaticViews, getWalkthroughKeyframes, sampleWalkthrough } from './cameras/CameraViews.js';
import { setupUI } from './ui/UIControls.js';

const canvas = document.getElementById('scene-canvas');

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xcfd8dc);
scene.fog = new THREE.Fog(0xcfd8dc, 14, 34);

const camera = new THREE.PerspectiveCamera(CAMERA.fov, window.innerWidth / window.innerHeight, 0.1, 100);
const overviewStart = {
  position: new THREE.Vector3(CONTAINER.length + 3.4, 3.1, -2.0),
  target: new THREE.Vector3(CONTAINER.length / 2, 0.9, CONTAINER.width / 2),
};
camera.position.copy(overviewStart.position);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.15;

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.08;
controls.minDistance = 0.6;
controls.maxDistance = 18;
controls.maxPolarAngle = Math.PI * 0.495;
controls.target.copy(overviewStart.target);
controls.update();

// Ground plane for context, kept plain and unobtrusive.
const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(60, 60),
  new THREE.MeshStandardMaterial({ color: 0xb9c2c4, roughness: 1 })
);
ground.rotation.x = -Math.PI / 2;
ground.position.y = -0.06;
ground.receiveShadow = true;
scene.add(ground);

const grid = new THREE.GridHelper(60, 60, 0x9aa5a8, 0xb9c2c4);
grid.position.y = -0.055;
scene.add(grid);

const materials = createMaterials();

const shell = createContainerShell(materials);
scene.add(shell);

const partition = createPartition(materials);
scene.add(partition.group);

const mainEntrance = createMainEntrance(materials);
scene.add(mainEntrance.group);

const teamBench = createTeamBench(materials);
scene.add(teamBench.group);

const serviceStorage = createServiceStorage(materials);
scene.add(serviceStorage.group);

const flexRect = {
  xMin: ZONES.zone1.xMin + 0.25,
  xMax: serviceStorage.bounds.xMin - 0.2,
  zMin: 0.2,
  zMax: CONTAINER.width - TEAM_BENCH.depth - 0.25,
};
const flexibleArea = createFlexibleArea(materials, flexRect);
scene.add(flexibleArea.group);

const ownerWorkstation = createOwnerWorkstation(materials);
scene.add(ownerWorkstation.group);

const iotBench = createIoTBench(materials);
scene.add(iotBench.group);

const lighting = createLighting();
scene.add(lighting);

const branding = createBranding();
scene.add(branding.group);

// --- Zone labels (simple screen-space overlay) -----------------------------
const labelLayer = document.getElementById('app');
const zoneLabelDefs = [
  { text: 'Zone 1 — Multipurpose Area', world: new THREE.Vector3((ZONES.zone1.xMin + ZONES.zone1.xMax) / 2, 2.2, CONTAINER.width / 2) },
  { text: 'Zone 2 — Private Owner Room + IoT Lab', world: new THREE.Vector3((ZONES.zone2.xMin + ZONES.zone2.xMax) / 2, 2.2, CONTAINER.width / 2) },
];
const zoneLabelEls = zoneLabelDefs.map((def) => {
  const el = document.createElement('div');
  el.className = 'zone-label';
  el.textContent = def.text;
  el.style.display = 'none';
  labelLayer.appendChild(el);
  return el;
});
let labelsEnabled = false;

function updateZoneLabels() {
  if (!labelsEnabled) return;
  const halfW = window.innerWidth / 2;
  const halfH = window.innerHeight / 2;
  zoneLabelDefs.forEach((def, i) => {
    const projected = def.world.clone().project(camera);
    const el = zoneLabelEls[i];
    if (projected.z > 1) {
      el.style.display = 'none';
      return;
    }
    el.style.display = 'block';
    el.style.left = `${halfW + projected.x * halfW}px`;
    el.style.top = `${halfH - projected.y * halfH}px`;
  });
}

// --- Camera view switching --------------------------------------------------
const staticViews = getStaticViews();
const walkKeyframes = getWalkthroughKeyframes();

let walkthroughActive = false;
let walkthroughStart = 0;
const WALKTHROUGH_DURATION_MS = 26000;
const walkthroughBtn = document.getElementById('walkthrough-btn');

function applyStaticView(name) {
  stopWalkthrough(false);
  const view = staticViews[name];
  if (!view) return;
  camera.up.copy(view.up);
  camera.position.copy(view.position);
  controls.target.copy(view.target);
  controls.update();
}

function startWalkthrough() {
  walkthroughActive = true;
  walkthroughStart = performance.now();
  controls.enabled = false;
  camera.up.set(0, 1, 0);
  walkthroughBtn.textContent = 'Stop Walkthrough';
  ui.setActiveButton('walkthrough');
}

function stopWalkthrough(resetDoors = true) {
  if (!walkthroughActive) return;
  walkthroughActive = false;
  controls.enabled = true;
  walkthroughBtn.textContent = 'Walkthrough';
  if (resetDoors) {
    mainEntrance.setOpenFraction(0);
    partition.door.setOpenFraction(0);
  }
}

function updateWalkthrough(nowMs) {
  if (!walkthroughActive) return;
  const t = (nowMs - walkthroughStart) / WALKTHROUGH_DURATION_MS;

  if (t >= 1) {
    const sample = sampleWalkthrough(walkKeyframes, 1);
    camera.position.copy(sample.position);
    controls.target.copy(sample.target);
    camera.lookAt(sample.target);
    stopWalkthrough(false);
    return;
  }

  const sample = sampleWalkthrough(walkKeyframes, t);
  camera.position.copy(sample.position);
  camera.lookAt(sample.target);
  controls.target.copy(sample.target);

  // Entrance door swings open through segment 0 (outside -> entering).
  const entranceOpen = sample.segmentIndex === 0 ? sample.segmentT : 1;
  mainEntrance.setOpenFraction(entranceOpen);

  // Internal door swings open while approaching it (segment 3) and stays
  // open once inside the private room.
  let internalOpen = 0;
  if (sample.segmentIndex >= 4) internalOpen = 1;
  else if (sample.segmentIndex === 3) internalOpen = sample.segmentT;
  partition.door.setOpenFraction(internalOpen);
}

const ui = setupUI({
  onView: (view) => {
    if (view === 'walkthrough') {
      if (walkthroughActive) {
        stopWalkthrough();
        ui.setActiveButton(null);
      } else {
        startWalkthrough();
      }
      return;
    }
    applyStaticView(view);
  },
  onToggleRoof: (checked) => {
    shell.getObjectByName('Roof').visible = checked;
  },
  onToggleLabels: (checked) => {
    labelsEnabled = checked;
    zoneLabelEls.forEach((el) => { el.style.display = checked ? 'block' : 'none'; });
  },
  onFlexMode: (mode) => flexibleArea.setMode(mode),
});

// --- Resize + render loop ---------------------------------------------------
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

function animate(nowMs) {
  requestAnimationFrame(animate);

  if (walkthroughActive) {
    updateWalkthrough(nowMs);
  } else {
    controls.update();
  }

  updateZoneLabels();
  renderer.render(scene, camera);
}

requestAnimationFrame(animate);
