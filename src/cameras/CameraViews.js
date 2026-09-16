import * as THREE from 'three';
import { CONTAINER, ZONES, PARTITION, ENTRANCE, CAMERA } from '../config/dimensions.js';

const V = (x, y, z) => new THREE.Vector3(x, y, z);

// Five static, human-scale inspection views computed from the parametric
// dimensions, so they stay correct if the layout is resized.
export function getStaticViews() {
  const eye = CAMERA.eyeHeight;
  const z1 = ZONES.zone1;
  const z2 = ZONES.zone2;
  const benchCenterX = (z1.xMin + z1.xMax) / 2;

  // Top view is pulled well clear of the roof so the 2.9 m walls don't
  // dominate a perspective shot the way they would if the camera only
  // cleared the roof by a meter or two.
  const topHeight = Math.max(CONTAINER.length, CONTAINER.width) * 1.9;

  return {
    top: {
      position: V(CONTAINER.length / 2, topHeight, CONTAINER.width / 2 + 0.001),
      target: V(CONTAINER.length / 2, 0, CONTAINER.width / 2),
      up: V(0, 0, -1),
    },
    entrance: {
      // Standing outside, target sits right at the doorway (not deep inside
      // the room) so the door frames cleanly instead of cropping.
      position: V(CONTAINER.length + 3.4, eye, ENTRANCE.centerZ),
      target: V(CONTAINER.length - 0.2, 1.1, ENTRANCE.centerZ),
      up: V(0, 1, 0),
    },
    multipurpose: {
      // Elevated 3/4 corner shot from near the entrance, clear of the lower
      // wall, looking across at the team bench.
      position: V(z1.xMax - 0.6, eye + 0.35, 0.75),
      target: V(benchCenterX, 1.0, CONTAINER.width - 0.4),
      up: V(0, 1, 0),
    },
    private: {
      // Looking straight down the room's center line from near the door,
      // so the owner desk and IoT bench flank the view symmetrically
      // instead of the camera grazing past either one up close.
      position: V(z2.xMax - 0.3, eye + 0.3, CONTAINER.width * 0.5),
      target: V(z2.xMin + 0.3, 0.9, CONTAINER.width * 0.5),
      up: V(0, 1, 0),
    },
  };
}

// Ordered walkthrough: outside entrance -> multipurpose bench -> flexible
// area -> offset internal door -> private room -> owner desk -> IoT bench.
export function getWalkthroughKeyframes() {
  const eye = CAMERA.eyeHeight;
  const z1 = ZONES.zone1;
  const z2 = ZONES.zone2;
  const doorZ = PARTITION.doorCenterZ;

  return [
    {
      label: 'Outside main entrance',
      position: V(CONTAINER.length + 2.6, eye + 0.1, ENTRANCE.centerZ),
      target: V(CONTAINER.length, eye - 0.1, ENTRANCE.centerZ),
    },
    {
      label: 'Entering multipurpose area',
      position: V(z1.xMax - 0.9, eye, ENTRANCE.centerZ),
      target: V(z1.xMax - 2.0, eye - 0.1, CONTAINER.width - 0.4),
    },
    {
      label: 'Looking at the shared team bench',
      position: V((z1.xMin + z1.xMax) / 2, eye, 0.9),
      target: V((z1.xMin + z1.xMax) / 2, 1.0, CONTAINER.width - 0.35),
    },
    {
      label: 'Looking toward the flexible / sofa area',
      position: V(z1.xMin + (z1.xMax - z1.xMin) * 0.4, eye, CONTAINER.width - 0.9),
      target: V(z1.xMin + (z1.xMax - z1.xMin) * 0.35, 0.7, 0.5),
    },
    {
      label: 'Approaching the offset internal door',
      position: V(PARTITION.centerX + 1.1, eye, doorZ),
      target: V(PARTITION.centerX, eye - 0.2, doorZ),
    },
    {
      label: 'Entering the private room',
      position: V(PARTITION.centerX - 0.5, eye, doorZ),
      target: V(z2.xMin + 0.5, eye - 0.15, doorZ),
    },
    {
      label: 'Revealing the owner workstation',
      position: V(z2.xMin + 0.9, eye, CONTAINER.width * 0.5),
      target: V(z2.xMin + 0.4, 1.0, CONTAINER.width - 0.4),
    },
    {
      label: 'Revealing the IoT engineering bench',
      position: V(z2.xMin + 0.9, eye, 0.5),
      target: V(z2.xMin + 0.5, 1.0, 0.25),
    },
  ];
}

function smootherstep(t) {
  return t * t * t * (t * (t * 6 - 15) + 10);
}

// Samples the walkthrough path at global progress t in [0, 1], easing
// between consecutive keyframes. Also returns the active segment index so
// callers (e.g. door animation) can react to specific parts of the path.
export function sampleWalkthrough(keyframes, t) {
  const segments = keyframes.length - 1;
  const clamped = Math.max(0, Math.min(1, t));
  const scaled = clamped * segments;
  let index = Math.floor(scaled);
  if (index >= segments) index = segments - 1;
  const localT = smootherstep(scaled - index);

  const a = keyframes[index];
  const b = keyframes[index + 1];

  const position = a.position.clone().lerp(b.position, localT);
  const target = a.target.clone().lerp(b.target, localT);

  return { position, target, segmentIndex: index, segmentT: localT };
}
